<template>
  <div class="player" v-show="playlist.length">
    <transition
      name="normal"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-leave="afterLeave"
    >
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.image" alt="">
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <div class="middle">
          <div class="middle-l">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdCls">
                <img :src="currentSong.image" class="image">
              </div>
            </div>
          </div>
        </div>
        <div class="bottom">
          <div class="progress-wrapper">
            <span class="time time-l">{{ format(currentTime) }}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent" @percent-change="onProgressBarChange"></progress-bar>
            </div>
            <span class="time time-r">{{ format(currentSong.duration) }}</span>
          </div>
          <div class="operators">
            <div class="icon i-left">
              <i class="icon-sequence"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i class="icon-prev" @click="prev"></i>
            </div>
            <div class="icon i-center" :class="disableCls">
              <i @click="togglePlaying" :class="playIcon"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i class="icon-next" @click="next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon">
          <img :class="cdCls" :src="currentSong.image" alt="">
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <progress-circle :radius="radius" :percent="percent">
            <i :class="miniIcon" class="icon-mini" @click.stop="togglePlaying"></i>
          </progress-circle>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>    
    </transition>
    <audio ref="audio" :src="songUrl" @canplay="ready" @error="error" @timeupdate="updateTime"></audio>
  </div>
</template>

<script>
import ProgressBar from '@/base/progress-bar/progress-bar';
import ProgressCircle from '@/base/progress-circle/progress-circle';
import { mapGetters, mapMutations } from 'vuex';
import animations from 'create-keyframe-animation';
import { calculateSize } from '@/common/js/size';
import { prefixStyle } from '@/common/js/dom';
import { getSongUrl } from '@/api/song';
import { ERR_OK } from '@/api/config';

const transform = prefixStyle('transform');

export default {
  computed: {
    playIcon() {
      return this.playing ? 'icon-pause' : 'icon-play';
    },
    miniIcon() {
      return this.playing ? 'icon-pause-mini' : 'icon-play-mini';
    },
    cdCls() {
      return this.playing ? 'play' : 'play pause';
    },
    disableCls() {
      return this.songReady ? '' : 'disable';
    },
    percent() {
      return this.currentTime / this.currentSong.duration;
    },
    ...mapGetters([
      'fullScreen',
      'playlist',
      'currentSong',
      'currentIndex',
      'playing',
      'songsUrl'
    ])
  },
  data() {
    return {
      songUrl: '',
      songReady: false,
      currentTime: 0
    };
  },
  methods: {
    togglePlaying() {
      this.setPlayingState(!this.playing);
    },
    prev() {
      if (!this.songReady) {
        return;
      }
      let index = this.currentIndex - 1;
      if (index < 0) {
        index = this.playlist.length - 1;
      }
      this.setCurrentIndex(index);
      if (!this.playing) {
        this.togglePlaying();
      }
      this.songReady = false;
    },
    next() {
      if (!this.songReady) {
        return;
      }
      let index = this.currentIndex + 1;
      if (index === this.playlist.length) {
        index = 0;
      }
      this.setCurrentIndex(index);
      if (!this.playing) {
        this.togglePlaying();
      }
      this.songReady = false;
    },
    ready() {
      this.songReady = true;
    },
    error() {
      this.songReady = true;
    },
    updateTime(e) {
      this.currentTime = e.target.currentTime;
    },
    format(interval) {
      interval = interval | 0;
      const minute = interval / 60 | 0;
      const second = this._pad(interval % 60);
      return `${minute}:${second}`;
    },
    onProgressBarChange(percent) {
      this.$refs.audio.currentTime = this.currentSong.duration * percent;
      if (!this.playing) {
        this.togglePlaying();
      }
    },
    back() {
      this.setFullScreen(false);
    },
    open() {
      this.setFullScreen(true);
    },
    enter(el, done) {
      const {x, y, scale} = this._getPosAndScale();

      let animation = {
        0: {
          transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
        },
        60: {
          transform: 'translate3d(0, 0, 0) scale(1.1)'
        },
        100: {
          transform: 'translate3d(0, 0, 0) scale(1)'
        }
      };

      animations.registerAnimation({
        name: 'move',
        animation,
        presets: {
          duration: 400,
          easing: 'linear'
        }
      });

      animations.runAnimation(this.$refs.cdWrapper, 'move', done);
    },
    afterEnter() {
      animations.unregisterAnimation('move');
      this.$refs.cdWrapper.style.animation = '';
    },
    leave(el, done) {
      this.$refs.cdWrapper.style.transition = 'all .4s';
      const {x, y, scale} = this._getPosAndScale();
      this.$refs.cdWrapper.style[transform] = `translate3d(${x}px, ${y}px, 0)`;
      this.$refs.cdWrapper.addEventListener('transitionend', done);
    },
    afterLeave() {
      this.$refs.cdWrapper.style.transition = '';
      this.$refs.cdWrapper.style[transform] = '';
    },
    _pad(num, n = 2) {
      let len = num.toString().length;
      while (len < n) {
        num = '0' + num;
        len++;
      }
      return num;
    },
    _getSongUrl(mid) {
      if (this.songsUrl[mid]) {
        this.songUrl = this.songsUrl[mid];
        return;
      }
      getSongUrl(mid).then(res => {
        if (res.code === ERR_OK) {
          const filename = res.data.items[0].filename;
          const vkey = res.data.items[0].vkey;
          const url = `http://dl.stream.qqmusic.qq.com/${filename}?vkey=${vkey}&guid=7404459500&uin=0&fromtag=66`;
          this.songUrl = url;
          this.setSongsUrl({
            key: mid,
            url
          });
        }
      });
    },
    _getPosAndScale() {
      const targetWidth = calculateSize(80);
      const paddingLeft = calculateSize(40);
      const paddingBottom = calculateSize(60);
      const paddingTop = calculateSize(160);
      const width = window.innerWidth * 0.8;
      const scale = targetWidth / width;
      const x = -(window.innerWidth / 2 - paddingLeft);
      const y = window.innerHeight - paddingBottom;
      return {x, y, scale};
    },
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setSongsUrl: 'SET_SONGS_URL'
    })
  },
  watch: {
    currentIndex(index) {
      const mid = this.playlist[index].mid;
      this._getSongUrl(mid);
    },
    songUrl() {
      this.$nextTick(() => {
        this.$refs.audio.play();
      });
    },
    playing(newState) {
      this.$nextTick(() => {
        const audio = this.$refs.audio;
        newState && this.songUrl ? audio.play() : audio.pause();
      });
    }
  },
  created() {
    this.radius = calculateSize(64);
  },
  components: {
    ProgressBar,
    ProgressCircle
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 50px
        .back
          position absolute
          top: 0
          left: 12px
          z-index: 50
          .icon-back
            display: block
            padding: 18px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 80px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 40px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 160px
        bottom: 340px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 20px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%

          .playing-lyric-wrapper
            width: 80%
            margin: 60px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 40px
              line-height: 40px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 64px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
      .bottom
        position: absolute
        bottom: 100px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 8px
            width: 16px
            height: 16px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 40px
              border-radius: 10px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 20px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 60px
            line-height: 60px
            width: 60px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 60px
          .i-left
            text-align: right
          .i-center
            padding: 0 40px
            text-align: center
            i
              font-size: 80px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 120px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 80px
        width: 80px
        padding: 0 20px 0 40px
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 40px
        overflow: hidden
        .name
          margin-bottom: 4px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 60px
        width: 60px
        padding: 0 20px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 60px
          color: $color-theme-d
        .icon-mini
          font-size: 64px
          position: absolute
          left: 0
          top: 0

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>
