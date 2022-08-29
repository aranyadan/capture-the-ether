import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import {
    GuessTheRandomNumberChallenge,
    GuessNewAttacker,
    GuessNewAttacker__factory,
} from "../typechain-types"
import { assert, expect } from "chai"
import { ethers } from "hardhat"

describe("Guess Secret Number challenge", function () {
    let attacker: SignerWithAddress
    let target: GuessTheRandomNumberChallenge
    before(async function () {
        // Setup code here
        let instanceAddress: string =
            "0x9c51E6159bc317a4c54e848a77D4d93aAAF06c68"
        ;[attacker] = await ethers.getSigners()
        target = await ethers.getContractAt(
            "GuessTheRandomNumberChallenge",
            instanceAddress,
            attacker
        )
    })

    it("Guesses the secret number", async function () {
        // Exploit code here
        const attackerFactory: GuessNewAttacker__factory =
            await ethers.getContractFactory("GuessNewAttacker")
        const attackerContract: GuessNewAttacker =
            await attackerFactory.deploy()

        let tx = await attackerContract.attack(target.address, {
            value: ethers.utils.parseEther("1"),
        })
        await tx.wait()
    })

    after(async function () {
        // Verification Code here
        assert(await target.isComplete(), "Challenge not completed")
    })
})
