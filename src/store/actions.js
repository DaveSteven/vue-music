import * as types from './mutation-types';
import { playMode } from 'common/js/config';
import { shuffle } from 'common/js/util';

export const selectPlay = ({commit, state}, {list, index}) => {
  commit(types.SET_SEQUENCE_LIST, list);
  commit(types.SET_PLAYLIST, list);
  commit(types.SET_CURRENT_INDEX, index);
  commit(types.SET_FULL_SCREEN, true);
  commit(types.SET_PLAYING_STATE, true);
};

export const setSongsUrl = ({commit, state}, {key, url}) => {
  commit(types.SET_SONGS_URL, {key, url});
};

export const randomPlay = ({commit}, {list}) => {
  commit(types.SET_PLAY_MODE, playMode.random);
  commit(types.SET_SEQUENCE_LIST, list);
  let randomList = shuffle(list);
  commit(types.SET_PLAYLIST, randomList);
  commit(types.SET_CURRENT_INDEX, 0);
  commit(types.SET_FULL_SCREEN, true),
  commit(types.SET_PLAYING_STATE, true);
};