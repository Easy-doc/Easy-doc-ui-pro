import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Dispatch, AnyAction } from 'redux'
import { ServiceState } from '../../models/service'
import { ConnectState } from '@/models/connect'
import HeaderCard from '@/components/HeaderCard'
import ServiceTab from '@/components/ServiceTab'
import s from './index.less'

interface ServiceDetailProps {
  dispatch: Dispatch<AnyAction>;
  serviceData: ServiceState,
  location: object,
}

const ServiceDetail: React.FC<ServiceDetailProps> = props => {
  const { location, dispatch } = props

  useEffect(() => {
    if (location.state && location.state.url) {
      dispatch({
        type: 'service/fetchServiceDetail',
        payload: { url: location.state.url } })
    }
  }, [])

  return (
    <>
      <HeaderCard serviceData={props.serviceData} />
      <ServiceTab serviceData={props.serviceData} />
    </>
  )
}

export default connect(({ service }: ConnectState) => ({
  serviceData: service.serviceData,
}))(ServiceDetail)
