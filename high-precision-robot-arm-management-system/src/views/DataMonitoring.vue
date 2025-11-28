<template>
  <div class="grid cols-2">
    <div class="card">
      <h3>实时力矩曲线</h3>
      <div class="chart">
        <div
          v-for="point in torqueSeries"
          :key="point.time"
          class="bar"
          :style="{ height: point.value + '%', background: point.value > 70 ? '#f97316' : '#22c55e' }"
        >
          <span>{{ point.time }}</span>
        </div>
      </div>
      <div class="actions">
        <button class="btn" @click="showThreshold = true">调节阈值</button>
        <button class="btn secondary" @click="openRefresh">刷新数据</button>
      </div>
    </div>
    <div class="card">
      <h3>传感与告警</h3>
      <table class="table">
        <thead>
          <tr>
            <th>通道</th>
            <th>数值</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in sensorRows" :key="row.channel">
            <td>{{ row.channel }}</td>
            <td>{{ row.value }}</td>
            <td><span class="chip">{{ row.status }}</span></td>
          </tr>
        </tbody>
      </table>
      <button class="btn" @click="showAlert('信息', '所有传感器均在安全范围内。')">告警详情</button>
    </div>
  </div>

  <div v-if="showThreshold" class="modal-backdrop" @click.self="showThreshold = false">
    <div class="modal-panel">
      <h3>阈值调整</h3>
      <label class="form-group">
        <span>关节扭矩上限 (Nm)</span>
        <input type="number" v-model.number="threshold" min="40" max="160" />
      </label>
      <div class="footer">
        <button class="btn" @click="confirmThreshold">保存</button>
      </div>
    </div>
  </div>

  <div v-if="showProgress" class="modal-backdrop" @click.self="showProgress = false">
    <div class="modal-panel">
      <h3>刷新数据</h3>
      <p>正在从驱动器和传感器拉取最新数据。</p>
      <div class="progress">
        <div class="bar" :style="{ width: progress + '%' }"></div>
      </div>
      <p class="muted small">{{ progress }}% 完成</p>
    </div>
  </div>

  <div v-if="alert" class="modal-backdrop" @click.self="alert = null">
    <div class="modal-panel">
      <h3>{{ alert.title }}</h3>
      <p>{{ alert.body }}</p>
      <div class="footer">
        <button class="btn secondary" @click="alert = null">关闭</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const torqueSeries = reactive([
  { time: '14:00', value: 48 },
  { time: '14:05', value: 55 },
  { time: '14:10', value: 62 },
  { time: '14:15', value: 74 },
  { time: '14:20', value: 68 },
  { time: '14:25', value: 71 },
]);

const sensorRows = reactive([
  { channel: '力传感器', value: '12.4N', status: '稳定' },
  { channel: '温度', value: '42.1℃', status: '安全' },
  { channel: '振动', value: '0.14g', status: '平稳' },
  { channel: '末端电流', value: '2.1A', status: '正常' },
  { channel: '关节电流', value: '1.8A', status: '正常' },
]);

const threshold = ref(120);
const showThreshold = ref(false);
const alert = ref(null);
const showProgress = ref(false);
const progress = ref(20);

const confirmThreshold = () => {
  showThreshold.value = false;
  showAlert('阈值更新', `新的扭矩上限已保存为 ${threshold.value} Nm`);
};

const showAlert = (title, body) => {
  alert.value = { title, body };
};

const openRefresh = () => {
  showProgress.value = true;
  progress.value = 20;
  const timer = setInterval(() => {
    progress.value = Math.min(100, progress.value + 20);
    if (progress.value >= 100) clearInterval(timer);
  }, 360);
};
</script>

<style scoped>
.chart {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;
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
