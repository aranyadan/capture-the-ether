import { network } from "hardhat"
import chalk from "chalk"
import "dotenv/config"

const RINKEBY_RPC_URL = process.env.RINKEBY_RPC_URL
const networkConfig = {
    31337: {
        name: "hardhat",
    },
}
const developmentChains = ["hardhat", "localhost"]

const resetNode = async () => {
    if (developmentChains.includes(network.name)) {
        await network.provider.request({
            method: "hardhat_reset",
            params: [
                {
                    forking: {
                        jsonRpcUrl: RINKEBY_RPC_URL,
                    },
                },
            ],
        })
    }
}

const symbols = {
    info: chalk.blue("ℹ"),
    success: chalk.green("✔"),
    warning: chalk.yellow("⚠"),
    error: chalk.red("✖"),
}

// Exports
module.exports = {
    networkConfig,
    developmentChains,
    symbols,
    resetNode,
}
