<template>
  <scroll class="listview" :data="data" ref="listview">
    <ul>
      <li ref="listGroup" v-for="(group, index) in data" class="list-group" :key="index">
        <h2 class="list-group-title">{{ group.title }}</h2>
        <ul>
          <li v-for="item in group.items" :key="item.id" class="list-group-item">
            <img class="avatar" v-lazy="item.avatar">
            <span class="name">{{ item.name }}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart="onShortcutTouchStart">
      <ul>
        <li class="item" v-for="(item, index) in shortcutList" :key="index" :data-index="index">{{ item }}</li>
      </ul>
    </div>
  </scroll>
</template>

<script>
import Scroll from '@/base/scroll/scroll';
import { getData } from '@/common/js/dom';
export default {
  props: {
    data: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  computed: {
    shortcutList() {
      return this.data.map((group) => {
        return group.title.substr(0, 1);
      });
    }
  },
  methods: {
    onShortcutTouchStart(e) {
      let anchorIndex = getData(e.target, 'index');
      console.log(anchorIndex);
      console.log(this.$refs.listGroup[anchorIndex]);
      this.$refs.listview.scrollToElement(this.$refs.listGroup[anchorIndex], 0);
    }
  },
  components: {
    Scroll
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