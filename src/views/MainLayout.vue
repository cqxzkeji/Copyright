<template>
  <div class="layout">
    <aside class="sidebar">
      <h2>BI Suite</h2>
      <router-link v-for="item in menu" :key="item.path" :to="item.path" class="nav-item">
        {{ item.label }}
      </router-link>
      <router-link class="nav-item logout" to="/login">退出登录</router-link>
    </aside>
    <main class="content"><router-view /></main>
  </div>
</template>

<script setup>
const menu = [
  { label: '数据采集与接入', path: '/app/collection' },
  { label: '数据处理与清洗', path: '/app/processing' },
  { label: '数据分析与建模', path: '/app/analysis' },
  { label: '可视化与报告', path: '/app/visualization' },
  { label: '商业智能与决策', path: '/app/business' }
]
</script>
