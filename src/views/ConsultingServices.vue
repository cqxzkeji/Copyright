<template>
  <div class="page-shell">
    <section class="page-header">
      <div>
        <p class="eyebrow">Consulting Services</p>
        <h2>咨询服务组合</h2>
        <p>统一规划战略咨询、流程优化、数字化转型等服务线。</p>
      </div>
      <button class="primary" @click="showBooking = true">预约顾问</button>
    </section>
    <section class="grid">
      <article class="panel">
        <h3>热门服务包</h3>
        <ul>
          <li v-for="service in services" :key="service.name">
            <div>
              <strong>{{ service.name }}</strong>
              <p>{{ service.desc }}</p>
            </div>
            <button @click="openService(service)">详情</button>
          </li>
        </ul>
      </article>
      <article class="panel">
        <h3>满意度趋势</h3>
        <div class="line-chart">
          <div v-for="(point, idx) in satisfaction" :key="idx" class="dot" :style="{ bottom: point + '%' }"></div>
        </div>
        <p>近 6 个月客户满意度均值 4.7 分。</p>
      </article>
    </section>
    <section class="panel">
      <h3>交付加速工具</h3>
      <div class="toolbox">
        <button @click="showTemplate = true">行业模板</button>
        <button @click="showWorkshop = true">工作坊日程</button>
        <button @click="showProgress = true">交付进度</button>
      </div>
    </section>
    <ModalDialog v-model="showBooking" title="顾问预约">
      <p>已为您锁定云转型首席顾问，周三上午 10:00 进行需求澄清。</p>
    </ModalDialog>
    <ModalDialog v-model="showTemplate" title="模板中心">
      <p>包含 IT 战略蓝图、流程诊断问卷、组织画像等 36 套模板。</p>
    </ModalDialog>
    <ModalDialog v-model="showWorkshop" title="工作坊日程">
      <p>新增“数字运营转型”系列共 4 场会议，自动同步至日历。</p>
    </ModalDialog>
    <ModalDialog v-model="showService" :title="currentService?.name ?? '服务介绍'" :show-footer="false">
      <p>{{ currentService?.desc }}</p>
    </ModalDialog>
    <ModalDialog v-model="showProgress" title="交付进度">
      <div class="progress">
        <div class="progress-fill" :style="{ width: consultingProgress + '%' }"></div>
      </div>
      <p>交付完成度 {{ consultingProgress }}%，客户评分待提交。</p>
    </ModalDialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const showBooking = ref(false);
const showTemplate = ref(false);
const showWorkshop = ref(false);
const showService = ref(false);
const showProgress = ref(false);
const currentService = ref(null);
const consultingProgress = 58;

const services = [
  { name: '数字化路线图', desc: '梳理企业数字化愿景，制定 3 年实施路径。' },
  { name: '流程再造', desc: '端到端流程诊断，构建自动化与 AI 增强方案。' },
  { name: 'IT 治理评估', desc: '评估 IT 组织能力成熟度，输出治理指标体系。' }
];

const satisfaction = [60, 72, 68, 75, 80, 78];

const openService = (service) => {
  currentService.value = service;
  showService.value = true;
};
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
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.grid {
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

ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

li {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
}

li button {
  border: none;
  border-radius: 12px;
  padding: 8px 16px;
  background: #e0f2fe;
  color: #0369a1;
}

.primary,
.toolbox button {
  border: none;
  border-radius: 999px;
  padding: 10px 20px;
  font-weight: 600;
}

.primary {
  background: linear-gradient(120deg, #2563eb, #9333ea);
  color: #fff;
}

.toolbox {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.toolbox button {
  background: #f5f3ff;
  color: #6b21a8;
}

.line-chart {
  position: relative;
  height: 200px;
  background: linear-gradient(180deg, #eef2ff, #fff);
  border-radius: 24px;
  overflow: hidden;
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
}

.line-chart .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #f97316;
  position: relative;
}

.progress {
  width: 100%;
  height: 12px;
  border-radius: 999px;
  background: #e2e8f0;
  margin: 12px 0;
}

.progress-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(120deg, #f59e0b, #ef4444);
}
</style>
