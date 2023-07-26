import { Chain, ChainId } from 'symbiosis-js-sdk'

// https://testnet.symbiosis.finance/liquidity-v2/pools

type Pool = {
    address: string
    token: string
}

export type PoolT = {
    [chain in ChainId]?: Pool
}

export const Pools: PoolT = {
    [ChainId.SCROLL_TESTNET]: {
        address: '0x569D2a232F5f2a462673fAf184ED9640e8A9F4D8',
        token: '0xe586751BAED5b49Ba521e8169051b11A85b79007',
    },
    [ChainId.ETH_GOERLI]: {
        address: '0x569D2a232F5f2a462673fAf184ED9640e8A9F4D8',
        token: '0x32Ac07C5D3D6002B853836a48EE8538C9CF29ad4',
    },
    [ChainId.ZETACHAIN_ATHENS_2]: {
        address: '0x569D2a232F5f2a462673fAf184ED9640e8A9F4D8',
        token: '0x569D2a232F5f2a462673fAf184ED9640e8A9F4D8',
    },
    [ChainId.MATIC_MAINNET]: {
        address: '0x6148FD6C649866596C3d8a971fC313E5eCE84882',
        token: '0x59AA2e5F628659918A4890A2a732E6C8bD334E7A',
    },
}
