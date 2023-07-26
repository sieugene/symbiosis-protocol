import { ethers } from 'ethers'
import { Symbiosis } from 'symbiosis-js-sdk'

const wallet = new ethers.Wallet(process.env.PRIVATE_KEY as string)

// Create Symbiosis instance using TESTNET config
const CLIENT_ID = '00abc-apuri'

export const networkConfig = {
    wallet,
    symbiosis: {
        mainnet: new Symbiosis('mainnet', CLIENT_ID),
        testnet: new Symbiosis('testnet', CLIENT_ID),
    },
}
