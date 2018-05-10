import jsonp from 'common/js/jsonp';
import { commonParams, options } from './config';

export function getSingerList() {
  const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg';

  const data = Object.assign({}, commonParams, {
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1,
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq'
  });
  
  return jsonp(url, data, options);
}

export function getSingerDetail(singerId) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg';

  const data = Object.assign({}, commonParams, {
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq',
    order: 'listen',
    begin: 0,
    num: 100,
    songstatus: 1,
    singermid: singerId
  });

  return jsonp(url, data, options);
}

export function getMusicUrl(songmid) {
  const url = 'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg';
  const callback = `MusicJsonCallback${(Math.random() + '').replace('0.', '')}`;

  const data = Object.assign({}, commonParams, {
    jsonpCallback: callback,
    loginUin: 0,
    hostUin: 0,
    format: 'json',
    inCharset: 'utf8',
    notice: 0,
    platform: 'yqq',
    needNewCode: 0,
    cid: '205361747',
    callback,
    uin: 0,
    songmid,
    filename: `C400${songmid}.m4a`,
    guid: '7404459500'
  });

  return jsonp(url, data, options);
}