<template>
  <div class="rank" ref="rank">
    <scroll :data="topList" class="toplist" ref="toplist">
      <ul>
        <li @click="selectItem(item)" class="item" v-for="item in topList" :key="item.id">
          <div class="icon">
            <img width="100" height="100" v-lazy="item.picUrl">
          </div>
          <ul class="songlist">
            <li class="song" v-for="(song, index) in item.songList" :key="index">
              <span>{{ index + 1 }}</span>
              <span>{{ song.songname }} - {{ song.singername }}</span>
            </li>
          </ul>
        </li>
      </ul>
      <div class="loading-container" v-show="!topList.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view/>
  </div>
</template>

<script>
import { getTopList } from '@/api/rank';
import { ERR_OK } from '@/api/config';
import Scroll from '@/base/scroll/scroll';
import Loading from '@/base/loading/loading';
import { playlistMixin } from '@/common/js/mixin';
import { mapMutations } from 'vuex';

export default {
  mixins: [
    playlistMixin
  ],
  data() {
    return {
      topList: []
    };
  },
  methods: {
    handlePlaylist(playlist) {
      const bottom = playlist.length ? '60px' : '';
      this.$refs.rank.style.bottom = bottom;
      this.$refs.toplist.refresh();
    },
    selectItem(item) {
      this.setTopList(item);
      this.$router.push({
        path: `/rank/${item.id}`
      });
    },
    _getTopList() {
      getTopList().then(res => {
        if (ERR_OK === res.code) {
          this.topList = res.data.topList;
        }
      });
    },
    ...mapMutations({
      setTopList: 'SET_TOP_LIST'
    })
  },
  created() {
    this._getTopList();
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

  .rank
    position: fixed
    width: 100%
    top: 176px
    bottom: 0
    .toplist
      height: 100%
      overflow: hidden
      .item
        display: flex
        margin: 0 40px
        padding-top: 40px
        height: 200px
        &:last-child
          padding-bottom: 40px
        .icon
          flex: 0 0 200px
          width: 200px
          height: 200px
        .songlist
          flex: 1
          display: flex
          flex-direction: column
          justify-content: center
          padding: 0 40px
          height: 200px
          overflow: hidden
          background: $color-highlight-background
          color: $color-text-d
          font-size: $font-size-small
          .song
            no-wrap()
            line-height: 52px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
