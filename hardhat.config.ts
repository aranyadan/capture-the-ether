import { HardhatUserConfig } from "hardhat/config"
import "@nomicfoundation/hardhat-toolbox"
import "dotenv/config"
import "@nomicfoundation/hardhat-toolbox"
import "hardhat-deploy"
import "solidity-coverage"
import "hardhat-gas-reporter"

// RPC URLS
const LOCALHOST_RPC_URL = process.env.LOCALHOST_RPC_URL
const ROPSTEN_RPC_URL = process.env.ROPSTEN_RPC_URL

// Other keys
const PRIVATE_KEY = process.env.METAMASK_PRIVATE_KEY
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY

const config: HardhatUserConfig = {
    solidity: {
        compilers: [
            { version: "0.4.21" },
            { version: "0.5.0" },
            { version: "0.6.12" },
            { version: "0.7.0" },
            { version: "0.8.0" },
        ],
    },
    networks: {
        localhost: {
            url: LOCALHOST_RPC_URL,
            chainId: 31337,
        },
        hardhat: {
            chainId: 31337,
            forking: {
                url: ROPSTEN_RPC_URL!,
                blockNumber: 12885583,
            },
        },
        ropsten: {
            url: ROPSTEN_RPC_URL,
            accounts: [PRIVATE_KEY!],
            chainId: 3,
        },
    },
    etherscan: {
        apiKey: {
            ropsten: ETHERSCAN_API_KEY!,
        },
    },
    mocha: {
        timeout: 100000000,
    },
}

export default config
