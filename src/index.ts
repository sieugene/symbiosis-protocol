require('dotenv').config()
import { bridgingExecute } from './crossSwap'

;(async () => {
    try {
        await bridgingExecute()
    } catch (error) {
        console.error(error)
    }
})()
