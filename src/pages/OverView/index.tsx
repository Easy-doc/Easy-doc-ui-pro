import React, { useEffect } from 'react';
import { Card, Table, Tag } from 'antd';
import { connect } from 'dva';
import { Dispatch, AnyAction } from 'redux';
import router from 'umi/router';
import { ServiceState } from '../../models/service';
import { ConnectState } from '@/models/connect';
import s from './index.less';
import HeaderCard from '@/components/HeaderCard';

interface OverViewProps {
  dispatch: Dispatch<AnyAction>;
  serviceData: ServiceState;
}

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

const OverView: React.FC<OverViewProps> = props => {
  const { gateway, serviceList } = props.serviceData;

  const handleCheckDetail = (record: any, idx: any) => {
    if (record.doc) {
      router.push({ pathname: `/serviceDetail/${idx}`, state: record });
    }
  };

  useEffect(() => {
    const { dispatch } = props;
    dispatch({ type: 'service/fetchService' });
  }, []);

  return (
    <>
      <HeaderCard serviceData={props.serviceData} />
      {gateway && (
        <Card title="服务列表" className={s.list}>
          <Table
            onRow={(record, idx) => ({ onClick: () => handleCheckDetail(record, idx) })}
            key="url"
            dataSource={serviceList}
            columns={columns}
            size="small"
            pagination={false}
          />
        </Card>
      )}
    </>
  );
};

export default connect(({ service }: ConnectState) => ({
  serviceData: service.serviceData,
}))(OverView);
