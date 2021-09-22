function defineReactive(obj, key, val) {
  observe(val)

  const dep = new Dep()

  Object.defineProperty(obj, key, {
    get: () => {
      Dep.target && dep.addDep(Dep.target)

      return val
    },
    set: (newVal) => {
      if (val !== newVal) {
        val = newVal

        observe(val)
        dep.notify()
      }
    }
  })
}

function observe(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }

  Object.keys(obj).forEach(key => {
    defineReactive(obj, key, obj[key])
  })
}


class MyVue {
  constructor(options) {
    this.$options = options
    this.$el = options.el
    this.$data = options.data
    this.$methods = options.methods

    // 数据挟持
    observe(this.$data)
    // 代理到this上
    this.proxy()
    // 编译
    new Compile(this, this.$el)
  }

  proxy() {
    this.proxyData()
    this.proxyMethods()
  }

  proxyData() {
    Object.keys(this.$data).forEach(key => {
      Object.defineProperty(this, key, {
        get: () => {
          return this.$data[key]
        },
        set: (newVal) => {
          this.$data[key] = newVal
        }
      })
    })
  }

  proxyMethods() {
    Object.keys(this.$methods).forEach(key => {
      Object.defineProperty(this, key, {
        get: () => {
          return this.$methods[key]
        }
      })
    })
  }
}

class Compile {
  constructor(vm, el) {
    this.$vm = vm
    this.$el = document.querySelector(el)

    this.compile(this.$el)
  }

  compile(node) {
    const childNodes = node.childNodes
    childNodes.forEach(child => {
      // is element
      if (child.nodeType === 1) {
        this.compileElement(child)

        // 递归子元素
        child.hasChildNodes() && this.compile(child)
      } else if (this.isInter(child)) {
        this.compileText(child)
      }
    })
  }

  isInter(node) {
    return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent)
  }

  // {{ ?? }}
  compileText(node) {
    const exp = RegExp.$1.trim()
    this.update(node, exp, 'text')
  }

  // 获取元素指令 my-
  compileElement(node) {
    Array.from(node.attributes).forEach(attr => {
      const { name, value } = attr
      if (name.startsWith('my-')) {
        const dir = name.substring(3)
        this[dir] && this[dir](node, value)
      } else if (name.startsWith('@')) {
        const dir = name.substring(1)
        this.addEvents(node, value, dir)
      }
    })
  }

  // my-text
  text(node, key) {
    this.update(node, key, 'text')
  }

  // my-html
  html(node, key) {
    this.update(node, key, 'html')
  }

  // my-model
  model(node, key) {
    node.value = this.$vm[key]
    node.addEventListener('input', (e) => {
      this.$vm[key] = e.target.value
    })
  }

  // 添加事件
  addEvents(node, key, evnet) {
    node.addEventListener(evnet, (e) => {
      const fn = this.$vm[key]
      fn && fn.call(this.$vm)
    })
  }

  update(node, key, dir) {
    const fn = this[`${dir}Update`]
    if (fn) {
      fn(node, this.$vm[key])

      // 添加观察者
      new Watcher(this.$vm, key, (val) => {
        fn(node, val)
      })
    }
  }

  textUpdate(node, value) {
    node.textContent = value
  }

  htmlUpdate(node, value) {
    node.innerHTML = value
  }
}


class Watcher {
  constructor(vm, key, updater) {
    this.$vm = vm
    this.$key = key
    this.updaterFn = updater

    Dep.target = this
    this.$vm[this.$key]
    Dep.target = null
  }

  update() {
    this.updaterFn.call(this.$vm, this.$vm[this.$key])
  }
}

class Dep {
  constructor() {
    this.deps = []
  }

  addDep(watcher) {
    this.deps.push(watcher)
  }

  notify() {
    this.deps.forEach(watcher => watcher.update())
  }
}