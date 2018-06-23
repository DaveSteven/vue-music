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
  },
  [types.SET_DISC](state, disc) {
    state.disc = disc;
  },
  [types.SET_TOP_LIST](state, topList) {
    state.topList = topList;
  },
  [types.SET_SEARCH_HISTORY](state, history) {
    state.searchHistory = history;
  },
  [types.SET_PLAY_HISTORY](state, history) {
    state.playHistory = history;
  },
  [types.SET_FAVORITE_LIST](state, list) {
    state.favoriteList = list;
  }
};

export default mutations;