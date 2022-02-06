import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, useParams } from "react-router-dom";
import { Card, Image, Button } from "antd";
import { referralList } from "./tempData/referralList";
import { Link } from "react-router-dom";

const { Meta } = Card;

function BuyingDetails({ address, logoutOfWeb3Modal, web3Modal, loadWeb3Modal }) {
  let { nft_id } = useParams();
  const itemDetail = () => {
    return referralList.filter(obj => obj.id == nft_id)[0];
  };

  const [size, setSize] = "large";
  const [uniqueUrl, setUniqueUrl] = useState(`${process.env.PUBLIC_URL}/dark-thsdsdseme.css`);
  const [purchase, setPurchase] = useState("-");
  const modalButtons = [];

  if (web3Modal) {
    if (web3Modal.cachedProvider) {
      modalButtons.push(
        <Button
          key="logoutbutton"
          style={{ verticalAlign: "top", marginLeft: 8, marginTop: 4 }}
          shape="round"
          size="large"
          onClick={() => setPurchase("Congratulations on your purchase")}
        >
          PURCHASE
        </Button>,
      );
    } else {
      modalButtons.push(
        <Button
          key="loginbutton"
          style={{ verticalAlign: "top", marginLeft: 8, marginTop: 4 }}
          shape="round"
          size="large"
          /* type={minimized ? "default" : "primary"}     too many people just defaulting to MM and having a bad time */
          onClick={loadWeb3Modal}
        >
          Connect Wallet Before Purchasing
        </Button>,
      );
    }
  }

  return (
    <div>
      <h1>BUY</h1>
      <Image width={200} src={itemDetail().imageUrl} />
      <h1>{itemDetail().title}</h1>
      <h1>{itemDetail().desc}</h1>

      <br></br>
     
      <div> {modalButtons}</div>
      {purchase}
    </div>
  );
}

export default BuyingDetails;
