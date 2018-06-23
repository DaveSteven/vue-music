import { playMode } from 'common/js/config';
import { loadSearch, loadPlay, loadFavorite } from 'common/js/catch';

const state = {
  singer: {}, // 歌手
  playing: false, // 是否正在播放
  fullScreen: false,  // 是否全屏
  playlist: [], // 播放列表
  sequenceList: [], // 正序播放列表
  mode: playMode.sequence,  // 播放模式
  currentIndex: -1,  // 歌曲当前索引值,
  disc: [],
  topList: [],
  searchHistory: loadSearch(),
  playHistory: loadPlay(),
  favoriteList: loadFavorite()
};

export default state;