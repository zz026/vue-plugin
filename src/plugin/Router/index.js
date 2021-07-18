import RouterLink from './RouterLink';
import RouterView from './RouterView';

let Vue;

class Router {
  constructor(options) {
    this.$options = options;

    this.current = '/';
    Vue.util.defineReactive(this, 'matched', []);

    window.addEventListener('load', this.onHashChange.bind(this));
    window.addEventListener('hashchange', this.onHashChange.bind(this));
  }

  onHashChange() {
    this.current = window.location.hash.slice(1) || '/';
    this.matched = [];
    this.match();
  }

  match(routes = this.$options.routes) {
    for (const route of routes) {
      if (route.path === '/' && this.current === '/') {
        this.matched.push(route);
        return false;
      }

      if (route.path !== '/' && this.current.includes(route.path)) {
        this.matched.push(route);
        if (route.children && route.children.length) {
          this.match(route.children);
        }
        return
      }

    }
  }
}

Router.install = function (_Vue) {
  Vue = _Vue;

  Vue.mixin({
    beforeCreate() {
      if (this.$options.router) {
        Vue.prototype.$router = this.$options.router;
      }
    },
  })

  Vue.component('router-link', RouterLink);

  
  Vue.component('router-view', RouterView);
}

export default Router;
