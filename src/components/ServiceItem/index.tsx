/* eslint-disable react/no-array-index-key */
import React from 'react';
import { Collapse, Button, Row, Col, Divider } from 'antd';
import { getBtnColor, getPanelColor } from '@/utils/utils';
import s from './index.less';
import FormContent from '@/components/FormContent';
import ModelTable from '@/components/ModelTable';

const { Panel } = Collapse;

interface SeviceItemProps {
  detailData: {
    name: string;
    path: string;
    description: string;
    author: string;
    methodList: Array<object>;
  };
  serviceUrl: string;
  idx: string;
}

const ServiceItem: React.FC<SeviceItemProps> = props => {
  const { name, path, description, author, methodList } = props.detailData;

  const renderPanelHeader = () => (
    <section className={s.header}>
      <div>
        <span className={s.name}>{name}</span>
        <span className={s.path}>{path}</span>
        <span className={s.path}>{description}</span>
      </div>
      <div>{`By ${author}`}</div>
    </section>
  );

  const renderSubHeader = (method: any) => (
    <section className={s.subHeader}>
      <Button className={s.button} style={{ background: getBtnColor(method.type) }}>
        {method.type || 'ALL'}
      </Button>
      <p className={s.path}>{method.path}</p>
      <p className={s.path}>{method.description}</p>
    </section>
  );

  const renderSubContent = (method: any) => (
    <section className={s.subContent}>
      {method.paramList && method.paramList.length > 0 && (
        <Row className={s.paramTitle}>
          <Col span={12}>参数名称</Col>
          <Col span={12}>参数描述</Col>
        </Row>
      )}
      <Divider />
      <section>
        <FormContent method={method} path={path} serviceUrl={props.serviceUrl} />
      </section>
      <section>
        {method.responseList && method.responseList.length > 0 && (
          <Row className={s.paramTitle}>
            <Col span={12}>状态码</Col>
            <Col span={12}>描述</Col>
          </Row>
        )}
        <Divider />
        {method.responseList &&
          method.responseList.map((res: any, responseIdx: any) => (
            <React.Fragment key={`response-${responseIdx}`}>
              <Row className={s.params}>
                <Col span={12}>{res.code}</Col>
                <Col span={12}>{res.description}</Col>
              </Row>
              <Divider />
              <Row className={s.paramTitle}>
                <Col span={12}>返回值</Col>
              </Row>
              <Row>
                {res.fieldList &&
                  res.fieldList.map((field: any, fieldIdx: any) => (
                    <Col span={24} key={`fieldList-${fieldIdx}`}>
                      <ModelTable field={field} type={method.type} idx={fieldIdx} />
                    </Col>
                  ))}
              </Row>
            </React.Fragment>
          ))}
      </section>
    </section>
  );

  return (
    <Collapse bordered={false} defaultActiveKey={['1']}>
      <Panel key={props.idx} className={s.panel} header={renderPanelHeader()}>
        {methodList &&
          methodList.map((method, idx) => (
            <Collapse bordered={false} key={`method-${idx}`}>
              <Panel
                key={idx}
                header={renderSubHeader(method)}
                className={s.panel}
                style={{
                  background: getPanelColor(method.type),
                  border: `1px solid ${getBtnColor(method.type)}`,
                }}
              >
                {renderSubContent(method)}
              </Panel>
            </Collapse>
          ))}
      </Panel>
    </Collapse>
  );
};

export default ServiceItem;
