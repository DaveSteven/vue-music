<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div
        class="progress-btn-wrapper"
        ref="progressBtn"
        @touchstart.prevent="progressTouchStart"
        @touchmove.prevent="progressTouchMove"
        @touchend.prevent="progressTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { calculateSize } from '@/common/js/size';
import { prefixStyle } from '@/common/js/dom';

const PROGRESS_BTN_WIDTH = Math.ceil(calculateSize(32)); 
const transform = prefixStyle('transform');

export default {
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  created() {
    this.touch = {};
  },
  methods: {
    progressTouchStart(e) {
      this.touch.initiated = true;
      this.touch.startX = e.touches[0].pageX;
      this.touch.left = this.$refs.progress.clientWidth;
    },
    progressTouchMove(e) {
      if (!this.touch.initiated) {
        return;
      }
      const deltaX = e.touches[0].pageX - this.touch.startX;
      const barWidth = this.$refs.progressBar.clientWidth - PROGRESS_BTN_WIDTH;
      const offsetWidth = Math.min(barWidth, Math.max(0, this.touch.left + deltaX));
      this._offset(offsetWidth);
    },
    progressTouchEnd() {
      this.initiated = false;
      this._triggerPercent();
    },
    progressClick(e) {
      const rect = this.$refs.progressBar.getBoundingClientRect();
      const offsetWidth = e.pageX - rect.left;
      // 点击progressBtn的时候，ex.offsetX获取不对
      this._offset(offsetWidth);
      this._triggerPercent();
    },
    _triggerPercent() {
      const barWidth = this.$refs.progressBar.clientWidth - PROGRESS_BTN_WIDTH;
      const percent = this.$refs.progress.clientWidth / barWidth;
      this.$emit('percent-change', percent);
    },
    _offset(offsetWidth) {
      this.$refs.progress.style.width = `${offsetWidth}px`;
      this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`;
    },
    _calculateMoveDistance(percent) {
      const barWidth = this.$refs.progressBar.clientWidth - PROGRESS_BTN_WIDTH;
      const offsetWidth = percent * barWidth;
      this._offset(offsetWidth);
    }
  },
  watch: {
    percent(newPercent) {
      if (newPercent >= 0 && !this.touch.initiated) {
        this._calculateMoveDistance(newPercent);
      } else {
        this._calculateMoveDistance(newPercent);
      }
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-bar
    height: 60px
    .bar-inner
      position: relative
      top: 26px
      height: 8px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -16px
        top: -26px
        width: 60px
        height: 60px
        .progress-btn
          position: relative
          top: 14px
          left: 14px
          box-sizing: border-box
          width: 32px
          height: 32px
          border: 6px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>