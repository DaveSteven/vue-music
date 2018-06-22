<template>
  <transition name="slide">
    <div class="add-song" v-show="showFlag" @click.stop>
      <div class="header">
        <h1 class="title">添加歌曲到列表</h1>
        <div class="close" @click="hide">
          <i class="icon-close"></i>
        </div>
      </div>
      <div class="search-box-wrapper">
        <search-box ref="searchBox" @query="onQueryChange" placeholder="搜索歌曲"></search-box>
      </div>
      <div class="shortcut" v-show="!query"></div>
      <div class="search-result" v-show="query">
        <suggest :query="query" :showSinger="showSinger" @select="saveSearch" @listScroll="blurInput"></suggest>
      </div>
    </div>
  </transition>
</template>

<script>
import SearchBox from '@/base/search-box/search-box';
import Suggest from 'components/suggest/suggest';
import { searchMixin } from 'common/js/mixin';

export default {
  mixins: [
    searchMixin
  ],
  data() {
    return {
      showFlag: false,
      showSinger: false
    };
  },
  methods: {
    show() {
      this.showFlag = true;
    },
    hide() {
      this.showFlag = false;
    }
  },
  components: {
    SearchBox,
    Suggest
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .add-song
    position: fixed
    top: 0
    bottom: 0
    width: 100%
    z-index: 200
    background: $color-background
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
    .header
      position: relative
      height: 88px
      text-align: center
      .title
        line-height: 88px
        font-size: $font-size-large
        color: $color-text
      .close
        position: absolute
        top: 0
        right: 16px
        .icon-close
          display: block
          padding: 24px
          font-size: 40px
          color: $color-theme

    .search-box-wrapper
      margin: 40px
    .shortcut
      .list-wrapper
        position: absolute
        top: 330px
        bottom: 0
        width: 100%
        .list-scroll
          height: 100%
          overflow: hidden
          .list-inner
            padding: 40px 60px
    .search-result
      position: fixed
      top: 248px
      bottom: 0
      width: 100%
    .tip-title
      text-align: center
      padding: 36px 0
      font-size: 0
      .icon-ok
        font-size: $font-size-medium
        color: $color-theme
        margin-right: 8px
      .text
        font-size: $font-size-medium
        color: $color-text
</style>