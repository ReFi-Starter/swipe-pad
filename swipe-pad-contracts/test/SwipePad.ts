import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

describe("SwipePad Contracts", function () {
    async function deployFixture() {
        const [owner, otherAccount, treasury, project1, project2] = await ethers.getSigners();

        // Deploy Mock Token
        const Token = await ethers.getContractFactory("MockToken");
        const token = await Token.deploy("Celo Dollar", "cUSD");

        // Mint tokens to owner
        await token.mint(owner.address, ethers.parseEther("1000"));

        // Deploy Contracts
        const SwipeDonation = await ethers.getContractFactory("SwipeDonation");
        const swipeDonation = await SwipeDonation.deploy();

        const BoostManager = await ethers.getContractFactory("BoostManager");
        const boostManager = await BoostManager.deploy(treasury.address);

        const CauseFundFactory = await ethers.getContractFactory("CauseFundFactory");
        const causeFundFactory = await CauseFundFactory.deploy();

        return {
            token,
            swipeDonation,
            boostManager,
            causeFundFactory,
            owner,
            otherAccount,
            treasury,
            project1,
            project2
        };
    }

    describe("SwipeDonation", function () {
        it("Should handle direct donations", async function () {
            const { swipeDonation, token, owner, project1 } = await loadFixture(deployFixture);
            const amount = ethers.parseEther("10");

            await token.approve(await swipeDonation.getAddress(), amount);
            await swipeDonation.donate(await token.getAddress(), project1.address, amount);

            expect(await token.balanceOf(project1.address)).to.equal(amount);
        });

        it("Should handle batch donations", async function () {
            const { swipeDonation, token, owner, project1, project2 } = await loadFixture(deployFixture);
            const amount1 = ethers.parseEther("10");
            const amount2 = ethers.parseEther("20");
            const totalAmount = amount1 + amount2;

            await token.approve(await swipeDonation.getAddress(), totalAmount);
            await swipeDonation.batchDonate(
                await token.getAddress(),
                [project1.address, project2.address],
                [amount1, amount2]
            );

            expect(await token.balanceOf(project1.address)).to.equal(amount1);
            expect(await token.balanceOf(project2.address)).to.equal(amount2);
        });
    });

    describe("BoostManager", function () {
        it("Should transfer boost fees to treasury", async function () {
            const { boostManager, token, owner, treasury } = await loadFixture(deployFixture);
            const amount = ethers.parseEther("50");

            await token.approve(await boostManager.getAddress(), amount);
            await boostManager.boostProject(await token.getAddress(), amount);

            expect(await token.balanceOf(treasury.address)).to.equal(amount);
        });
    });

    describe("CauseFund", function () {
        it("Should create cause vaults and accept deposits", async function () {
            const { causeFundFactory, token, owner } = await loadFixture(deployFixture);

            await causeFundFactory.createCauseVault("Rainforest Fund");
            const vaults = await causeFundFactory.getVaults();
            const vaultAddress = vaults[0];

            const amount = ethers.parseEther("100");
            await token.approve(vaultAddress, amount);

            // Interact with the deployed vault
            const CauseVault = await ethers.getContractFactory("CauseVault");
            const vault = CauseVault.attach(vaultAddress);

            // We need to cast to any because attach returns a Contract, but we know it has deposit
            await (vault as any).deposit(await token.getAddress(), amount);

            expect(await token.balanceOf(vaultAddress)).to.equal(amount);
        });
    });
});
