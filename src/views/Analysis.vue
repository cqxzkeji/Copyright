<template>
  <div class="module">
    <section class="summary">
      <div class="card">
        <div class="label">维护次数</div>
        <div class="value">156 次</div>
        <div class="trend">环比 +12%</div>
      </div>
      <div class="card">
        <div class="label">故障趋势</div>
        <div class="value">下降 8%</div>
        <div class="trend">连续 3 周改善</div>
      </div>
      <div class="card">
        <div class="label">维护成本</div>
        <div class="value">￥68,000</div>
        <div class="trend">预算执行 82%</div>
      </div>
    </section>

    <section class="actions">
      <button class="primary" @click="openModal('report')">生成成本报表</button>
      <button class="ghost" @click="openModal('trend')">查看故障趋势</button>
      <button class="ghost" @click="openModal('kpi')">维护KPI配置</button>
      <button class="ghost" @click="openModal('progress')">分析进度</button>
      <button class="ghost" @click="openModal('tip')">按钮提示信息</button>
    </section>

    <section class="panel">
      <div class="panel-header">
        <div class="panel-title">维护成本趋势</div>
        <div class="panel-subtitle">近六个月成本变化</div>
      </div>
      <div class="chart">
        <div v-for="item in chartData" :key="item.month" class="bar">
          <div class="bar-fill" :style="{ height: item.value + '%' }"></div>
          <span>{{ item.month }}</span>
          <em>{{ item.value }}%</em>
        </div>
      </div>
    </section>

    <section class="panel">
      <div class="panel-header">
        <div class="panel-title">维护分析明细</div>
        <div class="panel-subtitle">表数据共 {{ records.length }} 条</div>
      </div>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>月份</th>
              <th>维护次数</th>
              <th>故障数量</th>
              <th>成本(元)</th>
              <th>关键改进项</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="record in records" :key="record.month">
              <td>{{ record.month }}</td>
              <td>{{ record.maintain }}</td>
              <td>{{ record.fail }}</td>
              <td>{{ record.cost }}</td>
              <td>{{ record.focus }}</td>
              <td>
                <button class="link" @click="openModal('detail', record)">详情</button>
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

        <form v-if="modal.type === 'report'" class="modal-form">
          <input placeholder="报表名称" />
          <select>
            <option>月度报表</option>
            <option>季度报表</option>
            <option>年度报表</option>
          </select>
          <input placeholder="发送对象" />
        </form>

        <form v-if="modal.type === 'trend'" class="modal-form">
          <input placeholder="选择产线" />
          <input placeholder="分析周期" />
          <textarea rows="3" placeholder="关注指标"></textarea>
        </form>

        <form v-if="modal.type === 'kpi'" class="modal-form">
          <input placeholder="KPI名称" />
          <input placeholder="目标值" />
          <input placeholder="责任部门" />
        </form>

        <div v-if="modal.type === 'progress'" class="progress">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: progress + '%' }"></div>
          </div>
          <div class="progress-text">数据汇总进度 {{ progress }}%</div>
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
  { month: "3月", value: 62 },
  { month: "4月", value: 70 },
  { month: "5月", value: 58 },
  { month: "6月", value: 75 },
  { month: "7月", value: 80 },
  { month: "8月", value: 68 }
];

const records = Array.from({ length: 20 }, (_, index) => ({
  month: `2024-${String((index % 12) + 1).padStart(2, "0")}`,
  maintain: 12 + (index % 6),
  fail: 3 + (index % 4),
  cost: 3200 + index * 120,
  focus: ["润滑优化", "备件替换", "巡检加强", "工艺调整"][index % 4]
}));

const modal = reactive({
  visible: false,
  title: "",
  message: "",
  type: "",
  payload: null
});

const progress = ref(44);

const openModal = (type, payload = null) => {
  modal.type = type;
  modal.payload = payload;
  modal.visible = true;
  if (type === "report") {
    modal.title = "生成成本报表";
    modal.message = "选择报表类型并配置发送对象。";
  }
  if (type === "trend") {
    modal.title = "故障趋势分析";
    modal.message = "选择产线并设定分析周期。";
  }
  if (type === "kpi") {
    modal.title = "维护KPI配置";
    modal.message = "设置关键绩效指标与目标值。";
  }
  if (type === "progress") {
    modal.title = "分析进度";
    modal.message = "数据正在汇总，请稍候。";
  }
  if (type === "detail") {
    modal.title = "分析详情";
    modal.message = `${payload.month} 成本 ${payload.cost} 元，重点改进项：${payload.focus}。`;
  }
  if (type === "tip") {
    modal.title = "提示信息";
    modal.message = "建议每月复盘关键指标并更新改进措施。";
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
  color: #0f172a;
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
  background: #0f172a;
  color: #fff;
  padding: 0 16px;
  cursor: pointer;
}

.ghost {
  height: 36px;
  border-radius: 10px;
  border: 1px solid #cbd5f5;
  background: #f8fafc;
  color: #0f172a;
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
  background: #f1f5f9;
  border-radius: 12px;
  height: 150px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 8px;
  text-align: center;
  font-size: 12px;
  color: #475569;
}

.bar-fill {
  background: linear-gradient(180deg, #94a3b8, #0f172a);
  border-radius: 10px;
  width: 100%;
}

.bar span {
  margin-top: 8px;
}

.bar em {
  font-style: normal;
  font-weight: 600;
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

.link {
  border: none;
  background: transparent;
  color: #0f172a;
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
  background: linear-gradient(90deg, #94a3b8, #0f172a);
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
