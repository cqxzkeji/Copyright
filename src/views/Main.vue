<template>
  <div class="main-layout">
    <aside class="sidebar">
      <div class="logo">
        <h2>气凝胶多尺度设计</h2>
        <span>工程版</span>
      </div>
      <nav>
        <router-link to="/main/materials">材料库与组分建模</router-link>
        <router-link to="/main/multiscale">多尺度结构生成</router-link>
        <router-link to="/main/simulation">性能仿真与等效计算</router-link>
        <router-link to="/main/optimization">设计优化与配方推荐</router-link>
        <router-link to="/main/validation">验证评估与报告发布</router-link>
      </nav>
      <div class="sidebar-footer">
        <button class="btn secondary" @click="showTip = true">系统提示</button>
      </div>
    </aside>
    <section class="content">
      <header class="topbar">
        <div>
          <h1>纤维增强气凝胶复合材料多尺度设计软件</h1>
          <p>轻量化、多尺度耦合、可追溯设计工作台</p>
        </div>
        <div class="topbar-actions">
          <button class="btn ghost" @click="showStatus = true">运行状态</button>
          <button class="btn" @click="showProfile = true">账户信息</button>
        </div>
      </header>
      <main class="workspace">
        <router-view />
      </main>
    </section>

    <BaseModal
      v-if="showTip"
      title="系统提示"
      description="模块菜单固定宽度，支持快速跳转与进度同步。"
      @close="showTip = false"
      @confirm="showTip = false"
    >
      <ul class="modal-list">
        <li>支持跨尺度参数同步。</li>
        <li>所有操作自动记录在版本日志。</li>
        <li>仿真队列可暂停与恢复。</li>
      </ul>
    </BaseModal>

    <BaseModal
      v-if="showStatus"
      title="运行状态"
      description="当前任务队列与资源占用情况。"
      @close="showStatus = false"
      @confirm="showStatus = false"
    >
      <div class="progress-section">
        <p>仿真队列：8/12</p>
        <div class="progress-bar"><span :style="{ width: '68%' }"></span></div>
        <p>数据同步：完成</p>
        <div class="progress-bar"><span :style="{ width: '100%' }"></span></div>
      </div>
    </BaseModal>

    <BaseModal
      v-if="showProfile"
      title="账户信息"
      description="当前登录角色与权限。"
      @close="showProfile = false"
      @confirm="showProfile = false"
    >
      <div class="profile-grid">
        <div><strong>角色：</strong> 材料设计工程师</div>
        <div><strong>权限：</strong> 读写、仿真、导出</div>
        <div><strong>上次登录：</strong> 2024-06-18 09:12</div>
      </div>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BaseModal from '../components/BaseModal.vue'

const showTip = ref(false)
const showStatus = ref(false)
const showProfile = ref(false)
</script>

<style scoped>
.main-layout {
  display: grid;
  grid-template-columns: 260px 1fr;
  min-height: 100vh;
}

.sidebar {
  background: #ffffff;
  border-right: 1px solid var(--border);
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.logo h2 {
  font-size: 18px;
}

.logo span {
  color: var(--muted);
  font-size: 12px;
}

nav {
  display: grid;
  gap: 10px;
}

nav a {
  padding: 10px 12px;
  border-radius: 12px;
  font-size: 14px;
  color: var(--muted);
  background: transparent;
  transition: all 0.2s ease;
}

nav a.router-link-active {
  background: #eef4ff;
  color: var(--primary);
  font-weight: 600;
}

.sidebar-footer {
  margin-top: auto;
}

.content {
  display: flex;
  flex-direction: column;
  padding: 24px;
  gap: 20px;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  background: #ffffff;
  padding: 16px 20px;
  border-radius: 16px;
  border: 1px solid var(--border);
}

.topbar p {
  color: var(--muted);
  font-size: 13px;
}

.topbar-actions {
  display: flex;
  gap: 12px;
}

.workspace {
  flex: 1;
}

.modal-list {
  display: grid;
  gap: 6px;
  color: var(--muted);
}

.profile-grid {
  display: grid;
  gap: 8px;
  font-size: 14px;
}

.progress-section {
  display: grid;
  gap: 10px;
}

@media (max-width: 1024px) {
  .main-layout {
    grid-template-columns: 1fr;
  }

  .sidebar {
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
  }

  nav {
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  }
}
</style>
