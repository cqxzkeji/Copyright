<template>
  <div class="layout-shell">
    <header class="layout-header">
      <div>
        <p class="eyebrow">多场景协同中枢</p>
        <h2>高集成装备控制与运维平台</h2>
      </div>
      <div class="header-actions">
        <button class="secondary-btn" @click="openMessage('环境监测', '所有节点指标均在安全范围内。')">环境诊断</button>
        <button class="primary-btn" @click="logout">安全退出</button>
      </div>
    </header>
    <div class="layout-body">
      <aside>
        <nav>
          <RouterLink v-for="item in menu" :key="item.path" :to="item.path" class="nav-link" active-class="active">
            <span>{{ item.label }}</span>
            <small>{{ item.desc }}</small>
          </RouterLink>
        </nav>
        <button class="secondary-btn broadcast" @click="openMessage('指挥公告', '全网巡检将在 22:00 自动执行，请提前确认无人值守策略。')">
          发布广播
        </button>
      </aside>
      <main>
        <router-view />
      </main>
    </div>
    <BaseModal v-if="modal" :title="modal.title" @close="modal = null">
      {{ modal.message }}
    </BaseModal>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import BaseModal from '../components/BaseModal.vue';

const router = useRouter();
const modal = ref(null);

const menu = [
  { path: '/app/dashboard', label: '系统监控', desc: '数据态势' },
  { path: '/app/control', label: '设备控制', desc: '调度执行' },
  { path: '/app/maintenance', label: '运维支持', desc: '巡检诊断' },
  { path: '/app/analytics', label: '数据分析', desc: '辅助决策' },
  { path: '/app/security', label: '平台安全', desc: '防护预警' }
];

const openMessage = (title, message) => {
  modal.value = { title, message };
};

const logout = () => {
  openMessage('退出提示', '已断开与指控中心的加密信道。');
  setTimeout(() => router.push('/login'), 600);
};
</script>

<style scoped>
.layout-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  gap: 1.5rem;
}

.layout-header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  background: rgba(15, 23, 42, 0.75);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 1.5rem 2rem;
}

.eyebrow {
  color: var(--muted);
  letter-spacing: 3px;
  text-transform: uppercase;
  margin: 0;
}

h2 {
  margin: 0.3rem 0 0;
}

.layout-body {
  display: flex;
  flex: 1;
  gap: 1.5rem;
}

aside {
  width: 280px;
  background: rgba(15, 23, 42, 0.75);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

nav {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.nav-link {
  display: flex;
  flex-direction: column;
  padding: 0.85rem 1rem;
  border-radius: 16px;
  border: 1px solid transparent;
  text-decoration: none;
  color: var(--muted);
  background: rgba(255, 255, 255, 0.02);
}

.nav-link small {
  color: rgba(255, 255, 255, 0.5);
}

.nav-link.active {
  border-color: rgba(5, 195, 221, 0.5);
  color: #fff;
  background: rgba(5, 195, 221, 0.15);
}

main {
  flex: 1;
  background: rgba(15, 23, 42, 0.75);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 1.5rem;
  display: flex;
}

main > * {
  flex: 1;
}

.header-actions {
  display: flex;
  gap: 0.8rem;
  align-items: center;
}

.broadcast {
  width: 100%;
}

@media (max-width: 960px) {
  .layout-body {
    flex-direction: column;
  }

  aside {
    width: 100%;
    flex-direction: column;
  }
}
</style>
