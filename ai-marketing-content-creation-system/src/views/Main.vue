<template>
  <div class="shell">
    <aside class="sidebar">
      <div class="brand">
        <strong>AI Marketing Hub</strong>
        <span>协同控制台</span>
      </div>
      <nav>
        <button @click="navigate('content')">文案创作</button>
        <button @click="navigate('visual')">视觉素材</button>
        <button @click="navigate('collaboration')">协作分享</button>
        <button @click="navigate('cross-platform')">广告适配</button>
        <button @click="navigate('analytics')">数据分析</button>
      </nav>
      <div class="status-card">
        <p>今日创意协作</p>
        <h3>{{ collaborationCount }} 个项目</h3>
        <div class="status-actions">
          <button class="tiny" @click="showNotification('今日计划已同步至团队邮箱')">通知</button>
          <button class="tiny" @click="showNotification('日程提醒已设置')">提醒</button>
        </div>
      </div>
    </aside>
    <section class="main">
      <header class="main-header">
        <div>
          <h2>{{ headerTitle }}</h2>
          <p>覆盖文案、视觉、发布与优化的全链路协作场景</p>
        </div>
        <button class="logout" @click="handleLogout">退出登录</button>
      </header>
      <div class="content">
        <router-view @open-modal="openModal" />
      </div>
    </section>
  </div>
  <div v-if="modal.visible" class="modal-backdrop" @click.self="closeModal">
    <div class="modal">
      <h3>{{ modal.title }}</h3>
      <p>{{ modal.message }}</p>
      <button @click="closeModal">知道了</button>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const collaborationCount = ref(12);
const modal = reactive({ visible: false, title: '', message: '' });

const headerTitle = computed(() => {
  const map = {
    content: '智能文案创作与优化中心',
    visual: '视觉素材生成与编辑工坊',
    collaboration: '协作平台与创意分享空间',
    'cross-platform': '跨平台广告适配与发布管理',
    analytics: '数据分析与效果优化实验室'
  };
  const key = route.path.split('/').pop();
  return map[key] || '智能创意工作台';
});

const navigate = (segment) => {
  router.push(`/workspace/${segment}`);
};

const handleLogout = () => {
  openModal('退出提示', '您已安全退出协同平台，欢迎随时回来继续创作。');
  setTimeout(() => router.push('/login'), 800);
};

const openModal = (title, message) => {
  modal.visible = true;
  modal.title = title;
  modal.message = message;
};

const closeModal = () => {
  modal.visible = false;
};

const showNotification = (message) => {
  openModal('系统提示', message);
};

watch(
  () => route.path,
  () => {
    collaborationCount.value = Math.floor(10 + Math.random() * 5);
  }
);
</script>

<style scoped>
.shell {
  display: flex;
  min-height: 100vh;
  background: #f8fafc;
  color: #0f172a;
}

.sidebar {
  width: 280px;
  background: #0f172a;
  color: white;
  display: flex;
  flex-direction: column;
  padding: 2rem 1.5rem;
  gap: 1.5rem;
}

.brand {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.brand span {
  font-size: 0.85rem;
  color: #94a3b8;
}

nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

nav button {
  border: none;
  background: #1e293b;
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  text-align: left;
  cursor: pointer;
  transition: background 0.2s;
}

nav button:hover {
  background: #2563eb;
}

.status-card {
  background: #1e293b;
  padding: 1rem;
  border-radius: 16px;
}

.status-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.tiny {
  flex: 1;
  background: rgba(255, 255, 255, 0.15);
  color: white;
  border: none;
  border-radius: 10px;
  padding: 0.35rem 0.5rem;
  cursor: pointer;
}

.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 2rem;
  gap: 1.5rem;
}

.main-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 1.5rem;
  border-radius: 18px;
  box-shadow: 0 20px 45px rgba(15, 23, 42, 0.08);
}

.logout {
  border: none;
  border-radius: 999px;
  background: #ef4444;
  color: white;
  padding: 0.65rem 1.5rem;
  cursor: pointer;
}

.content {
  flex: 1;
  background: white;
  border-radius: 24px;
  padding: 1.5rem;
  box-shadow: inset 0 0 0 1px #e2e8f0;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: white;
  padding: 2rem;
  border-radius: 20px;
  width: min(420px, 90vw);
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.4);
  text-align: center;
}

.modal button {
  margin-top: 1.5rem;
  border: none;
  border-radius: 999px;
  padding: 0.75rem 1.5rem;
  background: #2563eb;
  color: white;
  cursor: pointer;
}

@media (max-width: 960px) {
  .shell {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 1rem;
  }

  nav {
    flex-direction: row;
    flex-wrap: wrap;
  }

  nav button {
    flex: 1 0 40%;
  }
}
</style>
