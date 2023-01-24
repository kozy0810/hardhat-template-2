import { task } from "hardhat/config";
import { Wallet } from "@ethersproject/wallet";
import { splitSignature } from "ethers/lib/utils";
import { ERC2612PermitMessage, signERC2612PermitMessage } from "../utils/utils"

task("erc20Permit", "Excute permit myself")
  .addParam("contract", "Contract address")
  .addParam("owner", "Owner address")
  .addParam("spender", "Spender address")
  .addParam("value", "Sending amount e.g. 0.1 ETH = 1")
  .setAction(async (taskArgs, hre) => {
    const wallet = new Wallet(process.env.PRIVATE_KEY as string);
    const erc20Token = (await hre.ethers.getContractAt("ERC20Token", taskArgs.contract));
    const nonce = await erc20Token.nonces(taskArgs.owner);
    const value = hre.ethers.utils.parseUnits(taskArgs.value, 18)
    console.log("deadline:", )

    const message: ERC2612PermitMessage = {
      owner: taskArgs.owner,
      spender: taskArgs.spender,
      value: value.toString(),
      nonce: nonce.toString(),
      deadline: "1676961814",
    };

    const chainId = await hre.getChainId();
    const sig = signERC2612PermitMessage(wallet.privateKey, erc20Token.address, Number(chainId), message);

    const { v, r, s } = splitSignature(sig);

    const resp = await erc20Token.permit(wallet.address, taskArgs.spender, value.toString(), "1676961814", v, r, s);
    console.log(resp);
  });