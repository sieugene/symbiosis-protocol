/**
 * Example swapping of 15 USDC from Rinkeby
 * to BNB on BNB Chain Testnet
 */

import { MaxUint256 } from '@ethersproject/constants'
import { Contract } from '@ethersproject/contracts'
import { approveAbi } from '../shared/abi/approve__abi'
import { networkConfig } from '../shared/config'
import { scenario0 } from './scenarios'
import { OmniPools } from '../shared/data'

async function swapErc20() {
    try {
        const pool = OmniPools[scenario0?.fromChainId]
        if (!pool) throw new Error('Pool not exist')

        const swapping = networkConfig.symbiosis.testnet.newSwapping(pool)

        // Calculates fee for swapping between chains and transactionRequest
        console.log('Calculating swap...')
        const {
            transactionRequest,
            fee,
            tokenAmountOut,
            route,
            priceImpact,
            approveTo,
        } = await swapping.exactIn({
            tokenAmountIn: scenario0.tokenAmountIn,
            tokenOut: scenario0.tokenTo,
            from: scenario0.wallet.address,
            to: scenario0.wallet.address,
            revertableAddress: scenario0.wallet.address,
            slippage: 300,
            deadline: Date.now() + 20 * 60,
        })

        console.log({
            fee: fee.toSignificant(),
            tokenAmountOut: tokenAmountOut.toSignificant(),
            route: route.map((i) => i.symbol).join(' -> '),
            priceImpact: priceImpact.toSignificant(),
            approveTo,
        })

        return

        if (!scenario0.tokenAmountIn.token.isNative) {
            console.log('Approving...')
            const tokenContract = new Contract(
                scenario0.tokenAmountIn.token.address,
                JSON.stringify(approveAbi),
                scenario0.signer as any
            )
            const approveResponse = await tokenContract.approve(
                approveTo,
                MaxUint256
            )
            console.log('Approved', approveResponse.hash)

            const approveReceipt = await approveResponse.wait(1)
            console.log('Approve mined', approveReceipt.transactionHash)
        }

        // Send transaction to chain
        const transactionResponse = await scenario0.signer.sendTransaction(
            transactionRequest as any
        )
        console.log('Transaction sent', transactionResponse.hash)

        // Wait for transaction to be mined
        const receipt = await transactionResponse.wait(1)
        console.log('Transaction mined', (receipt as any)?.transactionHash)

        // Wait for transaction to be completed on recipient chain
        const log = await swapping.waitForComplete(receipt as any)
        console.log('Cross-chain swap completed', log.transactionHash)
    } catch (e) {
        console.error(e)
    }
}

export function run() {
    console.log('>>>')
    swapErc20().then(() => {
        console.log('<<<')
    })
}
