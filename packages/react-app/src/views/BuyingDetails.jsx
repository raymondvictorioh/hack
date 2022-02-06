import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, useParams, useLocation } from "react-router-dom";
import { Card, Image, Button } from "antd";
import { referralList } from "./tempData/referralList";
import { useContractManager } from "../hooks/useContractManager";
import { useCallback } from "react";

const { Meta } = Card;

function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

function BuyingDetails({ address, userSigner }) {
  let { nft_id } = useParams();
  const queryParams = useQuery();
  const contract = useContractManager(userSigner);

  const shillerAddress = queryParams.get("shiller");

  const buyNFT = useCallback(async () => {
    if (!nft_id || !contract) return;
    await contract.buyNFT(nft_id, shillerAddress);
  }, [contract, nft_id, shillerAddress]);

  const itemDetail = () => {
    return referralList.filter(obj => obj.id == nft_id)[0];
  };

  return (
    <div>
      <h1>BUY</h1>
      <Image width={200} src={itemDetail().imageUrl} />
      <h1>{itemDetail().title}</h1>
      <h1>{itemDetail().desc}</h1>
      <br></br>
      <div>
        <Button type="primary" size={"large"} onClick={buyNFT}>
          PURCHASE
        </Button>
      </div>
    </div>
  );
}

export default BuyingDetails;
