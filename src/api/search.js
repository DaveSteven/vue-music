import jsonp from 'common/js/jsonp';
import { commonParams, options } from './config';
import axios from 'axios';

export function getHotKey() {
  const url = '/api/getHotKey';

  const data = Object.assign({}, commonParams, {
    uin: 0,
    format: 'json',
    platform: 'h5',
    needNewCode: 1,
    _: +new Date()
  });

  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data);
  });
}

export function search(query, page, zhida, perpage) {
  const url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp';

  const data = Object.assign({}, commonParams, {
    w: query,
    p: page,
    catZhida: zhida ? 1 : 0,
    uin: 0,
    platform: 'h5',
    t: 0,
    zhidaqu: 1,
    flag: 1,
    le: 'utf-8',
    sem: 1,
    aggr: 0,
    perpage,
    n: perpage,
    remoteplace: 'txt.mqq.all',
    _: +new Date()
  });

  return jsonp(url, data, options);
}