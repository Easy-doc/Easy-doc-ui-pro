/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState } from 'react';
import { Button, Form, Row, Col, Input, Modal, notification, Spin, Upload } from 'antd';
import { getBtnColor, jsonParse, getDefault } from '@/utils/utils';
import { UploadOutlined } from '@ant-design/icons';
import s from './index.less';
import { request2, BASE_URL } from '@/utils/request';
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
  href: string;
  response: any;
}

const FormContent: React.FC<FormContentProps> = props => {
  const { path, body, type, paramList } = props.method;
  const [form] = Form.useForm();
  const [showModal, setShowModal] = useState(false);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [submitFile, setSubmitFile] = useState(null);
  const baseUrl = BASE_URL + props.path + path;

  const handleSubmit = () => {
    const values = form.getFieldsValue();
    let requestBody = {};
    const requestParams = {};
    const formData = new FormData();
    Object.keys(values).forEach(item => {
      if (/^{\(.|\n\)*}$/g.test(values[item])) {
        requestBody = JSON.parse(values[item]);
      } else if (values[item] !== undefined && values[item] !== '') {
        requestParams[item] = values[item];
        // 处理file
        if (fileList.length > 0) {
          formData.append(item, values[item]);
        }
      }
    });

    const localStr = localStorage.getItem('easy-doc-global-params');
    if (localStr) {
      new Map<string, any>(JSON.parse(localStr)).forEach((v: any, k: string) => {
        requestParams[k] = v.value;
      });
    }
    let methodType = type;
    if (type == null) {
      methodType = 'GET';
    }

    const resFile = props.response.some(r => r.fieldList.some(f => f.name === 'File'));
    const option = {
      method: methodType,
    };
    if (submitFile) {
      formData.append('file', submitFile);
      option.data = formData;
    } else {
      option.params = requestParams;
      option.data = requestBody;
    }
    if (resFile) {
      option.responseType = 'blob';
    }
    setLoading(true);
    request2(baseUrl, option)
      .then(res => {
        setLoading(false);
        setData(res);
        if (resFile && res) {
          const pom = document.createElement('a');
          const url = window.URL.createObjectURL(new Blob([res]));
          pom.setAttribute('href', url);
          pom.setAttribute('download', '下载文件.xlsx');
          if (document.createEvent) {
            const event = document.createEvent('MouseEvents');
            event.initEvent('click', true, true);
            pom.dispatchEvent(event);
          } else {
            pom.click();
          }
        }
      })
      .catch(error => {
        const { response } = error;
        const { status, url } = response || {};
        notification.error({ message: `请求错误 ${status}: ${url}` });
        setLoading(false);
        setData(error.data);
      });
    if (!resFile) setShowModal(true);
  };

  const handleOk = () => {
    setShowModal(false);
    setData('');
  };

  const handleCancel = () => {
    setShowModal(false);
    setData('');
  };

  const handleFileChange = (info: any) => {
    // 限制上传数量
    let fList = [...info.fileList];
    fList = fList.slice(-1);
    setFileList(fList);
  };

  const renderObject = () => {
    const obj = {};
    if (!body) {
      return JSON.stringify({ key: 'value' }, null, 2);
    }
    if (body.fieldList) {
      body.fieldList.forEach((item: any) => {
        obj[item.name] = getDefault(item.defaultValue, item.type);
      });
    }
    return jsonParse(obj);
  };

  const renderForm = (param: any) => {
    switch (param.type) {
      case 'Object':
        return (
          <Form.Item name={param.name}>
            <TextArea autoSize />
          </Form.Item>
        );
      case 'File':
        return (
          <Form.Item>
            <Upload
              beforeUpload={f => setSubmitFile(f)}
              onChange={handleFileChange}
              fileList={fileList}
            >
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>
        );
      default:
        return (
          <Form.Item name={param.name}>
            <Input size="large" />
          </Form.Item>
        );
    }
  };

  useEffect(() => {
    paramList.forEach((param: any) => {
      let defaultValue = '';
      if (!param.defaultValue) {
        defaultValue = param.type === 'Object' ? renderObject() : '';
      } else {
        defaultValue = param.defaultValue;
      }
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
              {param.type === 'Object' && body && body.fieldList && (
                <ModelTable
                  field={body}
                  type={type}
                  idx={idx}
                  href={props.href}
                  key={`modelTable-${idx}`}
                />
              )}
            </Col>
            <Col span={12}>
              {param.description.includes('@link:') ? (
                <a href={param.description.split('@link:')[1]}>
                  {param.description.split('@link:')[0]}-点击获取详情
                </a>
              ) : (
                <p>{param.description}</p>
              )}
              {renderForm(param)}
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
        <Spin spinning={loading} tip="接口请求中" />
        <pre className={s.bodyContent}>{jsonParse(data || {})}</pre>
      </Modal>
    </Form>
  );
};

export default FormContent;
