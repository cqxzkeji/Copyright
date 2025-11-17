<template>
  <div class="layout">
    <aside>
      <div class="brand">
        <span>BD</span>
        <strong>流计算中心</strong>
      </div>
      <nav>
        <button
          v-for="item in menu"
          :key="item.path"
          :class="{ active: $route.path.includes(item.path) }"
          @click="go(item.path)"
        >
          <i :class="item.icon"></i>
          {{ item.label }}
        </button>
      </nav>
      <div class="logout">
        <button class="logout-btn" @click="logout">退出登陆</button>
      </div>
    </aside>
    <main>
      <header>
        <h2>{{ currentTitle }}</h2>
        <div class="indicators">
          <div class="stat" v-for="stat in stats" :key="stat.label">
            <p>{{ stat.label }}</p>
            <strong>{{ stat.value }}</strong>
            <small>{{ stat.desc }}</small>
          </div>
        </div>
      </header>
      <section class="content">
        <RouterView />
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();

const menu = [
  { label: '数据采集', path: '/dashboard/data-collection', icon: 'ri-cloud-line' },
  { label: '流式计算', path: '/dashboard/data-processing', icon: 'ri-cpu-line' },
  { label: '数据存储', path: '/dashboard/data-storage', icon: 'ri-database-2-line' },
  { label: '实时可视化', path: '/dashboard/visualization', icon: 'ri-bar-chart-2-line' },
  { label: '监控与告警', path: '/dashboard/monitoring', icon: 'ri-notification-2-line' }
];

const stats = [
  { label: '实时吞吐', value: '850K msg/s', desc: 'Kafka 集群' },
  { label: '计算延迟', value: '1.5 s', desc: 'Flink 任务' },
  { label: '存储可用', value: '98%', desc: '对象存储' }
];

const currentTitle = computed(() => {
  const item = menu.find((m) => route.path.includes(m.path));
  return item ? item.label : '概览';
});

const go = (path) => router.push(path);

const logout = () => {
  localStorage.removeItem('bd-login');
  router.push('/login');
};
</script>

<style scoped>
@import 'https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css';

.layout {
  display: flex;
  min-height: 100vh;
  background: #f6f7fb;
  color: #0f172a;
}
aside {
  width: 260px;
  background: #0f172a;
  color: #fff;
  display: flex;
  flex-direction: column;
  padding: 2rem 1.5rem;
  gap: 2rem;
}
.brand {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 1.1rem;
}
.brand span {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: #22d3ee;
  color: #0f172a;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}
nav {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
nav button {
  border: none;
  border-radius: 14px;
  padding: 0.75rem 1rem;
  text-align: left;
  background: transparent;
  color: #cbd5f5;
  display: flex;
  gap: 0.5rem;
  align-items: center;
  cursor: pointer;
}
nav button.active,
nav button:hover {
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
}
main {
  flex: 1;
  padding: 2rem;
  display: flex;
  flex-direction: column;
}
header {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.indicators {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}
.stat {
  flex: 1;
  min-width: 180px;
  background: #fff;
  border-radius: 18px;
  padding: 1rem;
  box-shadow: 0 15px 30px rgba(15, 23, 42, 0.08);
}
.stat p {
  margin: 0;
  color: #64748b;
}
.stat strong {
  font-size: 1.4rem;
}
.stat small {
  color: #94a3b8;
}
.content {
  margin-top: 1.5rem;
  flex: 1;
}
.logout {
  margin-top: auto;
}
.logout-btn {
  width: 100%;
  padding: 0.8rem;
  border-radius: 14px;
  border: none;
  background: rgba(248, 250, 252, 0.15);
  color: #fff;
  cursor: pointer;
}
@media (max-width: 960px) {
  .layout {
    flex-direction: column;
  }
  aside {
    width: 100%;
    flex-direction: row;
    flex-wrap: wrap;
  }
  nav {
    flex-direction: row;
    flex-wrap: wrap;
  }
  nav button {
    flex: 1 1 45%;
  }
}
</style>
