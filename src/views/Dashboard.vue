<template>
  <div class="dashboard">
    <aside class="sidebar">
      <div class="brand">
        <span class="tag">CAE 智能平台</span>
        <h2>智能分析管理</h2>
      </div>
      <nav class="menu">
        <router-link to="/dashboard/fea">有限元分析管理</router-link>
        <router-link to="/dashboard/collision">碰撞仿真管理</router-link>
        <router-link to="/dashboard/dynamics">动力学仿真分析</router-link>
        <router-link to="/dashboard/thermal">热分析与流体分析</router-link>
        <router-link to="/dashboard/structural">结构优化与性能评估</router-link>
        <router-link to="/dashboard/reports">报告生成与管理</router-link>
      </nav>
      <div class="sidebar-footer">
        <div>在线求解节点：12</div>
        <div>任务队列：5</div>
      </div>
    </aside>
    <main class="content">
      <header class="content-header">
        <div>
          <h1>欢迎进入汽车CAE智能分析管理系统</h1>
          <p>集中管理仿真任务、模型数据与结果报告。</p>
        </div>
        <div class="header-actions">
          <button class="btn secondary" type="button" @click="openModal('overview')">任务概览</button>
          <button class="btn" type="button" @click="openModal('new')">新建仿真</button>
        </div>
      </header>
      <section class="page-wrapper">
        <div class="dashboard-cards">
          <div class="card">
            <div class="section-title">今日计算负载</div>
            <div class="chart-bars">
              <span style="height: 40%"></span>
              <span style="height: 65%"></span>
              <span style="height: 55%"></span>
              <span style="height: 80%"></span>
              <span style="height: 70%"></span>
            </div>
          </div>
          <div class="card">
            <div class="section-title">近期仿真里程碑</div>
            <ul class="milestones">
              <li>高强钢前纵梁优化完成</li>
              <li>侧碰仿真模型校准完成</li>
              <li>悬挂多体动力学参数更新</li>
              <li>热管理系统压力损失优化</li>
            </ul>
          </div>
          <div class="card">
            <div class="section-title">关键指标</div>
            <div class="metrics">
              <div>
                <strong>98%</strong>
                <span>模型完整率</span>
              </div>
              <div>
                <strong>12h</strong>
                <span>平均求解周期</span>
              </div>
              <div>
                <strong>24</strong>
                <span>活跃项目数</span>
              </div>
            </div>
          </div>
        </div>
        <router-view />
      </section>
    </main>

    <BaseModal v-if="activeModal === 'overview'" title="任务概览" @close="closeModal">
      <p>当前共有 5 个任务排队，2 个任务正在运行。</p>
      <div class="progress-bar" style="margin-top: 16px;">
        <span style="width: 40%"></span>
      </div>
      <div class="modal-actions">
        <button class="btn" type="button" @click="closeModal">继续查看</button>
      </div>
    </BaseModal>

    <BaseModal v-if="activeModal === 'new'" title="新建仿真任务" @close="closeModal">
      <form @submit.prevent="submitModal">
        <div class="input-field">
          <label>仿真模块</label>
          <select v-model="formState.module">
            <option>有限元分析</option>
            <option>碰撞仿真</option>
            <option>动力学仿真</option>
            <option>热流体分析</option>
            <option>结构优化</option>
          </select>
        </div>
        <div class="input-field">
          <label>项目名称</label>
          <input v-model="formState.project" placeholder="新能源轿车平台" />
        </div>
        <div class="input-field">
          <label>求解优先级</label>
          <select v-model="formState.priority">
            <option>高</option>
            <option>中</option>
            <option>低</option>
          </select>
        </div>
        <div class="modal-actions">
          <button class="btn secondary" type="button" @click="closeModal">取消</button>
          <button class="btn" type="submit">提交任务</button>
        </div>
      </form>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const activeModal = ref('');
const formState = ref({
  module: '有限元分析',
  project: '新能源轿车平台',
  priority: '中',
});

const openModal = (type) => {
  activeModal.value = type;
};

const closeModal = () => {
  activeModal.value = '';
};

const submitModal = () => {
  activeModal.value = 'overview';
};
</script>

<style scoped>
.dashboard {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 260px;
  background: #ffffff;
  padding: 24px 18px;
  display: flex;
  flex-direction: column;
  gap: 28px;
  border-right: 1px solid #eef1f6;
}

.brand h2 {
  margin-top: 10px;
  font-size: 20px;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.menu a {
  padding: 12px 14px;
  border-radius: 12px;
  color: #43536a;
  font-weight: 500;
}

.menu a.router-link-active {
  background: #eaf1ff;
  color: #2f6fed;
}

.sidebar-footer {
  margin-top: auto;
  font-size: 13px;
  color: #6c7b8f;
  display: grid;
  gap: 8px;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.content-header {
  padding: 24px 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fdfdff;
  border-bottom: 1px solid #eef1f6;
  gap: 16px;
}

.content-header h1 {
  font-size: 22px;
}

.content-header p {
  color: #6b7a90;
  margin-top: 6px;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.dashboard-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.milestones {
  list-style: none;
  display: grid;
  gap: 10px;
  color: #5f6c82;
}

.metrics {
  display: grid;
  gap: 16px;
}

.metrics strong {
  font-size: 24px;
  display: block;
  color: #2f6fed;
}

.metrics span {
  color: #6b7a90;
  font-size: 13px;
}

@media (max-width: 1024px) {
  .dashboard {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    flex-direction: row;
    flex-wrap: wrap;
  }

  .menu {
    flex-direction: row;
    flex-wrap: wrap;
  }
}
</style>
