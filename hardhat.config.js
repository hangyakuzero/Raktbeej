/** @type import('hardhat/config').HardhatUserConfig */
import { ethers } from "ethers";
import dotenv from "dotenv";
dotenv.config();
module.exports = {
  solidity: "0.8.28",
  paths: {
    artifacts: "./artifacts",
  },
};
