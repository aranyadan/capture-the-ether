import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { GuessTheNumberChallenge } from "../typechain-types"
import { assert, expect } from "chai"
import { ethers } from "hardhat"

describe("Guess Number challenge", function () {
    let attacker: SignerWithAddress
    let target: GuessTheNumberChallenge
    before(async function () {
        // Setup code here
        let instanceAddress: string =
            "0x3CFaDDDece0410ec025ce37Fbd9D6b70b761f392"
        ;[attacker] = await ethers.getSigners()
        target = await ethers.getContractAt(
            "GuessTheNumberChallenge",
            instanceAddress,
            attacker
        )
    })

    it("Guesses the number", async function () {
        // Exploit code here
        let tx = await target.guess("42", {
            value: ethers.utils.parseEther("1"),
            gasLimit: 1000000,
        })
        await tx.wait()
    })

    after(async function () {
        // Verification Code here
        assert(await target.isComplete(), "Challenge not completed")
    })
})
