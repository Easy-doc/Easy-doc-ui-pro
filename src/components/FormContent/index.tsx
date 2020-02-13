/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState } from 'react';
import { Button, Form, Row, Col, Input, Modal } from 'antd';
import { getBtnColor, jsonParse, getDefault } from '@/utils/utils';
import s from './index.less';
import { request2 } from '@/utils/request';
import TextArea from 'antd/lib/input/TextArea';
import ModelTable from '@/components/ModelTable';

interface FormContentProps {
  method: {
    path: string;
    type: string;
    body: any;
    paramList: any;
  };
  path: string;
  serviceUrl: string;
  href: string;
}

const FormContent: React.FC<FormContentProps> = props => {
  const { path, body, type, paramList } = props.method;
  const [form] = Form.useForm();
  const [showModal, setShowModal] = useState(false);
  const [data, setData] = useState({});

  const handleSubmit = async () => {
    const baseUrl = props.serviceUrl + props.path + path;
    const values = form.getFieldsValue();
    let requestBody = {};
    const requestParams = {};
    Object.keys(values).forEach(item => {
      if (/^{\(.|\n\)*}$/g.test(values[item])) {
        requestBody = JSON.parse(values[item]);
      } else if (values[item] !== undefined && values[item] !== '') {
        requestParams[item] = values[item];
      }
    });
    const localStr = localStorage.getItem('easy-doc-global-params');
    if (localStr) {
      new Map<string, any>(JSON.parse(localStr)).forEach((v: any, k: string) => {
        requestParams[k] = v.value;
      });
    }
    const resData = await request2(baseUrl, {
      method: type,
      params: requestParams,
      data: requestBody,
    });
    setData(resData);
    setShowModal(true);
  };

  const handleOk = () => {
    setShowModal(false);
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  const renderObject = () => {
    const obj = {};
    if (!body || !body) {
      return JSON.stringify({ key: 'value' }, null, 2);
    }
    body.fieldList.forEach((item: any) => {
      obj[item.name] = getDefault(item.defaultValue, item.type);
    });
    return jsonParse(obj);
  };

  useEffect(() => {
    paramList.forEach((param: any) => {
      const defaultValue = param.type === 'Object' ? renderObject() : param.defaultValue;
      form.setFieldsValue({
        [param.name]: defaultValue,
      });
    });
  }, []);

  return (
    <Form form={form} onFinish={handleSubmit}>
      {paramList &&
        paramList.map((param: any, idx: any) => (
          <Row gutter={[16, 45]} key={`params-${idx}`}>
            <Col span={12} className={s.params}>
              <p>
                {param.name}
                {param.required && <span className={s.red}>*required</span>}
              </p>
              <i>{param.type}</i>
              {param.type === 'Object' && (
                <ModelTable field={body} type={type} idx={idx} href={props.href} />
              )}
            </Col>
            <Col span={12}>
              <p>{param.description}</p>
              {param.type === 'Object' ? (
                <Form.Item name={param.name}>
                  <TextArea />
                </Form.Item>
              ) : (
                <Form.Item name={param.name}>
                  <Input size="large" />
                </Form.Item>
              )}
            </Col>
          </Row>
        ))}
      <Form.Item>
        <Button
          type="primary"
          className="excute"
          htmlType="submit"
          style={{ background: getBtnColor(type), border: 'none' }}
          block
        >
          运行
        </Button>
      </Form.Item>
      <Modal title="结果" visible={showModal} onOk={handleOk} onCancel={handleCancel}>
        <pre className={s.bodyContent}>{jsonParse(data || {})}</pre>
      </Modal>
    </Form>
  );
};

export default FormContent;
