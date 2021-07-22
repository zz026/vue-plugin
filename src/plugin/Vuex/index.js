let Vue;

class Store {
  constructor(options) {
    this._state = options.state
    this._mutations = options.mutations
    this._actions = options.actions
    this._wrapGetters = options.getters
    

    this.getters = {}
    const that = this
    const computed = {}

    Object.keys(that._wrapGetters).forEach(key => {
      const fn = that._wrapGetters[key]
      computed[key] = function() {
        return fn(that.state)
      }

      Object.defineProperty(that.getters, key, {
        get: () => that._vm[key]
      })
    })
    

    this._vm = new Vue({
      data() {
        return {
          $$state: that._state
        }
      },
      computed
    })

    this.commit = this.commit.bind(this)
    this.dispatch = this.dispatch.bind(this)

  }


  get state() {
    return this._vm._data.$$state
  }

  set state(v) {
    console.error('Please use mutations or actions update state!')
  }

  commit(type, params) {
    const entry = this._mutations[type]
    if (entry) {
      return entry(this.state, params)
    }
  }

  dispatch (type, params) {
    const entry = this._actions[type]
    if (entry) {
      return entry(this, params)
    }
  }
  

}

function install(_Vue) {
  Vue = _Vue


  Vue.mixin({
    beforeCreate() {
      if (this.$options.store) {
        Vue.prototype.$store = this.$options.store
      }
    }
  })

}


export default {
  Store,
  install
}