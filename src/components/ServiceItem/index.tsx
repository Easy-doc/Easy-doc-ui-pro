/* eslint-disable react/no-array-index-key */
import React from 'react'
import { Collapse, Button, Form, Row, Col, Input, Divider, Table } from 'antd'
import { getBtnColor } from '@/utils/utils'
import s from './index.less'
import TextArea from 'antd/lib/input/TextArea';

const { Panel } = Collapse;

interface SeviceItemProps  {
  detailData: {
    name: string,
    path: string,
    description: string,
    author: string,
    methodList: Array<object>,
  },
  key: string,
}

const columns = [
  {
    title: '对象名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '描述',
    dataIndex: 'description',
    key: 'description',
  }
]

const subColumns = [
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '类型',
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: '描述',
    dataIndex: 'description',
    key: 'description',
  }
]

const ServiceItem: React.FC<SeviceItemProps> = props => {
  const { name, path, description, author, methodList } = props.detailData
  const form = Form.useForm()

  const handleSubmit = () => {}

  const renderPanelHeader = () => (
    <section className={s.header}>
      <div>
        <span className={s.name}>{name}</span>
        <span className={s.path}>{path}</span>
        <span className={s.path}>{description}</span>
      </div>
      <div>{`By ${author}`}</div>
    </section>
  )

  const renderSubHeader = (method: any) => (
    <section className={s.subHeader}>
      <Button
        className={s.button}
        style={{ background: getBtnColor(method.type) }}
      >
        {method.type || 'DISCARD'}
      </Button>
      <p className={s.path}>{method.path}</p>
      <p className={s.path}>{method.description}</p>
    </section>
  )

  const expandedRowRender = (fieldList: any) => {
    if (!fieldList) return null
    return (
      <>
        {Array.isArray(fieldList) &&
        fieldList.map((f: any, idx: any) => {
          if (!f.fieldList) return null
          return (
            <Table
              rowKey="name"
              key={`table-${idx}`}
              columns={subColumns}
              dataSource={f && f.fieldList}
              expandedRowRender={() => expandedRowRender(f && f.fieldList)}
              pagination={false}
            />
          )})
        }
      </>
    )
  }

  const renderSubContent = (method: any) => (
    <section className={s.subContent}>
      {method.paramList &&
      method.paramList.length > 0 &&
      <Row className={s.paramTitle}>
        <Col span={12}>参数名称</Col>
        <Col span={12}>参数描述</Col>
      </Row>}
      <Divider />
      <section>
        {method.paramList &&
        method.paramList.map((params: any, idx: any) => (
          <Form form={form} onFinish={handleSubmit}>
          <Row gutter={[16, 45]} key={`params-${idx}`}>
            <Col span={12} className={s.params}>
              <p>
                {params.name}
                {params.required && <span className={s.red}>*required</span>}
              </p>
              <i>{params.type}</i>
            </Col>
            <Col span={12}>
              <p>{params.description}</p>
              {params.type === 'object' ?
               <Form.Item name={params.name}>
                  <TextArea />
               </Form.Item> :
               <Form.Item name={params.name}>
                  <Input size="large" />
                </Form.Item> }
            </Col>
          </Row>
          </Form>
        ))}
      </section>
      <Button
        type="primary"
        size="large"
        className={s.btn}
      >
        运行
      </Button>
      <section>
        {method.responseList &&
        method.responseList.length > 0 &&
        <Row className={s.paramTitle}>
          <Col span={12}>状态码</Col>
          <Col span={12}>描述</Col>
        </Row>}
        <Divider />
          {method.responseList &&
        method.responseList.map((res: any, idx: any) => (
          <React.Fragment key={`response-${idx}`}>
            <Row className={s.params}>
              <Col span={12}>{res.code}</Col>
              <Col span={12}>{res.description}</Col>
            </Row>
            <Row justify="end">
              <Col span={12}>
                <Table
                  rowKey="name"
                  columns={columns}
                  expandedRowRender={() => expandedRowRender(res.fieldList)}
                  dataSource={res.fieldList}
                />
              </Col>
            </Row>
          </React.Fragment>
        ))}
      </section>
    </section>
  )

  return (
    <Collapse defaultActiveKey={['1']}>
      <Panel
        key={props.key}
        className={s.panel}
        header={renderPanelHeader()}
      >
        {methodList && methodList.map((method, idx) => (
          <Collapse key={`method-${idx}`}>
            <Panel
              key={idx}
              header={renderSubHeader(method)}
              className={s.panel}
            >
              {renderSubContent(method)}
            </Panel>
          </Collapse>
        ))}
      </Panel>
    </Collapse>
  )
}

export default ServiceItem
