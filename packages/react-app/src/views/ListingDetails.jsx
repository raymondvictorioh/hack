import React, {useEffect, useState} from "react";
import { Card, Avatar, Button } from "antd";
import { referralList } from "./tempData/referralList";

const { Meta } = Card;
const itemDetail = () => {
    return referralList.filter(obj => obj.id == 1)[0]
}


function ListingDetails({match}) {

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