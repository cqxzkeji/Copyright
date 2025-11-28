<template>
  <div class="grid cols-2">
    <div class="card">
      <h3>能耗与效率</h3>
      <div class="chart">
        <div
          v-for="item in efficiency"
          :key="item.metric"
          class="bar"
          :style="{ height: item.score + '%', background: '#0ea5e9' }"
        >
          <span>{{ item.metric }}</span>
        </div>
      </div>
      <button class="btn" @click="startReport">生成报告</button>
    </div>
    <div class="card">
      <h3>周期统计</h3>
      <table class="table">
        <thead>
          <tr>
            <th>工序</th>
            <th>平均时长</th>
            <th>成功率</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in cycles" :key="row.step">
            <td>{{ row.step }}</td>
            <td>{{ row.duration }}</td>
            <td>{{ row.rate }}</td>
          </tr>
        </tbody>
      </table>
      <div class="actions">
        <button class="btn secondary" @click="showInsight('异常检测', '未发现异常振动与过载事件。')">
          异常检测
        </button>
        <button class="btn" @click="showInsight('优化建议', '建议提升力控采样频率至 1kHz 以优化精度。')">
          优化建议
        </button>
      </div>
    </div>
  </div>

  <div v-if="showProgress" class="modal-backdrop" @click.self="showProgress = false">
    <div class="modal-panel">
      <h3>报告生成中</h3>
      <p>正在汇总能耗、循环时间与重复精度指标。</p>
      <div class="progress">
        <div class="bar" :style="{ width: progress + '%' }"></div>
      </div>
      <p class="muted small">{{ progress }}% 完成</p>
    </div>
  </div>

  <div v-if="insight" class="modal-backdrop" @click.self="insight = null">
    <div class="modal-panel">
      <h3>{{ insight.title }}</h3>
      <p>{{ insight.body }}</p>
      <div class="footer">
        <button class="btn secondary" @click="insight = null">关闭</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const efficiency = reactive([
  { metric: '周期效率', score: 86 },
  { metric: '力控稳定', score: 92 },
  { metric: '精度保持', score: 88 },
  { metric: '能耗控制', score: 76 },
]);

const cycles = reactive([
  { step: '取件', duration: '1.2s', rate: '99.3%' },
  { step: '搬运', duration: '2.1s', rate: '99.0%' },
  { step: '装配', duration: '2.8s', rate: '98.7%' },
  { step: '检测', duration: '1.1s', rate: '99.5%' },
  { step: '拧紧', duration: '1.6s', rate: '99.1%' },
]);

const showProgress = ref(false);
const progress = ref(18);
const insight = ref(null);

const startReport = () => {
  progress.value = 18;
  showProgress.value = true;
  const timer = setInterval(() => {
    progress.value = Math.min(100, progress.value + 18);
    if (progress.value >= 100) clearInterval(timer);
  }, 420);
};

const showInsight = (title, body) => {
  insight.value = { title, body };
};
</script>

<style scoped>
.chart {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  align-items: end;
  height: 220px;
  padding: 12px;
  background: linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 12px;
}

.bar {
  position: relative;
  border-radius: 12px 12px 6px 6px;
  transition: height 0.3s ease;
  display: grid;
  align-items: end;
  justify-items: center;
  color: #0f172a;
  font-weight: 600;
}

.bar span {
  position: absolute;
  bottom: -26px;
  font-size: 12px;
  color: #475569;
}
</style>
