import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

// require("dotenv").config();
// require("@nomicfoundation/hardhat-toolbox");  // This includes ethers, verify, etc.

export default {
  solidity: "0.8.8",
  networks: {
    basesepolia: {
      url: process.env.BASE_SEPOLIA_RPC_URL || "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],  // Better as array even for one key
    },
  },
};
