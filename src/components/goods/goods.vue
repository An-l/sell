<template>
  <div class="goods">
    <div class="menu-wrapper">
      <ul>
        <li v-for="(good, index) in goods" :class="{'current': currentIndex === index}" @click="selectMenu(index, $event)" :key="index" class="menu-item">
          <span class="text">
            <span v-show="good.type > 0" class="icon" :class="classMap[good.type]"></span>{{good.name}}
          </span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper">
      <ul class="content">
        <li v-for="(item, index) in goods" :key="index" class="food-list food-list-hook">
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
                <div class="cartcontrol-wrapper">
                  <cartcontrol :food="food" @add="_drop"></cartcontrol>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <shopcart :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice" :select-foods="selectFoods" ref="shopcart"></shopcart>
  </div>
</template>

<script>
import axios from 'axios'
import BScroll from 'better-scroll'
import shopcart from 'components/shopcart/shopcart'
import cartcontrol from 'components/cartcontrol/cartcontrol'

const ERR_OK = 0

export default {
  props: {
    seller: {
      type: Object
    }
  },
  data() {
    return {
      goods: [],
      listHeight: [],
      scrollY: 0
    }
  },
  computed: {
    currentIndex() {
      for (let i = 0; i < this.listHeight.length; i++) {
        let height1 = this.listHeight[i]
        let height2 = this.listHeight[i + 1]
        if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
          return i
        }
      }
      return 0
    },
    selectFoods() {
      let foods = []
      this.goods.forEach(function(good) {
        good.foods.forEach((food) => {
          if (food.count > 0) {
            foods.push(food)
          }
        })
      }, this)
      return foods
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

        this.$nextTick(() => {
          this._initScroll()
          this._calculateHeight()
        })
      })
      .catch(function(error) {
        console.log(error)
      })
  },
  methods: {
    selectMenu(index, event) {
      if (!event._constructed) {
        return
      }
      let foodList = document.getElementsByClassName('food-list-hook')
      let el = foodList[index]
      this.foodsScroll.scrollToElement(el, 500)
    },
    _initScroll() {
      this.menuScroll = new BScroll('.menu-wrapper', {
        click: true
      })
      this.foodsScroll = new BScroll('.foods-wrapper', {
        click: true,
        probeType: 3
      })

      this.foodsScroll.on('scroll', (pos) => {
        this.scrollY = Math.abs(Math.round(pos.y))
      })
    },
    _calculateHeight() {
      let foodList = document.getElementsByClassName('food-list-hook')
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < foodList.length; i++) {
        let item = foodList[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    },
    _drop(target) {
      // 优化，异步执行下落动画
      this.$nextTick(() => {
        this.$refs.shopcart.drop(target)
      })
    },
    addFood(target) {
      this._drop(target)
    }
  },
  components: {
    shopcart,
    cartcontrol
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
      padding: 0 12px;
      line-height: 14px;

      font-size: 0;
      &.current {
        position: relative;
        margin-top: -1px;
        z-index: 10;
        background: #fff;
        .text {
          font-weight: 700;
          @include border-none();
        }
      }

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
        @include border-1px(rgba(7, 17, 27, 0.1));
        &:last-child {
          // @include border-none();
        }
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
            line-height: 12px;
            font-size: 10px;
            color: rgb(147, 153, 159);
          }
          .extra {
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
        }
      }
    }
  }
  .cartcontrol-wrapper {
    position: absolute;
    bottom: 10px;
    right: 0;
  }
}
</style>
