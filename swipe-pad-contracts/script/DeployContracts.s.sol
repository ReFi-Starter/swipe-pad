// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {Script, console} from "forge-std/Script.sol";
import {Vm} from "forge-std/Vm.sol";
import {stdJson} from "forge-std/StdJson.sol";
import {DonationPool} from "../src/DonationPool.sol";
import {Pool} from "../src/Pool.sol";
import {MockERC20} from "../src/mock/MockERC20.sol";

contract DeployContractsScript is Script {
    using stdJson for string;

    DonationPool public donationPool;
    Pool public pool;
    MockERC20 public token;

    // Path where deployment addresses will be saved
    string constant DEPLOYMENTS_FILE = "deployments.json";

    function run()
        public
        returns (address donationPoolAddr, address poolAddr, address tokenAddr)
    {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        string memory rpcUrl = vm.envString("CELO_ALFAJORES_RPC"); // Use the correct env var name

        // Check if required env vars are set
        require(deployerPrivateKey != 0, "PRIVATE_KEY env var not set");
        require(bytes(rpcUrl).length > 0, "CELO_ALFAJORES_RPC env var not set");

        vm.startBroadcast(deployerPrivateKey);

        console.log("Deploying MockERC20...");
        token = new MockERC20("Mock Celo Dollar", "mcUSD", 18);
        tokenAddr = address(token);
        console.log("MockERC20 deployed at:", tokenAddr);

        console.log("Deploying DonationPool...");
        donationPool = new DonationPool();
        donationPoolAddr = address(donationPool);
        console.log("DonationPool deployed at:", donationPoolAddr);

        console.log("Deploying Pool...");
        pool = new Pool();
        poolAddr = address(pool);
        console.log("Pool deployed at:", poolAddr);

        vm.stopBroadcast();

        // Write deployed addresses to JSON file
        writeDeployments(donationPoolAddr, poolAddr, tokenAddr);

        console.log(
            "Deployment successful and addresses saved to",
            DEPLOYMENTS_FILE
        );

        return (donationPoolAddr, poolAddr, tokenAddr);
    }

    function writeDeployments(
        address _donationPool,
        address _pool,
        address _token
    ) internal {
        string memory json = "{}"; // Start with an empty JSON object

        // Add addresses to the JSON object
        json = json.serialize("donationPool", vm.toString(_donationPool));
        json = json.serialize("pool", vm.toString(_pool));
        json = json.serialize("token", vm.toString(_token));

        // Write the JSON to the file
        vm.writeJson(json, DEPLOYMENTS_FILE);
    }
}
