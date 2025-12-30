<template>
  <div class="layout">
    <aside class="sider card">
      <div class="brand">
        <div class="logo">MW</div>
        <div>
          <div class="title">多仓配送</div>
          <div class="subtitle">协同调度</div>
        </div>
      </div>
      <nav>
        <router-link v-for="item in menus" :key="item.path" :to="item.path" class="nav-item" active-class="active">
          <span>{{ item.label }}</span>
          <small>{{ item.desc }}</small>
        </router-link>
      </nav>
    </aside>
    <main class="content">
      <header class="topbar card">
        <div>
          <div class="hello">欢迎，调度员</div>
          <div class="hint">选择功能模块进入工作</div>
        </div>
        <div class="toolbar">
          <button class="btn secondary" @click="showTip = true">操作提示</button>
          <button class="btn" @click="logout">退出</button>
        </div>
      </header>
      <section class="module card">
        <router-view />
      </section>
    </main>
    <div v-if="showTip" class="modal-mask" @click.self="showTip = false">
      <div class="modal">
        <div class="modal-header">
          <h3>导航提示</h3>
          <button class="btn secondary" @click="showTip = false">关闭</button>
        </div>
        <p>左侧菜单切换独立模块，所有操作为 modal 弹窗，保持轻量明亮的体验。</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const showTip = ref(false);

const menus = [
  { path: '/main/warehouse', label: '多仓中心与基础资料', desc: '仓库、客户、车辆资料' },
  { path: '/main/orders', label: '订单与需求管理', desc: '导入拆分与时效约束' },
  { path: '/main/dispatch', label: '车辆调度与路径优化', desc: '装载约束与VRP优化' },
  { path: '/main/execution', label: '执行监控与异常协同', desc: '轨迹、异常与改派' },
  { path: '/main/analytics', label: '数据分析与绩效报表', desc: '成本、效率与预警' }
];

const logout = () => {
  router.push('/login');
};
</script>

<style scoped>
.layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  min-height: 100vh;
  gap: 16px;
  padding: 16px;
}

.sider {
  position: sticky;
  top: 16px;
  height: calc(100vh - 32px);
  display: grid;
  align-content: start;
  gap: 16px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo {
  width: 48px;
  height: 48px;
  display: grid;
  place-items: center;
  border-radius: 14px;
  background: linear-gradient(135deg, #3b82f6, #22c55e);
  color: #fff;
  font-weight: 800;
  font-size: 18px;
}

.title {
  font-size: 18px;
  font-weight: 700;
}

.subtitle {
  color: #475569;
}

nav {
  display: grid;
  gap: 10px;
}

.nav-item {
  display: grid;
  gap: 4px;
  padding: 12px;
  border-radius: 12px;
  text-decoration: none;
  color: #0f172a;
  border: 1px solid transparent;
  transition: all 0.2s ease;
  background: linear-gradient(145deg, #fff, #f8fafc);
}

.nav-item small {
  color: #475569;
}

.nav-item:hover,
.nav-item.active {
  border-color: #bfdbfe;
  box-shadow: inset 0 0 0 1px #dbeafe;
}

.content {
  display: grid;
  gap: 16px;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.hello {
  font-size: 18px;
  font-weight: 700;
}

.hint {
  color: #475569;
}

.module {
  min-height: 70vh;
}

.toolbar {
  display: flex;
  gap: 10px;
}

@media (max-width: 900px) {
  .layout {
    grid-template-columns: 1fr;
  }
  .sider {
    position: relative;
    height: auto;
  }
}
</style>
