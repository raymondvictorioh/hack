import React, {useEffect, useState} from "react";
import {
    BrowserRouter as Router,
    useParams
  } from "react-router-dom";
import { Card, Avatar, Button } from "antd";
import { referralList } from "./tempData/referralList";

const { Meta } = Card;


function ListingDetails() {
    let { id } = useParams();
    const itemDetail = () => {
        return referralList.filter(obj => obj.id == id)[0]
    }
    
    const [size, setSize] = "large"
  return (
    <div>
        <h1>   
            {itemDetail().title}
        </h1>
        <h1>   
            {itemDetail().desc}
        </h1>
       
        <Button type="primary" size={size}>
          Promote
        </Button>
    </div>
  );
}

export default ListingDetails