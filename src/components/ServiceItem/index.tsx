/* eslint-disable react/no-array-index-key */
import React, { useState } from 'react';
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
    methodList: Array<any>;
  };
  serviceUrl: string;
  idx: string;
}

const ServiceItem: React.FC<SeviceItemProps> = props => {
  const { name, path, description, author, methodList } = props.detailData;
  const [hash, setHash] = useState<string[]>([]);

  const renderPanelHeader = () => (
    <section className={s.header}>
      <div>
        <a
          href={`#/controller/${props.idx}`}
          id={`#/controller/${props.idx}`}
          className={s.panelHeader}
        >
          <span className={s.name}>{name}</span>
          <span className={s.path}>{path}</span>
          <span className={s.path}>{description}</span>
        </a>
      </div>
      <div>{`By ${author}`}</div>
    </section>
  );

  const handlePanelHeader = (key: any) => {
    hash[1] = key[0];
    setHash(hash);
  };

  const renderSubHeader = (method: any, key: any) => (
    <section className={s.subHeader}>
      <Button className={s.button} style={{ background: getBtnColor(method.type) }}>
        {method.type || 'ALL'}
      </Button>
      <a
        href={`#/controller/${props.idx}/method/${key}`}
        id={`#/controller/${props.idx}/method/${key}`}
      >
        <span className={s.path}>{method.path}</span>
        <span className={s.path}>{method.description}</span>
      </a>
    </section>
  );

  const renderSubContent = (method: any, methodIdx: any) => (
    <section className={s.subContent}>
      {method.paramList && method.paramList.length > 0 && (
        <Row className={s.paramTitle}>
          <Col span={12}>参数名称</Col>
          <Col span={12}>参数描述</Col>
        </Row>
      )}
      <Divider />
      <section>
        <FormContent
          method={method}
          path={path}
          serviceUrl={props.serviceUrl}
          href={`#/controller/0/method/${methodIdx}`}
        />
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
                      <ModelTable
                        field={field}
                        type={method.type}
                        idx={fieldIdx}
                        href={`#/controller/${props.idx}/method/${methodIdx}`}
                      />
                    </Col>
                  ))}
              </Row>
            </React.Fragment>
          ))}
      </section>
    </section>
  );

  return (
    <Collapse bordered={false} onChange={handlePanelHeader} activeKey={hash[1]}>
      <Panel key={props.idx} className={s.panel} header={renderPanelHeader()}>
        {methodList &&
          methodList.map((method, idx) => (
            <Collapse bordered={false} key={`method-${idx}`}>
              <Panel
                key={idx}
                header={renderSubHeader(method, idx)}
                className={s.panel}
                style={{
                  background: getPanelColor(method.type),
                  border: `1px solid ${getBtnColor(method.type)}`,
                }}
              >
                {renderSubContent(method, idx)}
              </Panel>
            </Collapse>
          ))}
      </Panel>
    </Collapse>
  );
};

export default ServiceItem;
