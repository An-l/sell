<template>
  <div class="shopcart">
    <div class="content">
      <div class="content-left" @click="toggleList">
        <div class="logo-wrapper">
          <div class="logo" :class="{'highlight': totalCount > 0}">
            <i class="icon-shopping_cart" :class="{'highlight': totalCount > 0}"></i>
          </div>
          <div class="num" v-show="totalCount > 0">{{totalCount}}</div>
        </div>
        <div class="price" :class="{'highlight': totalCount > 0}">
          ￥{{totalPrice}}
        </div>
        <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
      </div>
      <div class="content-right">
        <div class="pay" :class="payClass" @click="pay">
          {{payDesc}}
        </div>
      </div>
      <div class="ball-container">
        <div v-for="(ball,index) in balls" :key="index">
          <transition name="drop" v-on:before-enter="beforeEnter"
          v-on:enter="enter" v-on:after-enter="afterEnter">
            <div v-show="ball.show" class="ball" :css="false">
              <div class="inner inner-hook"></div>
            </div>
          </transition>
        </div>
      </div>

      <transition name="fold">
        <div class="shopcart-list" v-show="listShow">
          <div class="list-header">
            <h3 class="title">购物车</h3>
            <span class="empty" @click="clearList">清空</span>
          </div>
          <div class="list-content" ref="listContent">
            <ul>
              <li v-for="(food, index) in selectFoods" :key="index" class="food">
                <span class="name">{{food.name}}</span>
                <span class="price">￥{{food.price * food.count}}</span>
                <div class="cartcontrol-wrapper">
                  <cartcontrol @add="addFood" :food="food"></cartcontrol>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
    <transition name="fade">
      <div class="list-mask" v-show="listShow" @click="toggleList"></div>
    </transition>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
import cartcontrol from 'components/cartcontrol/cartcontrol'

export default {
  props: {
    selectFoods: {
      type: Array,
      default() {
        return [
          // {
          //   price: 8,
          //   count: 2
          // }
        ]
      }
    },
    deliveryPrice: {
      type: Number,
      default: 0
    },
    minPrice: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      balls: [{
        show: false
      }, {
        show: false
      }, {
        show: false
      }, {
        show: false
      }, {
        show: false
      }],
      dropBalls: [],
      fold: true
    }
  },
  computed: {
    totalPrice() {
      let total = 0
      this.selectFoods.forEach(function(food) {
        total += food.price * food.count
      }, this)
      return total
    },
    totalCount() {
      let count = 0
      this.selectFoods.forEach(function(food) {
        count += food.count
      }, this)
      return count
    },
    payDesc() {
      if (this.totalPrice === 0) {
        return `￥${this.minPrice}元起送`
      } else if (this.totalPrice < this.minPrice) {
        return `还差￥${this.minPrice - this.totalPrice}元起送`
      } else {
        return '结算'
      }
    },
    payClass() {
      if (this.totalPrice < this.minPrice) {
        return 'not-enough'
      } else {
        return 'enough'
      }
    },
    listShow() {
      if (!this.totalCount) {
        this.fold = true
        return false
      }
      let show = !this.fold
      if (show) {
        this.$nextTick(() => {
          // 初始化购物车列表滚动
          if (!this.cartListScroll) {
            this.cartListScroll = new BScroll(this.$refs.listContent, {
              click: true
            })
          } else {
            this.cartListScroll.refresh()
          }
        })
      }
      return show
    }
  },
  methods: {
    toggleList() {
      if (!this.totalCount) {
        return
      }
      this.fold = !this.fold
    },
    clearList() {
      this.selectFoods.forEach((food) => {
        food.count = 0
      })
    },
    pay() {
      if (this.totalPrice < this.minPrice) {
        return
      }
      alert(`需要支付${this.totalPrice}元！`)
    },
    drop(target) {
      console.log(target)
      for (let i = 0; i < this.balls.length; i++) {
        let ball = this.balls[i]
        if (!ball.show) {
          ball.show = true
          // this.$set(ball, 'el', target)
          ball.el = target
          this.dropBalls.push(ball)
          return
        }
      }
    },
    beforeEnter(el) {
      let count = this.balls.length
      while (count--) {
        let ball = this.balls[count]
        if (ball.show) {
          let rect = ball.el.getBoundingClientRect()
          let x = rect.left - 32
          let y = -(window.innerHeight - rect.top - 22)
          el.style.display = ''
          el.style.webkitTransform = `translate3d(0,${y}px,0)`
          el.style.transform = `translate3d(0,${y}px,0)`
          let inner = el.querySelector('.inner-hook')
          inner.style.webkitTransform = `translate3d(${x}px,0,0)`
          inner.style.transform = `translate3d(${x}px,0,0)`
        }
      }
    },
    enter(el, done) {
      el.offsetHeight // 触发浏览器重绘，offsetWidth、offsetTop等方法都可以触发
      this.$nextTick(() => {
        el.style.webkitTransform = 'translate3d(0,0,0)'
        el.style.transform = 'translate3d(0,0,0)'
        let inner = el.querySelector('.inner-hook')
        inner.style.webkitTransform = 'translate3d(0,0,0)'
        inner.style.transform = 'translate3d(0,0,0)'
        el.addEventListener('transitionend', done)
      })
    },
    afterEnter(el) {
      let ball = this.dropBalls.shift()
      if (ball) {
        ball.show = false
        el.style.display = 'none'
      }
    },
    addFood(target) {
      this.drop(target)
    }
  },
  components: {
    cartcontrol
  }
}
</script>

