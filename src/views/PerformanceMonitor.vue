<template>
  <div class="module flex-column">
    <div class="module-header flex-row">
      <div>
        <h2>性能监控与优化</h2>
        <p>实时检测负载瓶颈，自动生成索引与 SQL 调优建议。</p>
      </div>
      <div class="flex-row gap">
        <button class="secondary-button" @click="showHint('已刷新最新性能快照')">刷新</button>
        <button class="primary-button" @click="openModal">生成优化方案</button>
      </div>
    </div>

    <div class="flex-row panels">
      <div class="card flex-column panel">
        <h3>关键指标</h3>
        <div class="grid">
          <div class="indicator" v-for="metric in metrics" :key="metric.label">
            <span>{{ metric.label }}</span>
            <strong>{{ metric.value }}</strong>
            <small :class="{ danger: metric.trend > 0 }">{{ metric.trend > 0 ? '+' : '' }}{{ metric.trend }}%</small>
          </div>
        </div>
      </div>
      <div class="card flex-column panel">
        <h3>实时延迟波形</h3>
        <div class="wave">
          <div v-for="bar in latency" :key="bar" class="wave-bar" :style="{ height: bar + '%' }"></div>
        </div>
      </div>
    </div>

    <div v-if="modal" class="modal-backdrop" @click="modal = false">
      <div class="modal-panel" @click.stop>
        <h3>优化方案</h3>
        <ul>
          <li>对 <strong>orders.idx_user_created</strong> 建议合并复合索引，预计提升 38%。</li>
          <li>建议调大连接池至 600，提高突发流量承载能力。</li>
          <li>识别到 4 条慢查询，已生成重写建议。</li>
        </ul>
        <button class="primary-button" @click="modal = false">确认</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const modal = ref(false);
const metrics = [
  { label: '平均响应', value: '23ms', trend: -12 },
  { label: '吞吐', value: '18.6k QPS', trend: 6 },
  { label: '慢查询', value: '12 条', trend: -33 },
  { label: '阻塞会话', value: '3 个', trend: -12 }
];
const latency = [30, 60, 45, 70, 50, 35, 55, 80, 40, 65, 33, 58];

const openModal = () => {
  modal.value = true;
};

const showHint = (text) => {
  window.alert(text);
};
</script>

<style scoped>
.module {
  gap: 1.5rem;
}

.module-header {
  justify-content: space-between;
  align-items: center;
}

.panels {
  gap: 1.5rem;
  flex-wrap: wrap;
}

.panel {
  flex: 1;
  gap: 1rem;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
}

.indicator {
  background: #f8fafc;
  padding: 1rem;
  border-radius: 14px;
}

.indicator span {
  color: #64748b;
}

.indicator strong {
  display: block;
  font-size: 1.35rem;
  margin: 0.35rem 0;
}

.indicator small {
  color: #16a34a;
}

.indicator small.danger {
  color: #f97316;
}

.wave {
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
  height: 140px;
}

.wave-bar {
  flex: 1;
  background: linear-gradient(180deg, rgba(96, 165, 250, 0.9), rgba(37, 99, 235, 0.5));
  border-radius: 8px 8px 0 0;
}
</style>
