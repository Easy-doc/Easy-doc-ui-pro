import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Dispatch, AnyAction } from 'redux';
import { ConnectState } from '@/models/connect';
import HeaderCard from '@/components/HeaderCard';
import ServiceTab from '@/components/ServiceTab';
import { BASE_URL } from '@/utils/request';
import { ServiceState } from '../../models/service';

interface ServiceDetailProps {
  dispatch: Dispatch<AnyAction>;
  serviceData: ServiceState;
  location: any;
}

const ServiceDetail: React.FC<ServiceDetailProps> = props => {
  const { location, dispatch } = props;
  const [serviceUrl, setServiceUrl] = useState(BASE_URL);

  useEffect(() => {
    let requestUrl;
    let auth;
    let authConfig;
    if (location.state && location.state.url) {
      requestUrl = location.state.gateway ? location.state.url : BASE_URL;
      auth = location.state.auth;
      authConfig = location.state.authConfig;
    } else {
      const temPath = location.pathname.split('/');
      const localStr = localStorage.getItem('easy-doc-service-map');
      if (localStr) {
        const serviceMap = new Map<number, any>(JSON.parse(localStr));
        const serviceInfo = serviceMap.get(parseInt(temPath[2], 10));
        requestUrl = serviceInfo.url;
        auth = serviceInfo.auth;
        authConfig = serviceInfo.authConfig;
      }
    }
    setServiceUrl(requestUrl);
    if (auth) {
      dispatch({
        type: 'service/fetchServiceDetail',
        payload: {
          url: requestUrl,
          account: authConfig.account,
          password: authConfig.password,
        },
      });
    } else {
      dispatch({
        type: 'service/fetchServiceDetail',
        payload: { url: requestUrl },
      });
    }
  }, []);

  return (
    <>
      <HeaderCard serviceData={props.serviceData} />
      <ServiceTab serviceData={props.serviceData} serviceUrl={serviceUrl} />
    </>
  );
};

export default connect(({ service }: ConnectState) => ({
  serviceData: service.serviceData,
}))(ServiceDetail);
