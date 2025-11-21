<template>
  <div class="page-shell">
    <section class="page-header">
      <div>
        <p class="eyebrow">PMO Command Center</p>
        <h2>项目组合管理</h2>
        <p>在线规划、执行、监控项目生命周期，随时掌握资源与风险状态。</p>
      </div>
      <div class="header-actions">
        <button @click="showAddTask = true">添加任务</button>
        <button class="secondary" @click="showMilestone = true">查看里程碑</button>
      </div>
    </section>
    <section class="flex-layout">
      <article class="panel">
        <h3>关键路径进度</h3>
        <div class="timeline">
          <div v-for="item in timeline" :key="item.label" class="node">
            <span class="label">{{ item.label }}</span>
            <div class="bar">
              <div class="fill" :style="{ width: item.progress + '%' }"></div>
            </div>
            <small>{{ item.progress }}%</small>
          </div>
        </div>
      </article>
      <article class="panel">
        <h3>风险热力</h3>
        <div class="heatmap">
          <div v-for="risk in risks" :key="risk.title" class="heat-cell" :style="{ background: risk.color }">
            <strong>{{ risk.title }}</strong>
            <span>{{ risk.level }}</span>
          </div>
        </div>
        <button class="link" @click="showRisk = true">推送风险对策</button>
      </article>
    </section>
    <section class="panel">
      <h3>资源消耗甘特</h3>
      <div class="gantt">
        <div v-for="resource in resources" :key="resource.name" class="gantt-row">
          <span>{{ resource.name }}</span>
          <div class="gantt-bar">
            <div class="fill" :style="{ width: resource.load + '%' }"></div>
          </div>
          <small>{{ resource.load }}%</small>
        </div>
      </div>
      <button class="primary" @click="showProgress = true">查看交付进度</button>
    </section>
    <ModalDialog v-model="showAddTask" title="新增项目任务">
      <p>创建“多云迁移蓝图”任务，责任人：咨询顾问宋远。</p>
    </ModalDialog>
    <ModalDialog v-model="showMilestone" title="里程碑详情">
      <p>当前迭代里程碑：UAT 完成，计划日期 6 月 30 日。</p>
    </ModalDialog>
    <ModalDialog v-model="showRisk" title="风险对策">
      <p>已针对“供应商集成延误”发布应急处理流程。</p>
    </ModalDialog>
    <ModalDialog v-model="showProgress" title="交付进度">
      <p>项目整体完成度</p>
      <div class="progress">
        <div class="progress-fill" :style="{ width: projectProgress + '%' }"></div>
      </div>
      <p>{{ projectProgress }}% · 预计按期交付</p>
    </ModalDialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const showAddTask = ref(false);
const showMilestone = ref(false);
const showRisk = ref(false);
const showProgress = ref(false);
const projectProgress = 64;

const timeline = [
  { label: '解决方案设计', progress: 92 },
  { label: '集成开发', progress: 70 },
  { label: '联调测试', progress: 45 },
  { label: '上线准备', progress: 25 }
];

const risks = [
  { title: '需求变更', level: '高', color: '#fecdd3' },
  { title: '资源冲突', level: '中', color: '#fde68a' },
  { title: '供应延期', level: '高', color: '#fca5a5' },
  { title: '质量缺陷', level: '低', color: '#bae6fd' }
];

const resources = [
  { name: '研发团队', load: 76 },
  { name: '咨询顾问', load: 68 },
  { name: '测试团队', load: 54 },
  { name: '实施团队', load: 40 }
];
</script>

<style scoped>
.page-shell {
  padding: 40px 60px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.page-header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 24px;
}

.eyebrow {
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #2563eb;
  font-weight: 700;
}

.header-actions {
  display: flex;
  gap: 12px;
}

button {
  border: none;
  border-radius: 14px;
  padding: 10px 18px;
  font-weight: 600;
}

button.secondary {
  background: #e0e7ff;
  color: #312e81;
}

button.primary {
  background: #2563eb;
  color: #fff;
}

.flex-layout {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
}

.panel {
  flex: 1 1 320px;
  background: #fff;
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.08);
}

.timeline .node {
  margin-bottom: 16px;
}

.timeline .bar {
  width: 100%;
  height: 14px;
  background: #e2e8f0;
  border-radius: 999px;
}

.timeline .fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(120deg, #10b981, #14b8a6);
}

.heatmap {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.heat-cell {
  flex: 1 1 120px;
  border-radius: 18px;
  padding: 12px;
  color: #0f172a;
  min-height: 90px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.gantt-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
}

.gantt-bar {
  flex: 1;
  height: 12px;
  background: #e2e8f0;
  border-radius: 999px;
}

.gantt-bar .fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(120deg, #8b5cf6, #ec4899);
}

.progress {
  width: 100%;
  height: 12px;
  background: #e2e8f0;
  border-radius: 999px;
  margin: 12px 0;
}

.progress-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(120deg, #22c55e, #3b82f6);
}
</style>
