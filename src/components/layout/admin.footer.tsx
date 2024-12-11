"use client";
import { Layout } from "antd";
import React from "react";

const AdminFooter = () => {
  const { Header, Content, Footer, Sider } = Layout;

  return (
    <div>
      <Footer style={{ textAlign: "center" }}>
        Ant Design ©{new Date().getFullYear()} Created by Ant UED
      </Footer>
    </div>
  );
};

export default AdminFooter;
