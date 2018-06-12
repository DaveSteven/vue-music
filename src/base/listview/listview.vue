<template>
  <scroll
    class="listview"
    :data="data"
    :listenScroll="listenScroll"
    :probeType="3"
    ref="listview"
    @scroll="scroll"
  >
    <!-- 歌手列表，根据字母分组 -->
    <ul>
      <li ref="listGroup" v-for="(group, index) in data" class="list-group" :key="index">
        <h2 class="list-group-title">{{ group.title }}</h2>
        <ul>
          <li v-for="item in group.items" :key="item.id" class="list-group-item" @click="selectItem(item)">
            <div class="avatar"><img v-lazy="item.avatar" alt=""></div>
            <span class="name">{{ item.name }}</span>
          </li>
        </ul>
      </li>
    </ul>
    <!-- 字母列表，用来快速定位 -->
    <div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li
          class="item"
          v-for="(item, index) in shortcutList"
          :key="index" 
          :data-index="index"
          :class="{'current': currentIndex === index}"
        >
        {{ item }}
        </li>
      </ul>
    </div>
    <div v-show="fixedTitle" class="list-fixed" ref="fixedTitle">
      <div class="fixed-title">{{ fixedTitle }}</div>
    </div>
    <div v-if="!data.length" class="loading-container">
      <loading></loading>
    </div>
  </scroll>
</template>

<script>
import Scroll from '@/base/scroll/scroll';
import Loading from '@/base/loading/loading';
import { getData } from '@/common/js/dom';
import { calculateSize } from '@/common/js/size';

export default {
  props: {
    data: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      listenScroll: false,
      scrollY: -1,
      currentIndex: 0,
      diff: -1
    };
  },
  computed: {
    shortcutList() {
      return this.data.map((group) => {
        return group.title.substr(0, 1);
      });
    },
    fixedTitle() {
      if (this.scrollY > 0) {
        return '';
      }
      return this.data[this.currentIndex] ? this.data[this.currentIndex].title : '';
    }
  },
  methods: {
    selectItem(item) {
      this.$emit('select', item);
    },
    onShortcutTouchStart(e) {
      let anchorIndex = getData(e.target, 'index');
      let firstTouch = e.touches[0];
      this.touch.y1 = firstTouch.pageY;
      this.touch.anchorIndex = anchorIndex;
      this._scrolTo(anchorIndex);
    },
    onShortcutTouchMove(e) {
      let firstTouch = e.touches[0];
      this.touch.y2 = firstTouch.pageY;
      let delta = (this.touch.y2 - this.touch.y1) / this.anchorHeight | 0;
      let anchorIndex = parseInt(this.touch.anchorIndex) + delta;
      this._scrolTo(anchorIndex);
    },
    scroll(pos) {
      this.scrollY = pos.y;
    },
    _scrolTo(index) {
      if (!index && index !== 0) {
        return;
      }
      if (index < 0) {
        index = 0;
      } else if (index > this.listHeight.length - 2) {
        index = this.listHeight.length - 2;
      }
      this.scrollY = -this.listHeight[index];
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0);
    },
    _calculateSize() {
      this.anchorHeight = calculateSize(34);
      this.titleHeight = calculateSize(60);
    },
    _calculateHeight() {
      this.listHeight = [];
      const list = this.$refs.listGroup;
      let height = 0;
      this.listHeight.push(height);
      for (let i = 0; i < list.length; i++) {
        let item = list[i];
        height += item.clientHeight;
        this.listHeight.push(height);
      }
    }
  },
  created() {
    this.touch = {};
    this.listenScroll = true;
    this.listHeight = [];
    this._calculateSize();
  },
  mounted() {
    window.addEventListener('resize', () => {
      if (this.deviceWidth) {
        this._calculateSize();
      }
    });
  },
  watch: {
    data() {
      setTimeout(() => {
        this._calculateHeight();
      }, 20);
    },
    scrollY(newY) {
      const listHeight = this.listHeight;
      // 当滚动到顶部，newY > 0
      if (newY > 0) {
        this.currentIndex = 0;
        return;
      }
      // 在中间部分滚动
      for (let i = 0; i < listHeight.length - 1; i++) {
        let height1 = listHeight[i];
        let height2 = listHeight[i + 1];
        if (-newY >= height1 && -newY < height2) {
          this.currentIndex = i;
          this.diff = height2 + newY;
          return;
        }
      }
      // 当滚动到底部，-newY > 最后一个元素的上限
      this.currentIndex = listHeight.length - 2;
    },
    diff(newVal) {
      let fixedTop = (newVal > 0 && newVal < this.titleHeight) ? newVal - this.titleHeight : 0;
      if (this.fixedTop === fixedTop) {
        return;
      }
      this.fixedTop = fixedTop;
      this.$refs.fixedTitle.style.transform = `translate3d(0, ${fixedTop}px, 0)`;
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

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 60px
      .list-group-title
        height: 60px
        line-height: 60px
        padding-left: 40px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 40px 0 0 60px
        .avatar
          width: 100px
          height: 100px
          img
            border-radius: 50%
        .name
          margin-left: 40px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 40px
      padding: 40px 0
      border-radius: 20px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 5px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 60px
        line-height: 60px
        padding-left: 40px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>