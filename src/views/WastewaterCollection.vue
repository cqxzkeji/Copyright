<template>
  <div class="module-wrapper">
    <div class="section-header">
      <div>
        <h2>废水采集与预处理</h2>
        <p>采样、筛渣、沉降、pH 调节的现场记录实时展示。</p>
      </div>
      <div class="actions">
        <button @click="showUpload = true">采集记录上传</button>
        <button @click="showStatus = true">运行状态</button>
        <button @click="showTip = true">安全提示</button>
      </div>
    </div>

    <div class="cards">
      <div class="card">
        <div class="card-title">现场流量趋势</div>
        <div class="chart">
          <div
            v-for="item in flowChart"
            :key="item.label"
            class="bar"
            :style="{ height: item.value + 'px' }"
          >
            <span>{{ item.label }}</span>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-title">筛渣/沉降效率</div>
        <div class="pill" v-for="step in pretreat" :key="step.name">
          <span>{{ step.name }}</span>
          <div class="pill-bar">
            <div class="pill-fill" :style="{ width: step.rate + '%' }"></div>
          </div>
          <span class="value">{{ step.rate }}%</span>
        </div>
      </div>
    </div>

    <div class="table-wrapper">
      <div class="table-title">采样记录（不少于10条）</div>
      <table>
        <thead>
          <tr>
            <th>采集点</th>
            <th>时间</th>
            <th>流量(m³/h)</th>
            <th>浊度(NTU)</th>
            <th>pH</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in samples" :key="row.site + row.time">
            <td>{{ row.site }}</td>
            <td>{{ row.time }}</td>
            <td>{{ row.flow }}</td>
            <td>{{ row.turbidity }}</td>
            <td>{{ row.ph }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseModal title="上传采样记录" :visible="showUpload" @close="showUpload = false">
      <form class="modal-form">
        <label>采样点<input v-model="form.site" placeholder="如：格栅前" /></label>
        <label>采样时间<input v-model="form.time" type="datetime-local" /></label>
        <label>流量(m³/h)<input v-model="form.flow" type="number" step="0.1" /></label>
        <label>浊度(NTU)<input v-model="form.turbidity" type="number" step="0.1" /></label>
        <label>pH<input v-model="form.ph" type="number" step="0.1" /></label>
      </form>
      <template #footer>
        <button class="ghost" @click="showUpload = false">取消</button>
        <button class="primary" @click="submitRecord">保存记录</button>
      </template>
    </BaseModal>

    <BaseModal title="预处理运行状态" :visible="showStatus" @close="showStatus = false">
      <p>在线泵组、搅拌器、药剂投加器实时运行进度。</p>
      <div class="progress" v-for="item in statuses" :key="item.name">
        <div class="progress-header">
          <span>{{ item.name }}</span>
          <span>{{ item.progress }}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: item.progress + '%' }"></div>
        </div>
      </div>
    </BaseModal>

    <BaseModal title="安全提示" :visible="showTip" @close="showTip = false">
      <ul class="tips">
        <li>确保采样瓶干净并标识编号。</li>
        <li>预处理池投加絮凝剂前，确认搅拌器正常。</li>
        <li>每日核对流量计与手抄记录，避免偏差。</li>
      </ul>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const showUpload = ref(false);
const showStatus = ref(false);
const showTip = ref(false);
const form = reactive({ site: '', time: '', flow: '', turbidity: '', ph: '' });

const flowChart = [
  { label: '08时', value: 80 },
  { label: '10时', value: 110 },
  { label: '12时', value: 140 },
  { label: '14时', value: 130 },
  { label: '16时', value: 120 },
  { label: '18时', value: 150 }
];

const pretreat = [
  { name: '格栅拦截', rate: 86 },
  { name: '沉砂池', rate: 78 },
  { name: '初沉池', rate: 73 },
  { name: 'pH 调节', rate: 92 }
];

