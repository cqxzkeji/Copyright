<template>
  <div class="dashboard">
    <aside class="sidebar">
      <div class="logo">
        <span>SB</span>
        <div>
          <h2>调度系统</h2>
          <p>成型 · 打磨 · 质量</p>
        </div>
      </div>
      <nav class="menu">
        <router-link to="/dashboard/forming">成型工艺管理</router-link>
        <router-link to="/dashboard/grinding">打磨调度管理</router-link>
        <router-link to="/dashboard/planning">生产计划工单</router-link>
        <router-link to="/dashboard/quality">质量检测追溯</router-link>
        <router-link to="/dashboard/analytics">运行监控分析</router-link>
      </nav>
      <div class="sidebar-footer">
        <div class="status-pill">
          <span class="dot"></span>
          系统在线 · 18台设备
        </div>
        <button class="btn ghost" type="button" @click="openShift">班组交接</button>
      </div>
    </aside>

    <section class="content">
      <header class="content-header">
        <div>
          <h1>生产与调度总览</h1>
          <p>成型—打磨联动生产计划与实时调度</p>
        </div>
        <div class="header-actions">
          <button class="btn" type="button" @click="openNotice">发布通知</button>
          <button class="btn ghost" type="button" @click="openOverview">运行概览</button>
        </div>
      </header>
      <div class="summary-grid">
        <div class="summary-card">
          <h3>今日计划</h3>
          <strong>1,240 件</strong>
          <span>已完成 62% · 在制 318 件</span>
        </div>
        <div class="summary-card">
          <h3>异常预警</h3>
          <strong>3 项</strong>
          <span>冲压压力波动 · 打磨超时</span>
        </div>
        <div class="summary-card">
          <h3>质检合格率</h3>
          <strong>98.6%</strong>
          <span>批次 SN-2024-082</span>
        </div>
      </div>
      <div class="module-window">
        <router-view />
      </div>
    </section>

    <Modal :open="noticeModal" title="发布生产通知" confirm-text="确认发布" @close="closeNotice" @confirm="confirmNotice">
      <div class="form-grid">
        <label>
          通知主题
          <input v-model="notice.title" type="text" placeholder="如：今日优先处理急单" />
        </label>
        <label>
          接收班组
          <select v-model="notice.team">
            <option>全部班组</option>
            <option>冲压一班</option>
            <option>锻造二班</option>
            <option>打磨三班</option>
          </select>
        </label>
        <label class="full">
          通知内容
          <textarea v-model="notice.content" rows="3" placeholder="输入通知内容"></textarea>
        </label>
      </div>
    </Modal>

    <Modal :open="shiftModal" title="班组交接" confirm-text="提交交接" @close="closeShift" @confirm="confirmShift">
      <div class="form-grid">
        <label>
          交接人
          <input v-model="handoff.user" type="text" placeholder="张工" />
        </label>
        <label>
          接班人
          <input v-model="handoff.next" type="text" placeholder="李工" />
        </label>
        <label class="full">
          交接事项
          <textarea v-model="handoff.notes" rows="3" placeholder="设备状态、待处理工单"></textarea>
        </label>
      </div>
    </Modal>

    <Modal :open="overviewModal" title="运行概览" @close="overviewModal = false">
      <ul class="overview-list">
        <li>成型设备利用率：88.2%</li>
        <li>打磨平均节拍：56 秒/件</li>
        <li>在制品库存：318 件</li>
        <li>异常关闭工单：2 单</li>
      </ul>
    </Modal>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import Modal from '../components/Modal.vue';

const noticeModal = ref(false);
const shiftModal = ref(false);
const overviewModal = ref(false);

const notice = reactive({
  title: '成型急单优先切换',
  team: '全部班组',
  content: '请于 14:00 前完成 SN-2024-082 批次成型任务。'
});

const handoff = reactive({
  user: '张工',
  next: '李工',
  notes: '3 台冲压机待保养，打磨 2 号线需复检。'
});

const openNotice = () => {
  noticeModal.value = true;
};

const closeNotice = () => {
  noticeModal.value = false;
};

const confirmNotice = () => {
  noticeModal.value = false;
};

const openShift = () => {
  shiftModal.value = true;
};

const closeShift = () => {
  shiftModal.value = false;
};

const confirmShift = () => {
  shiftModal.value = false;
};

const openOverview = () => {
  overviewModal.value = true;
};
</script>

<style scoped>
.dashboard {
  display: flex;
  min-height: 100vh;
  color: #0f172a;
}

.sidebar {
  width: 240px;
  background: #ffffff;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  padding: 24px 18px;
  gap: 24px;
}

.logo {
  display: flex;
  gap: 12px;
  align-items: center;
}

.logo span {
  background: #2563eb;
  color: #fff;
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  font-weight: 700;
}

.logo h2 {
  margin: 0;
  font-size: 18px;
}

.logo p {
  margin: 4px 0 0;
  font-size: 12px;
  color: #94a3b8;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.menu a {
  padding: 10px 12px;
  border-radius: 12px;
  color: #334155;
  text-decoration: none;
  font-weight: 500;
  background: #f8fafc;
}

.menu a.router-link-active {
  background: #dbeafe;
  color: #1d4ed8;
}

.sidebar-footer {
  margin-top: auto;
  display: grid;
  gap: 12px;
}

.status-pill {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: #f1f5f9;
  border-radius: 999px;
  font-size: 12px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #22c55e;
}

.content {
  flex: 1;
  padding: 24px 32px 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.content-header h1 {
  margin: 0;
  font-size: 24px;
}

.content-header p {
  margin: 6px 0 0;
  color: #64748b;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.btn {
  border: none;
  background: #2563eb;
  color: #fff;
  padding: 10px 16px;
  border-radius: 10px;
  cursor: pointer;
}

.btn.ghost {
  background: #e2e8f0;
  color: #1e293b;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: 16px;
}

.summary-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 16px 18px;
  box-shadow: 0 12px 28px rgba(148, 163, 184, 0.2);
}

.summary-card h3 {
  margin: 0 0 8px;
  font-size: 15px;
  color: #475569;
}

.summary-card strong {
  font-size: 22px;
  color: #1d4ed8;
}

.summary-card span {
  display: block;
  margin-top: 6px;
  color: #94a3b8;
  font-size: 12px;
}

.module-window {
  background: #ffffff;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 16px 34px rgba(148, 163, 184, 0.2);
  min-height: 520px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
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
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 8px 10px;
}

.form-grid .full {
  grid-column: 1 / -1;
}

.overview-list {
  padding-left: 18px;
  color: #475569;
  margin: 0;
}

@media (max-width: 960px) {
  .dashboard {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    flex-direction: row;
    flex-wrap: wrap;
  }

  .content-header {
    flex-direction: column;
  }
}
</style>
