import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

const deployContracts: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("SwipeDonation", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });

  await deploy("BoostManager", {
    from: deployer,
    args: [deployer], // Treasury is deployer for now
    log: true,
    autoMine: true,
  });

  await deploy("CauseFundFactory", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });

  // Get the deployed contracts to interact with them after deploying.
  const swipeDonation = await hre.ethers.getContract<Contract>("SwipeDonation", deployer);
  console.log("👋 SwipeDonation deployed at:", await swipeDonation.getAddress());

  const boostManager = await hre.ethers.getContract<Contract>("BoostManager", deployer);
  console.log("👋 BoostManager deployed at:", await boostManager.getAddress());

  const causeFundFactory = await hre.ethers.getContract<Contract>("CauseFundFactory", deployer);
  console.log("👋 CauseFundFactory deployed at:", await causeFundFactory.getAddress());
};

export default deployContracts;

deployContracts.tags = ["SwipeDonation", "BoostManager", "CauseFundFactory"];
