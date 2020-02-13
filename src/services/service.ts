import { request, request2 } from '@/utils/request';

export interface LoginParamsType {
  account?: string;
  password?: string;
}

export interface seviceParamsType {
  url: string;
}

// 获取接口列表
export const getMethodList = (params: LoginParamsType) =>
  request.get('/easy-doc/resource', { params });

export const getSeviceDetail = (params: seviceParamsType) =>
  request2.get(`${params.url}/easy-doc/resource`);
