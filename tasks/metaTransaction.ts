import { task } from "hardhat/config";
import { Wallet } from "@ethersproject/wallet";
import { splitSignature } from "ethers/lib/utils";
import { signTypedData, SignTypedDataVersion } from "@metamask/eth-sig-util";
import axios from "axios";

import { ERC2612PermitMessage ,getRelayerURL } from "../utils/utils";

task("erc20Permit-via-relayer", "Excute permit via relayer")
  .addParam("contract", "Contract address")
  .addParam("owner", "Owner address")
  .addParam("spender", "Spender address")
  .addParam("value", "Sending amount")
  .setAction(async (taskArgs, hre) => {
    const wallet = new Wallet(process.env.PRIVATE_KEY as string);
    const erc20Token = (await hre.ethers.getContractAt("ERC20Token", taskArgs.contract));
    const nonce = await erc20Token.nonces(taskArgs.owner);
    const value = hre.ethers.utils.parseUnits("1", 18)

    const message: ERC2612PermitMessage = {
      owner: taskArgs.owner,
      spender: taskArgs.spender,
      value: value.toString(),
      nonce: nonce.toString(),
      deadline: "1674864773",
    };

    const chainId = await hre.getChainId();
    const signature = signTypedData({
      privateKey: Buffer.from(wallet.privateKey.slice(2), "hex"),
      data: {
        types: {
          EIP712Domain: [
            { name: "name", type: "string" },
            { name: "version", type: "string" },
            { name: "chainId", type: "uint256" },
            { name: "verifyingContract", type: "address" },
          ],
          Permit: [
            { name: "owner", type: "address" },
            { name: "spender", type: "address" },
            { name: "value", type: "uint256" },
            { name: "nonce", type: "uint256" },
            { name: "deadline", type: "uint256" },
          ],
        },
        primaryType: "Permit",
        domain: {
          name: "MyToken Permit Message",
          version: "1",
          chainId: Number(chainId),
          verifyingContract: "0x3F71a85B94314b54889A8AC050C571dC5406797A",
        },
        message: message,
      },
      version: SignTypedDataVersion.V4
    });

    const { v, r, s } = splitSignature(signature);

    const relayerURL = getRelayerURL();

    const requestParams = {
      "owner": taskArgs.owner,
      "speder": taskArgs.spender,
      "value": Number(value),
      "deadline": 1674864773,
      "signature": signature,
      "v": v,
      "r": r,
      "s": s
    }

    const beforeTxOwnerBalance = await hre.ethers.provider.getBalance(taskArgs.owner);
    const beforeTxSpenderBalance = await hre.ethers.provider.getBalance(taskArgs.spender);

    try {
      await axios.post(relayerURL+"/permit", requestParams).then(resp => {
        if (resp.status !== 200) {
          throw new Error(resp.data)
        }
        console.log(resp.data);
      })
    } catch(e) {
      console.error(e);
    }

    const afterTxOwnerBalance = await hre.ethers.provider.getBalance(taskArgs.owner);
    const afterTxSpenderBalance = await hre.ethers.provider.getBalance(taskArgs.spender);

    console.log("beforeTxOwnerBalance: ", beforeTxOwnerBalance.toString());
    console.log("afterTxOwnerBalance: ", afterTxOwnerBalance.toString());
    console.log("#########################################################");
    console.log("beforeTxSpenderBalance: ", beforeTxSpenderBalance.toString());
    console.log("afterTxSpenderBalance: ", afterTxSpenderBalance.toString());

    const allowance = await erc20Token.allowance(taskArgs.owner, taskArgs.spender)
    console.log("allowance", allowance.toString())
  });