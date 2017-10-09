<template>
  <div>
    <v-header :seller="seller"></v-header>
    <div class="tab border-1px">
      <div class="tab-item">
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
    <router-view/>
  </div>
</template>

<script>
import axios from 'axios'
import header from 'components/header/header'

const ERR_OK = 0

export default {
  name: 'app',
  components: {
    'v-header': header
  },
  data() {
    return {
      seller: {}
    }
  },
  created() {
    axios.get('/api/seller')
      .then((res) => {
        if (res.data.errno !== ERR_OK) {
          return
        }
        this.seller = res.data.seller
      })
      .catch(function(error) {
        console.log(error)
      })
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped="" type="text/css">
  @import "./common/scss/mixin.scss";

  .tab {
    display: flex;
    height: 40px;
    line-height: 40px;
    @include border-1px(rgba(7, 17, 27, 0.1));
    .tab-item {
      flex: 1;
      text-align: center;
      &>a {
        display: block;
        font-size: 14px;
        color: rgb(77, 85, 93);
        &.active {
          color: rgb(240, 20, 20);
        }
      }
    }
  }
</style>
