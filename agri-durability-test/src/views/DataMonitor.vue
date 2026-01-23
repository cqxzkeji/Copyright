<template>
  <section class="module">
    <div class="module-header">
      <div>
        <h3>数据采集监测</h3>
        <p>实时采集载荷、应变等测试数据，显示变化曲线与通道状态。</p>
      </div>
      <div class="actions">
        <button class="btn" @click="openModal('calibrate')">通道校准</button>
        <button class="btn light" @click="openModal('threshold')">阈值设置</button>
        <button class="btn light" @click="openModal('export')">导出实时数据</button>
        <button class="btn primary" @click="openModal('pause')">暂停采集</button>
      </div>
    </div>

    <div class="panel">
      <div class="card">
        <h4>载荷与应变曲线</h4>
        <svg viewBox="0 0 520 200" class="chart" aria-label="实时曲线">
          <polyline
            points="0,150 40,140 80,120 120,130 160,110 200,90 240,100 280,80 320,95 360,70 400,90 440,60 480,85 520,75"
            fill="none"
            stroke="#2b77f3"
            stroke-width="4"
          />
          <polyline
            points="0,170 40,160 80,165 120,150 160,155 200,140 240,150 280,130 320,140 360,120 400,135 440,110 480,120 520,105"
            fill="none"
            stroke="#7bc59b"
            stroke-width="3"
          />
        </svg>
        <div class="legend">
          <span><i class="dot blue"></i>载荷</span>
          <span><i class="dot green"></i>应变</span>
        </div>
      </div>
      <div class="card metrics">
        <h4>实时指标</h4>
        <div class="metric-grid">
          <div>
            <p>平均载荷</p>
            <strong>64.2 kN</strong>
          </div>
          <div>
            <p>最大应变</p>
            <strong>785 με</strong>
          </div>
          <div>
            <p>温度</p>
            <strong>42 ℃</strong>
          </div>
          <div>
            <p>采样频率</p>
            <strong>200 Hz</strong>
          </div>
        </div>
      </div>
    </div>

    <div class="table-card">
      <table>
        <thead>
          <tr>
            <th>通道</th>
            <th>传感器</th>
            <th>当前载荷 (kN)</th>
            <th>应变 (με)</th>
            <th>温度 (℃)</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in channels" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.sensor }}</td>
            <td>{{ item.load }}</td>
            <td>{{ item.strain }}</td>
            <td>{{ item.temp }}</td>
            <td><span class="tag">{{ item.status }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseModal v-if="activeModal === 'calibrate'" title="通道校准" @close="closeModal">
      <p>选择校准方式，系统将自动生成校准记录。</p>
      <div class="modal-grid">
        <button class="btn light" @click="handleSubmit('已完成全通道零点校准')">零点校准</button>
        <button class="btn light" @click="handleSubmit('已完成满量程校准')">满量程校准</button>
      </div>
    </BaseModal>

    <BaseModal v-if="activeModal === 'threshold'" title="阈值设置" @close="closeModal">
      <form class="modal-form" @submit.prevent="handleSubmit('阈值已更新，报警策略同步完成')">
        <label>
          载荷报警阈值 (kN)
          <input v-model="threshold.load" type="number" required />
        </label>
        <label>
          应变报警阈值 (με)
          <input v-model="threshold.strain" type="number" required />
        </label>
        <button class="btn primary" type="submit">保存阈值</button>
      </form>
    </BaseModal>

    <BaseModal v-if="activeModal === 'export'" title="导出实时数据" @close="closeModal">
      <p>选择导出格式并生成最新采集数据包。</p>
      <div class="modal-grid">
        <button class="btn light" @click="handleSubmit('已导出 CSV 数据包至本地')">导出 CSV</button>
        <button class="btn light" @click="handleSubmit('已导出 Excel 数据包至本地')">导出 Excel</button>
      </div>
    </BaseModal>

    <BaseModal v-if="activeModal === 'pause'" title="暂停采集" @close="closeModal">
      <p>系统将进入暂停状态，缓存当前 5 分钟数据。</p>
      <div class="progress">
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
      </div>
      <button class="btn primary" @click="startProgress">确认暂停</button>
    </BaseModal>

    <BaseModal v-if="activeModal === 'info'" title="操作完成" @close="closeModal">
      <p>{{ message }}</p>
    </BaseModal>
  </section>
</template>

<script setup>
import { ref } from "vue";
import BaseModal from "../components/BaseModal.vue";

const activeModal = ref("");
const message = ref("");
const progress = ref(0);
const threshold = ref({
  load: 95,
  strain: 900
});

const channels = Array.from({ length: 20 }, (_, index) => ({
  id: `CH-${index + 1}`,
  sensor: index % 2 === 0 ? "载荷传感器" : "应变片",
  load: (60 + index * 1.4).toFixed(1),
  strain: 680 + index * 8,
  temp: 38 + (index % 5),
  status: index % 4 === 0 ? "关注" : "正常"
}));

const openModal = (type) => {
  activeModal.value = type;
  message.value = "";
};

const closeModal = () => {
  activeModal.value = "";
  progress.value = 0;
};

const handleSubmit = (text) => {
  message.value = text;
  activeModal.value = "info";
};

const startProgress = () => {
  progress.value = 0;
  const timer = setInterval(() => {
    progress.value += 20;
    if (progress.value >= 100) {
      clearInterval(timer);
      handleSubmit("数据采集已暂停，缓存成功。");
    }
  }, 200);
};
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.module-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 20px;
}

