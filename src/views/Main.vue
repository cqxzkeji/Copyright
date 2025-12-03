<template>
  <div class="shell">
    <aside class="sidebar">
      <div class="brand">优特钢销售标准</div>
      <nav>
        <router-link to="/main/standards" class="nav-item" active-class="active">技术标准管理</router-link>
        <router-link to="/main/sales" class="nav-item" active-class="active">销售跟踪</router-link>
        <router-link to="/main/orders" class="nav-item" active-class="active">订单处理</router-link>
        <router-link to="/main/quality" class="nav-item" active-class="active">质量控制</router-link>
        <router-link to="/main/analytics" class="nav-item" active-class="active">数据分析</router-link>
      </nav>
    </aside>
    <section class="content">
      <header class="top-bar">
        <div class="title">欢迎来到标准化运营中心</div>
        <div class="actions">
          <button class="secondary-btn" @click="showNotice = true">公告</button>
          <button class="primary-btn" @click="logout">退出</button>
        </div>
      </header>
      <div class="main-body">
        <router-view />
      </div>
    </section>
  </div>
  <div v-if="showNotice" class="modal-mask">
    <div class="modal-container">
      <div class="modal-header">
        <h3>系统公告</h3>
        <button class="secondary-btn" @click="showNotice = false">关闭</button>
      </div>
      <p>系统所有按钮均提供弹窗反馈，便于演示业务流程的关键环节。</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const showNotice = ref(false)

const logout = () => {
  localStorage.removeItem('yutegang-token')
  router.replace('/login')
}
</script>

<style scoped>
.shell {
  display: grid;
  grid-template-columns: 260px 1fr;
  min-height: 100vh;
}

.sidebar {
  background: linear-gradient(180deg, #eef2ff, #e0f2fe);
  padding: 24px 18px;
  border-right: 1px solid #e5e7eb;
}

.brand {
  font-weight: 800;
  font-size: 18px;
  color: #1e3a8a;
  margin-bottom: 20px;
}

nav {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.nav-item {
  padding: 12px 14px;
  border-radius: 12px;
  color: #1f2937;
  background: #fff;
  border: 1px solid transparent;
  font-weight: 600;
}

.nav-item.active {
  background: linear-gradient(120deg, #c7d2fe, #bfdbfe);
  color: #1e3a8a;
  border-color: #a5b4fc;
}

.content {
  display: flex;
  flex-direction: column;
  background: #f4f7fb;
}

.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 22px;
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
}

.title {
  font-size: 18px;
  font-weight: 700;
  color: #1e3a8a;
}

.main-body {
  padding: 20px 24px;
  overflow: auto;
  flex: 1;
}

.actions {
  display: flex;
  gap: 10px;
}
</style>
