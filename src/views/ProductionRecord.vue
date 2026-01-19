<template>
  <section class="module">
    <header class="module-header">
      <div>
        <h2>生产过程记录与质量管控</h2>
        <p>对播种、施肥、用药、养殖、采收等过程进行数字化记录。</p>
      </div>
      <div class="actions">
        <button @click="openModal('record')">新增操作记录</button>
        <button class="secondary" @click="openModal('input')">投入品入库</button>
        <button class="secondary" @click="openModal('risk')">风险提示</button>
      </div>
    </header>

    <div class="cards">
      <div class="card">
        <h3>今日操作次数</h3>
        <p>36 次</p>
        <span>近7日环比 +12%</span>
      </div>
      <div class="card">
        <h3>投入品库存预警</h3>
        <p>5 项</p>
        <span>需补充安全投入品</span>
      </div>
      <div class="card">
        <h3>异常记录</h3>
        <p>2 条</p>
        <span>已推送整改通知</span>
      </div>
    </div>

    <div class="chart-panel">
      <div>
        <h3>工序合规率</h3>
        <p>最近30日主要工序合规情况。</p>
      </div>
      <div class="bar-chart">
        <div v-for="item in chartData" :key="item.label" class="bar-item">
          <span>{{ item.label }}</span>
          <div class="bar-track">
            <div class="bar-fill" :style="{ width: item.value + '%' }"></div>
          </div>
          <strong>{{ item.value }}%</strong>
        </div>
      </div>
    </div>

    <div class="table-panel">
      <div class="table-header">
        <h3>操作日志</h3>
        <div class="table-actions">
          <button class="ghost" @click="openModal('sync')">同步上链</button>
          <button class="ghost" @click="openModal('export')">导出日志</button>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>记录编号</th>
            <th>地块</th>
            <th>工序</th>
            <th>投入品批次</th>
            <th>执行人</th>
            <th>时间</th>
            <th>质量状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in records" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.area }}</td>
            <td>{{ item.task }}</td>
            <td>{{ item.batch }}</td>
            <td>{{ item.operator }}</td>
            <td>{{ item.date }}</td>
            <td>
              <span :class="['status', item.status === '合规' ? 'ok' : 'warn']">{{ item.status }}</span>
            </td>
            <td>
              <button class="link" @click="openModal('detail', item)">查看</button>
              <button class="link" @click="openModal('log', item)">追溯</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseModal
      :show="modalState.visible"
      :title="modalState.title"
      :show-footer="modalState.footer"
      :width="modalState.width"
      @close="closeModal"
      @confirm="confirmModal"
    >
      <template v-if="modalState.type === 'record'">
        <form class="form">
          <label>工序类型<input placeholder="如：播种、施肥、灌溉" /></label>
          <label>投入品批次<input placeholder="请输入批次号" /></label>
          <label>执行人员<input placeholder="请输入执行人" /></label>
          <label>备注<input placeholder="填写关键操作说明" /></label>
        </form>
      </template>
      <template v-else-if="modalState.type === 'input'">
        <form class="form">
          <label>投入品名称<input placeholder="如：有机肥、农药" /></label>
          <label>批次编号<input placeholder="请输入批次编号" /></label>
          <label>入库数量<input placeholder="例如 200 kg" /></label>
          <label>供应商<input placeholder="请输入供应商" /></label>
        </form>
      </template>
      <template v-else-if="modalState.type === 'risk'">
        <div class="modal-info">
          <p>系统检测到 2 条高风险操作，请立即核查。</p>
          <ul>
            <li>地块 12 号：用药剂量偏高</li>
            <li>地块 19 号：间隔期不足</li>
          </ul>
        </div>
      </template>
      <template v-else-if="modalState.type === 'sync'">
        <div class="modal-info">
          <p>正在同步操作日志至区块链溯源平台。</p>
          <div class="progress">
            <div class="progress-bar" :style="{ width: progress + '%' }"></div>
          </div>
          <span>同步进度：{{ progress }}%</span>
        </div>
      </template>
      <template v-else-if="modalState.type === 'export'">
        <div class="modal-info">
          <p>正在生成操作日志导出文件。</p>
          <div class="progress">
            <div class="progress-bar" :style="{ width: progress + '%' }"></div>
          </div>
          <span>导出进度：{{ progress }}%</span>
        </div>
      </template>
      <template v-else-if="modalState.type === 'detail'">
        <div class="modal-info">
          <p>记录编号：{{ modalState.payload?.id }}</p>
          <p>工序：{{ modalState.payload?.task }}</p>
          <p>投入品：{{ modalState.payload?.batch }}</p>
          <p>备注：{{ modalState.payload?.note }}</p>
        </div>
      </template>
      <template v-else-if="modalState.type === 'log'">
        <div class="modal-info">
          <p>追溯路径：{{ modalState.payload?.area }} → {{ modalState.payload?.task }} → {{ modalState.payload?.batch }}</p>
          <p>已关联 3 条质控记录与 1 条异常提示。</p>
        </div>
      </template>
    </BaseModal>
  </section>
