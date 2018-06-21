<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="onQueryChange"></search-box>
    </div>
    <div class="shortcut-wrapper" v-show="!query">
      <div class="shortcut">
        <div class="hot-key">
          <h1 class="title">热门搜索</h1>
          <ul>
            <li @click="addQuery(item.k)" class="item" v-for="(item, index) in hotKey" :key="index">
              <span>{{ item.k }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="search-result" ref="searchResult" v-show="query">
      <suggest :query="query" @listScroll="blurInput" ref="suggest"></suggest>
    </div>
    <router-view/>
  </div>
</template>

<script>
import SearchBox from '@/base/search-box/search-box';
import { getHotKey } from  '@/api/search';
import { ERR_OK } from '@/api/config';
import Suggest from 'components/suggest/suggest';
import { calculateSize } from '@/common/js/size';

const BOTTOM = calculateSize(120);

export default {
  data() {
    return {
      hotKey: [],
      query: ''
    };
  },
  methods: {
    addQuery(query) {
      this.$refs.searchBox.setQuery(query);
    },
    onQueryChange(query) {
      this.query = query;
    },
    blurInput() {
      this.$refs.searchBox.blur();
    },
    _getHotKey() {
      getHotKey().then(res => {
        if (ERR_OK === res.code) {
          this.hotKey = res.data.hotkey.slice(0, 10);
        }
      });
    }
  },
  created() {
    this._getHotKey();
  },
  components: {
    SearchBox,
    Suggest
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
      position: fixed
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