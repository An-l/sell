<template>
  <div class="ratings">
    <div class="ratings-content">
      <div class="overviw">
        <div class="overviw-left">
          <h2 class="score">{{seller.score}}</h2>
          <div class="title">综合评分</div>
          <div class="rank">高于周边商家{{seller.rankRate}}%</div>
        </div>
        <div class="overviw-right">
          <div class="score-wrapper">
            <span class="title">
              服务态度
            </span>
            <star :size="36" :score="seller.serviceScore"></star>
            <span class="score">{{seller.serviceScore}}</span>
          </div>
          <div class="score-wrapper">
            <span class="title">
              食物评分
            </span>
            <star :size="36" :score="seller.foodScore"></star>
            <span class="score">{{seller.foodScore}}</span>
          </div>
          <div class="score-wrapper">
            <span class="title">
              送达时间
            </span>
            <span class="time">{{seller.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>
      <split></split>
      <div class="ratingselect-wrapper">
        <ratingselect @rating-type="selectRatingType" @toggle-only-content="toggleOnlyContent" :ratings="ratings" :select-type="selectType" :only-content="onlyContent" :desc="desc"></ratingselect>
      </div>
      <ul class="rating-list" v-show="ratings.length">
        <li v-show="needShow(rating.rateType, rating.text)" class="rating-item" v-for="(rating, index) in ratings" :key="index">
          <div class="avatar">
            <img :src="rating.avatar" class="avatar">
          </div>
          <div class="content">
            <h3 class="name">{{rating.username}}</h3>
            <div class="star-wrapper">
              <star :size="24" :score="rating.score"></star>
              <span class="delivery-time" v-show="rating.deliveryTime">{{rating.deliveryTime}}分钟送达</span>
            </div>
            <p class="text">{{rating.text}}</p>
            <div class="recommend">
              <i class="icon" :class="{'icon-thumb_up': rating.rateType === 0, 'icon-thumb_down': rating.rateType === 1}"></i>
              <span class="recommend-item" v-for="(item, index) in rating.recommend" :key="index">{{item}}</span>
            </div>
            <div class="time">{{rating.rateTime | formatDateFilter}}</div>
          </div>
        </li>
      </ul>
      <div class="no-rating" v-show="!ratings || !ratings.length">暂无评价</div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import BScroll from 'better-scroll'

import star from 'components/star/star'
import split from 'components/split/split'
import ratingselect from 'components/ratingselect/ratingselect'
import { formatDate } from 'common/js/util.js'

const ERR_OK = 0
const ALLTPYE = 2

export default {
  props: {
    seller: {
      type: Object
    }
  },
  data() {
    return {
      ratings: [],
      showFlag: false,
      selectType: ALLTPYE,
      onlyContent: true,
      desc: {
        all: '全部',
        positive: '满意',
        negative: '不满意'
      }
    }
  },
  methods: {
    selectRatingType(type) {
      this.selectType = type
      this.$nextTick(() => {
        this.scroll.refresh()
      })
    },
    toggleOnlyContent(onlyContent) {
      this.onlyContent = onlyContent
      this.$nextTick(() => {
        this.scroll.refresh()
      })
    },
    needShow(type, text) {
      if (this.onlyContent && !text) {
        return false
      }
      if (this.selectType === ALLTPYE) {
        return true
      } else {
        return type === this.selectType
      }
    }
  },
  created() {
    axios.get('/api/ratings')
      .then((res) => {
        if (res.data.errno !== ERR_OK) {
          return
        }
        this.ratings = res.data.ratings

        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll('.ratings', {
              click: true
            })
          } else {
            this.scroll.refresh()
          }
        })
      })
      .catch(function(error) {
        console.log(error)
      })
  },
  filters: {
    formatDateFilter(time) {
      let date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    }
  },
  components: {
    star,
    split,
    ratingselect
  }
}
</script>

<style lang="scss" type="text/css">
@import '../../common/scss/mixin.scss';

.ratings {
  position: absolute;
  top: 177px;
  bottom: 0;
  width: 100%;
  overflow: hidden;

  .overviw {
    display: flex;
    padding: 18px 0;

    .overviw-left {
      flex: 0 0 137px;
      width: 137px;
      border-right: 1px solid rgba(7, 17, 27, 0.1);
      text-align: center;
      @media only screen and (max-width: 320px) {
        flex: 0 0 120px;
        width: 120px;
      }

      .score {
        line-height: 28px;
        font-size: 24px;
        color: rgb(255, 153, 0);
      }
      .title {
        margin-top: 6px;
        line-height: 18px;
        font-size: 12px;
        color: rgb(7, 17, 27);
      }
      .rank {
        margin: 8px 0 6px 0;
        line-height: 10px;
        font-size: 10px;
        color: rgba(7, 17, 27, 0.5);
      }
    }
    .overviw-right {
      flex: 1;
      padding-left: 24px;

      @media only screen and (max-width: 320px) {
        padding-left: 6px;
      }

      .score-wrapper {
        margin-bottom: 2px;
        line-height: 18px;
        font-size: 0;
        &:last-child {
          margin-bottom: 0;
        }
        .title {
          margin-right: 12px;
          font-size: 12px;
          color: rgb(7, 17, 27);

          @media only screen and (max-width: 320px) {
            margin-right: 6px;
          }
        }
        .star {
          display: inline-block;
          vertical-align: top;
        }
        .score {
          margin-left: 12px;
          font-size: 12px;
          color: rgb(255, 153, 0);

          @media only screen and (max-width: 320px) {
            margin-left: 6px;
          }
        }
        .time {
          font-size: 12px;
          color: rgb(147, 153, 159);
        }
      }
    }
  }

  .rating-list {
    margin: 0 18px;

    .rating-item {
      display: flex;
      padding: 18px 0;

      @include border-1px(rgba(7, 17, 27, 0.1));
      &:last-child {
        @include border-none();
      }
      .avatar {
        flex: 0 0 28px;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .content {
        flex: 1;
        margin-left: 12px;
        .name {
          margin-bottom: 4px;
          line-height: 12px;
          font-size: 10px;
          color: rgb(7, 17, 27);
        }
        .star-wrapper {
          margin-bottom: 6px;
          font-size: 0;
          .star {
            display: inline-block;
          }
          .delivery-time {
            margin-left: 6px;
            line-height: 12px;
            font-size: 10px;
            color: rgb(147, 153, 159);
          }
        }
        .text {
          margin-bottom: 8px;
          line-height: 18px;
          font-size: 12px;
          color: rgb(7, 17, 27);
        }
      }
      .recommend {
        line-height: 16px;
        font-size: 0;
        .icon {
          margin-right: 8px;
          font-size: 12px;
          color: rgb(147, 153, 159);
          &.icon-thumb_up {
            color: rgb(0, 160, 220);
          }
        }
        .recommend-item {
          display: inline-block; // box-sizing: border-box;
          max-width: 61px;
          padding: 0 6px;
          margin-right: 8px;
          font-size: 9px;
          color: rgb(147, 153, 159);
          border: 1px solid rgba(7, 17, 27, 0.1);
          border-radius: 2px;
          background: #fff;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
      .time {
        position: absolute;
        top: 18px;
        right: 0;
        line-height: 12px;
        font-size: 10px;
        color: rgb(147, 153, 159);
      }
    }
  }
}
</style>
