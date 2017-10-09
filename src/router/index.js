import Vue from 'vue'
import Router from 'vue-router'
import goods from 'components/goods/goods'
import seller from 'components/seller/seller'
import ratings from 'components/ratings/ratings'

Vue.use(Router)

export default new Router({
  linkActiveClass: 'active',
  routes: [
    {
      path: '/',
      name: 'index',
      redirect: '/goods'
    },
    {
      path: '/goods',
      name: 'Goods',
      component: goods
    },
    {
      path: '/seller',
      name: 'Seller',
      component: seller
    },
    {
      path: '/ratings',
      name: 'Ratings',
      component: ratings
    }
  ]
})
