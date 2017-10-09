<template>
  <div class="goods">
    <div class="menu-wrapper">
      <ul>
        <li v-for="(good, index) in goods" :key="index" class="menu-item">
          <span class="text">
            <span v-show="good.type > 0" class="icon" :class="classMap[good.type]"></span>{{good.name}}
          </span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper">
      <ul>
        <li v-for="(item, index) in goods" :key="index" class="food-list">
          <h2 class="title">{{item.name}}</h2>
          <ul>
            <li v-for="(food, idex) in item.foods" :key="idex" class="food-item border-1px">
              <div class="icon">
                <img :src="food.icon" width="50" height="50">
              </div>
              <div class="content">
                <h3 class="name">{{food.name}}</h3>
                <p class="desc" v-if="food.description">{{food.description}}</p>
                <div class="extra">
                  <span class="sellCount">月销{{food.sellCount}}份</span>
                  <span class="rating">好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="now">￥{{food.price}}</span>
                  <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

const ERR_OK = 0

export default {
  props: {
    seller: {
      type: Object
    }
  },
  data() {
    return {
      goods: []
    }
  },
  created() {
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']

    axios.get('/api/goods')
      .then((res) => {
        if (res.data.errno !== ERR_OK) {
          return
        }
        this.goods = res.data.goods
      })
      .catch(function(error) {
        console.log(error)
      })
  }
}
</script>

<style lang="scss" type="text/css">
@import '../../common/scss/mixin.scss';

.goods {
  display: flex;
  position: absolute;
  top: 177px;
  bottom: 46px;
  width: 100%;
  overflow: hidden;

  .menu-wrapper {
    flex: 0 0 80px;
    width: 80px;
    background: #f3f5f7;

    .menu-item {
      display: table;
      width: 56px;
      height: 54px;
      margin: 0 auto;
      line-height: 14px;
      @include border-1px(rgba(7, 17, 27, 0.1));
      font-size: 0;

      .icon {
        display: inline-block;
        width: 12px;
        height: 12px;
        margin-right: 2px;
        vertical-align: top;
        background-size: 12px 12px;
        background-repeat: no-repeat;
        &.decrease {
          @include bg-image('decrease_3')
        }
        &.discount {
          @include bg-image('discount_3')
        }
        &.invoice {
          @include bg-image('invoice_3')
        }
        &.guarantee {
          @include bg-image('guarantee_3')
        }
        &.special {
          @include bg-image('special_3')
        }
      }

      .text {
        display: table-cell;
        width: 54px;
        font-size: 12px; // color: rgb(240, 20, 20);
        line-height: 14px;
        vertical-align: middle;
      }
    }
  }
  .foods-wrapper {
    flex: 1;
    background: #fff;

    .food-list {
      .title {
        padding-left: 14px;
        height: 26px;
        line-height: 26px;
        border-left: 2px solid #d9dde1;
        font-size: 12px;
        color: rgb(147, 153, 159);
        background: #f3f5f7;
      }
      .food-item {
        display: flex;
        margin: 18px;
        padding-bottom: 18px;
        @include border-1px(rgba(7, 17, 27, 0.1));

        &:last-child {
          @include border-none();
          margin-bottom: 0;
        }

        .icon {
          flex: 0 0 50px;
          vertical-align: top;
        }
        .content {
          flex: 1;
          margin-left: 10px;
          .name {
            margin: 2px 0 8px 0;
            line-height: 14px;
            font-size: 14px;
            color: rgb(7, 17, 27);
          }

          .desc,
          .extra {
            margin-bottom: 8px;
            line-height: 10px;
            font-size: 10px;
            color: rgb(147, 153, 159);
          }
          .extra {
            .sell-count {
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
        }
      }
    }
  }
}
</style>
