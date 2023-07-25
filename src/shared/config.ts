import { AddressZero } from '@ethersproject/constants'
import { JsonRpcProvider } from '@ethersproject/providers'
import { ethers } from 'ethers'
import { ChainId, Symbiosis, Token } from 'symbiosis-js-sdk'

const wallet = new ethers.Wallet(process.env.PRIVATE_KEY as string)

// Create Symbiosis instance using TESTNET config
const CLIENT_ID = '00abc-apuri'
const symbiosis = new Symbiosis('testnet', CLIENT_ID)
const provider = new JsonRpcProvider(
    'https://data-seed-prebsc-1-s1.bnbchain.org:8545'
)
const signer = wallet.connect(provider as any)

export const networkConfig = {
    wallet,
    symbiosis,
    provider,
    signer,
    tokenIn: new Token({
        chainId: ChainId.BSC_TESTNET,
        address: '0xae13d989dac2f0debff460ac112a837c89baa7cd',
        name: 'WBNB',
        symbol: 'WBNB',
        decimals: 18,
    }),
    tokenOut: new Token({
        chainId: ChainId.MATIC_MUMBAI,
        address: '0xa6fa4fb5f76172d178d61b04b0ecd319c5d1c0aa',
        name: 'WETH',
        symbol: 'WETH',
        decimals: 18,
    }),
}
