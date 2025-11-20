<template>
  <div class="module">
    <header>
      <div>
        <h2>数据分析与优化</h2>
        <p>展示活动投放效果图表，所有按钮均提供弹窗提示。</p>
      </div>
      <div class="header-actions">
        <button @click="openModal('刷新成功', '实时拉取最新传播数据，图表已更新。')">刷新数据</button>
        <button class="ghost" @click="openModal('报告导出', '已生成PDF分析报告，请到文件中心下载。')">导出报告</button>
      </div>
    </header>

    <section class="insights">
      <article v-for="metric in metrics" :key="metric.label" class="metric">
        <p>{{ metric.label }}</p>
        <strong>{{ metric.value }}</strong>
        <small>{{ metric.desc }}</small>
      </article>
    </section>

    <section class="chart-panel">
      <div class="chart">
        <div
          v-for="point in chartData"
          :key="point.label"
          class="bar"
          :style="{ height: point.value + '%', background: point.color }"
          @click="openModal(point.label, point.detail)"
        >
          <span>{{ point.value }}%</span>
        </div>
      </div>
      <div class="chart-legend">
        <p v-for="point in chartData" :key="point.label">
          <span :style="{ background: point.color }"></span>
          {{ point.label }}
        </p>
      </div>
    </section>

    <div v-if="modal.visible" class="modal-mask">
      <div class="modal-box">
        <h3>{{ modal.title }}</h3>
        <p>{{ modal.message }}</p>
        <button @click="modal.visible = false">关闭</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';

const metrics = [
  { label: '日曝光', value: '1.2M', desc: '媒体投放 + 现场曝光' },
  { label: '互动率', value: '8.6%', desc: '社交平台互动' },
  { label: '转化报名', value: '3,240', desc: '活动预约' }
];

const chartData = [
  { label: '短视频平台', value: 68, color: '#4f7bff', detail: '短视频带来68%整体曝光，建议继续加码。' },
  { label: '线下场景', value: 52, color: '#7f5dff', detail: '线下体验贡献52%的口碑传播。' },
  { label: '公众号', value: 33, color: '#33b1c0', detail: '长图文深度内容触达33%的目标人群。' },
  { label: '合作媒体', value: 41, color: '#ff9f68', detail: '合作媒体报道带来了41%的新增关注。' }
];

const modal = reactive({ visible: false, title: '', message: '' });

const openModal = (title, message) => {
  modal.title = title;
  modal.message = message;
  modal.visible = true;
};
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

header {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}

.header-actions {
  display: flex;
  gap: 0.8rem;
}

button {
  border: none;
  border-radius: 0.8rem;
  padding: 0.6rem 1.2rem;
  cursor: pointer;
  background: #4f7bff;
  color: #fff;
}

button.ghost {
  background: transparent;
  border: 1px solid #4f7bff;
  color: #4f7bff;
}

.insights {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.metric {
  flex: 1 1 200px;
  border-radius: 1rem;
  background: #f5f7ff;
  padding: 1rem;
}

.metric strong {
  font-size: 1.8rem;
}

.chart-panel {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  align-items: flex-end;
}

.chart {
  flex: 1 1 400px;
  display: flex;
  align-items: flex-end;
  gap: 1rem;
  min-height: 260px;
  padding: 1rem;
  background: #fefefe;
  border-radius: 1rem;
  border: 1px solid #e5e8fb;
}

.bar {
  flex: 1;
  border-radius: 1rem 1rem 0 0;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  color: #fff;
  cursor: pointer;
  position: relative;
  transition: transform 0.2s ease;
}

.bar span {
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.bar:hover {
  transform: translateY(-4px);
}

.chart-legend {
  flex: 0 0 200px;
  background: #f5f7ff;
  padding: 1rem;
  border-radius: 1rem;
}

.chart-legend p {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.chart-legend span {
  width: 14px;
  height: 14px;
  border-radius: 4px;
  display: inline-block;
}

.modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(14, 18, 36, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-box {
  width: min(360px, 90%);
  background: #fff;
  padding: 1.2rem;
  border-radius: 1rem;
  text-align: center;
}
</style>
