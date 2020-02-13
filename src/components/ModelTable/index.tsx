/* eslint-disable react/no-array-index-key */
import React from 'react';
import { Collapse, Table } from 'antd';
import { getPanelColor } from '@/utils/utils';
import s from './index.less';

const { Panel } = Collapse;

interface ModelTableProps {
  field: any;
  type: string;
  idx: string;
  href: string;
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

const ModelTable: React.FC<ModelTableProps> = props => {
  const { name, description, fieldList } = props.field;

  const renderResPanelHeader = () => (
    <div>
      <a href={`${props.href}/response/${props.idx}`} id={`${props.href}/response/${props.idx}`}>
        <span className={s.name}>{name}</span>
        <span className={s.description}>{description}</span>
      </a>
    </div>
  );

  return (
    <Collapse bordered={false}>
      <Panel
        key={props.idx}
        header={renderResPanelHeader()}
        style={{ background: getPanelColor(props.type) }}
      >
        <Table
          rowKey="name"
          columns={subColumns}
          childrenColumnName="fieldList"
          dataSource={fieldList}
          pagination={false}
          size="small"
          tableLayout="fixed"
        />
      </Panel>
    </Collapse>
  );
};

export default ModelTable;
