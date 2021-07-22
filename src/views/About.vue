<template>
  <div class="about">
    <h1>This is an about page</h1>
    <p>{{ $store.state.count }}</p>
    <p>getter: {{ $store.getters.doubleCount }}</p>
    
    <p><button @click="$store.commit('ADD_COUNT')">mutations</button></p>
    <p><button @click="$store.dispatch('ADD_COUNT_ACTIONS')">actions</button></p>

    <router-view />
  </div>
</template>
