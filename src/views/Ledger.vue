<template>
  <div class="module">
    <section class="summary">
      <div class="card">
        <div class="label">在役制品</div>
        <div class="value">128 件</div>
        <div class="trend">本月新增 6 件</div>
      </div>
      <div class="card">
        <div class="label">寿命预警</div>
        <div class="value">9 件</div>
        <div class="trend">需关注老化风险</div>
      </div>
      <div class="card">
        <div class="label">关键产线</div>
        <div class="value">4 条</div>
        <div class="trend">优先维护保障</div>
      </div>
    </section>

    <section class="actions">
      <button class="primary" @click="openModal('create')">新建制品档案</button>
      <button class="ghost" @click="openModal('usage')">更新使用记录</button>
      <button class="ghost" @click="openModal('progress')">寿命评估进度</button>
      <button class="ghost" @click="openModal('tip')">按钮提示信息</button>
    </section>

    <section class="panel">
      <div class="panel-header">
        <div class="panel-title">寿命周期监控</div>
        <div class="panel-subtitle">近六个月关键制品寿命消耗率</div>
      </div>
      <div class="chart">
        <div v-for="(item, index) in chartData" :key="item.month" class="bar">
          <div class="bar-fill" :style="{ height: item.value + '%' }"></div>
          <span>{{ item.month }}</span>
          <em>{{ item.value }}%</em>
          <div class="bar-rank">#{{ index + 1 }}</div>
        </div>
      </div>
    </section>

    <section class="panel">
      <div class="panel-header">
        <div class="panel-title">制品台账明细</div>
        <div class="panel-subtitle">表数据共 {{ ledgerItems.length }} 条</div>
      </div>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>编号</th>
              <th>制品名称</th>
              <th>产线</th>
              <th>启用日期</th>
              <th>寿命状态</th>
              <th>负责人</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in ledgerItems" :key="item.id">
              <td>{{ item.id }}</td>
              <td>{{ item.name }}</td>
              <td>{{ item.line }}</td>
              <td>{{ item.start }}</td>
              <td>
                <span class="status" :class="item.statusClass">{{ item.status }}</span>
              </td>
              <td>{{ item.owner }}</td>
              <td>
                <button class="link" @click="openModal('detail', item)">详情</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <div v-if="modal.visible" class="modal-backdrop">
      <div class="modal">
        <h3>{{ modal.title }}</h3>
        <p class="modal-message">{{ modal.message }}</p>

        <form v-if="modal.type === 'create'" class="modal-form">
          <input placeholder="制品名称" />
          <input placeholder="产线编号" />
          <input type="date" />
          <select>
            <option>关键件</option>
            <option>常规件</option>
          </select>
        </form>

        <form v-if="modal.type === 'usage'" class="modal-form">
          <input placeholder="制品编号" />
          <input placeholder="使用时长(小时)" />
          <textarea rows="3" placeholder="维护备注"></textarea>
        </form>

        <div v-if="modal.type === 'progress'" class="progress">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: progress + '%' }"></div>
          </div>
          <div class="progress-text">评估进度 {{ progress }}%</div>
        </div>

        <div class="modal-actions">
          <button class="ghost" @click="closeModal">取消</button>
          <button class="primary" @click="confirmModal">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";

const chartData = [
  { month: "3月", value: 56 },
  { month: "4月", value: 62 },
  { month: "5月", value: 48 },
  { month: "6月", value: 74 },
  { month: "7月", value: 69 },
  { month: "8月", value: 81 }
];

const ledgerItems = Array.from({ length: 20 }, (_, index) => ({
  id: `RJ-${index + 1}`,
  name: `耐磨胶辊-${index + 1}`,
  line: `产线-${(index % 4) + 1}`,
  start: `2024-${String((index % 8) + 1).padStart(2, "0")}-15`,
  status: index % 5 === 0 ? "即将到期" : "正常",
  statusClass: index % 5 === 0 ? "warn" : "good",
  owner: ["李工", "王工", "陈工", "赵工"][index % 4]
}));

const modal = reactive({
  visible: false,
  title: "",
  message: "",
  type: "",
  payload: null
});

