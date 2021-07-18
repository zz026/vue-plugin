
import RouterLink from './RouterLink'
import RouterView from './RouterView'

let Vue;

class Router {
  constructor(options) {
    this.$options = options

    // 缓存路由关系
    this.routerMap = {}
    this.$options.routes.forEach(val => {
      this.routerMap[val.path] = val
    })
  
    
    Vue.util.defineReactive(this, 'current', '/')

    window.addEventListener('load', this.onHashChange.bind(this))
    window.addEventListener('hashchange', this.onHashChange.bind(this))
  }

  onHashChange() {
    this.current = window.location.hash.slice(1) || '/'
  }
}

Router.install = function(_Vue) {
  Vue = _Vue

  Vue.mixin({
    beforeCreate() {
      if (this.$options.router) {
        Vue.prototype.$router = this.$options.router
      } 
    }
  })

  Vue.component('router-link', RouterLink)

  
  Vue.component('router-view', RouterView)
}

export default Router;
