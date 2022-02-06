import React, { useEffect, useState, useRef } from "react";
import { BrowserRouter as Router, useParams } from "react-router-dom";
import { Card, Image, Button, Typography } from "antd";
import { referralList } from "./tempData/referralList";
import { Link } from "react-router-dom";
import { NETWORKS } from "../constants";
import wagmiABI from "../abi/wagmi.json";
import { useContractRead, useSigner } from "wagmi";
import { ethers } from "../../../hardhat/node_modules/ethers/lib";
import { useContractManager } from "../hooks/useContractManager";
import { BigNumber } from "ethers";
const { Text, Paragraph, Title } = Typography;
const { Meta } = Card;
const size = "large";
function ListingDetails({ address, id, userSigner, web3Modal, loadWeb3Modal }) {
  const [resourceUri, setResourceUri] = useState("");
  let { nft_id } = useParams();
  const itemDetail = () => referralList.filter(obj => obj.id == nft_id)[0];
  const [uniqueUrl, setUniqueUrl] = useState(`${process.env.PUBLIC_URL}/dark-thsdsdseme.css`);
  const [listingDetail, setListingDetail] = useState();

  console.log(userSigner);
  const contract = useContractManager(userSigner);
  const baseuri = useRef("");
  //SET LISTING DUMMY NFT
  const _tokenAddr = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const _tokenId = 8;
  const _listPrice = ethers.utils.parseEther("0.00005");
  const _promoterReward = 15;
  const _buyerReward = 20;
  useEffect(() => {
    contract.on("NewListing", listingId => {
      console.log("New Listing");
    });

    return () => {
      contract.off("NewListing", listingId => {
        console.log("New Listing");
      });
    };
  }, []);

  // IIFE
  useEffect(() => {
    if (!contract) return;
    (async () => {
      try {
        const listing = await contract.getListing(nft_id);
        console.log(listing);
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

  const SignUpButton = [];
  if (web3Modal) {
    if (web3Modal.cachedProvider) {
      SignUpButton.push(
        <Button
          type="primary"
          key="logoutbutton"
          style={{ verticalAlign: "top", marginLeft: 8, margin: 4 }}
          size="large"
          shape="round"
          // onClick={alert('Sign Contract')}
        >
          Sign Up as Promoter
        </Button>,
      );
    } else {
      SignUpButton.push(
        <Button
          key="loginbutton"
          style={{ verticalAlign: "top", marginLeft: 8, margin: 20 }}
          shape="round"
          size="large"
          /* type={minimized ? "default" : "primary"}     too many people just defaulting to MM and having a bad time */
          onClick={loadWeb3Modal}
        >
          Connect your Wallet & Sign Up as Promoter
        </Button>,
      );
    }
  }

  const PromoteButton = (
    <div>
      <Button
        type="primary"
        key="logoutbutton"
        style={{ verticalAlign: "top", marginLeft: 8, margin: 4 }}
        size="large"
        disabled
        // onClick={logoutOfWeb3Modal}
      >
        Sign Up as Promoter
      </Button>
    </div>
  );

  return (
    <div>
      <div>
        <Button
          type="primary"
          size={size}
          onClick={async () => {
            if (!contract) return;
            console.log("CLICK!");
            await contract.listNFT(_tokenAddr, _tokenId, _listPrice, _promoterReward, _buyerReward);
          }}
        >
          LIST NFT
        </Button>
      </div>

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

          {SignUpButton}

          <div>
            <b>Unique Referral Url : </b>
            
          </div>
          <Button>
              <Title copyable mark level={5}>
                {`${baseuri.current}/buy/${nft_id}?shiller=${address}`}
              </Title>
            </Button>
        </div>
      )}
    </div>
  );
}

export default ListingDetails;
