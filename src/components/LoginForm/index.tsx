/* eslint-disable react/no-array-index-key */
import React, { useState } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { request } from '@/utils/request';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

interface LoginFormProps {
  showModal: boolean;
  getData: any;
}

const LoginForm: React.FC<LoginFormProps> = props => {
  const [form] = Form.useForm();

  const [show, setShow] = useState(true);

  const handleSubmit = async () => {
    const values = form.getFieldsValue();
    const authConfig = {
      account: values.account,
      password: values.password,
    };
    const resData = await request('/easy-doc/resource', {
      method: 'GET',
      params: {
        account: values.account,
        password: values.password,
      },
    });
    if (resData && resData.success) {
      message.success('登陆成功');
      localStorage.setItem('easy-doc-auth', JSON.stringify(authConfig));
      props.getData(values);
      setShow(false);
    } else {
      message.error('账号/密码错误');
    }
  };

  const handleCancel = () => {
    setShow(false);
  };

  return (
    <Modal title="登录" visible={props.showModal && show} onCancel={handleCancel} footer={false}>
      <Form onFinish={handleSubmit} className="login-form" form={form}>
        <Form.Item name="account" rules={[{ required: true }]}>
          <Input prefix={<UserOutlined />} placeholder="Username" />
        </Form.Item>
        <Form.Item name="password" rules={[{ required: true }]}>
          <Input prefix={<LockOutlined />} type="password" placeholder="Password" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" shape="round" htmlType="submit">
            登陆
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default LoginForm;
