<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="brand">
        <span class="chip">在线</span>
        <h2>路侧感知融合</h2>
        <p>Transformer 边缘计算集群</p>
      </div>
      <nav class="nav">
        <button class="primary-btn" @click="go('data-collection')">数据采集与传感器接入</button>
        <button class="primary-btn" @click="go('data-processing')">数据预处理与融合</button>
        <button class="primary-btn" @click="go('perception-analysis')">感知分析与目标检测</button>
        <button class="primary-btn" @click="go('fusion-algorithm')">融合算法与结果计算</button>
        <button class="primary-btn" @click="go('visualization')">可视化与决策支持</button>
        <button class="secondary" @click="showSession = true">会话状态</button>
      </nav>
    </aside>
    <main class="content">
      <header class="topbar">
        <div>
          <h1>城市道路场景</h1>
          <p>模块化装配：拖拉式加载各独立功能模块</p>
        </div>
        <div class="user-actions">
          <button class="primary-btn" @click="showAnnouncement = true">公告</button>
          <button class="primary-btn" @click="logout">退出</button>
        </div>
      </header>
      <section class="module-view">
        <router-view />
      </section>
    </main>

    <div v-if="showSession" class="modal-backdrop" @click.self="showSession = false">
      <div class="modal-content">
        <h3>当前会话</h3>
        <p>令牌：{{ token }}</p>
        <p>角色：路侧融合管理员</p>
        <p>加载策略：按需加载，每个模块独立渲染</p>
        <button class="primary-btn" @click="showSession = false">关闭</button>
      </div>
    </div>

    <div v-if="showAnnouncement" class="modal-backdrop" @click.self="showAnnouncement = false">
      <div class="modal-content">
        <h3>系统公告</h3>
        <p>本版本聚焦 Transformer 编排、传感器多源对齐与在线决策。</p>
        <button class="primary-btn" @click="showAnnouncement = false">我已知晓</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const token = computed(() => sessionStorage.getItem('token') || '未登录');
const showSession = ref(false);
const showAnnouncement = ref(false);

const go = (path) => {
  router.push(`/main/${path}`);
};

const logout = () => {
  sessionStorage.removeItem('token');
  router.push('/');
};
</script>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
  gap: 18px;
  padding: 18px;
}

.sidebar {
  width: 300px;
  background: #ffffff;
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.brand h2 {
  margin: 6px 0 2px;
}

.brand p {
  margin: 0;
  color: #6b7280;
}

.nav {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.secondary {
  background: #e5e7eb;
  border: none;
  padding: 10px 16px;
  border-radius: 10px;
  font-weight: 600;
}

.content {
  flex: 1;
  background: #ffffff;
  border-radius: 18px;
  padding: 18px;
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.topbar h1 {
  margin: 0;
}

.user-actions {
  display: flex;
  gap: 10px;
}

.module-view {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