const progress = ref(68);

const openModal = (type, payload = null) => {
  modal.type = type;
  modal.payload = payload;
  modal.visible = true;
  if (type === "create") {
    modal.title = "新建制品档案";
    modal.message = "填写制品基础信息并提交建档。";
  }
  if (type === "usage") {
    modal.title = "更新使用记录";
    modal.message = "记录最新使用时长与维护情况。";
  }
  if (type === "progress") {
    modal.title = "寿命评估进度";
    modal.message = "系统正在计算寿命指标。";
  }
  if (type === "tip") {
    modal.title = "提示信息";
    modal.message = "请确保台账信息及时更新，避免寿命失控。";
  }
  if (type === "detail") {
    modal.title = "制品详情";
    modal.message = `制品 ${payload.name} 当前状态：${payload.status}，负责人：${payload.owner}。`;
  }
};

const closeModal = () => {
  modal.visible = false;
};

const confirmModal = () => {
  modal.visible = false;
};
</script>

<style scoped>
.module {
  display: grid;
  gap: 24px;
}

.summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.card {
  background: #fff;
  padding: 18px;
  border-radius: 16px;
  box-shadow: 0 12px 20px rgba(15, 23, 42, 0.08);
}

.label {
  color: #64748b;
  font-size: 13px;
}

.value {
  font-size: 24px;
  font-weight: 700;
  margin: 8px 0 4px;
  color: #1d4ed8;
}

.trend {
  font-size: 12px;
  color: #94a3b8;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.primary {
  height: 36px;
  border-radius: 10px;
  border: none;
  background: #2563eb;
  color: #fff;
  padding: 0 16px;
  cursor: pointer;
}

.ghost {
  height: 36px;
  border-radius: 10px;
  border: 1px solid #cbd5f5;
  background: #f8fafc;
  color: #1e3a8a;
  padding: 0 16px;
  cursor: pointer;
}

.panel {
  background: #fff;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 12px 20px rgba(15, 23, 42, 0.08);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.panel-title {
  font-weight: 600;
}

.panel-subtitle {
  font-size: 13px;
  color: #94a3b8;
}

.chart {
  margin-top: 16px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
  gap: 16px;
  align-items: end;
}

.bar {
  position: relative;
  background: #f1f5f9;
  border-radius: 12px;
  height: 160px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 8px;
  text-align: center;
  font-size: 12px;
  color: #475569;
}

.bar-fill {
  background: linear-gradient(180deg, #60a5fa, #2563eb);
  border-radius: 10px;
  width: 100%;
  transition: height 0.3s ease;
}

.bar span {
  margin-top: 8px;
}

.bar em {
  font-style: normal;
  font-weight: 600;
}

.bar-rank {
  position: absolute;
  top: 8px;
  left: 8px;
  font-size: 11px;
  color: #1d4ed8;
  background: #eff6ff;
  padding: 2px 6px;
  border-radius: 10px;
}

.table-wrapper {
  overflow-x: auto;
  margin-top: 16px;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

th,
td {
  padding: 10px 12px;
  border-bottom: 1px solid #e2e8f0;
  text-align: left;
}

.status {
  padding: 2px 10px;
  border-radius: 999px;
  font-size: 12px;
}

.status.good {
  background: #dcfce7;
  color: #15803d;
}

.status.warn {
  background: #fef3c7;
  color: #b45309;
}

.link {
  border: none;
  background: transparent;
  color: #2563eb;
  cursor: pointer;
  padding: 0;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  z-index: 40;
}

.modal {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  width: min(420px, 100%);
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.2);
}

.modal-message {
  color: #475569;
}

.modal-form {
  display: grid;
  gap: 12px;
  margin: 16px 0;
}

.modal-form input,
.modal-form select,
.modal-form textarea {
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 8px 12px;
}

.progress {
  margin: 16px 0;
}

.progress-bar {
  height: 10px;
  background: #e2e8f0;
  border-radius: 999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #38bdf8, #2563eb);
}

.progress-text {
  margin-top: 8px;
  font-size: 13px;
  color: #475569;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
