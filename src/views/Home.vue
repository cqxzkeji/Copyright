<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="logo">IR-FEA</div>
      <nav>
        <button class="nav-btn" :class="{ active: isActive('/home/upload') }" @click="go('/home/upload')">图像上传</button>
        <button class="nav-btn" :class="{ active: isActive('/home/processing') }" @click="go('/home/processing')">图像处理</button>
        <button class="nav-btn" :class="{ active: isActive('/home/features') }" @click="go('/home/features')">特征提取</button>
        <button class="nav-btn" :class="{ active: isActive('/home/results') }" @click="go('/home/results')">识别结果</button>
        <button class="nav-btn" :class="{ active: isActive('/home/analysis') }" @click="go('/home/analysis')">数据分析</button>
        <button class="nav-btn" :class="{ active: isActive('/home/settings') }" @click="go('/home/settings')">系统设置</button>
      </nav>
    </aside>
    <main class="content">
      <header class="topbar">
        <div class="breadcrumbs">图像识别与特征提取分析平台</div>
        <div class="actions">
          <button class="btn secondary" @click="showUser = true">用户信息</button>
          <button class="btn" @click="logout">退出</button>
        </div>
      </header>
      <section class="module-view">
        <router-view />
      </section>
    </main>
    <ModalDialog v-model="showUser" title="当前用户" confirm-text="关闭" @confirm="showUser = false">
      <p>工程账号：{{ profile.name }}</p>
      <p>角色：{{ profile.role }}</p>
    </ModalDialog>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import ModalDialog from '../components/ModalDialog.vue';

const router = useRouter();
const route = useRoute();
const showUser = ref(false);
const profile = reactive({ name: '分析员-01', role: '管理员' });

const go = (path) => router.push(path);
const isActive = (path) => route.path === path;
const logout = () => router.push('/login');
</script>

<style scoped>
.layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  min-height: 100vh;
}

.sidebar {
  background: #0ea5e9;
  color: #fff;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.logo {
  font-weight: 800;
  letter-spacing: 1px;
  font-size: 1.2rem;
}

.nav-btn {
  border: none;
  width: 100%;
  padding: 0.75rem 0.6rem;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  text-align: left;
  font-weight: 600;
  margin-bottom: 0.35rem;
  transition: background 0.2s ease, transform 0.1s ease;
}

.nav-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateX(2px);
}

.nav-btn.active {
  background: #fff;
  color: #0ea5e9;
}

.content {
  padding: 1rem 1.5rem 2rem;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.breadcrumbs {
  font-weight: 700;
  color: #0f172a;
}

.module-view {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 16px;
  padding: 1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  min-height: calc(100vh - 120px);
}

.actions {
  display: flex;
  gap: 0.5rem;
}

@media (max-width: 900px) {
  .layout {
    grid-template-columns: 1fr;
  }
  .sidebar {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
  }
  .nav-btn {
    flex: 1 1 45%;
    text-align: center;
  }
}
</style>
