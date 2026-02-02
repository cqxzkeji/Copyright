<template>
  <div class="app-shell" :class="{ 'is-login': isLogin }">
    <aside v-if="!isLogin" class="sidebar">
      <div class="brand">
        <div class="brand-icon">CQ</div>
        <div>
          <p class="brand-title">课堂质量诊断</p>
          <p class="brand-subtitle">LSTM · 注意力机制</p>
        </div>
      </div>
      <nav class="menu">
        <RouterLink v-for="item in menu" :key="item.path" :to="item.path" class="menu-item">
          <span>{{ item.label }}</span>
        </RouterLink>
      </nav>
      <div class="sidebar-footer">
        <div class="tag">在线监测中</div>
        <p>数据流延迟 0.6s</p>
      </div>
    </aside>
    <div class="main">
      <header v-if="!isLogin" class="topbar">
        <div>
          <h1>{{ currentTitle }}</h1>
          <p>实时课堂教学质量诊断平台</p>
        </div>
        <div class="top-actions">
          <button class="secondary-btn" @click="openNotice">系统公告</button>
          <button class="primary-btn" @click="openProfile">教师中心</button>
        </div>
      </header>
      <RouterView />
    </div>

    <div v-if="noticeModal" class="modal-mask" role="dialog" aria-modal="true">
      <div class="modal">
        <h3>平台公告</h3>
        <p>课堂质量诊断系统已接入多模态采集通道，支持 5G 教室实时分析。</p>
        <div class="modal-actions">
          <button class="secondary-btn" @click="noticeModal = false">关闭</button>
        </div>
      </div>
    </div>

    <div v-if="profileModal" class="modal-mask" role="dialog" aria-modal="true">
      <div class="modal">
        <h3>教师中心</h3>
        <p>查看本学期课堂表现与教学改进建议。</p>
        <div class="modal-form">
          <label>
            当前教师
            <input value="李老师" readonly />
          </label>
          <label>
            当前课程
            <input value="高等数学（A）" readonly />
          </label>
        </div>
        <div class="modal-actions">
          <button class="secondary-btn" @click="profileModal = false">返回</button>
          <button class="primary-btn" @click="profileModal = false">进入中心</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const noticeModal = ref(false);
const profileModal = ref(false);

const menu = [
  { label: '课堂质量概览', path: '/dashboard' },
  { label: '数据采集与处理', path: '/data-collection' },
  { label: 'LSTM 训练与推理', path: '/lstm-training' },
  { label: '注意力机制优化', path: '/attention' },
  { label: '实时诊断反馈', path: '/real-time' },
  { label: '可视化分析', path: '/visualization' },
  { label: '报告生成中心', path: '/report' }
];

const isLogin = computed(() => route.name === 'login');
const currentTitle = computed(() => {
  const match = menu.find((item) => item.path === route.path);
  return match?.label ?? '课堂质量概览';
});

const openNotice = () => {
  noticeModal.value = true;
};

const openProfile = () => {
  profileModal.value = true;
};
</script>

<style scoped>
.app-shell {
  display: grid;
  grid-template-columns: 260px 1fr;
  min-height: 100vh;
}

.app-shell.is-login {
  grid-template-columns: 1fr;
}

.sidebar {
  background: #ffffff;
  padding: 24px 18px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  border-right: 1px solid #eef1f7;
  min-width: 260px;
}

.brand {
  display: flex;
  gap: 12px;
  align-items: center;
}

.brand-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, #4c6fff, #7ab8ff);
  color: #fff;
  display: grid;
  place-items: center;
  font-weight: 700;
}

.brand-title {
  font-weight: 600;
}

.brand-subtitle {
  font-size: 12px;
  color: #6b7280;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.menu-item {
  padding: 10px 12px;
  border-radius: 10px;
  font-weight: 500;
  color: #4b5563;
  transition: background 0.2s ease;
}

.menu-item.router-link-active {
  background: #eef1ff;
  color: #3554d1;
}

.sidebar-footer {
  margin-top: auto;
  font-size: 12px;
  color: #6b7280;
  display: grid;
  gap: 8px;
}

.main {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.topbar {
  padding: 20px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #ffffff;
  border-bottom: 1px solid #eef1f7;
}

.topbar h1 {
  font-size: 22px;
  margin-bottom: 4px;
}

.topbar p {
  color: #6b7280;
  font-size: 13px;
}

.top-actions {
  display: flex;
  gap: 10px;
}

@media (max-width: 1100px) {
  .app-shell {
    grid-template-columns: 220px 1fr;
  }
}

@media (max-width: 900px) {
  .app-shell {
    grid-template-columns: 1fr;
  }

  .sidebar {
    position: sticky;
    top: 0;
    z-index: 10;
    flex-direction: row;
    align-items: center;
    overflow-x: auto;
    min-width: 100%;
  }

  .menu {
    flex-direction: row;
    gap: 8px;
  }

  .menu-item {
    white-space: nowrap;
  }
}
</style>
