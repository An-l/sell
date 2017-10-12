<template>
  <transition name="move">
    <div class="food-wrapper" v-show="showFlag">
      <div class="food">
        <div class="food-header">
          <div class="image-wrapper">
            <img :src="food.image">
            <div class="back" @click="hide">
              <i class="icon-arrow_lift"></i>
            </div>
          </div>
          <div class="food-pannel food-content">
            <div class="name">
              {{food.name}}
            </div>
            <div class="extra">
              <span class="sellCount">月销{{food.sellCount}}份</span>
              <span class="rating">好评率{{food.rating}}%</span>
            </div>
            <div class="price">
              <span class="now">￥{{food.price}}</span>
              <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
            </div>
            <div class="cartcontrol-wrapper">
              <cartcontrol :food="food" @add="addCart" v-show="food.count"></cartcontrol>
            </div>
            <transition name="fade">
              <div class="add-cart" v-show="!food.count || food.count === 0" @click="_addFirst">加入购物车</div>
            </transition>
          </div>
        </div>
        <split></split>
        <div class="food-pannel food-desc">
          <div class="title">商品介绍</div>
          <p class="content">{{food.info}}</p>
        </div>
        <split></split>
        <div class="food-pannel food-rating">
          <div class="title">商品评价</div>
          <div class="ratingselect-wrapper">
            <ratingselect @rating-type="selectRatingType" @toggle-only-content="toggleOnlyContent" :ratings="food.ratings" :select-type="selectType" :only-content="onlyContent" :desc="desc"></ratingselect>
          </div>
          <ul class="rating-list" v-show="food.ratings.length">
            <li class="list-item" v-for="(rating, index) in ratingsList" :key="index">
              <div class="time">{{rating.rateTime | formatDateFilter}}</div>
              <div class="text">
                <i class="icon" :class="{'icon-thumb_up': rating.rateType === 0, 'icon-thumb_down': rating.rateType === 1}"></i>
                {{rating.text}}
              </div>
              <div class="user">
                <span class="name">{{rating.username}}</span>
                <img :src="rating.avatar" class="avatar">
              </div>
            </li>
          </ul>
          <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import BScroll from 'better-scroll'
import cartcontrol from 'components/cartcontrol/cartcontrol'
import split from 'components/split/split'
import ratingselect from 'components/ratingselect/ratingselect'
import { formatDate } from 'common/js/util.js'
// const POSITIVETYPE = 0
// const NEGATIVE = 1
const ALLTPYE = 2

export default {
  props: {
    food: {
      type: Object
    }
  },
  methods: {
    show() {
      this.showFlag = true
      this.selectType = ALLTPYE
      this.onlyContent = true
      this.$nextTick(() => {
        if (!this.foodScroll) {
          this.foodScroll = new BScroll('.food-wrapper', {
            click: true
          })
        } else {
          this.foodScroll.refresh()
        }
      })
    },
    hide() {
      this.showFlag = false
    },
    _addFirst(event) {
      if (!this.food.count) {
        this.$set(this.food, 'count', 1)
      } else {
        this.food.count++
      }
      this.$emit('add', event.target)
    },
    addCart(target) {
      this.$emit('add', target)
    },
    selectRatingType(type) {
      this.selectType = type
      this.$nextTick(() => {
        this.foodScroll.refresh()
      })
    },
    toggleOnlyContent(onlyContent) {
      this.onlyContent = onlyContent
      this.$nextTick(() => {
        this.foodScroll.refresh()
      })
    }
  },
  computed: {
    positives() {
      console.log(this.food.ratings)
      return this.food.ratings.filter((rating) => {
        return rating.rateType === 0
      })
    },
    negatives() {
      return this.food.ratings.filter((rating) => {
        return rating.rateType === 1
      })
    },
    ratingsList() {
      let list = []
      if (this.selectType === 0) {
        list = this.positives
      } else if (this.selectType === 1) {
        list = this.negatives
      } else {
        list = this.food.ratings
      }
      if (this.onlyContent) {
        return list.filter((rating) => {
          return rating.text !== ''
        })
      }
      return list
    }
  },
  data() {
    return {
      showFlag: false,
      selectType: ALLTPYE,
      onlyContent: true,
      desc: {
        all: '全部',
        positive: '推荐',
        negative: '吐槽'
      }
    }
  },
  components: {
    cartcontrol,
    split,
    ratingselect
  },
  filters: {
    formatDateFilter(time) {
      let date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    }
  }
}
</script>

