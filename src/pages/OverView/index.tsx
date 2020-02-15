import React, { useEffect, useState } from 'react';
import { Card, Table, Tag } from 'antd';
import { connect } from 'dva';
import { Dispatch, AnyAction } from 'redux';
import router from 'umi/router';
import { ConnectState } from '@/models/connect';
import HeaderCard from '@/components/HeaderCard';
import ServiceTab from '@/components/ServiceTab';
import LoginForm from '@/components/LoginForm';
import { BASE_URL } from '@/utils/request';
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
  const [click, setClick] = useState(true);
  const { dispatch } = props;

  useEffect(() => {
    dispatch({ type: 'service/fetchService' });
  }, []);

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
    if (click) {
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
      setClick(false);
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
      render: (auth: boolean) => {
        const color = auth ? 'green' : 'volcano';
        return (
          <Tag color={color} key="auth">
            {auth ? '是' : '否'}
          </Tag>
        );
      },
    },
  ];

  const handleCheckDetail = (record: any, idx: any) => {
    // 网关模式下需要暂存子服务的请求地址
    if (gateway) {
      const serviceMap = new Map();
      serviceList.map((service: any, serviceIdx: number) => {
        serviceMap.set(serviceIdx, service);
        return true;
      });
      localStorage.setItem('easy-doc-service-map', JSON.stringify([...serviceMap]));
    }
    if (record.doc) {
      router.push({
        pathname: `/serviceDetail/${idx}`,
        state: {
          url: record.url,
          gateway,
          auth: record.auth,
          authConfig: record.authConfig,
        },
      });
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
            onRow={(record, idx) => ({ onClick: () => handleCheckDetail(record, idx) })}
            key="card-table"
            dataSource={serviceList}
            columns={columns}
            size="small"
            pagination={false}
          />
        </Card>
      )}
      {!gateway && (
        <ServiceTab key="serviceTab" serviceData={props.serviceData} serviceUrl={BASE_URL} />
      )}
    </>
  );
};

export default connect(({ service }: ConnectState) => ({
  serviceData: service.serviceData,
}))(OverView);
