/**
 * Example swapping of 15 USDC from Rinkeby
 * to BNB on BNB Chain Testnet
 */

import { MaxUint256 } from '@ethersproject/constants'
import { Contract } from '@ethersproject/contracts'
import { ChainId, Token, TokenAmount } from 'symbiosis-js-sdk'
import { approveAbi } from '../shared/abi/approve__abi'
import { networkConfig } from '../shared/config'
import { Pools } from '../shared/data'

const provider = networkConfig.symbiosis.mainnet.getProvider(
    ChainId.MATIC_MAINNET
)
const signer = networkConfig.wallet.connect(provider as any) as any

const tokenIn = new Token({
    chainId: ChainId.MATIC_MAINNET,
    address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
    name: 'USD Coin',
    symbol: 'USDC',
    decimals: 6,
})

const tokenAmountIn = new TokenAmount(
    tokenIn,
    '15000000' // 15 USDC
)

const tokenOut = new Token({
    chainId: ChainId.BSC_MAINNET,
    isNative: true,
    address: '',
    symbol: 'BNB',
    decimals: 18,
})

async function swapErc20() {
    try {
        const swapping = networkConfig.symbiosis.mainnet.newSwapping({
            address: Pools[ChainId.MATIC_MAINNET]?.address as string,
            chainId: ChainId.MATIC_MAINNET,
            oracle: '',
        })

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
            tokenAmountIn,
            tokenOut,
            from: networkConfig.wallet.address,
            revertableAddress: networkConfig.wallet.address,
            to: networkConfig.wallet.address,
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

        if (!tokenAmountIn.token.isNative) {
            console.log('Approving...')
            const tokenContract = new Contract(
                tokenAmountIn.token.address,
                JSON.stringify(approveAbi),
                signer
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
        const transactionResponse = await signer.sendTransaction(
            transactionRequest
        )
        console.log('Transaction sent', transactionResponse.hash)

        // Wait for transaction to be mined
        const receipt = await transactionResponse.wait(1)
        console.log('Transaction mined', receipt.transactionHash)

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
