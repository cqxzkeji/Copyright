<template>
  <div class="module-layout">
    <section class="section-card">
      <header class="module-header">
        <div>
          <h3>实时数据总览</h3>
          <p>沉浸体验环节的核心指标</p>
        </div>
        <button @click="openExport">导出日报</button>
      </header>
      <div class="kpi-grid">
        <article v-for="kpi in kpis" :key="kpi.label" class="kpi-card">
          <strong>{{ kpi.value }}</strong>
          <span>{{ kpi.label }}</span>
        </article>
      </div>
    </section>

    <section class="section-card">
      <header class="module-header">
        <h3>互动链路监测</h3>
      </header>
      <div class="flat-chart">
        <div v-for="node in nodes" :key="node.label" class="flat-chart-bar" :style="{ height: node.health + '%' }">
          <span>{{ node.label }}</span>
        </div>
      </div>
      <button style="margin-top:1rem;background:#0ea5e9;" @click="checkLatency">延迟诊断</button>
    </section>

    <section class="section-card">
      <header class="module-header">
        <h3>游客反馈</h3>
      </header>
      <div class="feedback-table">
        <div class="feedback-row feedback-head">
          <span>场景</span>
          <span>情绪指数</span>
          <span>吐槽</span>
          <span>处理</span>
        </div>
        <div class="feedback-row" v-for="item in reviews" :key="item.scene">
          <span>{{ item.scene }}</span>
          <span>{{ item.mood }}</span>
          <span>{{ item.note }}</span>
          <span><button @click="respond(item)">回复</button></span>
        </div>
      </div>
    </section>

    <BaseModal :open="showExport" title="导出日报" @close="showExport = false">
      <p>选择输出格式，系统将立即生成下载链接。</p>
      <div style="display:flex;gap:0.6rem;">
        <button @click="finishExport('PDF')">PDF</button>
        <button style="background:#0ea5e9;" @click="finishExport('Excel')">Excel</button>
      </div>
    </BaseModal>

    <BaseModal :open="showToast" title="系统提示" @close="showToast = false">
      <p>{{ toastMessage }}</p>
    </BaseModal>

    <BaseModal :open="showLatency" title="链路诊断" @close="showLatency = false">
      <p>云端延迟：{{ latency }}ms，边缘节点：{{ edgeLatency }}ms。</p>
      <div class="progress-track">
        <div class="progress-fill" :style="{ width: Math.min(100, (latency / 120) * 100) + '%' }"></div>
      </div>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const kpis = [
  { label: '峰值在线', value: '1,280 人' },
  { label: '平均互动时长', value: '28 分钟' },
  { label: '付费转化', value: '12.5%' }
];

const nodes = [
  { label: '渲染', health: 92 },
  { label: '互动', health: 88 },
  { label: '音频', health: 75 },
  { label: '边缘', health: 64 }
];

const reviews = [
  { scene: '极光雪谷', mood: '4.9 / 5', note: '想加长极光段' },
  { scene: '冰川穿越', mood: '4.6 / 5', note: '建议加震动提示' },
  { scene: '星空雪原', mood: '4.8 / 5', note: '音乐很放松' }
];

const showExport = ref(false);
const showToast = ref(false);
const toastMessage = ref('');
const showLatency = ref(false);
const latency = ref(0);
const edgeLatency = ref(0);

function openExport() {
  showExport.value = true;
}

function finishExport(type) {
  showExport.value = false;
  toastMessage.value = `${type} 日报生成完成，链接已发送到邮箱。`;
  showToast.value = true;
}

function respond(item) {
  toastMessage.value = `已回复 ${item.scene} 游客反馈：感谢建议！`;
  showToast.value = true;
}

function checkLatency() {
  latency.value = Math.floor(Math.random() * 60) + 60;
  edgeLatency.value = Math.floor(Math.random() * 40) + 40;
  showLatency.value = true;
}
</script>

<style scoped>
.module-layout {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.kpi-grid {
  display: flex;
  gap: 1rem;
}

.kpi-card {
  flex: 1;
  background: #f8fafc;
  border-radius: 16px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.feedback-table {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.feedback-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.4rem;
  align-items: center;
}

.feedback-head {
  color: #475569;
  font-weight: 600;
}
</style>
