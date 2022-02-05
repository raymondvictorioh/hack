import { Card, Avatar } from "antd";
import React from "react";
import {
  Link,
} from "react-router-dom";
const { Meta } = Card;


function ListingCard({project}) {
  const {title, desc, imageUrl, id} = project

  return (

    <Link to={`project/${id}`}> 
    <div>

      <Card
        style={{ width: 300, margin:10 }}
        cover={<img alt="example" src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" />}
        hoverable
      >

        <Meta
          avatar={<Avatar src={imageUrl} />}
          title={title}
          description={desc}
        />

      </Card>
      </div>

      </Link>


  );
}

export default ListingCard