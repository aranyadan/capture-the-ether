import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { CallMeChallenge } from "../typechain-types"
import { assert, expect } from "chai"
import { ethers } from "hardhat"

describe("CallMe challenge", function () {
    let attacker: SignerWithAddress
    let target: CallMeChallenge
    before(async function () {
        // Setup code here
        let instanceAddress: string =
            "0xF3C12D68B8aEe556E898E18b7b84081947C9Ba36"
        ;[attacker] = await ethers.getSigners()
        target = await ethers.getContractAt("CallMeChallenge", instanceAddress)
    })

    it("Calls Target", async function () {
        // Exploit code here
        let tx = await target.callme()
        await tx.wait()
    })

    after(async function () {
        // Verification Code here
        assert(await target.isComplete(), "Call not completed")
    })
})
