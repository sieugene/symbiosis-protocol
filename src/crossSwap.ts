// https://docs.symbiosis.finance/developer-tools/symbiosis-js-sdk

import { ChainId, Symbiosis, Token, TokenAmount } from 'symbiosis-js-sdk'
import { networkConfig } from './shared/config'
import { formatEther } from '@ethersproject/units'

const amountIn = new TokenAmount(networkConfig.tokenIn, '10000000')

export async function bridgingExecute() {
    // Create a new Bridging instance
    const bridging = networkConfig.symbiosis.newBridging()

    // Calculate the fee for bridging and get an execute function
    const { execute, fee, tokenAmountOut } = await bridging.exactIn({
        tokenAmountIn: amountIn, // TokenAmount object
        tokenOut: networkConfig.tokenOut, // Token object
        to: networkConfig.wallet.address,
        revertableAddress: bridging.revertableAddress, // ??,
    })
    console.log(tokenAmountOut, 'tokenAmountOut')
    return

    // Execute the transaction
    const { response, waitForMined } = await execute(networkConfig.wallet)

    // Wait for transaction to be mined
    const { receipt, waitForComplete } = await waitForMined()

    // Wait for transaction to be completed on recipient chain
    const log = await waitForComplete()
}
