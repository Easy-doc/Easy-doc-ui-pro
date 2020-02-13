/* eslint-disable react/no-array-index-key */
import React from 'react';
import { Collapse, Table } from 'antd';
import s from './index.less';

const { Panel } = Collapse;

interface ModelItemProps {
  detailData: {
    name: string;
    description: string;
    author: string;
    deprecated: boolean;
    fieldList: Array<object>;
  };
  idx: string;
}

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
  },
];

const ModelItem: React.FC<ModelItemProps> = props => {
  const { name, description, author, fieldList } = props.detailData;

  const renderPanelHeader = () => (
    <section className={s.header}>
      <div>
        <a href={`#/model/${props.idx}`} id={`#/model/${props.idx}`}>
          <span className={s.name}>{name}</span>
          <span className={s.description}>{description}</span>
        </a>
      </div>
      <div>{`By ${author}`}</div>
    </section>
  );

  return (
    <Collapse bordered={false} defaultActiveKey={['1']}>
      <Panel key={props.idx} className={s.panel} header={renderPanelHeader()}>
        <Table
          rowKey="name"
          columns={subColumns}
          childrenColumnName="fieldList"
          dataSource={fieldList}
          pagination={false}
        />
      </Panel>
    </Collapse>
  );
};

export default ModelItem;
