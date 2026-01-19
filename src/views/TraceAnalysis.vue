<template>
  <section class="module">
    <header class="module-header">
      <div>
        <h2>溯源展示与监管分析</h2>
        <p>面向消费者、企业与监管部门提供多角色溯源查询与风险分析。</p>
      </div>
      <div class="actions">
        <button @click="openModal('query')">溯源查询</button>
        <button class="secondary" @click="openModal('report')">生成报表</button>
        <button class="secondary" @click="openModal('alert')">监管预警</button>
      </div>
    </header>

    <div class="cards">
      <div class="card">
        <h3>今日查询量</h3>
        <p>1,268 次</p>
        <span>消费者访问占比 62%</span>
      </div>
      <div class="card">
        <h3>风险预警</h3>
        <p>3 条</p>
        <span>已推送监管部门</span>
      </div>
      <div class="card">
        <h3>综合评分</h3>
        <p>92 分</p>
        <span>质量趋势稳定</span>
      </div>
    </div>

    <div class="chart-panel">
      <div>
        <h3>溯源查询热度</h3>
        <p>近七日访问量。</p>
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
        <h3>监管分析明细</h3>
        <div class="table-actions">
          <button class="ghost" @click="openModal('dashboard')">风险看板</button>
          <button class="ghost" @click="openModal('share')">分享监管</button>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>编号</th>
            <th>主体</th>
            <th>风险类型</th>
            <th>等级</th>
            <th>发现时间</th>
            <th>处理状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in records" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.owner }}</td>
            <td>{{ item.type }}</td>
            <td>{{ item.level }}</td>
            <td>{{ item.date }}</td>
            <td>
              <span :class="['status', item.status === '已处置' ? 'ok' : 'warn']">{{ item.status }}</span>
            </td>
            <td>
              <button class="link" @click="openModal('detail', item)">查看</button>
              <button class="link" @click="openModal('plan', item)">整改</button>
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
      <template v-if="modalState.type === 'query'">
        <div class="modal-info">
          <p>请输入溯源码，支持正向查询与逆向追责。</p>
          <input class="input" placeholder="例如：QR-TRACE-2024-0815" />
        </div>
      </template>
      <template v-else-if="modalState.type === 'report'">
        <div class="modal-info">
          <p>系统正在生成质量分析报表。</p>
          <div class="progress">
            <div class="progress-bar" :style="{ width: progress + '%' }"></div>
          </div>
          <span>报表进度：{{ progress }}%</span>
        </div>
      </template>
      <template v-else-if="modalState.type === 'alert'">
        <div class="modal-info">
          <p>监管预警将推送至主管部门，并同步风险台账。</p>
          <textarea class="textarea" rows="4" placeholder="填写预警说明"></textarea>
        </div>
      </template>
      <template v-else-if="modalState.type === 'dashboard'">
        <div class="modal-info">
          <p>风险看板已汇聚 6 类风险指标。</p>
          <ul>
            <li>高风险 2 条</li>
            <li>中风险 5 条</li>
            <li>低风险 8 条</li>
          </ul>
        </div>
      </template>
      <template v-else-if="modalState.type === 'share'">
        <div class="modal-info">
          <p>已生成监管共享链接，可发送至外部监管部门。</p>
          <div class="code-box">https://trace.gov/share/2024-0815</div>
        </div>
      </template>
      <template v-else-if="modalState.type === 'detail'">
        <div class="modal-info">
          <p>风险编号：{{ modalState.payload?.id }}</p>
          <p>风险类型：{{ modalState.payload?.type }}</p>
          <p>处置建议：加强抽检与复测。</p>
        </div>
      </template>
      <template v-else-if="modalState.type === 'plan'">
        <div class="modal-info">
          <p>整改计划将分配至主体 {{ modalState.payload?.owner }}。</p>
          <form class="form">
            <label>整改期限<input placeholder="例如：7天" /></label>
            <label>责任人<input placeholder="填写责任人" /></label>
          </form>
        </div>
      </template>
    </BaseModal>
  </section>
</template>

<script setup>
import { ref } from "vue";
import BaseModal from "../components/BaseModal.vue";

const records = Array.from({ length: 22 }, (_, index) => ({
  id: `RA-${String(index + 1).padStart(3, "0")}`,
  owner: `主体${index + 1}`,
  type: ["农残超标", "资质过期", "温控异常", "用药违规"][index % 4],
  level: ["高", "中", "低"][index % 3],
  date: `2024-09-${String((index % 28) + 1).padStart(2, "0")}`,
  status: index % 5 === 0 ? "待处置" : "已处置"
}));

const chartData = [
  { label: "周一", value: 65 },
  { label: "周二", value: 72 },
  { label: "周三", value: 58 },
  { label: "周四", value: 80 },
  { label: "周五", value: 90 },
  { label: "周六", value: 75 },
  { label: "周日", value: 68 }
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
  modalState.value.footer = !["report"].includes(type);
  modalState.value.title =
    type === "query"
      ? "溯源查询"
      : type === "report"
      ? "生成报表"
      : type === "alert"
      ? "监管预警"
      : type === "dashboard"
      ? "风险看板"
      : type === "share"
      ? "共享链接"
      : type === "detail"
      ? "风险详情"
      : "整改计划";
  if (type === "report") {
    progress.value = 0;
    clearInterval(timer);
    timer = setInterval(() => {
      if (progress.value < 100) {
        progress.value += 14;
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
  grid-template-columns: 70px 1fr 50px;
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
  background: linear-gradient(90deg, #a855f7, #6366f1);
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

.form input,
.input {
  padding: 8px 10px;
  border-radius: 10px;
  border: 1px solid #cbd5f5;
  background: #f8fafc;
}

.textarea {
  width: 100%;
  padding: 8px 10px;
  border-radius: 10px;
  border: 1px solid #cbd5f5;
  background: #f8fafc;
  resize: vertical;
}

.modal-info {
  display: grid;
  gap: 10px;
  color: #475569;
}

.code-box {
  background: #f1f5f9;
  padding: 12px;
  border-radius: 10px;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
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
