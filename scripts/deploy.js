/* eslint-disable import/no-commonjs */
const { ethers } = require("hardhat");
async function main() {
  const Donate = await ethers.getContractFactory("OpenDonationSplitter");
  const dep = await Donate.deploy();
  console.log("Contract instace", dep);
  console.log("Contract Deployed to", dep.target);
}

main().then(() =>
  process.exit(0).catch((error) => {
    console.error(error);
    process.exit(1);
  }),
);
