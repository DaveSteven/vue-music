<template>
  <scroll
    :data="result"
    class="suggest"
    :pullup="pullup"
    :beforeScroll="beforeScroll"
    @scrollTopEnd="searchMore"
    @beforeScroll="listScroll"
    ref="suggest"
  >
    <ul class="suggest-list">
      <loading v-show="refresh" title=""></loading>
      <li class="suggest-item" v-for="(item, index) in result" :key="index">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore" title=""></loading>
    </ul>
  </scroll>
</template>

<script>
import { search } from '@/api/search';
import { ERR_OK } from '@/api/config';
import { createSong } from '@/common/js/song';
import Scroll from '@/base/scroll/scroll';
import Loading from '@/base/loading/loading';

const TYPE_SINGER = 'singer';
const perpage = 20;

export default {
  props: {
    query: {
      type: String,
      default: ''
    },
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      page: 1,
      result: [],
      pullup: true,
      beforeScroll: true,
      hasMore: true,
      refresh: false
    };
  },
  methods: {
    getIconCls(item) {
      if (item.type === TYPE_SINGER) {
        return 'icon-mine';
      } else {
        return 'icon-music';
      }
    },
    getDisplayName(item) {
      if (item.type === TYPE_SINGER) {
        return item.singername;
      } else {
        return `${item.name} - ${item.singer}`;
      }
    },
    searchMore() {
      if (!this.hasMore) {
        return;
      }
      this.page += 1;
      search(this.query, this.page, this.showSinger, perpage).then(res => {
        this.result = this.result.concat(this._genResult(res.data));
        this._checkMore(res.data);
      });
    },
    listScroll() {
      this.emit('listScroll');
    },
    _search() {
      this.page = 1;
      this.hasMore = true;
      this.$refs.suggest.scrollTo(0, 0);
      search(this.query, this.page, this.showSinger, perpage).then(res => {
        if (ERR_OK === res.code) {
          this.result = this._genResult(res.data);
          this._checkMore(res.data);
        }
      });
    },
    _checkMore(data) {
      const song = data.song;
      if (!song.list.length || (song.curnum + song.curpage * perpage) >= song.totalnum) {
        this.hasMore = false;
      }
    },
    _genResult(data) {
      let ret = [];
      if (data.zhida && data.zhida.singerid) {
        ret.push({
          ...data.zhida,
          ...{type: TYPE_SINGER}
        });
      }
      if (data.song) {
        ret = ret.concat(this._normalizeSongs(data.song.list));
      }
      return ret;
    },
    _normalizeSongs(list) {
      let ret = [];
      list.forEach(musicData => {
        if (musicData.songid && musicData.albumid) {
          ret.push(createSong(musicData));
        }
      });
      return ret;
    }
  },
  watch: {
    query() {
      this._search();
    }
  },
  components: {
    Scroll,
    Loading
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 60px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 40px
      .icon
        flex: 0 0 60px
        width: 60px
        [class^="icon-"]
          font-size: 28px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>