<template>
  <transition name="slide">
    <div class="user-center">
      <div class="back" @click="back">
        <i class="icon-back"></i>
      </div>
      <div class="switches-wrapper">
        <switches @switch="switchItem" :currentIndex="currentIndex" :switches="switches"></switches>
      </div>
      <div class="play-btn" @click="random">
        <i class="icon-play"></i>
        <span class="text">随机播放全部</span>
      </div>
      <div class="list-wrapper" ref="listWrapper">
        <scroll ref="favoriteList" class="list-scroll" :data="favoriteList" v-if="currentIndex === 0">
          <song-list @select="selectSong" class="list-inner" :songs="favoriteList"></song-list>
        </scroll>
        <scroll ref="playlist" class="list-scroll" :data="playlist" v-if="currentIndex === 1">
          <song-list @select="selectSong" class="list-inner" :songs="playlist"></song-list>
        </scroll>
      </div>
      <div class="no-result-wrapper" v-show="noResult">
        <no-result :title="noResultDesc"></no-result>
      </div>
    </div>
  </transition>
</template>

<script>
import Switches from '@/base/switches/switches';
import Scroll from '@/base/scroll/scroll';
import SongList from '@/base/song-list/song-list';
import NoResult from '@/base/no-result/no-result';
import { mapGetters, mapActions } from 'vuex';
import { playlistMixin } from 'common/js/mixin';
import Song from 'common/js/song';

export default {
  mixins: [
    playlistMixin
  ],
  data() {
    return {
      currentIndex: 0,
      switches: [
        {
          name: '我喜欢的'
        },
        {
          name: '最近听的'
        }
      ]
    };
  },
  computed: {
    noResult() {
      if (this.currentIndex === 0) {
        return !this.favoriteList.length;
      } else {
        return !this.playlist.length;
      }
    },
    noResultDesc() {
      if (this.currentIndex === 0) {
        return '暂无收藏歌曲';
      } else {
        return '你还没有听过歌曲';
      }
    },
    ...mapGetters([
      'favoriteList',
      'playlist'
    ])
  },
  methods: {
    switchItem(index) {
      this.currentIndex = index;
    },
    back() {
      this.$router.back();
    },
    selectSong(song) {
      this.insertSong(new Song(song));
    },
    handlePlaylist(playlist) {
      const bottom = playlist.length ? '60px' : '';
      this.$refs.listWrapper.style.bottom = bottom;
      if (this.currentIndex === 0) {
        this.$refs.favoriteList.refresh();
      } else {
        this.$refs.playlist.refresh();
      }
    },
    random() {
      let list = this.currentIndex === 0 ? this.favoriteList.slice() : this.playlist.slice();
      if (!list.length) {
        return;
      };
      list = list.map(song => {
        return new Song(song);
      });
      this.randomPlay({
        list
      });
    },
    ...mapActions([
      'randomPlay',
      'insertSong'
    ])
  },
  components: {
    Switches,
    Scroll,
    SongList,
    NoResult
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .user-center
    position: fixed
    top: 0
    bottom: 0
    z-index: 100
    width: 100%
    background: $color-background
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
    .back
      position absolute
      top: 0
      left: 12px
      z-index: 50
      .icon-back
        display: block
        padding: 20px
        font-size: $font-size-large-x
        color: $color-theme
    .switches-wrapper
      margin: 20px 0 60px 0
    .play-btn
      box-sizing: border-box
      width: 270px
      padding: 14px 0
      margin: 0 auto
      text-align: center
      border: 2px solid  $color-text-l
      color: $color-text-l
      border-radius: 200px
      font-size: 0
      .icon-play
        display: inline-block
        vertical-align: middle
        margin-right: 12px
        font-size: $font-size-medium-x
      .text
        display: inline-block
        vertical-align: middle
        font-size: $font-size-small
    .list-wrapper
      position: absolute
      top: 220px
      bottom: 0
      width: 100%
      .list-scroll
        height: 100%
        overflow: hidden
        .list-inner
          padding: 40px 60px
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>