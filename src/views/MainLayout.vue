<template>
  <div class="layout">
    <aside class="sidebar">
      <div>
        <h2>新能源汽车综合扫描检测系统</h2>
        <p class="tag">运行状态：在线</p>
      </div>
      <nav class="nav-links">
        <router-link to="/vehicle-diagnosis">车辆诊断与检测</router-link>
        <router-link to="/fault-warning">故障预警与告警</router-link>
        <router-link to="/data-management">数据存储与管理</router-link>
        <router-link to="/system-calibration">系统自检与校准</router-link>
        <router-link to="/report-generation">报告生成与导出</router-link>
      </nav>
      <button class="secondary" type="button" @click="showProfile = true">账户信息</button>
    </aside>
    <main class="main-content">
      <div class="topbar">
        <div>
          <h1>{{ currentTitle }}</h1>
          <p>统一管理新能源车辆检测全流程，模块独立运行。</p>
        </div>
        <div class="tag">数据刷新：{{ now }}</div>
      </div>
      <router-view />
    </main>
  </div>
  <BaseModal v-if="showProfile" title="操作员账户信息" @close="showProfile = false">
    <div class="form-grid">
      <div>
        <label>操作员</label>
        <input type="text" value="安检专员-吴明" disabled />
      </div>
      <div>
        <label>所属中心</label>
        <input type="text" value="华东新能源检测中心" disabled />
      </div>
      <div>
        <label>当前权限</label>
        <input type="text" value="高级诊断与报告审核" disabled />
      </div>
    </div>
  </BaseModal>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import BaseModal from '../components/BaseModal.vue';

const route = useRoute();
const showProfile = ref(false);
const now = new Date().toLocaleString('zh-CN');

const titles = {
  '/vehicle-diagnosis': '车辆诊断与检测',
  '/fault-warning': '故障预警与告警',
  '/data-management': '数据存储与管理',
  '/system-calibration': '系统自检与校准',
  '/report-generation': '报告生成与导出'
};

const currentTitle = computed(() => titles[route.path] || '综合扫描检测');
</script>
