<template>
  <div class="module">
    <div class="card-grid">
      <div class="card">
        <h3>排放清单版本概览</h3>
        <p>当前版本：2024Q3-区域一体化清单，覆盖 18 行业与 6 源类。</p>
        <div class="pill-grid">
          <div class="pill">
            <span>工业源</span>
            <strong>42%</strong>
          </div>
          <div class="pill">
            <span>交通源</span>
            <strong>26%</strong>
          </div>
          <div class="pill">
            <span>生活源</span>
            <strong>18%</strong>
          </div>
          <div class="pill">
            <span>农业源</span>
            <strong>8%</strong>
          </div>
        </div>
      </div>
      <div class="card">
        <h3>情景与边界条件</h3>
        <div class="chart">
          <div v-for="(item, index) in boundaryTrend" :key="index" class="line-point">
            <span :style="{ height: item.value + '%' }"></span>
            <label>{{ item.label }}</label>
          </div>
        </div>
      </div>
      <div class="card action-card">
        <h3>清单管理操作</h3>
        <div class="actions">
          <button class="primary" type="button" @click="openModal('新增排放源')">新增排放源</button>
          <button class="ghost" type="button" @click="openModal('情景配置')">情景配置</button>
          <button class="ghost" type="button" @click="openModal('边界条件更新')">边界条件更新</button>
          <button class="ghost" type="button" @click="openModal('版本对比')">版本对比</button>
        </div>
        <ul class="status">
          <li>最新同步：2024-08-15 09:00</li>
          <li>重污染应急情景：启动中</li>
          <li>节假日调整：已配置</li>
        </ul>
      </div>
    </div>

    <div class="table-card">
      <div class="table-header">
        <h3>排放源清单（部分）</h3>
        <button class="ghost" type="button" @click="openModal('导出清单')">导出清单</button>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>编号</th>
              <th>行业</th>
              <th>源类</th>
              <th>排放量</th>
              <th>时空分配</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in tableRows" :key="row.id">
              <td>{{ row.id }}</td>
              <td>{{ row.industry }}</td>
              <td>{{ row.type }}</td>
              <td>{{ row.value }}</td>
              <td>{{ row.profile }}</td>
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
      <h4>配置表单</h4>
      <div class="modal-grid">
        <label>
          情景名称
          <input placeholder="例如：应急减排" />
        </label>
        <label>
          行业范围
          <select>
            <option>工业源</option>
            <option>交通源</option>
            <option>生活源</option>
            <option>农业源</option>
          </select>
        </label>
        <label>
          减排比例
          <input placeholder="例如：30%" />
        </label>
        <label>
          生效时间
          <input placeholder="2024-08-16 00:00" />
        </label>
      </div>
    </div>
    <div class="modal-section">
      <h4>执行进度</h4>
      <div class="progress">
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
      </div>
      <p class="progress-text">当前处理进度 {{ progress }}%</p>
    </div>
    <div class="modal-section info">
      <strong>提示信息：</strong>
      <span>系统将自动保留版本快照并生成差异报告。</span>
    </div>
  </ModalShell>
</template>

<script setup>
import { ref } from "vue";
import ModalShell from "../components/ModalShell.vue";

const activeModal = ref("");
const progress = ref(46);

const boundaryTrend = [
  { label: "周一", value: 60 },
  { label: "周二", value: 72 },
  { label: "周三", value: 66 },
  { label: "周四", value: 78 },
  { label: "周五", value: 70 },
  { label: "周六", value: 84 },
  { label: "周日", value: 68 },
];

const tableRows = Array.from({ length: 22 }, (_, index) => ({
  id: `EM-${(index + 1).toString().padStart(3, "0")}`,
  industry: ["钢铁", "电力", "建材", "化工", "交通", "燃气"][(index + 1) % 6],
  type: ["点源", "线源", "面源"][(index + 2) % 3],
  value: `${120 + index * 3} t/年`,
  profile: index % 2 === 0 ? "小时-网格" : "日-区县",
  status: index % 3 === 0 ? "已审核" : index % 3 === 1 ? "待补充" : "更新中",
  statusClass: index % 3 === 0 ? "ok" : index % 3 === 1 ? "warn" : "info",
}));

const openModal = (title) => {
  activeModal.value = title;
  progress.value = 38;
  const timer = setInterval(() => {
    progress.value = Math.min(100, progress.value + 14);
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

.pill-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
}

.pill {
  background: #f8fafc;
  border-radius: 12px;
  padding: 12px;
  display: grid;
  gap: 6px;
  color: #475569;
}

.pill strong {
  color: #1d4ed8;
  font-size: 20px;
}

.chart {
  display: flex;
  align-items: flex-end;
  gap: 10px;
  height: 160px;
}

.line-point {
  flex: 1;
  display: grid;
  gap: 6px;
  font-size: 12px;
  color: #64748b;
}

.line-point span {
  width: 100%;
  background: linear-gradient(180deg, #7dd3fc, #0ea5e9);
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
