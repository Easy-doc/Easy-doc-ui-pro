import React, { useEffect, useState } from 'react';
import { Form, Tag, Input, Table, Button } from 'antd';
import s from './index.less';
import { connect } from 'dva';
import { Dispatch, AnyAction } from 'redux';
import { ServiceState } from '../../models/service';
import { ConnectState } from '@/models/connect';

interface GlobalParamProps {
  dispatch: Dispatch<AnyAction>;
  serviceData: ServiceState;
}

const GlobalParam: React.FC<GlobalParamProps> = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState(new Map<string, any>());

  const submitParam = () => {
    const value = form.getFieldsValue();
    const temp = new Map(data);
    temp.set(form.getFieldValue('key'), value);
    localStorage.setItem('easy-doc-global-params', JSON.stringify([...temp]));
    setData(temp);
  };

  const deletParam = (record: any) => {
    const temp = new Map(data);
    temp.delete(record.key);
    localStorage.setItem('easy-doc-global-params', JSON.stringify([...temp]));
    setData(temp);
  };

  useEffect(() => {
    const localStr = localStorage.getItem('easy-doc-global-params');
    if (localStr) {
      setData(new Map(JSON.parse(localStr)));
    }
  }, []);

  const columns = [
    {
      title: 'Key',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      render: (description: string) => (
        <Tag color="green" key="description">
          {description}
        </Tag>
      ),
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      render: (_: any, record: any) => (
        <Button type="danger" shape="round" onClick={() => deletParam(record)}>
          删除
        </Button>
      ),
    },
  ];

  return (
    <>
      <Form layout="inline" form={form} onFinish={submitParam} className={s.form}>
        <Form.Item name="key" rules={[{ required: true }]}>
          <Input addonBefore="Key" />
        </Form.Item>
        <Form.Item name="value" rules={[{ required: true }]}>
          <Input addonBefore="Value" />
        </Form.Item>
        <Form.Item name="description">
          <Input className={s.input} addonBefore="描述" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" shape="round" htmlType="submit">
            添加
          </Button>
        </Form.Item>
      </Form>

      <Table
        key="key"
        dataSource={Array.from(data.values())}
        columns={columns}
        pagination={false}
      />
    </>
  );
};

export default connect(({ service }: ConnectState) => ({
  serviceData: service.serviceData,
}))(GlobalParam);
