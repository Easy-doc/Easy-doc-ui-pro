import { parse } from 'querystring';
import pathRegexp from 'path-to-regexp';
import { Route } from '@/models/connect';

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);

export const isAntDesignPro = (): boolean => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }
  return window.location.hostname === 'preview.pro.ant.design';
};

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export const isAntDesignProOrDev = (): boolean => {
  const { NODE_ENV } = process.env;
  if (NODE_ENV === 'development') {
    return true;
  }
  return isAntDesignPro();
};

export const getPageQuery = () => parse(window.location.href.split('?')[1]);

/**
 * props.route.routes
 * @param router [{}]
 * @param pathname string
 */
export const getAuthorityFromRouter = <T extends { path?: string }>(
  router: T[] = [],
  pathname: string,
): T | undefined => {
  const authority = router.find(({ path }) => path && pathRegexp(path).exec(pathname));
  if (authority) return authority;
  return undefined;
};

export const getRouteAuthority = (path: string, routeData: Route[]) => {
  let authorities: string[] | string | undefined;
  routeData.forEach(route => {
    // match prefix
    if (pathRegexp(`${route.path}/(.*)`).test(`${path}/`)) {
      if (route.authority) {
        authorities = route.authority;
      }
      // exact match
      if (route.path === path) {
        authorities = route.authority || authorities;
      }
      // get children authority recursively
      if (route.routes) {
        authorities = getRouteAuthority(path, route.routes) || authorities;
      }
    }
  });
  return authorities;
};

// 根据不同的方法类型返回不同的颜色
export const getBtnColor = (type: any) => {
  switch (type) {
    case 'GET':
      return 'rgb(37,198,252)';
    case 'POST':
      return 'rgb(64,219,217)';
    case 'PUT':
      return 'rgb(234,240,72)';
    case 'HEAD':
      return 'rgb(42,82,1)';
    case 'DELETE':
      return 'rgb(255,83,76)';
    case 'OPTIONS':
      return 'rgb(255,235,204)';
    default:
      return 'rgb(237,208,190)';
  }
};

// 根据不同的方法类型返回不同的颜色
export const getPanelColor = (type: any) => {
  switch (type) {
    case 'GET':
      return 'rgb(37,198,252,0.3)';
    case 'POST':
      return 'rgb(64,219,217,0.3)';
    case 'PUT':
      return 'rgb(234,240,72,0.3)';
    case 'HEAD':
      return 'rgb(42,82,1,0.3)';
    case 'DELETE':
      return 'rgb(255,83,76,0.3)';
    case 'OPTIONS':
      return 'rgb(255,235,204,0.3)';
    default:
      return 'rgb(237,208,190,0.3)';
  }
};

export const jsonParse = (obj: any) => {
  if (!(obj instanceof Object)) {
    return '';
  }
  return JSON.stringify(obj, null, 2);
};

export const getDefault = (val: any, type: any) => {
  if (val === null || val === undefined) {
    switch (type) {
      case 'String':
        return '';
      case 'Object':
        return {};
      case 'Integer':
        return 0;
      case 'Double':
        return 0.0;
      case 'Boolean':
        return false;
      case 'List':
        return [];
      case 'Timestamp':
        return 1577808000000;
      case 'Date':
        return '2020-01-01 00:00:00';
      default:
        return '';
    }
  }
  return val;
};
