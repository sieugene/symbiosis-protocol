import { ChainId, Token, TokenAmount } from 'symbiosis-js-sdk'
import { networkConfig } from '../shared/config'

const ETH_GOERLI = '5' as any

// tokens
const GOERLI_USDC = new Token({
    chainId: ETH_GOERLI,
    address: '0x07865c6E87B9F70255377e024ace6630C1Eaa37F',
    name: 'USD Coin',
    symbol: 'USDC',
    decimals: 6,
})

const BSC_T_BNB = new Token({
    chainId: ChainId.BSC_TESTNET,
    isNative: true,
    address: '',
    symbol: 'BNB',
    decimals: 18,
})

// Scenarios

// Erc20 swap (method newSwapping)
export const scenario0 = {
    fromChainId: ETH_GOERLI,
    toChainId: ChainId.BSC_TESTNET,
    tokenFrom: GOERLI_USDC,
    tokenAmountIn: new TokenAmount(
        GOERLI_USDC,
        '15000000' // 15 USDC
    ),
    tokenTo: BSC_T_BNB,
    signer: networkConfig.wallet.connect(
        networkConfig.symbiosis.testnet.getProvider(ETH_GOERLI) as any
    ),
    wallet: networkConfig.wallet,
}
