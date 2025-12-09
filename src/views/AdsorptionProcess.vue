<template>
  <div class="module-wrapper">
    <div class="section-header">
      <div>
        <h2>吸附处理</h2>
        <p>钙基膨润土投加、搅拌、接触反应的过程监控。</p>
      </div>
      <div class="actions">
        <button @click="showDosage = true">调整投加</button>
        <button @click="showMixer = true">搅拌控制</button>
        <button @click="showAlarm = true">报警记录</button>
      </div>
    </div>

    <div class="cards">
      <div class="card">
        <div class="card-title">投加量趋势 (kg/h)</div>
        <div class="chart">
          <div v-for="item in dosageChart" :key="item.time" class="bar" :style="{ height: item.value + 'px' }">
            <span>{{ item.time }}</span>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-title">接触反应出水指标</div>
        <div class="pill" v-for="metric in metrics" :key="metric.name">
          <span>{{ metric.name }}</span>
          <div class="pill-bar">
            <div class="pill-fill" :style="{ width: metric.value + '%' }"></div>
          </div>
          <span class="value">{{ metric.value }}%</span>
        </div>
      </div>
    </div>

    <div class="table-wrapper">
      <div class="table-title">吸附池运行数据（不少于10条）</div>
      <table>
        <thead>
          <tr>
            <th>时间</th>
            <th>投加量(kg/h)</th>
            <th>接触时间(min)</th>
            <th>溶解氧(mg/L)</th>
            <th>温度(℃)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in adsorptionRows" :key="row.time">
            <td>{{ row.time }}</td>
            <td>{{ row.dose }}</td>
            <td>{{ row.contact }}</td>
            <td>{{ row.do }}</td>
            <td>{{ row.temp }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseModal title="投加调度" :visible="showDosage" @close="showDosage = false">
      <form class="modal-form">
        <label>目标投加量(kg/h)<input v-model="dosageForm.target" type="number" step="0.5" /></label>
        <label>调整时长(min)<input v-model="dosageForm.duration" type="number" /></label>
        <label>泵频率(Hz)<input v-model="dosageForm.freq" type="number" step="0.1" /></label>
      </form>
      <template #footer>
        <button class="ghost" @click="showDosage = false">取消</button>
        <button class="primary" @click="confirmDosage">下发调度</button>
      </template>
    </BaseModal>

    <BaseModal title="搅拌器控制" :visible="showMixer" @close="showMixer = false">
      <p>分段搅拌策略确保膨润土充分分散。</p>
      <div class="progress" v-for="plan in mixerPlan" :key="plan.name">
        <div class="progress-header">
          <span>{{ plan.name }}</span>
          <span>{{ plan.progress }}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: plan.progress + '%' }"></div>
        </div>
      </div>
    </BaseModal>

    <BaseModal title="报警详情" :visible="showAlarm" @close="showAlarm = false">
      <ul class="tips">
        <li v-for="alarm in alarms" :key="alarm.time">{{ alarm.time }} - {{ alarm.content }}</li>
      </ul>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const showDosage = ref(false);
const showMixer = ref(false);
const showAlarm = ref(false);
const dosageForm = reactive({ target: 35, duration: 30, freq: 42 });

const dosageChart = [
  { time: '08:00', value: 80 },
  { time: '10:00', value: 95 },
  { time: '12:00', value: 120 },
  { time: '14:00', value: 110 },
  { time: '16:00', value: 105 },
  { time: '18:00', value: 98 }
];

const metrics = [
  { name: '磷吸附率', value: 86 },
  { name: '胶体去除率', value: 81 },
  { name: '色度降低', value: 74 }
];

const adsorptionRows = [
  { time: '08:00', dose: 32, contact: 25, do: 3.5, temp: 21.4 },
  { time: '08:30', dose: 33, contact: 25, do: 3.6, temp: 21.5 },
  { time: '09:00', dose: 34, contact: 26, do: 3.4, temp: 21.9 },
  { time: '09:30', dose: 34.5, contact: 26, do: 3.2, temp: 22.1 },
  { time: '10:00', dose: 35, contact: 27, do: 3.1, temp: 22.4 },
  { time: '10:30', dose: 35, contact: 27, do: 3.0, temp: 22.6 },
  { time: '11:00', dose: 35.5, contact: 28, do: 2.9, temp: 22.8 },
  { time: '11:30', dose: 36, contact: 28, do: 2.8, temp: 23.0 },
  { time: '12:00', dose: 36, contact: 29, do: 2.7, temp: 23.2 },
  { time: '12:30', dose: 36.5, contact: 29, do: 2.6, temp: 23.3 }
];

const mixerPlan = [
  { name: '快速搅拌', progress: 82 },
  { name: '慢速搅拌', progress: 64 },
  { name: '静置反应', progress: 48 }
];

const alarms = [
  { time: '2024-05-01 09:12', content: '投加泵频率突降，系统自动切换备用泵。' },
  { time: '2024-05-01 11:25', content: '接触池 DO 低于 2.8mg/L，建议提升曝气。' },
  { time: '2024-05-01 14:02', content: '出水色度偏高，检查搅拌均匀性。' }
];

const confirmDosage = () => {
  showDosage.value = false;
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
  background: #fde68a;
  color: #92400e;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 6px 18px rgba(234, 179, 8, 0.18);
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 12px;
}

.card {
  background: #fff7ed;
  border-radius: 14px;
  padding: 14px;
  border: 1px solid #fed7aa;
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
  background: linear-gradient(180deg, #f59e0b, #fed7aa);
  border-radius: 12px 12px 6px 6px;
  display: grid;
  place-items: center;
  color: #78350f;
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
  background: #fed7aa;
  height: 12px;
  border-radius: 999px;
  overflow: hidden;
}

.pill-fill {
  height: 100%;
  background: linear-gradient(90deg, #f59e0b, #fb923c);
}

.table-wrapper {
  border: 1px solid #fed7aa;
  border-radius: 14px;
  overflow: hidden;
}

.table-title {
  background: #fff3e0;
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
  border-bottom: 1px solid #ffe4c7;
  text-align: left;
}

tr:nth-child(even) {
  background: #fffaf3;
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
  border: 1px solid #fed7aa;
}

.ghost {
  background: #fff3e0;
}

.primary {
  background: #f97316;
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
  background: #ffe4c7;
  height: 12px;
  border-radius: 999px;
  overflow: hidden;
  margin-top: 6px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #fb923c, #fdba74);
}

.tips {
  padding-left: 18px;
  margin: 0;
  display: grid;
  gap: 6px;
  color: #92400e;
}
</style>
