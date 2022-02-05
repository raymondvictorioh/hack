import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, useParams } from "react-router-dom";
import { Card, Image, Button } from "antd";
import { referralList } from "./tempData/referralList";
import { Link } from "react-router-dom";


const { Meta } = Card;

function BuyingDetails({ address }) {
  let { nft_id } = useParams();
  const itemDetail = () => {
    return referralList.filter(obj => obj.id == nft_id)[0];
  };

  const [size, setSize] = "large";
  const [uniqueUrl, setUniqueUrl] = useState(`${process.env.PUBLIC_URL}/dark-thsdsdseme.css`)

  return (
    <div>
        <h1>BUY</h1>
      <Image width={200} src={itemDetail().imageUrl} />
      <h1>{itemDetail().title}</h1>
      <h1>{itemDetail().desc}</h1>
    
      <br></br>
      <div>
        <Link to={`/buyer/${nft_id}/${address}`}>
          <Button type="primary" size={size}>
            PURCHASE
          </Button>
        </Link>
      </div>


    </div>
  );
}

export default BuyingDetails;
