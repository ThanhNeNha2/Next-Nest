import AdminContent from "@/components/layout/admin.content";
import AdminFooter from "@/components/layout/admin.footer";
import AdminHaeder from "@/components/layout/admin.haeder";
import AdminSidebar from "@/components/layout/admin.sidebar";
import { Layout } from "antd";
import React from "react";

const AdminLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { Header, Content, Footer, Sider } = Layout;

  return (
    <Layout>
      <AdminSidebar />
      <Layout>
        <AdminHaeder />
        <AdminContent>{children}</AdminContent>
        <AdminFooter />
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
