<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="logo">饲料配方</div>
      <div class="nav-group">
        <router-link v-for="item in navs" :key="item.path" class="nav" :class="{ active: $route.path.includes(item.path) }" :to="item.path">
          <span>{{ item.name }}</span>
          <span class="tag">{{ item.desc }}</span>
        </router-link>
      </div>
      <button class="btn secondary" @click="openHelper">查看导航提示</button>
    </aside>
    <main class="content">
      <header class="content-header">
        <div>
          <p class="subtitle">共生人工鱼群算法驱动的饲料优化</p>
          <h2>主控台</h2>
        </div>
        <div class="header-actions">
          <div class="tag">安全登录 {{ user }}</div>
          <button class="btn" @click="openNotice">同步云端提示</button>
        </div>
      </header>
      <router-view />
    </main>
  </div>

  <div v-if="modal.open" class="modal-mask">
    <div class="modal-card">
      <h3>{{ modal.title }}</h3>
      <p style="margin: 0.25rem 0 0.5rem">{{ modal.message }}</p>
      <ul v-if="modal.type === 'nav'">
        <li>左侧导航切换五大功能模块。</li>
        <li>模块按钮均为弹窗操作，带有对应的表单或进度。</li>
        <li>顶部按钮可同步示例数据，确保演示流畅。</li>
      </ul>
      <div class="modal-actions">
        <button class="secondary" @click="modal.open = false">关闭</button>
        <button @click="modal.open = false">知道了</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';

const user = 'demo_admin';
const navs = [
  { name: '原料管理', path: '/main/ingredients', desc: '原料与营养维护' },
  { name: '目标约束', path: '/main/constraints', desc: '指标/规则' },
  { name: '算法优化', path: '/main/optimize', desc: 'AI求解' },
  { name: '方案评估', path: '/main/evaluate', desc: '对比分析' },
  { name: '发布导出', path: '/main/publish', desc: '应用落地' }
];

const modal = reactive({ open: false, title: '', message: '', type: '' });

const openHelper = () => {
  modal.open = true;
  modal.title = '导航提示';
  modal.message = '选择模块加载对应内容区，所有操作均以弹窗确认。';
  modal.type = 'nav';
};

const openNotice = () => {
  modal.open = true;
  modal.title = '同步云端';
  modal.message = '已连接示例云端，确保原料、约束、算法参数保持最新。';
  modal.type = 'notice';
};
</script>

<style scoped>
.layout {
  display: grid;
  grid-template-columns: 260px 1fr;
  min-height: 100vh;
}

.sidebar {
  background: #ffffff;
  border-right: 1px solid #e2e8f0;
  padding: 1.25rem;
  display: grid;
  gap: 1rem;
  align-content: start;
}

.logo {
  font-size: 1.35rem;
  font-weight: 800;
  color: #2563eb;
}

.nav-group {
  display: grid;
  gap: 0.85rem;
}

.nav {
  display: grid;
  gap: 0.35rem;
  padding: 0.75rem;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
}

.nav.active {
  border-color: #2563eb;
  box-shadow: 0 12px 30px rgba(37, 99, 235, 0.15);
  background: #eef2ff;
}

.content {
  padding: 1.25rem 1.5rem 2rem;
}

.content-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}

.subtitle {
  margin: 0;
  color: #475569;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

@media (max-width: 920px) {
  .layout {
    grid-template-columns: 1fr;
  }
  .sidebar {
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    grid-auto-rows: 1fr;
  }
}
</style>
