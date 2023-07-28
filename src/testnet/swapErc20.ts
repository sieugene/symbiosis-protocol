/**
 * Example swapping of 15 USDC from Rinkeby
 * to BNB on BNB Chain Testnet
 */

import { TransactionResponse } from '@ethersproject/providers'
import { BigNumber, Contract } from 'ethers'
import { approveAbi } from '../shared/abi/approve__abi'
import { networkConfig } from '../shared/config'
import { OmniPools } from '../shared/data'
import { scenario0 } from './scenarios'
import { MaxUint256 } from '@ethersproject/constants'

async function swapErc20() {
    try {
        if (!scenario0.signer) throw new Error('Signer not provided')

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

        if (!scenario0.tokenAmountIn.token.isNative) {
            console.log('Approving...')
            const tokenContract = new Contract(
                scenario0.tokenAmountIn.token.address,
                JSON.stringify(approveAbi),
                scenario0.signer
            )
            const allowance: BigNumber = await tokenContract.allowance(
                scenario0.signer.address,
                approveTo
            )
            console.log('allowance', allowance)

            const approveResponse: TransactionResponse =
                await tokenContract.approve(approveTo, MaxUint256)
            console.log('Approved', approveResponse.hash)

            const approveReceipt = await approveResponse.wait(1)
            console.log('Approve mined', approveReceipt.transactionHash)
        }

        // Send transaction to chain

        const transactionResponse = await scenario0.signer.sendTransaction(
            transactionRequest
        )
        console.log('Transaction sent', transactionResponse.hash)

        // Wait for transaction to be mined
        const receipt = await transactionResponse?.wait(1)
        console.log('Transaction mined', receipt?.transactionHash)

        // Wait for transaction to be completed on recipient chain
        const log = await swapping.waitForComplete(receipt)
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
