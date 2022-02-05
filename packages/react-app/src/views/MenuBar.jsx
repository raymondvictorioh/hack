import { Button, Col, Menu, Row } from "antd";
import React from "react";
import { Link, Route, Switch, useLocation } from "react-router-dom";



function MenuBar() {
  const location = useLocation();

  return (

    <Menu style={{ textAlign: "center", marginTop: 40 }} selectedKeys={[location.pathname]} mode="horizontal">
    <Menu.Item key="/">
      <Link to="/">NFT referrals</Link>
    </Menu.Item>
    <Menu.Item key="/referrals">
      <Link to="/referrals">My referrals</Link>
    </Menu.Item>
  </Menu>


  );
}

export default MenuBar