<template>
  <div class="page">
    <aside class="sidebar" style="position:fixed;left:0;top:0;bottom:0;width:240px;background:#ffffff;box-shadow:4px 0 16px rgba(37,99,235,.08);padding:20px;">
      <h3 style="margin:8px 0 20px">运行监测平台</h3>
      <nav class="nav-list" style="display:grid;gap:10px;">
        <RouterLink v-for="item in menus" :key="item.path" :to="item.path" class="btn" :class="{primary: route.path === item.path}">{{ item.name }}</RouterLink>
      </nav>
      <button class="btn" style="margin-top:18px;width:100%" @click="showLogout=true">退出登录</button>
    </aside>
    <main class="dashboard-body" style="margin-left:240px;padding:20px;">
      <router-view />
    </main>

    <ModalDialog :visible="showLogout" title="退出确认" confirm-text="退出" @close="showLogout=false" @confirm="logout">
      <p>确认退出当前系统吗？退出后将返回登录页。</p>
    </ModalDialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import ModalDialog from '../components/ModalDialog.vue'

const route = useRoute()
const router = useRouter()
const showLogout = ref(false)
const menus = [
  { name: '数据采集与监测', path: '/dashboard/data-collection' },
  { name: '数据分析与预警', path: '/dashboard/analysis' },
  { name: '运行状态可视化', path: '/dashboard/visualization' },
  { name: '远程控制与调节', path: '/dashboard/control' },
  { name: '数据报告与统计分析', path: '/dashboard/reports' }
]

const logout = () => {
  localStorage.removeItem('ferment-auth')
  showLogout.value = false
  router.push('/login')
}
</script>
