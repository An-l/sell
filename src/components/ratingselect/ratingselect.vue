<template>
  <div class="ratingselect">
    <ul class="rating-type">
      <li @click="select(2, $event)" class="block positive" :class="{'active': selectType === 2}">
        {{desc.all}}
        <span class="count">{{ratings.length}}</span>
      </li>
      <li @click="select(0, $event)" class="block positive" :class="{'active': selectType === 0}">
        {{desc.positive}}
        <span class="count">{{positives.length}}</span>
      </li>
      <li @click="select(1, $event)" class="block negative" :class="{'active': selectType === 1}">
        {{desc.negative}}
        <span class="count">{{negatives.length}}</span>
      </li>
    </ul>
    <div @click="toggleContent" class="switch" :class="{'on': onlyContent}">
      <i class="icon icon-check_circle"></i> 只看有内容的评价
    </div>

  </div>
</template>

<script>
const POSITIVETYPE = 0
const NEGATIVE = 1
const ALLTPYE = 2

export default {
  props: {
    ratings: {
      type: Array,
      default() {
        return []
      }
    },
    selectType: {
      type: Number,
      default: ALLTPYE
    },
    onlyContent: {
      type: Boolean,
      default: false
    },
    desc: {
      type: Object,
      default() {
        return {
          all: '全部',
          positive: '满意',
          negative: '不满意'
        }
      }
    }
  },
  methods: {
    select(type, event) {
      // this.selectType = type
      this.$emit('rating-type', type)
    },
    toggleContent() {
      let onlyContent = !this.onlyContent
      this.$emit('toggle-only-content', onlyContent)
    }
  },
  computed: {
    positives() {
      return this.ratings.filter((rating) => {
        return rating.rateType === POSITIVETYPE
      })
    },
    negatives() {
      return this.ratings.filter((rating) => {
        return rating.rateType === NEGATIVE
      })
    }
  }
}
</script>

<style lang="scss" type="text/css">
@import '../../common/scss/mixin.scss';

.ratingselect {
  .rating-type {
    margin: 0 18px;
    padding: 12px 0 18px 0;
    font-size: 0;
    @include border-1px(rgba(7, 17, 27, 0.1));

    .block {
      display: inline-block;
      margin-right: 8px;
      padding: 8px 12px;
      font-size: 12px;
      color: rgb(77, 85, 93);
      &.active {
        color: #fff;
      }
      &.positive {
        background: rgba(0, 160, 220, 0.2);
        &.active {
          background: rgb(0, 160, 220);
        }
      }
      &.negative {
        background: rgba(77, 78, 93, 0.2);
        &.active {
          background: rgb(77, 78, 93);
        }
      }
      .count {
        margin-left: 2px;
        font-size: 8px;
      }
    }
  }
  .switch {
    padding: 12px 18px;
    line-height: 24px;
    font-size: 12px;
    color: rgb(147, 153, 159);
    border-bottom: 1px solid rgba(7, 17, 27, 0.1);
    &.on {
      .icon {
        color: #00c850;
      }
    }
    .icon {
      display: inline-block;
      vertical-align: top;
      font-size: 24px;
    }
  }
}
</style>
