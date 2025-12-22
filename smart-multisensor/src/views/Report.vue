<template>
  <div class="page">
    <div class="grid">
      <div class="card">
        <div class="card-header">
          <h3>截图管理</h3>
          <button class="primary" @click="openModal('capture')">生成截图</button>
        </div>
        <div class="shot-grid">
          <div class="shot" v-for="shot in shots" :key="shot.name">
            <div class="thumb"></div>
            <div>
              <strong>{{ shot.name }}</strong>
              <p>{{ shot.time }}</p>
            </div>
            <button class="ghost" @click="openModal('detail')">查看</button>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h3>检测评分</h3>
          <button class="primary" @click="openModal('score')">刷新评分</button>
        </div>
        <div class="score">
          <div>
            <span>综合评分</span>
            <strong>92</strong>
          </div>
          <div>
            <span>风险等级</span>
            <strong>低</strong>
          </div>
          <div>
            <span>异常次数</span>
            <strong>3</strong>
          </div>
        </div>
        <div class="progress">
          <div class="bar" :style="{ width: scoreProgress + '%' }"></div>
        </div>
        <div class="progress-info">
          <span>评分加载</span>
          <strong>{{ scoreProgress }}%</strong>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <h3>检测报告列表</h3>
        <div class="card-actions">
          <button class="ghost" @click="openModal('template')">模板设置</button>
          <button class="primary" @click="openModal('export')">导出报告</button>
        </div>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>报告编号</th>
              <th>日期</th>
              <th>设备组</th>
              <th>评分</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="report in reports" :key="report.id">
              <td>{{ report.id }}</td>
              <td>{{ report.date }}</td>
              <td>{{ report.group }}</td>
              <td>{{ report.score }}</td>
              <td>{{ report.status }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <h3>异常分布</h3>
        <button class="primary" @click="openModal('analyze')">分析异常</button>
      </div>
      <div class="chart">
        <svg viewBox="0 0 420 180" aria-label="异常分布">
          <rect x="20" y="80" width="60" height="80" />
          <rect x="110" y="60" width="60" height="100" />
          <rect x="200" y="40" width="60" height="120" />
          <rect x="290" y="70" width="60" height="90" />
        </svg>
        <div class="legend">
          <div><span class="dot" style="background:#93c5fd"></span>雷达异常</div>
          <div><span class="dot" style="background:#60a5fa"></span>摄像头异常</div>
          <div><span class="dot" style="background:#2563eb"></span>融合异常</div>
          <div><span class="dot" style="background:#1d4ed8"></span>驱动异常</div>
        </div>
      </div>
    </div>

    <div v-if="activeModal" class="modal-backdrop" @click.self="closeModal">
      <div class="modal">
        <template v-if="activeModal === 'capture'">
          <h3>生成截图</h3>
          <form class="modal-form" @submit.prevent="submitModal">
            <label>
              <span>截图名称</span>
              <input v-model="form.name" type="text" />
            </label>
            <label>
              <span>包含画面</span>
              <select v-model="form.source">
                <option>雷达 + 摄像头</option>
                <option>仅雷达</option>
                <option>仅摄像头</option>
              </select>
            </label>
            <div class="modal-actions">
              <button class="ghost" type="button" @click="closeModal">取消</button>
              <button class="primary" type="submit">生成</button>
            </div>
          </form>
        </template>

        <template v-else-if="activeModal === 'export'">
          <h3>导出报告</h3>
          <form class="modal-form" @submit.prevent="submitModal">
            <label>
              <span>报告范围</span>
              <select v-model="form.range">
                <option>今日</option>
                <option>本周</option>
                <option>本月</option>
              </select>
            </label>
            <label>
              <span>导出格式</span>
              <select v-model="form.format">
                <option>PDF</option>
                <option>Word</option>
                <option>Excel</option>
              </select>
            </label>
            <div class="modal-actions">
              <button class="ghost" type="button" @click="closeModal">取消</button>
              <button class="primary" type="submit">开始导出</button>
            </div>
          </form>
        </template>

        <template v-else-if="activeModal === 'score'">
          <h3>评分计算中</h3>
          <p class="muted">正在重新计算综合评分。</p>
          <div class="progress">
            <div class="bar" :style="{ width: scoreProgress + '%' }"></div>
          </div>
          <div class="modal-actions">
            <button class="primary" @click="completeScore">完成</button>
          </div>
        </template>

        <template v-else>
          <h3>提示信息</h3>
          <p class="muted">{{ modalMessage }}</p>
          <div class="modal-actions">
            <button class="primary" @click="closeModal">知道了</button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from "vue";

const shots = [
  { name: "雷达-北区", time: "09:20" },
  { name: "摄像头-西区", time: "09:25" },
  { name: "融合-场景A", time: "09:30" },
  { name: "夜间巡检", time: "09:35" }
];

const reports = [
  { id: "RP-001", date: "2024-09-10", group: "北区雷达", score: "93", status: "已完成" },
  { id: "RP-002", date: "2024-09-11", group: "西区摄像头", score: "91", status: "已完成" },
  { id: "RP-003", date: "2024-09-12", group: "东区融合", score: "88", status: "待审核" },
  { id: "RP-004", date: "2024-09-13", group: "南区雷达", score: "90", status: "已完成" },
  { id: "RP-005", date: "2024-09-14", group: "北区摄像头", score: "92", status: "已完成" },
  { id: "RP-006", date: "2024-09-15", group: "中控融合", score: "89", status: "待审核" },
  { id: "RP-007", date: "2024-09-16", group: "西区雷达", score: "94", status: "已完成" },
  { id: "RP-008", date: "2024-09-17", group: "南区摄像头", score: "90", status: "已完成" },
  { id: "RP-009", date: "2024-09-18", group: "东区雷达", score: "87", status: "待审核" },
  { id: "RP-010", date: "2024-09-19", group: "北区融合", score: "93", status: "已完成" }
];

const activeModal = ref("");
const scoreProgress = ref(66);
const form = reactive({
  name: "检测-0920",
  source: "雷达 + 摄像头",
  range: "今日",
  format: "PDF"
});

const modalMessage = computed(() => {
  const messages = {
    detail: "截图已同步到报告中心，可在导出时选择。",
    template: "报告模板已切换为完整版式。",
    analyze: "异常分析完成，风险等级维持在低。"
  };
  return messages[activeModal.value] || "操作完成。";
});

const openModal = (key) => {
  activeModal.value = key;
};

const closeModal = () => {
  activeModal.value = "";
};

const submitModal = () => {
  activeModal.value = "";
};

const completeScore = () => {
  scoreProgress.value = 100;
  activeModal.value = "";
};
</script>

<style scoped>
.page {
  display: grid;
  gap: 20px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.card {
  background: white;
  border-radius: 18px;
  padding: 20px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
  display: grid;
  gap: 16px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.card-header h3 {
  margin: 0;
  font-size: 16px;
}

.card-actions {
  display: flex;
  gap: 10px;
}

.primary {
  background: #2563eb;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
}

.ghost {
  background: #eff6ff;
  border: none;
  color: #2563eb;
  padding: 8px 14px;
  border-radius: 12px;
  cursor: pointer;
}

.shot-grid {
  display: grid;
  gap: 12px;
}

.shot {
  display: grid;
  grid-template-columns: 80px 1fr auto;
  align-items: center;
  gap: 12px;
  background: #f8fafc;
  padding: 12px;
  border-radius: 12px;
}

.thumb {
  width: 80px;
  height: 60px;
  border-radius: 10px;
  background: linear-gradient(135deg, #bfdbfe, #93c5fd);
}

.shot strong {
  display: block;
}

.shot p {
  margin: 2px 0 0;
  font-size: 12px;
  color: #94a3b8;
}

.score {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 12px;
}

.score span {
  font-size: 12px;
  color: #94a3b8;
}

.score strong {
  display: block;
  font-size: 20px;
  color: #1e3a8a;
}

.progress {
  background: #e2e8f0;
  border-radius: 999px;
  height: 10px;
  overflow: hidden;
}

.bar {
  background: linear-gradient(90deg, #2563eb, #60a5fa);
  height: 100%;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #475569;
}

.table-wrap {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

th,
 td {
  text-align: left;
  padding: 10px 8px;
  border-bottom: 1px solid #e2e8f0;
}

th {
  color: #475569;
  font-weight: 600;
}

.chart {
  display: grid;
  gap: 14px;
}

.chart svg {
  width: 100%;
  height: 180px;
  background: #f8fafc;
  border-radius: 12px;
  padding: 10px;
}

.chart rect {
  fill: #93c5fd;
}

.legend {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 8px;
  font-size: 13px;
  color: #475569;
}

.legend .dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 999px;
  margin-right: 6px;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.4);
  display: grid;
  place-items: center;
  z-index: 30;
}

.modal {
  width: min(420px, 90vw);
  background: white;
  border-radius: 16px;
  padding: 24px;
  display: grid;
  gap: 16px;
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.2);
}

.modal-form {
  display: grid;
  gap: 12px;
}

.modal-form label {
  display: grid;
  gap: 6px;
  font-size: 14px;
  color: #475569;
}

.modal-form input,
.modal-form select {
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 8px 10px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.muted {
  margin: 0;
  color: #64748b;
}
</style>
