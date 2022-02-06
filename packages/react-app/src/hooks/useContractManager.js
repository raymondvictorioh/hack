import { useContract, useNetwork, useProvider, useSigner } from 'wagmi'
import wagmiABI from "../abi/wagmi.json"
import { ethers } from "../../../hardhat/node_modules/ethers/lib";

export const useContractManager = (signer) => {
  console.log('signer', signer)

  // const provider = useProvider()

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const metamaskSigner = provider.getSigner();



  const signerProvider = signer ?? provider
  let contractManager

  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    contractManager = useContract({
      addressOrName: "0x3Aa5ebB10DC797CAC828524e59A333d0A371443c",
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