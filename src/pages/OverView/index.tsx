import React, { useEffect, useState } from 'react';
import { Card, Table, Tag } from 'antd';
import { connect } from 'dva';
import { Dispatch, AnyAction } from 'redux';
import { ConnectState } from '@/models/connect';
import HeaderCard from '@/components/HeaderCard';
import ServiceTab from '@/components/ServiceTab';
import LoginForm from '@/components/LoginForm';
import { ServiceState } from '../../models/service';
import s from './index.less';

interface OverViewProps {
  dispatch: Dispatch<AnyAction>;
  serviceData: ServiceState;
}

const OverView: React.FC<OverViewProps> = props => {
  const { gateway, serviceList } = props.serviceData;
  const [data, setData] = useState();
  const [show, setShow] = useState(false);
  const [request, setRequest] = useState(0);
  const { dispatch } = props;

  useEffect(() => {
    if (data) {
      dispatch({
        type: 'service/fetchService',
        payload: {
          account: data.account,
          password: data.password,
        },
      });
    }
  }, [data]);

  useEffect(() => {
    if (request === 0) {
      dispatch({ type: 'service/fetchService' });
      setRequest(1);
    } else if (request === 1 && Object.keys(props.serviceData).length <= 0) {
      // 获取不到值代表需要登陆
      const localAuth = localStorage.getItem('easy-doc-auth');
      // 本地不存在时需要输入信息
      if (!localAuth) {
        setShow(true);
      } else {
        setShow(false);
        const authConfig = JSON.parse(localAuth);
        dispatch({
          type: 'service/fetchService',
          payload: {
            account: authConfig.account,
            password: authConfig.password,
          },
        });
      }
      setRequest(2);
    }
  }, [props.serviceData]);

  const columns = [
    {
      title: '服务名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '服务地址',
      dataIndex: 'url',
      key: 'url',
    },
    {
      title: '是否存在文档',
      dataIndex: 'doc',
      key: 'doc',
      render: (doc: boolean) => {
        const color = doc ? 'green' : 'volcano';
        return (
          <Tag color={color} key="doc">
            {doc ? '是' : '否'}
          </Tag>
        );
      },
    },
    {
      title: '是否验证权限',
      dataIndex: 'auth',
      key: 'auth',
      render: (docAuth: boolean) => {
        const color = docAuth ? 'green' : 'volcano';
        return (
          <Tag color={color} key="docAuth">
            {docAuth ? '是' : '否'}
          </Tag>
        );
      },
    },
  ];

  const handleCheckDetail = (record: any) => {
    if (record.doc) {
      window.location.href = `${record.url}/easy-doc.html`;
    }
  };

  const getData = (d: any) => {
    setData(d);
  };

  return (
    <>
      <LoginForm key="loginForm" showModal={show} getData={getData} />
      <HeaderCard serviceData={props.serviceData} />
      {gateway && (
        <Card title="服务列表" className={s.list} key="card">
          <Table
            onRow={record => ({ onClick: () => handleCheckDetail(record) })}
            rowKey="name"
            dataSource={serviceList}
            columns={columns}
            size="small"
            pagination={false}
          />
        </Card>
      )}
      {!gateway && <ServiceTab key="serviceTab" serviceData={props.serviceData} />}
    </>
  );
};

export default connect(({ service }: ConnectState) => ({
  serviceData: service.serviceData,
}))(OverView);
