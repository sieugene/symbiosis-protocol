import { Chain, ChainId, Token, TokenAmount } from 'symbiosis-js-sdk'
import { networkConfig } from '../shared/config'
import { parseUnits } from '@ethersproject/units'
import { JsonRpcProvider } from '@ethersproject/providers'

// tokens
const BSC_USDT = new Token({
    chainId: ChainId.BSC_TESTNET,
    address: '0x9a01bf917477dd9f5d715d188618fc8b7350cd22',
    name: 'Binance USD',
    symbol: 'BUSD',
    decimals: 18,
})

const MATIC_USDT = new Token({
    name: 'USDT',
    symbol: 'USDT',
    address: '0x9a01bf917477dd9f5d715d188618fc8b7350cd22',
    chainId: ChainId.MATIC_MUMBAI,
    decimals: 6,
})

// Scenarios

// Erc20 swap (method newSwapping)
export const scenario0 = {
    fromChainId: ChainId.BSC_TESTNET,
    toChainId: ChainId.MATIC_MUMBAI,
    tokenFrom: BSC_USDT,
    tokenAmountIn: new TokenAmount(BSC_USDT, parseUnits('0.05').toString()),
    tokenTo: MATIC_USDT,
    signer: networkConfig.wallet.connect(
        new JsonRpcProvider('https://data-seed-prebsc-1-s2.bnbchain.org:8545')
    ),
    wallet: networkConfig.wallet,
}
