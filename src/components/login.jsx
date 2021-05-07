import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Form, Input, Button, notification } from "antd";
import React, { useEffect, useState } from "react";
import firebase from "../firebase";

const Login = (props) => {
  const db = firebase.firestore().collection("items");
  const [empty, setEmpty] = useState(true);

  const onFinish = (values) => {
    if (values) {
      db.where("username", "==", values.username)
        .where("key", "==", values.key)
        .get()
        .then(async (querySnapshot) => {
          localStorage.setItem("empty", querySnapshot.empty);
          setEmpty(querySnapshot.empty);
          if (querySnapshot.empty) {
            notification["error"]({
              message: "Error",
              description: "Not found user please contact administrator",
            });
          } else {
            querySnapshot.forEach((doc) => {
              console.log(doc.data());
              localStorage.setItem("user", JSON.stringify(doc.data()));
            });
            notification["success"]({
              message: "Success",
              description: "Welcome....",
            });
            await props.getUserInfo();
          }
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });
    }
  };

  useEffect(() => {
    let empty = localStorage.getItem("empty");
    setEmpty(!empty);
  }, []);

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="login" style={{ display: `${empty ? "flex" : "none"}` }}>
      <div className="box-login">
        <p className="lumbark">
          <LockOutlined className="pr-4" /> Lumbark Admin
        </p>
        <Form name="basic" onFinish={onFinish} onFinishFailed={onFinishFailed}>
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: "Please input your username!",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Username"
            />
          </Form.Item>

          <Form.Item
            name="key"
            rules={[
              {
                required: true,
                message: "Please input your key!",
              },
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="key"
            />
          </Form.Item>

          <Form.Item>
            <Button block type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
