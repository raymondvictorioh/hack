import { useContract, useNetwork, useProvider, useSigner } from 'wagmi'
import wagmiABI from "../abi/wagmi.json"
import { ethers } from "../../../hardhat/node_modules/ethers/lib";

export const useContractManager = (signer) => {

  // const provider = useProvider()
  const provider = new ethers.providers.JsonRpcProvider()
  console.log("useSigner",  provider.getSigner())

  const signerProvider = signer ?? provider
  let contractManager

  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    contractManager = useContract({
      addressOrName: "0x959922bE3CAee4b8Cd9a407cc3ac1C251C2007B1",
      contractInterface: wagmiABI,
      signerOrProvider: signerProvider,
    })
  } catch (e) {
    console.log('dick')
    console.error(e)
    return
  }

  // if (!signerProvider) {
  //   return
  // }
  console.log(contractManager)

  return contractManager
}