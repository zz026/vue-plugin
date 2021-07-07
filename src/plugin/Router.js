let Vue;

class Router {
  constructor(options) {
    this.$options = options;
    const current = window.location.hash.slice(1) || '/';

    // 响应式数据
    Vue.util.defineReactive(this, 'current', current);

    window.addEventListener('hashchange', () => {
      this.current = window.location.hash.slice(1);
    });
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
  });

  Vue.component('router-link', {
    props: {
      to: {
        type: String,
        default: '',
      },
    },
    render(createElement) {
      // 不建议在插件中使用JSX, JSX需要依赖环境
      // return <a href={ `#${this.to}` }>{ this.$slots.default }</a>;
      return createElement('a', {
        attrs: {
          href: `#${this.to}`,
        },
      }, this.$slots.default);
    },
  });

  Vue.component('router-view', {
    render(createElement) {
      let component = null;
      const { $options: { routes }, current } = this.$router;
      const route = routes.find((val) => val.path === current);

      if (route) {
        component = route.component;
      }
      return createElement(component);
    },
  });
};

export default Router;
