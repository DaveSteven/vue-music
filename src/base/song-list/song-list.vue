<template>
  <div class="song-list">
    <ul>
      <li @click="selectItem(song, index)" v-for="(song, index) in songs" :key="song.id" class="item">
        <div class="content">
          <h2 class="name">{{ song.name }}</h2>
          <p class="desc">{{ getDesc(song) }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    songs: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  methods: {
    getDesc(song) {
      return `${song.singer} · ${song.album}`;
    },
    selectItem(item, index) {
      this.$emit('select', item, index);
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .song-list
    .item
      display: flex
      align-items: center
      box-sizing: border-box
      height: 128px
      font-size: $font-size-medium
      .rank
        flex: 0 0 50px
        width: 50px
        margin-right: 60px
        text-align: center
        .icon
          display: inline-block
          width: 50px
          height: 48px
          background-size: 50px 48px
          &.icon0
            bg-image('images/first')
          &.icon1
            bg-image('images/second')
          &.icon2
            bg-image('images/third')
        .text
          color: $color-theme
          font-size: $font-size-large
      .content
        flex: 1
        line-height: 40px
        overflow: hidden
        .name
          no-wrap()
          color: $color-text
        .desc
          no-wrap()
          margin-top: 8px
          color: $color-text-d
</style>
