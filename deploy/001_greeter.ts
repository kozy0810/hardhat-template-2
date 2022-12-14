import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deployments, getNamedAccounts, ethers } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  await deploy('Greeter', {
    from: deployer,
    args: ['Hello'],
    log: true,
    deterministicDeployment: true,
  });
}

export default func;
func.id = 'deploy_greeter';
func.tags = ['Greeter'];