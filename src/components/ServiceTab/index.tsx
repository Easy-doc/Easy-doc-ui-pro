/* eslint-disable react/no-array-index-key */
import React from 'react';
import { Tabs, Card } from 'antd';
import { ServiceState } from '../../models/service';
import ServiceItem from '../ServiceItem';
import ModelItem from '../ModelItem';
import s from './index.less';

const { TabPane } = Tabs;

interface ServiceTabProps {
  serviceData: ServiceState;
  serviceUrl: string;
}

const ServiceTab: React.FC<ServiceTabProps> = props => {
  const callback = () => {};

  const { modelList, controllerList } = props.serviceData;

  return (
    <Card className={s.card}>
      <Tabs defaultActiveKey="1" onChange={callback}>
        <TabPane tab="接口列表" key="serviceList">
          {controllerList &&
            controllerList.map((service: any, idx: any) => (
              <ServiceItem
                detailData={service}
                serviceUrl={props.serviceUrl}
                idx={`service-${idx}`}
              />
            ))}
        </TabPane>
        <TabPane tab="对象列表" key="modelList">
          {modelList &&
            modelList.map((model: any, idx: any) => (
              <ModelItem detailData={model} idx={`control-${idx}`} />
            ))}
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default ServiceTab;
