import { playMode } from '@/common/js/config';

const state = {
  singer: {}, // 歌手
  playing: false, // 是否正在播放
  fullScreen: false,  // 是否全屏
  playlist: [], // 播放列表
  sequenceList: [], // 乱序播放列表
  mode: playMode.sequence,  // 播放模式
  currentIndex: -1,  // 歌曲当前索引值,
  disc: [],
  topList: []
};

export default state;