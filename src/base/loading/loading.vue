<template>
  <div class="loading">
    <div class="loading-img"><img src="./images/loading.gif"></div>
    <p class="desc">{{title}}</p>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    props: {
      title: {
        type: String,
        default: '正在载入...'
      }
    }
  };
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .loading
    width: 100%
    text-align: center
    .loading-img
      margin: 0 auto;
      width: 48px;
      height: 48px;
    .desc
      line-height: 40px
      font-size: $font-size-small
      color: $color-text-l
</style>
