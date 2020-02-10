import React, { useEffect } from 'react';
import { Card, Table } from 'antd';
import { connect } from 'dva';
import { Dispatch, AnyAction } from 'redux';
import router from 'umi/router';
import { ServiceState } from '../../models/service'
import { ConnectState } from '@/models/connect';
import s from './index.less';
import HeaderCard from '@/components/HeaderCard';

interface OverViewProps {
  dispatch: Dispatch<AnyAction>;
  serviceData: ServiceState,
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
    render: (doc: any) => doc ? '是' : '否'
  },
  {
    title: '是否验证权限',
    dataIndex: 'auth',
    key: 'auth',
    render: (auth: any) =>  auth ? '是' : '否'
  },
]

const OverView: React.FC<OverViewProps> = props => {
  const {
    gateway,
    serviceList,
  } = props.serviceData

  const handleCheckDetail = (record: any, idx: any) => {
    router.push({ pathname: `/serviceDetail/${idx}`, state: record})
  }

  useEffect(() => {
    const { dispatch } = props
    dispatch({ type: 'service/fetchService' })
  }, [])

  return (
    <>
      <HeaderCard serviceData={props.serviceData} />
      {gateway &&
      <Card title="Service List" className={s.list}>
        <Table
          onRow={(record, idx) => ({onClick: () => handleCheckDetail(record, idx) })}
          key="url"
          dataSource={serviceList}
          columns={columns}
          size="small"
        />
      </Card>}
    </>
  )
}

export default connect(({ service }: ConnectState) => ({
  serviceData: service.serviceData,
}))(OverView)
