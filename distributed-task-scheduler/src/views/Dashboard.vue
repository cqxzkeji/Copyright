<template>
  <div class="dashboard">
    <header class="top-bar">
      <div class="title">分布式计算任务调度与监控</div>
      <div class="actions">
        <span class="badge">在线</span>
        <button class="ghost" @click="openProfile">用户中心</button>
        <button class="ghost" @click="logout">退出</button>
      </div>
    </header>
    <div class="layout">
      <aside class="sidebar">
        <nav>
          <RouterLink to="/tasks" class="nav-link" active-class="active">任务管理</RouterLink>
          <RouterLink to="/monitoring" class="nav-link" active-class="active">任务监控</RouterLink>
          <RouterLink to="/resources" class="nav-link" active-class="active">资源管理</RouterLink>
          <RouterLink to="/reports" class="nav-link" active-class="active">报告生成</RouterLink>
          <RouterLink to="/settings" class="nav-link" active-class="active">系统设置</RouterLink>
        </nav>
        <div class="sidebar-card">
          <div class="flex-between">
            <span>今日吞吐</span>
            <span class="chip">13.5k</span>
          </div>
          <div class="chart-bars">
            <div v-for="(v, idx) in chartData" :key="idx" class="bar" :style="{ height: `${v}%` }">
              {{ v }}%
            </div>
          </div>
        </div>
      </aside>
      <main class="content">
        <router-view />
      </main>
    </div>
    <div v-if="showProfile" class="modal-backdrop" @click.self="showProfile = false">
      <div class="modal">
        <header>用户中心</header>
        <div class="body">
          <p>当前用户：运维管理员</p>
          <p>角色：全局管理、审批、监控</p>
        </div>
        <div class="footer">
          <button @click="showProfile = false">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const chartData = [52, 78, 63, 88, 92, 74, 69];
const router = useRouter();
const showProfile = ref(false);

const logout = () => {
  sessionStorage.removeItem('dts-auth');
  router.push('/login');
};

const openProfile = () => {
  showProfile.value = true;
};
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 20px;
  background: #ffffffcc;
  backdrop-filter: blur(8px);
  border-bottom: 1px solid #e6edf7;
}

.title {
  font-size: 18px;
  font-weight: 800;
  color: #123a99;
}

.actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.ghost {
  border: 1px solid #d5e0f4;
  padding: 8px 12px;
  border-radius: 10px;
  background: #fff;
  color: #1f4fd1;
  font-weight: 700;
}

.layout {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 16px;
  padding: 16px;
}

.sidebar {
  background: #fff;
  border-radius: 14px;
  padding: 14px;
  box-shadow: 0 10px 30px rgba(65, 101, 174, 0.12);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sidebar-card {
  margin-top: auto;
  padding: 10px;
  border-radius: 12px;
  background: #f3f7ff;
}

.content {
  min-height: 70vh;
}
</style>
