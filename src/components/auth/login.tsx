"use client";
import { Button, Col, Divider, Form, Input, notification, Row } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import Link from "next/link";
import { authenticate } from "@/utils/actions";
import { useRouter } from "next/navigation";
import ModalVerify from "./modal.verify";
import { useState } from "react";
const Login = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [getEmail, setGetEmail] = useState("");
  const router = useRouter();
  const onFinish = async (values: any) => {
    setGetEmail("");
    const { password, username } = values;
    const res = await authenticate(username, password);

    if (res?.error) {
      if (+res?.code === 2) {
        // router.push(`/verify`);
        setGetEmail(username);
        setIsModalOpen(true);
        return;
      }
      notification.error({
        message: "Error login",
        description: res?.error,
      });
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div>
      <Row justify={"center"} style={{ marginTop: "30px" }}>
        <Col xs={24} md={16} lg={8}>
          <fieldset
            style={{
              padding: "15px",
              margin: "5px",
              border: "1px solid #ccc",
              borderRadius: "5px",
            }}
          >
            <legend>Đăng Nhập</legend>
            <Form
              name="basic"
              onFinish={onFinish}
              autoComplete="off"
              layout="vertical"
            >
              <Form.Item
                label="Email"
                name="username"
                rules={[
                  {
                    required: true,
                    message: "Please input your email!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Please input your password!",
                  },
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Login
                </Button>
              </Form.Item>
            </Form>
            <Link href={"/"}>
              <ArrowLeftOutlined /> Quay lại trang chủ
            </Link>
            <Divider />
            <div style={{ textAlign: "center" }}>
              Chưa có tài khoản?{" "}
              <Link href={"/auth/register"}>Đăng ký tại đây</Link>
            </div>
          </fieldset>
        </Col>
      </Row>
      <ModalVerify
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        getEmail={getEmail}
      />
    </div>
  );
};

export default Login;
