<template>
  <div class="module">
    <div class="card-grid">
      <div class="card">
        <h3>预报评估指标</h3>
        <div class="kpi-grid">
          <div class="kpi">
            <span>命中率</span>
            <strong>87%</strong>
          </div>
          <div class="kpi">
            <span>偏差</span>
            <strong>-6.4</strong>
          </div>
          <div class="kpi">
            <span>RMSE</span>
            <strong>18.2</strong>
          </div>
          <div class="kpi">
            <span>相关性</span>
            <strong>0.81</strong>
          </div>
        </div>
      </div>
      <div class="card">
        <h3>污染成因诊断</h3>
        <p>区域传输贡献占比 36%，本地排放占比 49%。</p>
        <div class="chart">
          <div v-for="(item, index) in contribution" :key="index" class="bar">
            <span :style="{ height: item.value + '%' }"></span>
            <label>{{ item.label }}</label>
          </div>
        </div>
      </div>
      <div class="card action-card">
        <h3>决策支持操作</h3>
        <div class="actions">
          <button class="primary" type="button" @click="openModal('生成评估报告')">生成评估报告</button>
          <button class="ghost" type="button" @click="openModal('贡献分析配置')">贡献分析</button>
          <button class="ghost" type="button" @click="openModal('传输诊断')">传输诊断</button>
          <button class="ghost" type="button" @click="openModal('趋势看板更新')">趋势看板</button>
        </div>
        <ul class="status">
          <li>重点城市对比：10 城市</li>
          <li>趋势周期：近 30 天</li>
          <li>诊断报告：已生成 4 份</li>
        </ul>
      </div>
    </div>

    <div class="table-card">
      <div class="table-header">
        <h3>重点城市评估对比</h3>
        <button class="ghost" type="button" @click="openModal('导出评估表')">导出评估表</button>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>城市</th>
              <th>命中率</th>
              <th>偏差</th>
              <th>RMSE</th>
              <th>趋势</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in tableRows" :key="row.id">
              <td>{{ row.city }}</td>
              <td>{{ row.hit }}</td>
              <td>{{ row.bias }}</td>
              <td>{{ row.rmse }}</td>
              <td>
                <span class="tag" :class="row.statusClass">{{ row.status }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <ModalShell
    v-if="activeModal"
    :title="activeModal"
    @close="activeModal = ''"
    @confirm="activeModal = ''"
  >
    <div class="modal-section">
      <h4>评估配置表单</h4>
      <div class="modal-grid">
        <label>
          评估周期
          <input placeholder="2024-08-01 ~ 2024-08-15" />
        </label>
        <label>
          对比城市
          <select>
            <option>全省重点城市</option>
            <option>核心城市群</option>
            <option>污染重点城市</option>
          </select>
        </label>
        <label>
          指标集
          <select>
            <option>命中率/偏差/RMSE</option>
            <option>相关性/趋势</option>
            <option>全指标</option>
          </select>
        </label>
        <label>
          报告格式
          <select>
            <option>PDF</option>
            <option>Word</option>
            <option>PPT</option>
          </select>
        </label>
      </div>
    </div>
    <div class="modal-section">
      <h4>生成进度</h4>
      <div class="progress">
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
      </div>
      <p class="progress-text">当前处理进度 {{ progress }}%</p>
    </div>
    <div class="modal-section info">
      <strong>提示信息：</strong>
      <span>报告完成后将推送至决策看板与会商简报库。</span>
    </div>
  </ModalShell>
</template>

<script setup>
import { ref } from "vue";
import ModalShell from "../components/ModalShell.vue";

const activeModal = ref("");
const progress = ref(56);

const contribution = [
  { label: "本地排放", value: 76 },
  { label: "区域传输", value: 58 },
  { label: "气象条件", value: 42 },
  { label: "二次生成", value: 64 },
  { label: "清洁气团", value: 35 },
];

const cities = [
  "北京",
  "天津",
  "石家庄",
  "保定",
  "唐山",
  "济南",
  "太原",
  "郑州",
  "邯郸",
  "廊坊",
  "邢台",
  "德州",
  "衡水",
  "沧州",
  "聊城",
  "安阳",
  "新乡",
  "淄博",
  "潍坊",
  "临沂",
  "菏泽",
  "滨州",
];

const tableRows = cities.map((city, index) => ({
  id: index,
  city,
  hit: `${80 + (index % 10)}%`,
  bias: `${-8 + (index % 5)} μg/m³`,
  rmse: `${14 + (index % 6)} μg/m³`,
  status: index % 3 === 0 ? "提升" : index % 3 === 1 ? "稳定" : "下降",
  statusClass: index % 3 === 0 ? "ok" : index % 3 === 1 ? "info" : "warn",
}));

const openModal = (title) => {
  activeModal.value = title;
  progress.value = 42;
  const timer = setInterval(() => {
    progress.value = Math.min(100, progress.value + 12);
    if (progress.value >= 100) {
      clearInterval(timer);
    }
  }, 160);
};
</script>

<style scoped>
.module {
  display: grid;
  gap: 20px;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
}

.card {
  background: #ffffff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
}

.card h3 {
  margin: 0 0 12px;
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
  gap: 12px;
}

.kpi {
  background: #f8fafc;
  border-radius: 12px;
  padding: 12px;
  display: grid;
  gap: 6px;
  color: #64748b;
}

.kpi strong {
  font-size: 20px;
  color: #1d4ed8;
}

.chart {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  height: 160px;
  margin-top: 16px;
}

.bar {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #64748b;
}

.bar span {
  width: 100%;
  background: linear-gradient(180deg, #a7f3d0, #10b981);
  border-radius: 8px 8px 4px 4px;
}

.action-card {
  display: grid;
  gap: 16px;
}

.actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
}

.status {
  margin: 0;
  padding-left: 16px;
  color: #64748b;
  font-size: 14px;
}

.table-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
}

.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.table-wrap {
  overflow: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

th,
td {
  padding: 10px 12px;
  border-bottom: 1px solid #e2e8f0;
}

th {
  background: #f8fafc;
  text-align: left;
}

.tag {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
}

.tag.ok {
  background: #dcfce7;
  color: #15803d;
}

.tag.warn {
  background: #fef9c3;
  color: #b45309;
}

.tag.info {
  background: #e0f2fe;
  color: #0369a1;
}

.primary {
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 10px 16px;
  cursor: pointer;
}

.ghost {
  background: #ffffff;
  border: 1px solid #cbd5f5;
  color: #334155;
  border-radius: 10px;
  padding: 10px 16px;
  cursor: pointer;
}

.modal-section {
  margin-bottom: 20px;
}

.modal-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
}

.progress {
  height: 10px;
  background: #e2e8f0;
  border-radius: 999px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #38bdf8, #2563eb);
  transition: width 0.3s ease;
}

.progress-text {
  margin-top: 6px;
  font-size: 13px;
  color: #475569;
}

.info {
  background: #f8fafc;
  border-radius: 12px;
  padding: 12px;
  color: #475569;
}
</style>
