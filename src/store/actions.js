import * as types from './mutation-types';

export const selectPlay = ({commit, state}, {list, index}) => {
  commit(types.SET_SEQUENCE_LIST, list);
  commit(types.SET_PLAYLIST, list);
  commit(types.SET_CURRENT_INDEX, index);
  commit(types.SET_FULL_SCREEN, true);
  commit(types.SET_PLAYING_STATE, true);
};

export const setSongsUrl = ({commit, state}, {key, url}) => {
  console.log(key, url);
  commit(types.SET_SONGS_URL, {key, url});
};