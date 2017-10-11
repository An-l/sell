<template>
  <div class="food">
    <div class="food-header">
      <div class="pic-wrapper">
        <img :src="food.image">
      </div>
      <div class="food-pannel content">
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
          <cartcontrol :food="food"></cartcontrol>
        </div>
      </div>
    </div>
    <div class="food-pannel food-desc">
      <div class="title">商品介绍</div>
      <p class="content">{{food.info}}</p>
    </div>
    <div class="food-pannel food-rating">
      <div class="rating-header">
        <div class="title">商品评价</div>
        <ul class="rating-type">
          <li class="rating-type-item all">
            全部
            <span></span>
          </li>
          <li class="rating-type-item good">
            推荐
            <span></span>
          </li>
          <li class="rating-type-item bad">
            吐槽
            <span></span>
          </li>
        </ul>
        <div class="only-read-content">
          <i class="icon icon-check_circle"></i> 只看有内容的评价
        </div>
      </div>
      <ul class="rating-list">
        <li class="list-item" v-for="(rating, index) in food.ratings" :key="index">
          <div class="time">{{rating.rateTime}}</div>
          <div class="text">{{rating.text}}</div>
          <div class="user">
            <span class="name">{{rating.username}}</span>
            <img :src="rating.avatar" class="avatar">
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    food: {
      type: Object,
      default() {
        return {
          name: '皮蛋瘦肉粥',
          price: 10,
          oldPrice: '',
          description: '咸粥',
          sellCount: 229,
          rating: 100,
          info: '一碗皮蛋瘦肉粥，总是我到粥店时的不二之选。香浓软滑，饱腹暖心，皮蛋的Q弹与瘦肉的滑嫩伴着粥香溢于满口，让人喝这样的一碗粥也觉得心满意足',
          ratings: [
            {
              username: '3******c',
              rateTime: 1469281964000,
              rateType: 0,
              text: '很喜欢的粥',
              avatar: 'http://static.galileo.xiaojukeji.com/static/tms/default_header.png'
            },
            {
              username: '2******3',
              rateTime: 1469271264000,
              rateType: 0,
              text: '',
              avatar: 'http://static.galileo.xiaojukeji.com/static/tms/default_header.png'
            },
            {
              username: '3******b',
              rateTime: 1469261964000,
              rateType: 1,
              text: '',
              avatar: 'http://static.galileo.xiaojukeji.com/static/tms/default_header.png'
            }
          ],
          icon: 'http://fuss10.elemecdn.com/c/cd/c12745ed8a5171e13b427dbc39401jpeg.jpeg?imageView2/1/w/114/h/114',
          image: 'http://fuss10.elemecdn.com/c/cd/c12745ed8a5171e13b427dbc39401jpeg.jpeg?imageView2/1/w/750/h/750'
        }
      }
    }
  }
}
</script>

<style lang="scss">
@import '../../common/scss/mixin.scss';

.food {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 30px;
  width: 100%;
  background: #f3f5f7;
  .food-pannel {
    margin-bottom: 16px;
    background: #fff;

    .title {
      margin-bottom: 6px;
      font-size: 14px;
    }
  }
  .food-header {
    .pic-wrapper {
      height: 375px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .content {
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
    .rating-header {
      padding: 18px 18px 12px 18px;
      border-bottom: 1px solid rgba(7, 17, 27, 0.1);
      .rating-type {
        margin-bottom: 12px;
        padding: 12px 0 18px 0;
        font-size: 0;
        @include border-1px(rgba(7, 17, 27, 0.1));

        .rating-type-item {
          display: inline-block;
          margin-right: 8px;
          padding: 8px 12px;
          font-size: 12px;
          &.all {
            color: #fff;
            background: rgb(0, 160, 220);
          }
          &.good {
            color: rgb(77, 85, 93);
            background: rgba(0, 160, 220, 0.2);
          }
          &.bad {
            color: rgb(77, 85, 93);
            background: rgba(77, 78, 93, 0.2);
          }
        }
      }
      .only-read-content {
        line-height: 24px;
        font-size: 12px;
        color: rgb(147, 153, 159);
        .icon {
          display: inline-block;
          vertical-align: top;
          font-size: 24px;
          color: rgb(147, 153, 159);
        }
      }
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
          font-size: 12px;
          color: rgb(7, 17, 27);
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
  }
}
</style>

