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
      addressOrName: "0x59b670e9fA9D0A427751Af201D676719a970857b",
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