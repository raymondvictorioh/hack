import React, { useEffect, useState, useRef } from "react";
import { BrowserRouter as Router, useParams, useLocation } from "react-router-dom";
import { Card, Image, Button } from "antd";
import { referralList } from "./tempData/referralList";
import { Link } from "react-router-dom";
<<<<<<< HEAD
import {NETWORKS} from "../constants"
import wagmiABI from "../abi/wagmi.json"
import {useContractRead} from 'wagmi'
import { ethers } from "../../../hardhat/node_modules/ethers/lib";
import {useContractManager} from "../contracts/useContractManager"

const { Meta } = Card;
=======
>>>>>>> 9bc27be (add unique url with baseURI.current window location)

function ListingDetails({ address }) {
  let { nft_id } = useParams();
  const itemDetail = () => {
    return referralList.filter(obj => obj.id == nft_id)[0];
  };
<<<<<<< HEAD

  const contract = useContractManager()
  console.log(contract.getListing(1))

  const [size, setSize] = "large";
  const [uniqueUrl, setUniqueUrl] = useState(`${process.env.PUBLIC_URL}/dark-thsdsdseme.css`)
  // console.log(data, error, loading)
=======
  const [size, setSize] = "large";
  const baseURI = useRef("");
  const [uniquePromoterUrl, setUniquePromoterUrl] = useState('')

  useEffect(() => {
    baseURI.current = window.location.origin;
    setUniquePromoterUrl(baseURI.current + `/buyer/${nft_id}/${address}`)
  }, []);

>>>>>>> 9bc27be (add unique url with baseURI.current window location)
  return (
    <div>
      <Image width={200} src={itemDetail().imageUrl} />
      <h1>{itemDetail().title}</h1>
      <h1>{itemDetail().desc}</h1>
      <div>
        <Button type="primary" size={size}>
          Sign Up as Promoter
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

      <div>{uniquePromoterUrl}</div>
      <div>{baseURI.current}</div>
      {/* <div>{location}</div> */}
    </div>
  );
}

export default ListingDetails;
