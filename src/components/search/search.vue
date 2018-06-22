<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="onQueryChange"></search-box>
    </div>
    <div ref="shortcutWrapper" class="shortcut-wrapper" v-show="!query">
      <scroll ref="shortcut" class="shortcut" :data="shortcut" :refreshDelay="refreshDelay">
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li @click="addQuery(item.k)" class="item" v-for="(item, index) in hotKey" :key="index">
                <span>{{ item.k }}</span>
              </li>
            </ul>
          </div>
          <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span @click="showConfirm" class="clear">
                <i class="icon-clear"></i>
              </span>
            </h1>
            <search-list
              @select="addQuery"
              @delete="deleteSearchHistory"
              :searches="searchHistory"
            >
            </search-list>
          </div>
        </div>
      </scroll>
    </div>
    <div class="search-result" ref="searchResult" v-show="query">
      <suggest ref="suggest" :query="query" @listScroll="blurInput" @select="saveSearch"></suggest>
    </div>
    <confirm
      ref="confirm"
      text="是否清空所有搜索历史？"
      confirmBtnText="清空"
      @confirm="clearSearchHistory"
    ></confirm>
    <router-view/>
  </div>
</template>

<script>
import SearchBox from '@/base/search-box/search-box';
import { getHotKey } from  '@/api/search';
import { ERR_OK } from '@/api/config';
import Suggest from 'components/suggest/suggest';
import SearchList from '@/base/search-list/search-list';
import Confirm from '@/base/confirm/confirm';
import Scroll from '@/base/scroll/scroll';
import { calculateSize } from 'common/js/size';
import { mapActions } from 'vuex';
import { playlistMixin, searchMixin } from 'common/js/mixin';

const BOTTOM = calculateSize(120);

export default {
  mixins: [
    playlistMixin,
    searchMixin
  ],
  data() {
    return {
      hotKey: []
    };
  },
  computed: {
    shortcut() {
      return this.hotKey.concat(this.searchHistory);
    }
  },
  methods: {
    onQueryChange(query) {
      this.query = query;
    },
    showConfirm() {
      this.$refs.confirm.show();
    },
    handlePlaylist(playlist) {
      const bottom = this.playlist.length ? '60px' : '';
      this.$refs.shortcutWrapper.style.bottom = bottom;
      this.$refs.shortcut.refresh();
      this.$refs.searchResult.style.bottom = bottom;
      this.$refs.suggest.refresh();
    },
    _getHotKey() {
      getHotKey().then(res => {
        if (ERR_OK === res.code) {
          this.hotKey = res.data.hotkey.slice(0, 10);
        }
      });
    },
    ...mapActions([
      'clearSearchHistory'
    ])
  },
  watch: {
    query(newQuery) {
      if (!newQuery) {
        setTimeout(() => {
          this.$refs.shortcut.refresh();
        });
      }
    }
  },
  created() {
    this._getHotKey();
  },
  components: {
    SearchBox,
    Suggest,
    SearchList,
    Confirm,
    Scroll
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .search
    .search-box-wrapper
      margin: 40px
    .shortcut-wrapper
      position: absolute
      top: 356px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 40px 40px 40px
          .title
            margin-bottom: 40px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 10px 20px
            margin: 0 40px 20px 0
            border-radius: 12px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
        .search-history
          position: relative
          margin: 0 40px
          .title
            display: flex
            align-items: center
            height: 80px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 356px
      bottom: 0
</style>