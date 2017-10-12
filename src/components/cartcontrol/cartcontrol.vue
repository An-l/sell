<template>
  <div class="cartcontrol">
    <transition name="move">
      <div class="cart-decrease" v-show="food.count > 0" @click.stop="decreaseCart">
        <i class="inner icon-remove_circle_outline"></i>
      </div>
    </transition>
    <div class="cart-count" v-show="food.count > 0">
      {{food.count}}
    </div>
    <div class="cart-add" @click.stop.prevent="addCart">
      <i class="inner icon-add_circle"></i>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    food: {
      type: Object
    }
  },
  methods: {
    addCart(event) {
      if (!event._constructed) {
        return
      }
      if (!this.food.count) {
        this.$set(this.food, 'count', 1)
      } else {
        this.food.count++
      }
      // console.log(event.target)
      this.$emit('add', event.target)
    },
    decreaseCart(event) {
      if (!event._constructed) {
        return
      }
      this.food.count--
    }
  },
  created() {
  }
}
</script>

<style lang="scss" type="text/css">
@import '../../common/scss/mixin.scss';
.cartcontrol {
  font-size: 0;
  .cart-decrease,
  .cart-count,
  .cart-add {
    display: inline-block;
    vertical-align: top;
  }
  .cart-decrease,
  .cart-add {
    padding: 6px;

    .inner {
      display: inline-block;
      font-size: 24px;
      line-height: 24px;
      color: rgb(0, 160, 220);
    }
  }
  .cart-decrease {
    opacity: 1;
    transform: translate3d(0, 0, 0);
    transition: all .4s linear;
    .inner {
      transition: all .4s linear;
      transform: rotate(0);
    }
    &.move-enter,
    &.move-leave-active {
      opacity: 0;
      transform: translate3d(24px, 0, 0);
      .inner {
        transform: rotate(180deg);
      }
    }
  }

  .cart-count {
    width: 12px;
    padding-top: 6px;
    line-height: 24px;
    font-size: 10px;
    color: rgb(147, 153, 159);
    text-align: center;
  }
}
</style>
