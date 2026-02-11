<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const collapsed = ref(false)

const farmName = sessionStorage.getItem('farm_name') || '养殖场'
const selectedKey = computed(() => route.path.split('/').pop())

const modules = [
  { key: 'recommend', label: '配方推荐' },
  { key: 'optimization', label: '配方优化' },
  { key: 'cost', label: '成本核算' },
  { key: 'inventory', label: '库存管理' },
  { key: 'report', label: '报告跟踪' },
  { key: 'settings', label: '系统设置' }
]

const goPage = ({ key }) => router.push(`/dashboard/${key}`)

const logout = () => {
  sessionStorage.removeItem('afs_token')
  router.push('/login')
}
</script>

<template>
  <a-layout class="layout-wrap">
    <a-layout-sider v-model:collapsed="collapsed" :width="230" theme="light" class="sider-fixed">
      <div class="brand">无抗养殖系统</div>
      <a-menu :selected-keys="[selectedKey]" mode="inline" @click="goPage">
        <a-menu-item v-for="item in modules" :key="item.key">{{ item.label }}</a-menu-item>
      </a-menu>
    </a-layout-sider>

    <a-layout>
      <a-layout-header class="header-fixed">
        <span>{{ farmName }} · 运营中心</span>
        <a-space>
          <a-button @click="collapsed = !collapsed">{{ collapsed ? '展开菜单' : '收起菜单' }}</a-button>
          <a-button type="primary" danger @click="logout">退出登录</a-button>
        </a-space>
      </a-layout-header>
      <a-layout-content class="content-area">
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<style scoped>
.layout-wrap { min-height: 100vh; }
.sider-fixed {
  border-right: 1px solid #edf2ff;
  position: sticky;
  top: 0;
  left: 0;
  height: 100vh;
}
.brand {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: #2563eb;
}
.header-fixed {
  height: 64px;
  background: #fff;
  border-bottom: 1px solid #edf2ff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 5;
  padding: 0 20px;
}
.content-area {
  padding: 18px;
  min-height: calc(100vh - 64px);
}
</style>
