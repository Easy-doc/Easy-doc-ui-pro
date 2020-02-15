/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect } from 'react';
import { Tabs, Card } from 'antd';
import { ServiceState } from '../../models/service';
import ServiceItem from '../ServiceItem';
import ModelItem from '../ModelItem';
import s from './index.less';

const { TabPane } = Tabs;

interface ServiceTabProps {
  serviceData: ServiceState;
}

const ServiceTab: React.FC<ServiceTabProps> = props => {
  const [hash, setHash] = useState('controller');

  useEffect(() => {
    const temp = window.location.hash;
    if (temp) {
      const tempArr = temp.split('/');
      if (tempArr.length >= 1) {
        setHash(tempArr[1]);
      }
    }
  }, []);

  const handleTabChange = (key: any) => {
    setHash(key);
  };

  const { modelList, controllerList } = props.serviceData;

  return (
    <Card className={s.card}>
      <Tabs activeKey={hash} onChange={handleTabChange}>
        <TabPane tab="接口列表" key="controller">
          {controllerList &&
            controllerList.map((service: any, idx: any) => (
              <ServiceItem detailData={service} serviceUrl={props.serviceUrl} idx={idx} />
            ))}
        </TabPane>
        <TabPane tab="对象列表" key="model">
          {modelList &&
            modelList.map((model: any, idx: any) => <ModelItem detailData={model} idx={idx} />)}
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default ServiceTab;
