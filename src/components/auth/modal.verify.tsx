"use client";

import { sendRequest } from "@/utils/api";
import { useHasMounted } from "@/utils/customHook";
import {
  ArrowLeftOutlined,
  SmileOutlined,
  SolutionOutlined,
  UserOutlined,
} from "@ant-design/icons";

import {
  Button,
  Form,
  Input,
  Modal,
  Steps,
  Col,
  Divider,
  message,
  notification,
  Row,
} from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";

import React, { useEffect, useState } from "react";

const ModalVerify = (props: any) => {
  const { isModalOpen, setIsModalOpen, getEmail } = props;

  const [_id, setId] = useState("");

  const [form] = Form.useForm(); // Tạo instance của Form

  useEffect(() => {
    if (getEmail) {
      form.setFieldsValue({ email: getEmail }); // Cập nhật giá trị email
    }
  }, [getEmail, form]);
  const [current, setCurrent] = useState(0);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const onFinishStep0 = async (values: any) => {
    const { email } = values;
    console.log(" check email", email);

    const res = await sendRequest<IBackendRes<any>>({
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_BACKEND_PORT}/api/v1/auth/retry-active`,
      body: {
        email: email,
      },
    });
    if (res.data && res.statusCode === 201) {
      setCurrent(current + 1);
      setId(res.data.id);
    }
  };
  const onFinishStep1 = async (values: any) => {
    const { code } = values;

    const res = await sendRequest<IBackendRes<any>>({
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_BACKEND_PORT}/api/v1/auth/check-code`,
      body: {
        _id,
        code,
      },
    });

    if (res.data) {
      message.success("Kích hoạt tài khoản thành công ");
      setCurrent(current + 1);
    } else {
      notification.error({
        message: "Verify error",
        description: res.message,
      });
    }
  };
  const hasMounted = useHasMounted();
  if (!hasMounted) return <></>;
  return (
    <div>
      <>
        <Modal
          title="Kích hoạt tài khoản "
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          maskClosable={false}
          footer
        >
          <Steps
            current={current}
            items={[
              {
                title: "Login",

                icon: <UserOutlined />,
              },
              {
                title: "Verification",

                icon: <SolutionOutlined />,
              },

              {
                title: "Done",

                icon: <SmileOutlined />,
              },
            ]}
          />

          {current === 0 && (
            <>
              <div style={{ margin: "20px 0 " }}>
                <span>Tài khoản của bạn chưa được kích hoạt </span>
              </div>

              <Form
                form={form}
                name="basic"
                onFinish={onFinishStep0}
                autoComplete="off"
                layout="vertical"
              >
                <Form.Item
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: "Please input your email!",
                    },
                  ]}
                >
                  <Input disabled />
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Resend
                  </Button>
                </Form.Item>
              </Form>
            </>
          )}
          {current === 1 && (
            <Form
              name="basic"
              onFinish={onFinishStep1}
              autoComplete="off"
              layout="vertical"
            >
              <div style={{ padding: "20px 0 10px 0 " }}>
                <span>
                  Chúng tôi đã gửi 1 mã code xác nhận về email của bạn vui lòng
                  nhập để xác nhận tài khoản :{" "}
                </span>
              </div>

              <Form.Item
                label="Code"
                name="code"
                rules={[
                  {
                    required: true,
                    message: "Please input your code!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Form>
          )}

          {current === 2 && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "20px 0 ",
              }}
            >
              <h4>Tài khoản của bạn đã được kích hoạt !</h4>
            </div>
          )}
        </Modal>
      </>
    </div>
  );
};

export default ModalVerify;
