import { ChainId, OmniPoolConfig } from 'symbiosis-js-sdk'

// https://testnet.symbiosis.finance/liquidity-v2/pools
// https://github.com/symbiosis-finance/js-sdk/blob/v2/src/crosschain/config/testnet.ts

export type PoolT = {
    [chain in ChainId]?: OmniPoolConfig
}

export const OmniPools: PoolT = {
    [ChainId.BSC_TESTNET]: {
        chainId: ChainId.BSC_TESTNET,
        address: '0x569D2a232F5f2a462673fAf184ED9640e8A9F4D8',
        oracle: '0xcE29b84160fe8B6Fc1c6E5aD66F1F43279F2F1C9',
    },
}
