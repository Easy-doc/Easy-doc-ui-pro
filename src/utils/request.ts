/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend } from 'umi-request';

const CONTEXT_PATH = () => {
  if (
    document.location.pathname.split('/')[1] === 'easy-doc.html' ||
    document.location.pathname.split('/')[1] === 'serviceDetail.html' ||
    document.location.pathname.split('/')[1] === 'globalParam.html'
  ) {
    return '';
  }
  return `/${document.location.pathname.split('/')[1]}`;
};

// export const BASE_URL = 'http://tiku-editor-test.inner.youdao.com';
export const BASE_URL = window.location.origin + CONTEXT_PATH();

/**
 * 配置request请求时的默认参数
 */
export const request = extend({
  credentials: 'include', // 默认请求是否带上cookie
  prefix: BASE_URL,
});

export const request2 = extend({
  credentials: 'include', // 默认请求是否带上cookie
});
