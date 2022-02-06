import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, useParams } from "react-router-dom";
import { Card, Image, Button } from "antd";
import { referralList } from "./tempData/referralList";
import { Link } from "react-router-dom";
import {NETWORKS} from "../constants"
import wagmiABI from "../abi/wagmi.json"
import {useContractRead} from 'wagmi'
import { ethers } from "../../../hardhat/node_modules/ethers/lib";
import {useContractManager} from "../contracts/useContractManager"

const { Meta } = Card;

function ListingDetails({ address, id }) {
  let { nft_id } = useParams();
  const itemDetail = () => referralList.filter(obj => obj.id == nft_id)[0];

  const [listingDetail, setListingDetail] = useState([])

  const contract = useContractManager()

  const listingId = id

  // IIFE
  useEffect(() => {
    (async () => {
      const listing = await contract.getListing(1)
      console.log('listing', listing)
      setListingDetail(listing)
    })()
  }, [])


  const [size, setSize] = "large";
  const [uniqueUrl, setUniqueUrl] = useState(`${process.env.PUBLIC_URL}/dark-thsdsdseme.css`)
  // console.log(data, error, loading)
  return (
    <div>
      <Image width={200} src={itemDetail().imageUrl} />
      <h1>{itemDetail().title}</h1>
      <h1>{itemDetail().desc}</h1>
      <div>
        <Button type="primary" size={size} 
            onClick={() => setUniqueUrl(
                "Test"
            )}
        >
          Promote
        </Button>
      </div>
      <br></br>
      <div>
        <Link to={`/buyer/${nft_id}/${address}`}>
          <Button type="primary" size={size}>
            Buyer Link
          </Button>
        </Link>
      </div>

      <div>{address}</div>
      <div>{uniqueUrl}</div>

    </div>
  );
}

export default ListingDetails;
