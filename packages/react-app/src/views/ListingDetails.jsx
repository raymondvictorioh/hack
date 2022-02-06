import Rect, { useEffect, useState, useRef } from "react";
import { BrowserRouter as Router, useParams } from "react-router-dom";
import { Card, Image, Button, Typography } from "antd";
import { referralList } from "./tempData/referralList";
import { Link } from "react-router-dom";
import { NETWORKS } from "../constants";
import wagmiABI from "../abi/wagmi.json";
import { useContractRead } from "wagmi";
import { ethers } from "../../../hardhat/node_modules/ethers/lib";
import { useContractManager } from "../hooks/useContractManager";
const { Text, Paragraph, Title } = Typography;
const { Meta } = Card;
const size = "large";
function ListingDetails({ address, id, userSigner }) {
  const [resourceUri, setResourceUri] = useState("");
  let { nft_id } = useParams();
  const itemDetail = () => referralList.filter(obj => obj.id == nft_id)[0];
  const [uniqueUrl, setUniqueUrl] = useState(`${process.env.PUBLIC_URL}/dark-thsdsdseme.css`);
  const [listingDetail, setListingDetail] = useState(null);
  const contract = useContractManager(userSigner);

  const baseuri = useRef("");
  // //SET LISTING DUMMY NFT
  // const _tokenAddr = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
  // const _tokenId = 8
  // const _listPrice = ethers.utils.parseEther('100')
  // const _promoterReward = 5
  // const _buyerReward = 10
  // useEffect(() => {
  //   contract.on('NewListing', (listingId)  => {
  //     console.log("New Listing")
  //   })

  //   return () => {
  //     contract.off('NewListing', (listingId) => {
  //       console.log("New Listing")
  //     })
  //   }
  // }, [])
  // <div>
  //       <Button type="primary" size={size}
  //         onClick={async () => { await contract.listNFT(
  //           _tokenAddr,
  //           _tokenId,
  //           _listPrice,
  //           _promoterReward,
  //           _buyerReward
  //         )}
  //       }
  //       >
  //         LIST NFT
  //       </Button>
  //     </div>

  // IIFE
  useEffect(() => {
    if (!contract) return;
    (async () => {
      try {
        const listing = await contract.getListing(0);
        setListingDetail(listing);
        fetch(`${listing.resourceUri}`)
          .then(res => res.json())
          .then(
            result => {
              console.log(result);
              setResourceUri(result.image);
            },
            error => {
              console.err("error");
            },
          );
      } catch (err) {
        console.error(err);
      }
    })();
  }, [contract]);

  useEffect(() => {
    baseuri.current = window.location.host;
  }, []);

  return (
    <div>
      <Image width={200} src={resourceUri} />
      <h1>{listingDetail?.name}</h1>
      {!!listingDetail && (
        <div>
          <div>
            <b>Owner Address : </b> {listingDetail.ownerAddr}
          </div>
          <div>
            <b>Token Address : </b> {listingDetail.tokenAddr}
          </div>
          <div>
            <b>Listing Price : </b> {ethers.utils.formatEther(listingDetail.listPrice)}
          </div>
          <div>
            <b>Buyer Reward : </b> {listingDetail.buyerReward.toNumber()}
          </div>
          <div>
            <b>Promoter Reward </b> {listingDetail.promoterReward.toNumber()}
          </div>
          <div>
            <b>Image Url : </b>
            <a href={resourceUri} target="_blank">
              {resourceUri}
            </a>
          </div>
          <br></br>

          <div>
            <Button type="primary" size={size} onClick={() => setUniqueUrl("Test")}>
              Sign Up as Promoter
            </Button>
          </div>
          <br></br>
        
        
          <div>
            <b>Unique Referral Url : </b>

            <Title copyable level={5}>
            {`${baseuri.current}/buyer/${nft_id}?adddress=${address}`}
            </Title>

          </div>
        </div>
      )}
    </div>
  );
}

export default ListingDetails;