.module-header h3 {
  font-size: 20px;
  color: #1c2a4a;
  margin-bottom: 6px;
}

.module-header p {
  color: #6b7c98;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.btn {
  border: none;
  background: #e8efff;
  color: #2a4b8d;
  padding: 8px 14px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
}

.btn.light {
  background: #f5f7ff;
}

.btn.primary {
  background: #2b77f3;
  color: #fff;
}

.panel {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 16px;
}

.card {
  background: white;
  border-radius: 16px;
  padding: 16px 18px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
}

.card h4 {
  margin-bottom: 12px;
  color: #24314d;
}

.chart {
  width: 100%;
  height: 160px;
}

.legend {
  display: flex;
  gap: 12px;
  color: #5f6f8c;
  font-size: 13px;
  margin-top: 8px;
}

.dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 6px;
}

.dot.blue {
  background: #2b77f3;
}

.dot.green {
  background: #7bc59b;
}

.metrics {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.metric-grid {
  display: grid;
  gap: 12px;
}

.metric-grid p {
  color: #7a8ba7;
  font-size: 12px;
}

.metric-grid strong {
  font-size: 18px;
  color: #1c2a4a;
}

.table-card {
  background: white;
  border-radius: 16px;
  padding: 16px;
  overflow-x: auto;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 720px;
}

th,
td {
  padding: 12px 10px;
  text-align: left;
  font-size: 14px;
}

th {
  color: #6b7c98;
  font-weight: 600;
  border-bottom: 1px solid #e6edf7;
}

td {
  color: #2d3b55;
  border-bottom: 1px solid #f0f4fb;
}

.tag {
  background: #fef3c7;
  color: #92400e;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
}

.modal-form {
  display: grid;
  gap: 12px;
}

.modal-form label {
  display: grid;
  gap: 6px;
  color: #41506a;
  font-weight: 600;
}

.modal-form input {
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #d6deea;
  background: #f8faff;
}

.modal-grid {
  display: grid;
  gap: 10px;
  margin-top: 12px;
}

.progress {
  height: 10px;
  background: #edf1f8;
  border-radius: 999px;
  overflow: hidden;
  margin: 16px 0 12px;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #2b77f3, #6aa8ff);
  transition: width 0.2s ease;
}

@media (max-width: 980px) {
  .panel {
    grid-template-columns: 1fr;
  }
}
</style>
