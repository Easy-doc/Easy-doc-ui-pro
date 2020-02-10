import React from 'react';
import { Card, Row, Col, Divider } from 'antd';
import { ServiceState } from '../../models/service'
import s from './index.less';

interface HeaderCardProps {
  serviceData: ServiceState,
}

const HeaderCard: React.FC<HeaderCardProps> = props => {
  const {
    name,
    description,
    contact,
    gateway,
    totalMethod = 0,
    deprecatedMethod = 0,
    totalModel = 0,
    deprecatedModel = 0,
    totalService = 0,
    docService = 0,
  } = props.serviceData

  const renderCard = (total: any, deprecate: any, modelText: any) => (
    <Col span={8}>
      <Card className={s.card}>
        <h1>{`可用${modelText}数量`}</h1>
        <h1 className={s.total}>{total - deprecate}</h1>
        <Divider />
        {`总${modelText}数量:`}
          <span className={s.bold}>{total}</span>
        <Divider type="vertical" />
        {`${modelText === '文档' ? '无' : '废弃'}${modelText}数量:`}
        <span className={s.bold}>{deprecate}</span>
      </Card>
    </Col>
  )

  return (
    <>
      <Row justify="start" gutter={16}>
        <Col span={8}>
          <Card className={s.card}>
            <h1>{`服务名称：${name}`}</h1>
            <h4>{`项目描述：${description}`}</h4>
            <Divider />
            负责人：<span className={s.bold}>{contact}</span>
          </Card>
        </Col>
          {!gateway ?
          <>
            {renderCard(totalMethod, deprecatedMethod, '接口')}
            {renderCard(totalModel, deprecatedModel, '对象')}
          </> :
           <>{renderCard(totalService, totalService - docService, '文档')}</>}
      </Row>
    </>
  )
}

export default HeaderCard
