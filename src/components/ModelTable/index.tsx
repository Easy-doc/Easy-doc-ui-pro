/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState } from 'react';
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

  const [hash, setHash] = useState('');

  useEffect(() => {
    const temp = window.location.hash;
    if (temp) {
      const tempArr = temp.split('/');
      if (temp.length >= 6) {
        setHash(tempArr[6]);
      }
    }
  }, []);

  const renderResPanelHeader = () => (
    <div>
      <a href={`${props.href}/response/${props.idx}`} id={`${props.href}/response/${props.idx}`}>
        <span className={s.name}>{name}</span>
        {description.includes('@link:') ? (
          <a className={s.aDescription} href={description.split('@link:')[1]}>
            {description.split('@link:')[0]}-点击获取详情
          </a>
        ) : (
          <span className={s.description}>{description}</span>
        )}
      </a>
    </div>
  );

  const handlePanelHeader = (key: any) => {
    setHash(key);
  };

  return (
    <Collapse bordered={false} onChange={handlePanelHeader} activeKey={hash} accordion>
      <Panel
        key={props.idx}
        header={renderResPanelHeader()}
        style={{ background: getPanelColor(props.type) }}
      >
        {fieldList && (
          <Table
            rowKey="name"
            columns={subColumns}
            childrenColumnName="fieldList"
            dataSource={fieldList}
            pagination={false}
            size="small"
            tableLayout="fixed"
          />
        )}
      </Panel>
    </Collapse>
  );
};

export default ModelTable;