</template>

<script setup>
import { ref } from "vue";
import BaseModal from "../components/BaseModal.vue";

const records = Array.from({ length: 22 }, (_, index) => ({
  id: `PR-${String(index + 1).padStart(3, "0")}`,
  area: `地块-${index + 1}`,
  task: ["播种", "施肥", "用药", "灌溉", "采收"][index % 5],
  batch: `IN-${202400 + index}`,
  operator: `操作员${index % 6 + 1}`,
  date: `2024-08-${String((index % 28) + 1).padStart(2, "0")}`,
  status: index % 6 === 0 ? "异常" : "合规",
  note: "已完成记录并上传留痕。"
}));

const chartData = [
  { label: "播种", value: 96 },
  { label: "施肥", value: 92 },
  { label: "用药", value: 88 },
  { label: "养殖", value: 94 }
];

const modalState = ref({
  visible: false,
  type: "",
  title: "",
  footer: true,
  width: "520px",
  payload: null
});

const progress = ref(0);
let timer;

const openModal = (type, payload = null) => {
  modalState.value.visible = true;
  modalState.value.type = type;
  modalState.value.payload = payload;
  modalState.value.footer = !["sync", "export"].includes(type);
  modalState.value.title =
    type === "record"
      ? "新增操作记录"
      : type === "input"
      ? "投入品入库"
      : type === "risk"
      ? "质量风险提示"
      : type === "sync"
      ? "同步进度"
      : type === "export"
      ? "导出日志"
      : type === "detail"
      ? "记录详情"
      : "追溯链路";
  if (type === "sync" || type === "export") {
    progress.value = 0;
    clearInterval(timer);
    timer = setInterval(() => {
      if (progress.value < 100) {
        progress.value += 12;
      }
    }, 260);
  }
};

const closeModal = () => {
  modalState.value.visible = false;
  clearInterval(timer);
};

const confirmModal = () => {
  modalState.value.visible = false;
  clearInterval(timer);
};
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.module-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.module-header p {
  margin: 0;
  color: #64748b;
}

.actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

button {
  border: none;
  background: #2563eb;
  color: #fff;
  padding: 8px 14px;
  border-radius: 10px;
  cursor: pointer;
}

button.secondary {
  background: #e0f2fe;
  color: #0369a1;
}

button.ghost {
  background: #f1f5f9;
  color: #0f172a;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.card {
  background: #f8fafc;
  padding: 16px;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
}

.card h3 {
  margin: 0 0 8px;
  font-size: 14px;
  color: #64748b;
}

.card p {
  margin: 0 0 4px;
  font-size: 20px;
  font-weight: 600;
}

.card span {
  font-size: 12px;
  color: #94a3b8;
}

.chart-panel {
  display: grid;
  grid-template-columns: minmax(180px, 220px) 1fr;
  gap: 16px;
  align-items: center;
  background: #f8fafc;
  padding: 16px;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
}

.bar-chart {
  display: grid;
  gap: 10px;
}

.bar-item {
  display: grid;
  grid-template-columns: 90px 1fr 50px;
  align-items: center;
  gap: 12px;
  font-size: 13px;
}

.bar-track {
  background: #e2e8f0;
  border-radius: 999px;
  height: 10px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #4ade80, #2563eb);
  border-radius: 999px;
}

.table-panel {
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  overflow: hidden;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f8fafc;
}

.table-actions {
  display: flex;
  gap: 8px;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

th,
td {
  padding: 12px 14px;
  border-bottom: 1px solid #e2e8f0;
  text-align: left;
}

.status {
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 12px;
}

.status.ok {
  background: #dcfce7;
  color: #166534;
}

.status.warn {
  background: #fee2e2;
  color: #b91c1c;
}

.link {
  background: transparent;
  color: #2563eb;
  padding: 0;
  margin-right: 8px;
}

.form {
  display: grid;
  gap: 12px;
}

.form label {
  display: grid;
  gap: 6px;
  font-size: 13px;
  color: #334155;
}

.form input {
  padding: 8px 10px;
  border-radius: 10px;
  border: 1px solid #cbd5f5;
  background: #f8fafc;
}

.modal-info {
  display: grid;
  gap: 10px;
  color: #475569;
}

.progress {
  width: 100%;
  height: 10px;
  background: #e2e8f0;
  border-radius: 999px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #22c55e, #2563eb);
}

@media (max-width: 900px) {
  .chart-panel {
    grid-template-columns: 1fr;
  }

  .table-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}
</style>
