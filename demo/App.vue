<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <HelloWorld msg="Hello Vue 3 + TypeScript + Vite" />
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { useInjector, useProviders, useRequest } from '../packages';
import HelloWorld from './components/HelloWorld.vue';
import { useCustomeRequest } from './hooks/useCustomeRequest'
import { useHttpIntercept } from './hooks/useHttpIntercept';
import { useString } from './hooks/useString';

useProviders(
  // useCustomeRequest,
  useHttpIntercept,
  useString
);

useInjector(useString)

useRequest('/index.php/api/common/loginIn',{data: {a:1, b:2}, method: 'POST'})



</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>