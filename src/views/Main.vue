<template>
  <div class="layout">
    <aside class="sidebar">
      <h2>电压溯源中心</h2>
      <div class="menu">
        <RouterLink to="/main/device">设备管理</RouterLink>
        <RouterLink to="/main/collect">电压采集</RouterLink>
        <RouterLink to="/main/records">数据存储</RouterLink>
        <RouterLink to="/main/trace">数据溯源</RouterLink>
        <RouterLink to="/main/setting">统计与导出</RouterLink>
      </div>
      <div class="kpi">
        <span class="chip">WiFi / 蓝牙接入</span>
        <strong>{{ onlineDevices }} 台在线</strong>
        <small>实时安全监控</small>
      </div>
    </aside>
    <div class="content">
      <header class="topbar">
        <h1>蓄电池电压检测数据溯源系统</h1>
        <div class="tag-row">
          <span class="chip">实时采集</span>
          <span class="chip">数据可追溯</span>
          <span class="chip">亮色主题</span>
        </div>
      </header>
      <RouterView />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const onlineDevices = ref(18);
</script>
