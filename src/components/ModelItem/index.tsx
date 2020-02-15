/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect } from 'react';
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

  const [hash, setHash] = useState();

  useEffect(() => {
    const temp = window.location.hash;
    let tempId = '';
    if (temp) {
      const tempArr = temp.split('/');
      if (tempArr.length >= 2 && tempArr[1] === 'model') {
        tempId = tempArr[2];
        setHash(tempArr[2]);
      }
    }
    setTimeout(() => {
      const id = `/model/${tempId}`;
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center',
        });
      }
    }, 100);
  }, []);

  const renderPanelHeader = () => (
    <section className={s.header}>
      <div>
        <a href={`#/model/${props.idx}`} id={`/model/${props.idx}`}>
          <span className={s.name}>{name}</span>
          <span className={s.description}>{description}</span>
        </a>
      </div>
      <div>{`By ${author}`}</div>
    </section>
  );

  const handlePanelHeader = (key: any) => {
    setHash(key);
  };

  return (
    <Collapse bordered={false} onChange={handlePanelHeader} activeKey={hash} accordion>
      <Panel key={props.idx} className={s.panel} header={renderPanelHeader()}>
        <Table
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
