import { ethers } from "hardhat";

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    // Deploy SwipeDonation
    const SwipeDonation = await ethers.getContractFactory("SwipeDonation");
    const swipeDonation = await SwipeDonation.deploy();
    await swipeDonation.waitForDeployment();
    console.log("SwipeDonation deployed to:", await swipeDonation.getAddress());

    // Deploy BoostManager
    const treasuryAddress = deployer.address; // Use deployer as initial treasury
    const BoostManager = await ethers.getContractFactory("BoostManager");
    const boostManager = await BoostManager.deploy(treasuryAddress);
    await boostManager.waitForDeployment();
    console.log("BoostManager deployed to:", await boostManager.getAddress());

    // Deploy CauseFundFactory
    const CauseFundFactory = await ethers.getContractFactory("CauseFundFactory");
    const causeFundFactory = await CauseFundFactory.deploy();
    await causeFundFactory.waitForDeployment();
    console.log("CauseFundFactory deployed to:", await causeFundFactory.getAddress());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