<style lang="scss" type="text/css">
@import '../../common/scss/mixin.scss';

.food-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 30px;
  width: 100%;
  background: #fff;
  transform: translate3d(0, 0, 0);
  transition: all .2s linear;

  &.move-enter,
  &.move-leave-active {
    transform: translate3d(100%, 0, 0);
  }

  .food-pannel {
    // margin-bottom: 16px;
    background: #fff;

    .title {
      margin-bottom: 6px;
      font-size: 14px;
    }
  }
  .food-header {
    .image-wrapper {
      position: relative;
      width: 100%;
      height: 0;
      padding-top: 100%;
      img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
      .back {
        position: absolute;
        top: 10px;
        left: 0;
      }
      .icon-arrow_lift {
        display: block;
        padding: 10px;
        font-size: 20px;
        color: #fff;
      }
    }
    .food-content {
      position: relative;
      padding: 18px;
      .name {
        margin-bottom: 8px;
        line-height: 14px;
        color: rgb(7, 17, 27);
        font-size: 14px;
        font-weight: 700;
      }
      .extra {
        margin-bottom: 18px;
        font-size: 10px;
        color: rgb(147, 153, 159);
        .sellCount {
          margin-right: 12px;
        }
      }

      .price {
        line-height: 24px;
        font-weight: 700;
        &>.now {
          margin-right: 8px;
          font-size: 14px;
          color: rgb(240, 20, 20)
        }
        &>.old {
          text-decoration: line-through;
          font-size: 10px;
          color: rgb(147, 153, 159);
        }
      }

      .cartcontrol-wrapper {
        position: absolute;
        bottom: 18px;
        right: 18px;
      }
      .add-cart {
        position: absolute;
        bottom: 20px;
        right: 18px;
        padding: 6px 12px;
        line-height: 12px;
        font-size: 10px;
        border-radius: 12px;
        color: #fff;
        background-color: rgb(0, 160, 220);
        opacity: 1;
        transition: all .2s;

        &.fade-enter,
        &.fade-leave-active {
          opacity: 0;
        }
      }
    }
  }
  .food-desc {
    padding: 18px;
    .content {
      padding: 0 8px;
      line-height: 24px;
      font-size: 12px;
      color: rgb(77, 85, 93);
    }
  }
  .food-rating {
    padding-top: 18px;
    padding-bottom: 20px;
    
    .title {
      margin-bottom: 0;
      margin-left: 18px;
    }
    .rating-list {
      margin: 0 18px;

      .list-item {
        position: relative;
        padding: 16px 0;
        @include border-1px(rgba(7, 17, 27, 0.1));
        &:last-child {
          @include border-none();
        }

        .time {
          margin-bottom: 6px;
          font-size: 10px;
          color: rgb(147, 153, 159);
        }
        .text {
          line-height: 16px;
          font-size: 12px;
          color: rgb(7, 17, 27);

          .icon {
            margin-right: 4px;
            font-size: 12px;
            color: rgb(147, 153, 159);
            &.icon-thumb_up {
              color: rgb(0, 160, 220);
            }
          }
        }
        .user {
          position: absolute;
          top: 16px;
          right: 0;
          font-size: 0;
          .name {
            display: inline-block;
            margin-right: 6px;
            line-height: 12px;
            font-size: 10px;
            color: rgb(147, 153, 159);
          }
          .avatar {
            display: inline-block;
            vertical-align: top;
            width: 12px;
            height: 12px;
            border-radius: 50%;
          }
        }
      }
    }
    .no-rating {
      padding: 16px 18px;
      font-size: 12px;
      color: rgb(147, 153, 159);
    }
  }
}
</style>

