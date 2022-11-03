import { NetworksUserConfig } from "hardhat/types";
import dotenv from 'dotenv';
dotenv.config();

const networks: NetworksUserConfig = {};

if (process.env.PRIVATE_KEY) {
  networks.goerli = {
    chainId: 5,
    url: process.env.GOERLI_RPC,
    accounts: [ process.env.PRIVATE_KEY ]
  };
  networks.SEPOLIA = {
    chainId: 11155111,
    url: process.env.SEPOLIA_RPC,
    accounts: [ process.env.PRIVATE_KEY ]
  };
} else {
  networks.hardhat = {
    // forking: {
    //   url: process.env.MAINNET_RPC as string
    // }
  }
}

export default networks;