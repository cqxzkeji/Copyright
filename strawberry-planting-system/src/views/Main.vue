<template>
  <div class="main-layout">
    <aside class="sidebar">
      <div class="brand">
        <span class="badge">实时在线</span>
        <h2>草莓监控中心</h2>
      </div>
      <nav class="menu">
        <router-link
          v-for="item in menu"
          :key="item.path"
          :to="item.path"
          class="menu-item"
          active-class="active"
        >
          {{ item.label }}
        </router-link>
      </nav>
    </aside>
    <div class="content">
      <header class="topbar">
        <div>
          <h1>迷宫式与高位种植运行看板</h1>
          <p>智能感知、联动控制、全程追溯</p>
        </div>
        <div class="actions">
          <button class="btn secondary" @click="openTip">系统提示</button>
          <button class="btn" @click="openLogout">退出登录</button>
        </div>
      </header>
      <main class="page">
        <router-view />
      </main>
    </div>
    <BaseModal :show="showTip" title="系统提示" @close="showTip = false">
      <p>当前设备在线率 98%，今日计划完成度 76%，请按计划查看各模块细节。</p>
      <template #footer>
        <button class="btn" @click="showTip = false">我知道了</button>
      </template>
    </BaseModal>
    <BaseModal :show="showLogout" title="确认退出" @close="showLogout = false">
      <p>是否退出当前账号并返回登录页面？</p>
      <template #footer>
        <button class="btn secondary" @click="showLogout = false">取消</button>
        <button class="btn" @click="logout">确认退出</button>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseModal from '../components/BaseModal.vue'

const router = useRouter()
const showTip = ref(false)
const showLogout = ref(false)

const menu = [
  { label: '环境数据采集', path: '/main/environment' },
  { label: '智能环境控制', path: '/main/control' },
  { label: '生长监测展示', path: '/main/growth' },
  { label: '异常预警管理', path: '/main/alarm' },
  { label: '生产与数据管理', path: '/main/management' }
]

const openTip = () => {
  showTip.value = true
}

const openLogout = () => {
  showLogout.value = true
}

const logout = () => {
  showLogout.value = false
  router.push('/login')
}
</script>

<style scoped>
.main-layout {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 240px;
  background: #ffffff;
  border-right: 1px solid #eef2f8;
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.brand h2 {
  margin-top: 10px;
  font-size: 18px;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.menu-item {
  padding: 12px 14px;
  border-radius: 12px;
  background: #f7f9ff;
  color: #2d3b57;
  font-weight: 600;
}

.menu-item.active {
  background: #2f7cf6;
  color: #ffffff;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 24px;
  gap: 20px;
}

.topbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  background: #ffffff;
  border-radius: 18px;
  padding: 18px 22px;
  box-shadow: 0 10px 24px rgba(32, 66, 116, 0.08);
}

.topbar h1 {
  font-size: 20px;
  margin-bottom: 6px;
}

.topbar p {
  color: #6c7a96;
}

.actions {
  display: flex;
  gap: 12px;
}

.page {
  flex: 1;
}

@media (max-width: 900px) {
  .main-layout {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
  }

  .menu {
    flex-direction: row;
    flex-wrap: wrap;
  }
}
</style>