const samples = [
  { site: '格栅前', time: '2024-05-01 08:10', flow: 22, turbidity: 128, ph: 6.7 },
  { site: '格栅后', time: '2024-05-01 09:00', flow: 21.2, turbidity: 102, ph: 6.8 },
  { site: '沉砂池', time: '2024-05-01 10:30', flow: 20.1, turbidity: 88, ph: 6.9 },
  { site: '初沉池', time: '2024-05-01 11:00', flow: 19.8, turbidity: 72, ph: 7.0 },
  { site: '调节池', time: '2024-05-01 12:15', flow: 20.4, turbidity: 76, ph: 6.9 },
  { site: '格栅前', time: '2024-05-01 13:00', flow: 22.4, turbidity: 131, ph: 6.6 },
  { site: '格栅后', time: '2024-05-01 14:10', flow: 21.6, turbidity: 108, ph: 6.7 },
  { site: '沉砂池', time: '2024-05-01 15:20', flow: 20.9, turbidity: 91, ph: 6.8 },
  { site: '初沉池', time: '2024-05-01 16:30', flow: 19.5, turbidity: 74, ph: 7.1 },
  { site: '调节池', time: '2024-05-01 17:45', flow: 20.2, turbidity: 77, ph: 6.9 }
];

const statuses = [
  { name: '提升泵组', progress: 88 },
  { name: '加药搅拌', progress: 72 },
  { name: '沉降循环', progress: 64 }
];

const submitRecord = () => {
  showUpload.value = false;
  Object.keys(form).forEach((key) => (form[key] = ''));
};
</script>

<style scoped>
.module-wrapper {
  display: grid;
  gap: 16px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

h2 {
  margin: 0;
}

p {
  margin: 6px 0 0;
  color: #475569;
}

.actions {
  display: flex;
  gap: 10px;
}

.actions button {
  border: none;
  padding: 10px 14px;
  border-radius: 12px;
  background: #e0f2fe;
  color: #0f172a;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 6px 18px rgba(59, 130, 246, 0.18);
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 12px;
}

.card {
  background: #f8fafc;
  border-radius: 14px;
  padding: 14px;
  border: 1px solid #e2e8f0;
}

.card-title {
  font-weight: 700;
  margin-bottom: 10px;
}

.chart {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  height: 180px;
}

.bar {
  flex: 1;
  background: linear-gradient(180deg, #93c5fd, #dbeafe);
  border-radius: 12px 12px 6px 6px;
  display: grid;
  place-items: center;
  color: #0f172a;
  font-weight: 700;
  position: relative;
}

.bar span {
  position: absolute;
  bottom: -24px;
  font-size: 13px;
}

.pill {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  font-weight: 600;
}

.pill-bar {
  width: 100%;
  background: #e2e8f0;
  height: 12px;
  border-radius: 999px;
  overflow: hidden;
}

.pill-fill {
  height: 100%;
  background: linear-gradient(90deg, #5ca3ff, #93c5fd);
}

.table-wrapper {
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  overflow: hidden;
}

.table-title {
  background: #f1f5f9;
  padding: 12px;
  font-weight: 700;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 10px 12px;
  border-bottom: 1px solid #e2e8f0;
  text-align: left;
}

tr:nth-child(even) {
  background: #f8fafc;
}

.modal-form {
  display: grid;
  gap: 10px;
}

.modal-form label {
  display: grid;
  gap: 6px;
  font-weight: 600;
}

.modal-form input {
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #dbeafe;
}

.ghost {
  background: #f1f5f9;
}

.primary {
  background: #3b82f6;
  color: #fff;
}

.progress {
  margin-bottom: 12px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  font-weight: 700;
}

.progress-bar {
  background: #e2e8f0;
  height: 12px;
  border-radius: 999px;
  overflow: hidden;
  margin-top: 6px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #34d399, #4ade80);
}

.tips {
  padding-left: 18px;
  margin: 0;
  display: grid;
  gap: 6px;
  color: #475569;
}
</style>
