import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { GuessTheSecretNumberChallenge } from "../typechain-types"
import { assert, expect } from "chai"
import { ethers } from "hardhat"

describe("Guess Secret Number challenge", function () {
    let attacker: SignerWithAddress
    let target: GuessTheSecretNumberChallenge
    before(async function () {
        // Setup code here
        let instanceAddress: string =
            "0x39fd0b69fc9AEF2947f689c489d9CA21261E1FA1"
        ;[attacker] = await ethers.getSigners()
        target = await ethers.getContractAt(
            "GuessTheSecretNumberChallenge",
            instanceAddress,
            attacker
        )
    })

    it("Guesses the secret number", async function () {
        // Exploit code here
        let hash = await ethers.provider.getStorageAt(target.address, 0)
        console.log("Hash:", hash)

        let secret: number = -1
        for (let i = 0; i < 256; i++) {
            // let guesshash = ethers.utils.id(i.toString())
            let guesshash = ethers.utils.solidityKeccak256(["uint8"], [i])
            if (guesshash == hash) {
                console.log("Found the secret number:", i)
                secret = i
                break
            }
        }
        if (secret == -1) {
            console.log("Could not find the secret number")
        } else {
            let tx = await target.guess(secret.toString(), {
                value: ethers.utils.parseEther("1"),
            })
            await tx.wait()
        }
    })

    after(async function () {
        // Verification Code here
        assert(await target.isComplete(), "Challenge not completed")
    })
})
