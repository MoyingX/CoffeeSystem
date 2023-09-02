<template>
  <div>
    <router-view/>
  </div>
</template>

<script>
import { onMounted } from 'vue'
import { useStore } from 'vuex';
export default{
  name: 'App',
  setup(){
    const store = useStore()
    onMounted(()=>{
      if (localStorage.getItem('tokenString')) {
        store.commit('useLogin',1)
      }
    })
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
