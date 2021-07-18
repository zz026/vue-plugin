export default {
  name: 'RouterView',
  render(h) {

    const { current, routerMap } = this.$router
    const component = routerMap[current].component || null

    return h(component)
  }
}