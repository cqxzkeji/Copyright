<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="brand">
        <div class="logo">IPM</div>
        <div>
          <p class="title">智能项目管理</p>
          <span class="subtitle">大数据驱动平台</span>
        </div>
      </div>
      <nav class="menu">
        <RouterLink v-for="item in menuItems" :key="item.path" :to="item.path" class="menu-item">
          <span>{{ item.label }}</span>
        </RouterLink>
      </nav>
      <div class="sidebar-footer">
        <button class="ghost-btn" @click="openNotice">系统通知</button>
        <button class="primary-btn" @click="openLogout">安全退出</button>
      </div>
    </aside>
    <main class="main">
      <header class="topbar">
        <div>
          <h1>项目管理控制台</h1>
          <p>实时掌控项目状态、资源与风险。</p>
        </div>
        <div class="top-actions">
          <button class="outline-btn" @click="openQuick">快捷新建</button>
          <button class="primary-btn" @click="openReport">生成日报</button>
        </div>
      </header>
      <section class="content">
        <RouterView />
      </section>
    </main>
    <ModalBase :show="showQuick" title="快捷新建" @close="showQuick = false">
      <div class="form-grid">
        <label>
          事项类型
          <select v-model="quickForm.type">
            <option>项目立项</option>
            <option>资源申请</option>
            <option>风险登记</option>
            <option>周报提交</option>
          </select>
        </label>
        <label>
          负责人
          <input v-model="quickForm.owner" placeholder="请输入负责人" />
        </label>
        <label>
          截止日期
          <input type="date" v-model="quickForm.deadline" />
        </label>
        <label class="full">
          描述
          <textarea v-model="quickForm.desc" rows="3" placeholder="请填写详细描述"></textarea>
        </label>
      </div>
      <template #footer>
        <button class="ghost-btn" @click="showQuick = false">取消</button>
        <button class="primary-btn" @click="submitQuick">提交</button>
      </template>
    </ModalBase>
    <ModalBase :show="showReport" title="日报生成" @close="showReport = false">
      <p>系统将基于今日数据生成日报，并推送给相关负责人。</p>
      <div class="progress">
        <div class="progress-bar" :style="{ width: reportProgress + '%' }"></div>
      </div>
      <p class="muted">进度：{{ reportProgress }}%</p>
      <template #footer>
        <button class="ghost-btn" @click="showReport = false">关闭</button>
        <button class="primary-btn" @click="boostReport">加速生成</button>
      </template>
    </ModalBase>
    <ModalBase :show="showNotice" title="系统通知" @close="showNotice = false">
      <ul class="notice-list">
        <li v-for="notice in notices" :key="notice.id">
          <strong>{{ notice.title }}</strong>
          <span>{{ notice.time }}</span>
        </li>
      </ul>
      <template #footer>
        <button class="primary-btn" @click="showNotice = false">知道了</button>
      </template>
    </ModalBase>
    <ModalBase :show="showLogout" title="确认退出" @close="showLogout = false">
      <p>退出后将返回登录页，未保存的数据不会丢失。</p>
      <template #footer>
        <button class="ghost-btn" @click="showLogout = false">取消</button>
        <button class="primary-btn" @click="logout">确认退出</button>
      </template>
    </ModalBase>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, RouterView, RouterLink } from 'vue-router'
import ModalBase from './ModalBase.vue'

const router = useRouter()
const menuItems = [
  { path: '/app/dashboard', label: '控制台' },
  { path: '/app/planning', label: '项目规划与排期' },
  { path: '/app/resources', label: '资源调度优化' },
  { path: '/app/decision', label: '智能决策分析' },
  { path: '/app/collaboration', label: '团队协作沟通' },
  { path: '/app/risk', label: '风险管理合规' }
]

const showQuick = ref(false)
const showReport = ref(false)
const showNotice = ref(false)
const showLogout = ref(false)
const reportProgress = ref(68)
const quickForm = ref({
  type: '项目立项',
  owner: '张慧',
  deadline: '',
  desc: ''
})

const notices = [
  { id: 1, title: '资源池即将达到预警阈值', time: '10:24' },
  { id: 2, title: '立项评审会议已安排', time: '09:10' },
  { id: 3, title: '合规审计需补充资料', time: '昨天' }
]

const openQuick = () => {
  showQuick.value = true
}

const submitQuick = () => {
  showQuick.value = false
}

const openReport = () => {
  showReport.value = true
}

const boostReport = () => {
  reportProgress.value = Math.min(100, reportProgress.value + 12)
}

const openNotice = () => {
  showNotice.value = true
}

const openLogout = () => {
  showLogout.value = true
}

const logout = () => {
  localStorage.setItem('ipm-auth', 'false')
  showLogout.value = false
  router.push('/login')
}
</script>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 240px;
  background: #ffffff;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  padding: 24px 20px;
  position: sticky;
  top: 0;
  height: 100vh;
}

.brand {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 28px;
}

.logo {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: linear-gradient(135deg, #60a5fa, #34d399);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-weight: 700;
}

.title {
  font-weight: 700;
  font-size: 16px;
}

.subtitle {
  font-size: 12px;
  color: #94a3b8;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
}

.menu-item {
  padding: 10px 14px;
  border-radius: 12px;
  color: #334155;
  background: #f8fafc;
  font-size: 14px;
}

.menu-item.router-link-active {
  background: #e0f2fe;
  color: #0369a1;
}

.sidebar-footer {
  display: grid;
  gap: 10px;
}

.main {
  flex: 1;
  padding: 24px 28px 40px;
  display: flex;
  flex-direction: column;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.topbar h1 {
  font-size: 24px;
}

.topbar p {
  color: #64748b;
}

.top-actions {
  display: flex;
  gap: 12px;
}

.content {
  flex: 1;
}

.primary-btn {
  background: #2563eb;
  color: #ffffff;
  padding: 10px 16px;
  border-radius: 10px;
  font-size: 14px;
}

.outline-btn {
  border: 1px solid #cbd5f5;
  color: #1d4ed8;
  padding: 10px 16px;
  border-radius: 10px;
  background: #ffffff;
}

.ghost-btn {
  background: #eef2ff;
  color: #3730a3;
  padding: 10px 16px;
  border-radius: 10px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.form-grid label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
  color: #475569;
}

.form-grid input,
.form-grid select,
.form-grid textarea {
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
}

.form-grid .full {
  grid-column: 1 / -1;
}

.progress {
  height: 10px;
  border-radius: 999px;
  background: #e2e8f0;
  margin: 12px 0 8px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #60a5fa, #34d399);
}

.notice-list {
  display: grid;
  gap: 12px;
}

.notice-list li {
  display: flex;
  justify-content: space-between;
  background: #f8fafc;
  padding: 10px 12px;
  border-radius: 10px;
  font-size: 13px;
  color: #475569;
}

.notice-list strong {
  color: #0f172a;
}

.muted {
  color: #64748b;
  font-size: 13px;
}

@media (max-width: 1024px) {
  .layout {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    height: auto;
    position: static;
  }

  .topbar {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
