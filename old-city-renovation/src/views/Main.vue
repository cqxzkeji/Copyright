<template>
  <div class="layout">
    <aside class="sidebar card">
      <div class="logo">
        <div class="dot"></div>
        <div>
          <p class="tip" style="margin: 0; font-weight: 700; color: #0f172a;">老旧城区改造</p>
          <small style="color: #6b7280;">提升管理控制台</small>
        </div>
      </div>
      <nav>
        <router-link v-for="item in menus" :key="item.path" :to="item.path" class="nav-item" active-class="active">
          {{ item.label }}
        </router-link>
      </nav>
      <div class="user card">
        <p style="margin: 0; font-weight: 700;">项目指挥部</p>
        <p class="tip">今日巡检 12 次 · 待办 4 项</p>
        <button class="btn secondary" @click="showNotice = true">公告</button>
      </div>
    </aside>
    <main class="content">
      <header class="topbar card">
        <div>
          <p class="badge">一键切换模块</p>
          <h2 style="margin: 6px 0 0;">老旧城区功能提升与改造管理系统</h2>
        </div>
        <div class="top-actions">
          <button class="btn secondary" @click="showUser">用户中心</button>
          <button class="btn" @click="logout">退出</button>
        </div>
      </header>
      <section class="card">
        <router-view />
      </section>
    </main>
    <div v-if="showNotice" class="modal-overlay" @click.self="showNotice = false">
      <div class="modal">
        <div class="section-title">
          <h3>建设提示</h3>
          <button class="btn secondary" @click="showNotice = false">关闭</button>
        </div>
        <ul>
          <li>施工单位需按周提交进度和影像资料。</li>
          <li>公众诉求 48 小时内必须闭环。</li>
          <li>更新统计分析模块中的资金拨付明细。</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const showNotice = ref(false);

const menus = [
  { label: '基础信息管理', path: '/main/base' },
  { label: '改造项目管理', path: '/main/project' },
  { label: '施工进度监管', path: '/main/construction' },
  { label: '公众反馈管理', path: '/main/feedback' },
  { label: '统计分析决策', path: '/main/analysis' }
];

const logout = () => {
  router.push('/login');
};

const showUser = () => {
  showNotice.value = true;
};
</script>

<style scoped>
.layout {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 16px;
  padding: 18px;
}

.sidebar {
  min-height: calc(100vh - 36px);
  display: grid;
  gap: 16px;
  align-content: start;
  position: sticky;
  top: 16px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo .dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: linear-gradient(135deg, #63b3ff, #7cf5ff);
}

.nav-item {
  display: block;
  padding: 12px 14px;
  margin-bottom: 8px;
  border-radius: 12px;
  background: #f6f9ff;
  font-weight: 600;
  color: #0f172a;
}

.nav-item.active {
  background: linear-gradient(135deg, #63b3ff, #7cf5ff);
  box-shadow: 0 12px 30px rgba(99, 179, 255, 0.35);
}

.user {
  background: #f8fbff;
  border: 1px dashed #dbe6ff;
}

.content {
  display: grid;
  gap: 12px;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.top-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

@media (max-width: 960px) {
  .layout {
    grid-template-columns: 1fr;
  }
  .sidebar {
    position: relative;
    min-height: auto;
  }
}
</style>
