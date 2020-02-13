import { Effect } from 'dva';
import { Reducer } from 'redux';

import { getMethodList, getSeviceDetail } from '@/services/service';

export interface ServiceState {
  name?: string;
  description?: string;
  contact?: string;
  gateway?: boolean;
  totalMethod?: number;
  deprecatedMethod?: number;
  totalModel?: number;
  deprecatedModel?: number;
  totalService?: number;
  docService?: number;
  serviceList?: Array<any>;
  modelList?: Array<any>;
  controllerList?: Array<any>;
}

export interface ServiceModelState {
  serviceData?: ServiceState;
}

export interface ServiceModelType {
  namespace: 'service';
  state: ServiceModelState;
  effects: {
    fetchService: Effect;
    fetchServiceDetail: Effect;
  };
  reducers: {
    saveService: Reducer<ServiceModelState>;
    saveServiceDetail: Reducer<ServiceModelState>;
  };
}

const serviceModel: ServiceModelType = {
  namespace: 'service',

  state: {
    serviceData: {},
  },

  effects: {
    *fetchService({ payload }, { call, put }) {
      const response = yield call(getMethodList, { ...payload });
      yield put({
        type: 'saveService',
        payload: response.data,
      });
    },
    *fetchServiceDetail({ payload }, { call, put }) {
      const response = yield call(getSeviceDetail, { ...payload });
      yield put({
        type: 'saveServiceDetail',
        payload: response.data,
      });
    },
  },

  reducers: {
    saveService(state, action) {
      return {
        ...state,
        serviceData: action.payload || {},
      };
    },
    saveServiceDetail(state, action) {
      return {
        ...state,
        serviceData: action.payload || {},
      };
    },
  },
};

export default serviceModel;
