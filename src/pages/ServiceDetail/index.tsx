import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Dispatch, AnyAction } from 'redux';
import { ConnectState } from '@/models/connect';
import HeaderCard from '@/components/HeaderCard';
import ServiceTab from '@/components/ServiceTab';
import LoginForm from '@/components/LoginForm';
import { ServiceState } from '../../models/service';

interface ServiceDetailProps {
  dispatch: Dispatch<AnyAction>;
  serviceData: ServiceState;
}

const ServiceDetail: React.FC<ServiceDetailProps> = props => {
  const { dispatch, serviceData } = props;
  const [data, setData] = useState();
  const [show, setShow] = useState(false);
  const [click, setClick] = useState(true);

  useEffect(() => {
    dispatch({ type: 'service/fetchService' });
  }, []);

  useEffect(() => {
    if (data) {
      dispatch({
        type: 'service/fetchService',
        payload: {
          account: data.account,
          password: data.password,
        },
      });
    }
  }, [data]);

  useEffect(() => {
    if (serviceData.auth && click) {
      const localAuth = localStorage.getItem('easy-doc-auth');
      if (!localAuth) {
        setShow(true);
      } else {
        setShow(false);
        const authConfig = JSON.parse(localAuth);
        dispatch({
          type: 'service/fetchService',
          payload: {
            account: authConfig.account,
            password: authConfig.password,
          },
        });
      }
      setClick(false);
    }
  }, [props.serviceData]);

  const getData = (d: any) => {
    setData(d);
  };

  return (
    <>
      <LoginForm key="loginForm" showModal={show} getData={getData} />
      <HeaderCard serviceData={props.serviceData} />
      <ServiceTab serviceData={props.serviceData} />
    </>
  );
};

export default connect(({ service }: ConnectState) => ({
  serviceData: service.serviceData,
}))(ServiceDetail);
