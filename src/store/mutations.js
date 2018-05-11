import * as types from './mutation-types';

const mutations = {
  [types.SET_SINGER](state, singer) {
    state.singer = singer;
  },
  [types.SET_PLAYING_STATE](state, flag) {
    state.playing = flag;
  },
  [types.SET_FULL_SCREEN](state, flag) {
    state.fullScreen = flag;
  },
  [types.SET_PLAYLIST](state, flag) {
    state.playlist = flag;
  },
  [types.SET_SEQUENCE_LIST](state, flag) {
    state.sequenceList = flag;
  },
  [types.SET_PLAY_MODE](state, flag) {
    state.mode = flag;
  },
  [types.SET_CURRENT_INDEX](state, flag) {
    state.currentIndex = flag;
  },
  [types.SET_SONGS_URL](state, {key, url}) {
    state.songsUrl[key] = url;
  }
};

export default mutations;