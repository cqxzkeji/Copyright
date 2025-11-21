<template>
  <div class="dashboard-shell">
    <aside class="sidebar">
      <div class="logo">IT Consulting</div>
      <nav>
        <RouterLink to="/dashboard">仪表盘</RouterLink>
        <RouterLink to="/projects">项目管理</RouterLink>
        <RouterLink to="/consulting">咨询服务</RouterLink>
        <RouterLink to="/crm">客户关系</RouterLink>
        <RouterLink to="/resources">资源调度</RouterLink>
        <RouterLink to="/analysis">数据分析</RouterLink>
      </nav>
    </aside>
    <main class="content">
      <header class="top-bar">
        <div>
          <p class="eyebrow">实时态势</p>
          <h2>总部项目群概览</h2>
        </div>
        <button class="primary" @click="showProgress = true">发布运营快报</button>
      </header>
      <section class="kpi-grid">
        <article class="kpi-card" v-for="metric in metrics" :key="metric.label">
          <p>{{ metric.label }}</p>
          <h3>{{ metric.value }}</h3>
          <span :class="metric.trend > 0 ? 'up' : 'down'">{{ metric.trend > 0 ? '+' : '' }}{{ metric.trend }}%</span>
        </article>
      </section>
      <section class="main-panels">
        <div class="chart-card">
          <h3>里程碑燃尽图</h3>
          <div class="chart">
            <div v-for="(value, index) in burnDown" :key="index" class="chart-bar">
              <div class="fill" :style="{ height: value + '%' }"></div>
              <span>W{{ index + 1 }}</span>
            </div>
          </div>
        </div>
        <div class="module-card">
          <h3>快速进入模块</h3>
          <div class="module-grid">
            <button v-for="module in quickModules" :key="module.label" @click="navigate(module.to)">
              <span>{{ module.label }}</span>
              <small>{{ module.desc }}</small>
            </button>
          </div>
        </div>
      </section>
      <section class="activity">
        <div>
          <h3>咨询交付动态</h3>
          <ul>
            <li v-for="item in activities" :key="item.time">
              <strong>{{ item.title }}</strong>
              <span>{{ item.time }}</span>
              <p>{{ item.desc }}</p>
            </li>
          </ul>
        </div>
        <div class="alerts">
          <h3>风险提示</h3>
          <p>实时监测关键路径与资源冲突，点击按钮推送提醒。</p>
          <button @click="showAlert = true">推送风险提示</button>
        </div>
      </section>
    </main>
    <ModalDialog v-model="showAlert" title="风险推送">
      <p>已经向项目经理发送供应链延期风险的即时通知。</p>
    </ModalDialog>
    <ModalDialog v-model="showProgress" title="运营快报">
      <p>当前交付整体进度</p>
      <div class="progress">
        <div class="progress-fill" :style="{ width: overallProgress + '%' }"></div>
      </div>
      <p class="progress-label">完成度 {{ overallProgress }}%</p>
    </ModalDialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import ModalDialog from '../components/ModalDialog.vue';

const router = useRouter();
const showAlert = ref(false);
const showProgress = ref(false);
const overallProgress = 72;

const metrics = [
  { label: '在建项目', value: 18, trend: 8 },
  { label: '顾问利用率', value: '87%', trend: 5 },
  { label: '合同兑现', value: '12.6M', trend: 12 },
  { label: '满意度', value: '4.8/5', trend: 3 }
];

const burnDown = [80, 70, 55, 40, 30, 18];

const quickModules = [
  { label: '项目集', desc: '甘特&风险', to: '/projects' },
  { label: '咨询服务', desc: '方案&交付', to: '/consulting' },
  { label: '客户洞察', desc: '拜访&线索', to: '/crm' },
  { label: '资源筹划', desc: '人员&资产', to: '/resources' },
  { label: '数据报告', desc: '报表&指标', to: '/analysis' }
];

const activities = [
  { title: 'ERP 数字化咨询阶段验收', time: '09:20', desc: '交付团队提交阶段成果并获得客户签字。' },
  { title: 'PMO 每周例会', time: '10:15', desc: '讨论供应链风险与预算执行情况。' },
  { title: '政企 IT 基座项目', time: '11:30', desc: '完成三家合作伙伴资源对齐。' }
];

const navigate = (path) => router.push(path);
</script>

<style scoped>
.dashboard-shell {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 240px;
  background: #101828;
  color: #fff;
  padding: 32px 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.logo {
  font-weight: 700;
  font-size: 22px;
}

nav {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

nav a {
  color: #cbd5f5;
  text-decoration: none;
  padding: 10px 16px;
  border-radius: 12px;
}

nav a.router-link-active {
  background: rgba(99, 102, 241, 0.2);
  color: #fff;
}

.content {
  flex: 1;
  padding: 32px 48px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.primary {
  border: none;
  background: linear-gradient(120deg, #2563eb, #9333ea);
  color: #fff;
  padding: 12px 24px;
  border-radius: 999px;
  font-weight: 600;
}

.kpi-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.kpi-card {
  flex: 1 1 200px;
  background: #fff;
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 15px 45px rgba(15, 23, 42, 0.08);
}

.kpi-card h3 {
  font-size: 32px;
  margin: 12px 0;
}

.kpi-card .up {
  color: #16a34a;
}

.kpi-card .down {
  color: #ef4444;
}

.main-panels {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.chart-card,
.module-card {
  flex: 1 1 360px;
  background: #fff;
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 15px 45px rgba(15, 23, 42, 0.08);
}

.chart {
  display: flex;
  align-items: flex-end;
  gap: 14px;
  height: 200px;
}

.chart-bar {
  flex: 1;
  background: #f1f5f9;
  border-radius: 12px 12px 0 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
}

.chart-bar .fill {
  width: 100%;
  background: linear-gradient(120deg, #0ea5e9, #6366f1);
  border-radius: 12px 12px 0 0;
}

.module-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.module-grid button {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  padding: 14px 16px;
  background: #f8fafc;
}

.activity {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
}

.activity > div {
  flex: 1 1 320px;
  background: #fff;
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 15px 45px rgba(15, 23, 42, 0.08);
}

.activity ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.activity li {
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 12px;
}

.alerts button {
  border: none;
  border-radius: 12px;
  padding: 10px 18px;
  background: #f97316;
  color: #fff;
}

.progress {
  width: 100%;
  height: 14px;
  border-radius: 999px;
  background: #e2e8f0;
  margin: 12px 0;
}

.progress-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(120deg, #22c55e, #3b82f6);
}

@media (max-width: 960px) {
  .dashboard-shell {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    flex-direction: row;
    overflow-x: auto;
  }
}
</style>
