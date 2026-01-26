<template>
  <component :is="layout">
    <router-view />
  </component>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import MainLayout from './layouts/MainLayout.vue'

const route = useRoute()
const layout = computed(() => {
  if (route.meta.layout === 'main') {
    return MainLayout
  }
  return 'div'
})
</script>
