import { getLyric, getSongURL } from '@/api/song';
import { ERR_OK } from '@/api/config';
import { Base64 } from 'js-base64';

export default class Song {
  constructor({ id, mid, singer, name, album, duration, image }) {
    this.id = id;
    this.mid = mid;
    this.singer = singer;
    this.name = name;
    this.album = album;
    this.duration = duration;
    this.image = image;
  }

  getLyric() {
    if (this.lyric) {
      return Promise.resolve(this.lyric);
    }

    return new Promise((resolve, reject) => {
      getLyric(this.mid).then(res => {
        if (res.retcode === ERR_OK) {
          this.lyric = Base64.decode(res.lyric);
          resolve(this.lyric);
        } else {
          reject('no lyric');
        }
      });
    });
  }

  getSongURL() {
    if (this.url) {
      return Promise.resolve(this.url);
    }

    return new Promise((resolve, reject) => {
      getSongURL(this.mid).then(res => {
        if (res.code === ERR_OK) {
          const filename = res.data.items[0].filename;
          const vkey = res.data.items[0].vkey;
          const url = `http://dl.stream.qqmusic.qq.com/${filename}?vkey=${vkey}&guid=7404459500&uin=0&fromtag=66`;
          this.url = url;
          resolve(this.url);
        } else {
          reject('no url');
        }
      });
    });
  }
}

export function createSong(musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${
      musicData.albummid
    }.jpg?max_age=2592000`
  });
}

export function filterSinger(singer) {
  let ret = [];
  if (!singer) {
    return '';
  }
  singer.forEach(s => {
    ret.push(s.name);
  });
  return ret.join('/');
}
