<template>
  <div class="layout">
    <aside class="sidebar">
      <h2>Mgoshort</h2>
      <nav>
        <router-link v-for="item in menu" :key="item.path" :to="item.path">{{ item.label }}</router-link>
      </nav>
      <button class="logout" @click="openLogoutModal">退出登录</button>
    </aside>
    <section class="content-window">
      <router-view />
    </section>

    <ModalDialog
      :visible="logoutVisible"
      title="确认退出"
      show-confirm
      @close="logoutVisible = false"
      @confirm="logout"
    >
      <p>确定退出当前账号并返回登录页吗？</p>
    </ModalDialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ModalDialog from '../components/ModalDialog.vue'

const router = useRouter()
const logoutVisible = ref(false)

const menu = [
  { label: '上传管理', path: '/main/upload' },
  { label: '视频播放', path: '/main/play' },
  { label: '互动评论', path: '/main/interaction' },
  { label: '搜索分类', path: '/main/search' },
  { label: '统计分析', path: '/main/analytics' }
]

const openLogoutModal = () => {
  logoutVisible.value = true
}

const logout = () => {
  localStorage.removeItem('mgoshort-auth')
  logoutVisible.value = false
  router.push('/login')
}
</script>

<style scoped>
.layout {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 240px 1fr;
}

.sidebar {
  background: #f8fbff;
  border-right: 1px solid #dbe6ff;
  padding: 22px 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

h2 {
  margin: 0 10px;
  color: #1d4ed8;
}

nav {
  display: grid;
  gap: 8px;
}

a {
  text-decoration: none;
  color: #365275;
  padding: 10px 12px;
  border-radius: 10px;
}

a.router-link-active {
  background: #2563eb;
  color: #fff;
}

.logout {
  margin-top: auto;
  border: none;
  border-radius: 10px;
  background: #eff4ff;
  color: #1f3a60;
  padding: 10px;
  cursor: pointer;
}

.content-window {
  padding: 18px;
}

@media (max-width: 900px) {
  .layout {
    grid-template-columns: 1fr;
  }

  .sidebar {
    border-right: none;
    border-bottom: 1px solid #dbe6ff;
  }

  nav {
    grid-template-columns: repeat(5, minmax(120px, 1fr));
    overflow-x: auto;
  }
}
</style>
