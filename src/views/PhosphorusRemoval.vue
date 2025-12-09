<template>
  <div class="module-wrapper">
    <div class="section-header">
      <div>
        <h2>磷去除与处理</h2>
        <p>膨润土吸附后磷回收、污泥脱水、再生循环。</p>
      </div>
      <div class="actions">
        <button @click="showRecycle = true">磷回收</button>
        <button @click="showFilter = true">压滤任务</button>
        <button @click="showNotice = true">操作提示</button>
      </div>
    </div>

    <div class="cards">
      <div class="card">
        <div class="card-title">出水总磷 (mg/L)</div>
        <div class="chart">
          <div v-for="item in tpChart" :key="item.point" class="bar" :style="{ height: item.value * 60 + 'px' }">
            <span>{{ item.point }}</span>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-title">污泥脱水含固率</div>
        <div class="pill" v-for="line in sludge" :key="line.name">
          <span>{{ line.name }}</span>
          <div class="pill-bar">
            <div class="pill-fill" :style="{ width: line.rate + '%' }"></div>
          </div>
          <span class="value">{{ line.rate }}%</span>
        </div>
      </div>
    </div>

    <div class="table-wrapper">
      <div class="table-title">磷去除出水（不少于10条）</div>
      <table>
        <thead>
          <tr>
            <th>采样点</th>
            <th>时间</th>
            <th>总磷(mg/L)</th>
            <th>SS(mg/L)</th>
            <th>回收磷量(kg)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in removalRows" :key="row.time + row.point">
            <td>{{ row.point }}</td>
            <td>{{ row.time }}</td>
            <td>{{ row.tp }}</td>
            <td>{{ row.ss }}</td>
            <td>{{ row.recover }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseModal title="磷回收进度" :visible="showRecycle" @close="showRecycle = false">
      <p>回收池沉降-浓缩-结晶的过程。</p>
      <div class="progress" v-for="stage in recycle" :key="stage.name">
        <div class="progress-header">
          <span>{{ stage.name }}</span>
          <span>{{ stage.progress }}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: stage.progress + '%' }"></div>
        </div>
      </div>
    </BaseModal>

    <BaseModal title="压滤任务单" :visible="showFilter" @close="showFilter = false">
      <form class="modal-form">
        <label>滤板组数<input v-model="filterForm.plates" type="number" /></label>
        <label>目标含固率(%)<input v-model="filterForm.target" type="number" /></label>
        <label>预计排泥量(m³)<input v-model="filterForm.volume" type="number" step="0.1" /></label>
      </form>
      <template #footer>
        <button class="ghost" @click="showFilter = false">取消</button>
        <button class="primary" @click="confirmFilter">安排压滤</button>
      </template>
    </BaseModal>

    <BaseModal title="操作提示" :visible="showNotice" @close="showNotice = false">
      <ul class="tips">
        <li>回收液回流前确认总磷低于 0.2 mg/L。</li>
        <li>压滤机滤布保持清洁，避免含固率下降。</li>
        <li>再生膨润土按批次编号，记录再利用次数。</li>
      </ul>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const showRecycle = ref(false);
const showFilter = ref(false);
const showNotice = ref(false);

const tpChart = [
  { point: '出水口', value: 0.12 },
  { point: '回流前', value: 0.18 },
  { point: '滤后', value: 0.09 },
  { point: '备用口', value: 0.15 },
  { point: '事故口', value: 0.2 },
  { point: '旁路', value: 0.13 }
];

const sludge = [
  { name: '板框机#1', rate: 28 },
  { name: '板框机#2', rate: 31 },
  { name: '带式机', rate: 24 }
];

const removalRows = [
  { point: '出水口', time: '05-01 08:00', tp: 0.12, ss: 10, recover: 3.1 },
  { point: '出水口', time: '05-01 09:00', tp: 0.11, ss: 9, recover: 3.0 },
  { point: '出水口', time: '05-01 10:00', tp: 0.1, ss: 9, recover: 2.9 },
  { point: '回流前', time: '05-01 08:30', tp: 0.18, ss: 15, recover: 3.2 },
  { point: '回流前', time: '05-01 09:30', tp: 0.17, ss: 14, recover: 3.1 },
  { point: '滤后', time: '05-01 08:45', tp: 0.09, ss: 8, recover: 2.8 },
  { point: '滤后', time: '05-01 09:45', tp: 0.1, ss: 8, recover: 2.7 },
  { point: '备用口', time: '05-01 10:20', tp: 0.15, ss: 12, recover: 3.0 },
  { point: '事故口', time: '05-01 10:40', tp: 0.2, ss: 18, recover: 3.4 },
  { point: '旁路', time: '05-01 11:00', tp: 0.13, ss: 11, recover: 3.0 }
];

const recycle = [
  { name: '沉降浓缩', progress: 78 },
  { name: '化学结晶', progress: 64 },
  { name: '母液回流', progress: 52 }
];

const filterForm = reactive({ plates: 12, target: 30, volume: 8.5 });

const confirmFilter = () => {
  showFilter.value = false;
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
  background: #dcfce7;
  color: #065f46;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 6px 18px rgba(34, 197, 94, 0.18);
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 12px;
}

.card {
  background: #f0fdf4;
  border-radius: 14px;
  padding: 14px;
  border: 1px solid #bbf7d0;
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
  background: linear-gradient(180deg, #4ade80, #bbf7d0);
  border-radius: 12px 12px 6px 6px;
  display: grid;
  place-items: center;
  color: #064e3b;
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
  background: #d1fae5;
  height: 12px;
  border-radius: 999px;
  overflow: hidden;
}

.pill-fill {
  height: 100%;
  background: linear-gradient(90deg, #22c55e, #4ade80);
}

.table-wrapper {
  border: 1px solid #bbf7d0;
  border-radius: 14px;
  overflow: hidden;
}

.table-title {
  background: #ecfdf3;
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
  border-bottom: 1px solid #d1fae5;
  text-align: left;
}

tr:nth-child(even) {
  background: #f6fef9;
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
  border: 1px solid #bbf7d0;
}

.ghost {
  background: #ecfdf3;
}

.primary {
  background: #22c55e;
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
  background: #d1fae5;
  height: 12px;
  border-radius: 999px;
  overflow: hidden;
  margin-top: 6px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #22c55e, #4ade80);
}

.tips {
  padding-left: 18px;
  margin: 0;
  display: grid;
  gap: 6px;
  color: #065f46;
}
</style>
