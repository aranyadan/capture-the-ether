import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { CaptureTheEther } from "../typechain-types"
import { assert, expect } from "chai"
import { ethers } from "hardhat"

describe("Set Nickname challenge", function () {
    let attacker: SignerWithAddress
    let target: CaptureTheEther
    before(async function () {
        // Setup code here
        let instanceAddress: string =
            "0x71c46Ed333C35e4E6c62D32dc7C8F00D125b4fee"
        ;[attacker] = await ethers.getSigners()
        target = await ethers.getContractAt(
            "CaptureTheEther",
            instanceAddress,
            attacker
        )
    })

    it("Sets nickname", async function () {
        // Exploit code here
        this.nick = "carr0t"
        let tx = await target.setNickname(
            ethers.utils.formatBytes32String(this.nick)
        )
        await tx.wait()
    })

    after(async function () {
        // Verification Code here
        let res = await target.nicknameOf(attacker.address)
        assert.equal(
            ethers.utils.parseBytes32String(res),
            this.nick,
            "Nickname not set correctly"
        )
    })
})
