<template>
  <div class="recommend" ref="recommend">
    <scroll ref="scroll" class="recommend-content" :data="discList">
      <div>
        <div v-if="recommends.length" class="slider-wrapper">
          <slider>
            <div v-for="item in recommends" :key="item.id">
              <a :href="item.linkUrl">
                <img @load="loadImage" :src="item.picUrl" alt="">
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li @click="selectItem(item)" class="item" v-for="item in discList" :key="item.dissid">
              <div class="icon">
                <img v-lazy="item.imgurl" alt="">
              </div>
              <div class="text">
                <h2 class="name">{{ item.creator.name }}</h2>
                <p class="desc">{{ item.dissname }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container" v-show="!discList.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view/>
  </div>
</template>

<script>
import Slider from '@/base/slider/slider';
import { getRecommend, getDiscList } from '@/api/recommend';
import { ERR_OK } from '@/api/config';
import BScroll from 'better-scroll';
import Scroll from '@/base/scroll/scroll';
import Loading from '@/base/loading/loading';
import { playlistMixin } from 'common/js/mixin';
import { mapMutations } from 'vuex';

export default {
  mixins: [
    playlistMixin
  ],
  components: {
    Slider,
    Scroll,
    Loading
  },
  data() {
    return {
      recommends: [],
      discList: []
    };
  },
  methods: {
    selectItem(item) {
      this.setDisc(item);
      this.$router.push({
        path: `/recommend/${item.dissid}`
      });
    },
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '60px' : '0';
      this.$refs.recommend.style.bottom = bottom;
      this.$refs.scroll.refresh();
    },
    _getRecommend() {
      getRecommend().then(res => {
        if (res.code === ERR_OK) {
          this.recommends = res.data.slider;
        }
      });
    },
    _getDiscList() {
      getDiscList().then(res => {
        if (res.code === ERR_OK) {
          this.discList = res.data.list;
        }
      });
    },
    loadImage() {
      if (!this.checkLoaded) {
        this.$refs.scroll.refresh();
        this.checkLoaded = true;
      }
    },
    ...mapMutations({
      setDisc: 'SET_DISC'
    })
  },
  created() {
    this._getRecommend();
    this._getDiscList();
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';

.recommend {
  position: fixed;
  width: 100%;
  top: 176px;
  bottom: 0;

  .recommend-content {
    height: 100%;
    overflow: hidden;

    .slider-wrapper {
      position: relative;
      width: 100%;
      overflow: hidden;
    }

    .recommend-list {
      .list-title {
        height: 130px;
        line-height: 130px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-theme;
      }

      .item {
        display: flex;
        box-sizing: border-box;
        align-items: center;
        padding: 0 40px 40px 40px;

        .icon {
          flex: 0 0 120px;
          width: 120px;
          padding-right: 40px;
        }

        .text {
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex: 1;
          line-height: 40px;
          overflow: hidden;
          font-size: $font-size-medium;

          .name {
            margin-bottom: 20px;
            color: $color-text;
          }

          .desc {
            color: $color-text-d;
          }
        }
      }
    }

    .loading-container {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>
