<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="logo">Hexapod VS</div>
      <nav>
        <router-link to="/main/device" class="nav-item" active-class="active">设备接入</router-link>
        <router-link to="/main/vision" class="nav-item" active-class="active">视觉与标定</router-link>
        <router-link to="/main/control" class="nav-item" active-class="active">视觉伺服</router-link>
        <router-link to="/main/task" class="nav-item" active-class="active">任务管理</router-link>
        <router-link to="/main/analysis" class="nav-item" active-class="active">数据分析</router-link>
      </nav>
      <div class="card quick-action">
        <p>快速提示</p>
        <button @click="showHelp = true">查看操作提示</button>
      </div>
    </aside>
    <main class="content">
      <header class="content-header">
        <h2>六足机器人视觉伺服指挥台</h2>
        <div class="flex" style="align-items: center">
          <div class="tag">
            <span>联机</span>
            <span class="status-ok">连接正常</span>
          </div>
          <button @click="showProfile = true">用户中心</button>
        </div>
      </header>
      <router-view />
    </main>
  </div>

  <div v-if="showHelp" class="modal-overlay" @click.self="showHelp = false">
    <div class="modal">
      <h3>操作提示</h3>
      <ul>
        <li>左侧切换功能模块，右侧加载对应窗口。</li>
        <li>每个按钮提供对应功能弹窗，所有弹窗均为模态。</li>
        <li>保持亮色主题与自适应布局，适配大屏与笔记本。</li>
      </ul>
      <div class="flex-between" style="margin-top: 10px">
        <span class="badge">演示模式</span>
        <button @click="showHelp = false">关闭</button>
      </div>
    </div>
  </div>

  <div v-if="showProfile" class="modal-overlay" @click.self="showProfile = false">
    <div class="modal">
      <h3>用户中心</h3>
      <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));">
        <div class="card">
          <p class="badge">当前用户</p>
          <h4>高级操作员</h4>
          <p>角色：视觉伺服与任务调度</p>
        </div>
        <div class="card">
          <p class="badge">安全策略</p>
          <p>单点登录，操作日志已启用，超时锁屏 15 分钟。</p>
          <button @click="logout">退出登录</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const showHelp = ref(false);
const showProfile = ref(false);
const router = useRouter();

const logout = () => {
  router.push('/login');
};
</script>

<style scoped>
.layout {
  display: grid;
  grid-template-columns: 260px 1fr;
  min-height: 100vh;
}

.sidebar {
  background: #eef5ff;
  padding: 18px;
  border-right: 1px solid var(--border);
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: 16px;
  width: 260px;
  min-width: 260px;
  max-width: 260px;
}

.logo {
  font-weight: 800;
  font-size: 20px;
}

nav {
  display: grid;
  gap: 10px;
  width: 100%;
}

.nav-item {
  padding: 12px 14px;
  border-radius: 10px;
  background: #fff;
  border: 1px solid var(--border);
  font-weight: 600;
  display: block;
}

.nav-item.active {
  background: #e8f3ff;
  border-color: #90caf9;
  color: #0b5394;
}

.quick-action {
  display: grid;
  gap: 10px;
}

.content {
  padding: 20px;
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 16px;
}

.content-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

@media (max-width: 900px) {
  .layout {
    grid-template-columns: 260px 1fr;
    overflow-x: auto;
  }
  .sidebar {
    grid-template-rows: auto auto;
    grid-auto-rows: auto;
  }
}
</style>
