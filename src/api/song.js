import jsonp from 'common/js/jsonp';
import axios from 'axios';
import { commonParams, options } from './config';

export function getSongUrl(songmid) {
  const url = 'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg';
  const callback = `MusicJsonCallback${(Math.random() + '').replace('0.', '')}`;

  const data = Object.assign({}, commonParams, {
    loginUin: 0,
    hostUin: 0,
    format: 'json',
    inCharset: 'utf8',
    notice: 0,
    platform: 'yqq',
    needNewCode: 0,
    cid: '205361747',
    uin: 0,
    songmid,
    filename: `C400${songmid}.m4a`,
    guid: '7404459500',
    jsonpCallback: callback
  });

  return jsonp(url, data, {name: callback});
}