<style lang="scss" type="text/css">
@import '../../common/scss/mixin.scss';

.shopcart {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 48px;
  z-index: 50;

  .content {
    display: flex;
    height: 100%;
    background: #141d27;
    color: rgba(255, 255, 255, 0.4);
  }
  .content-left {
    flex: 1;
    font-size: 0;
    .logo-wrapper,
    .price,
    .desc {
      display: inline-block;
      vertical-align: top;
    }
    .logo-wrapper {
      position: relative;
      top: -10px;
      margin: 0 12px;
      padding: 6px;
      width: 56px;
      height: 56px;
      box-sizing: border-box;
      border-radius: 50%;
      background: #141d27;

      .logo {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        text-align: center;
        background: #2b343c;
        &.highlight {
          background: rgb(0, 160, 220);
        }
        .icon-shopping_cart {
          font-size: 24px;
          line-height: 44px;
          color: #80858a;
          &.highlight {
            color: #fff;
          }
        }
      }
      .num {
        position: absolute;
        top: 0;
        right: 0;
        width: 24px;
        height: 16px;
        line-height: 16px;
        border-radius: 16px;
        font-size: 9px;
        font-weight: 700;
        color: #fff;
        background: rgb(240, 20, 20);
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4);
        text-align: center;
      }
    }
    .price {
      margin-top: 12px;
      line-height: 24px;
      padding-right: 12px;
      border-right: 1px solid rgba(255, 255, 255, 0.1);
      font-size: 16px;
      font-weight: 700;
      &.highlight {
        color: #fff;
      }
    }
    .desc {
      margin: 12px 0 0 12px;
      line-height: 24px;
      font-size: 10px;
    }
  }

  .content-right {
    flex: 0 0 105px;
    .pay {
      height: 48px;
      line-height: 48px;
      text-align: center;
      font-size: 12px;
      font-weight: 700;
      &.enough {
        background: #00b43c;
        color: #fff;
      }
      &.not-enough {
        background: #2b333b;
      }
    }
  }

  .ball-container{
		.ball{
			position:fixed;
			left:32px;
			bottom:22px;
			z-index:200;
			//y 轴 贝塞尔曲线
			transition:all 0.5s cubic-bezier(0.49, -0.29, 0.75, 0.41);
      // &.drop-enter,
      // &.drop-enter-active {
      //   transition: all 0.4s cubic-bezier(0.49,-0.29,0.75,0.41);
      //   .inner {
      //     width: 16px;
      //     height: 16px;
      //     border-radius: 50%;
      //     background: rgb(0,160,220);
      //     transition: all 0.4s linear;
      //   }
      // }
			.inner{
				width:16px;
				height:16px;
				border-radius:50%;
				background-color:rgb(0,160,220);
				//x 轴只需要线性缓动
				transition:all 0.5s linear;
			}
		}
	}

  .shopcart-list {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    max-height: 257px;
    z-index: -1;
    transition: all .5s;
    transform: translate3d(0, -100%, 0);

    &.fold-enter,
    &.fold-leave-active {
      transform: translate3d(0, 0, 0);
    }

    .list-header {
      padding: 0 18px;
      height: 40px;
      line-height: 40px;
      background: #f3f5f7;
      border-bottom: 1px solid rgba(7, 17, 27, 0.1);
      .title {
        float: left;
        font-size: 14px;
        color: rgb(7, 17, 27);
      }
      .empty {
        float: right;
        font-size: 12px;
        color: rgb(0, 160, 220);
      }
    }

    .list-content {
      padding: 0 18px;
      width: 100%;
      overflow: hidden;
      background: #fff;
      box-sizing: border-box;

      .food {
        position: relative;
        padding: 12px 0;
        line-height: 24px;
        @include border-1px(rgba(7, 17, 27, 0.1));

        .name {
          font-size: 14px;
          color: rgb(7, 17, 27);
        }

        .price {
          position: absolute;
          right: 90px;
          bottom: 12px;
          font-size: 14px;
          font-weight: 700;
          color: rgb(240, 20, 20);
        }

        .cartcontrol-wrapper {
          position: absolute;
          right: 0;
          bottom: 6px;
          line-height: 1;
        }
      }
    }
  }

  .list-mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(7, 17, 27, 0.6);
    z-index: -2;
    opacity: 1;
    transition: all .5s;

    &.fade-enter,
    &.fade-leave-active {
      opacity: 0;
    }
  }
}
</style>
