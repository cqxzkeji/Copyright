<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="brand">智能信息服务系统</div>
      <nav>
        <router-link to="/app/data-collection" class="nav-item" active-class="active">数据采集</router-link>
        <router-link to="/app/data-processing" class="nav-item" active-class="active">数据处理与分析</router-link>
        <router-link to="/app/info-service" class="nav-item" active-class="active">信息服务</router-link>
        <router-link to="/app/visualization" class="nav-item" active-class="active">可视化与报表</router-link>
        <router-link to="/app/system-management" class="nav-item" active-class="active">系统管理</router-link>
      </nav>
    </aside>
    <main class="main">
      <header class="topbar">
        <div>
          <p class="subtitle">欢迎回来</p>
          <h2>智能信息服务与数据处理中心</h2>
        </div>
        <div class="top-actions">
          <button @click="showNotify = true">消息播报</button>
          <button class="ghost" @click="showProfile = true">账号资料</button>
        </div>
      </header>
      <section class="content">
        <router-view />
      </section>
    </main>
    <modal-dialog v-model="showNotify" title="系统通知">
      <ul class="bullet">
        <li>数据采集节点已全部恢复在线。</li>
        <li>今日共生成 12 份处理报告，请及时查看。</li>
        <li>安全补丁将在凌晨 2 点自动安装。</li>
      </ul>
    </modal-dialog>
    <modal-dialog v-model="showProfile" title="账户资料">
      <div class="profile">
        <div>
          <p class="muted">当前用户</p>
          <h3>运营管理员</h3>
          <p>权限：全局配置、数据导出、报表审核</p>
        </div>
        <div class="flex" style="margin-top: 10px;">
          <button @click="showReset = true">重置密码</button>
          <button class="ghost" @click="showProfile = false">关闭</button>
        </div>
      </div>
    </modal-dialog>
    <modal-dialog v-model="showReset" title="重置密码" width="420px">
      <div class="form-grid">
        <label>新密码<input type="password" placeholder="输入新密码" /></label>
        <label>确认密码<input type="password" placeholder="再次输入" /></label>
      </div>
      <template #footer>
        <button class="ghost" @click="showReset = false">取消</button>
        <button @click="confirmReset">确认重置</button>
      </template>
    </modal-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ModalDialog from './ModalDialog.vue';

const showNotify = ref(false);
const showProfile = ref(false);
const showReset = ref(false);

const confirmReset = () => {
  showReset.value = false;
  showProfile.value = false;
  showNotify.value = true;
};
</script>

<style scoped>
.layout {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 240px 1fr;
  background: #eef3fb;
}

.sidebar {
  background: #ffffff;
  padding: 18px;
  box-shadow: 12px 0 30px rgba(30, 136, 229, 0.08);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.brand {
  font-weight: 800;
  font-size: 18px;
  color: var(--primary);
  margin-bottom: 10px;
}

.nav-item {
  display: block;
  padding: 12px 14px;
  border-radius: 10px;
  color: #334155;
  margin-bottom: 6px;
  background: #f5f7fb;
  font-weight: 700;
}

.nav-item.active {
  background: linear-gradient(90deg, #1e88e5, #4fc3f7);
  color: #fff;
  box-shadow: var(--shadow);
}

.main {
  padding: 16px 20px;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--card);
  border-radius: var(--border-radius);
  padding: 16px;
  box-shadow: var(--shadow);
}

.subtitle {
  margin: 0;
  color: #64748b;
  font-weight: 700;
}

.top-actions {
  display: flex;
  gap: 12px;
}

.top-actions .ghost {
  background: #f1f5f9;
  color: #1f2933;
}

.content {
  margin-top: 16px;
}

button.ghost {
  background: #f1f5f9;
  color: #1f2933;
}

.bullet {
  margin: 0;
  padding-left: 18px;
  line-height: 1.8;
}

.profile .muted {
  margin: 0;
  color: #6b7280;
}

.form-grid {
  display: grid;
  gap: 12px;
}

.form-grid input {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #d7deea;
}

@media (max-width: 900px) {
  .layout {
    grid-template-columns: 1fr;
  }

  .sidebar {
    flex-direction: row;
    gap: 8px;
    overflow-x: auto;
    box-shadow: none;
  }

  .nav-item {
    white-space: nowrap;
  }

  .topbar {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}
</style>
