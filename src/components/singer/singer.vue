<template>
  <div class="singer" ref="singer">
    <list-view ref="list" :data="singers" @select="selectSinger"></list-view>
    <router-view/>
  </div>
</template>

<script>
import { getSingerList } from '@/api/singer';
import Singer from '@/common/js/singer';
import ListView from '@/base/listview/listview';
import { ERR_OK } from '@/api/config';
import { mapMutations } from 'vuex';
import { playlistMixin } from 'common/js/mixin';

const HOT_NAME = '热门';
const HOT_SINGER_LEN = 10;

export default {
  name: 'singer',
  mixins: [
    playlistMixin
  ],
  components: {
    ListView
  },
  data() {
    return {
      singers: []
    };
  },
  methods: {
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '60px' : '';
      this.$refs.singer.style.bottom = bottom;
      this.$refs.list.refresh();
    },
    selectSinger(singer) {
      this.$router.push({
        path: `/singer/${singer.id}`
      });
      this.setSinger(singer);
    },
    _getSingerList() {
      getSingerList().then(res => {
        if (res.code === ERR_OK) {
          this.singers = this._normalizeSinger(res.data.list);
        }
      });
    },
    _normalizeSinger(list) {
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      };

      list.forEach((item, index) => {
        if (index < HOT_SINGER_LEN) {
          map.hot.items.push(new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name,
          }));
        }

        const key = item.Findex;
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          };

          map[key].items.push(new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          }));
        }
      });

      // 处理map，得到有序列表
      let hot = [];
      let ret = [];
      for (let k in map) {
        let item = map[k];
        if (item.title.match(/[a-zA-Z]/)) {
          ret.push(item);
        } else if (item.title === HOT_NAME) {
          hot.push(item);
        }
      }

      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0);
      });

      return hot.concat(ret);
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    })
  },
  created() {
    this._getSingerList();
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .singer
    position: fixed
    top: 176px
    bottom: 0
    width: 100%
</style>

