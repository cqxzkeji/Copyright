<template>
  <section class="module">
    <header class="module-header">
      <div>
        <h2>流通环节与物流追踪</h2>
        <p>记录分级、包装、仓储、冷链运输与流向信息，保障品质稳定。</p>
      </div>
      <div class="actions">
        <button @click="openModal('create')">新建物流批次</button>
        <button class="secondary" @click="openModal('temperature')">温控记录</button>
        <button class="secondary" @click="openModal('track')">物流追踪</button>
      </div>
    </header>

    <div class="cards">
      <div class="card">
        <h3>在途批次</h3>
        <p>14 批</p>
        <span>冷链覆盖率 92%</span>
      </div>
      <div class="card">
        <h3>节点异常</h3>
        <p>1 次</p>
        <span>已启动应急调度</span>
      </div>
      <div class="card">
        <h3>平均运输时长</h3>
        <p>12.5 小时</p>
        <span>较上月下降 8%</span>
      </div>
    </div>

    <div class="chart-panel">
      <div>
        <h3>物流节点准时率</h3>
        <p>主要节点时效表现。</p>
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
        <h3>物流批次列表</h3>
        <div class="table-actions">
          <button class="ghost" @click="openModal('scan')">节点扫描</button>
          <button class="ghost" @click="openModal('storage')">仓储调整</button>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>批次号</th>
            <th>产品</th>
            <th>包装规格</th>
            <th>当前节点</th>
            <th>温控范围</th>
            <th>运输状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in records" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.product }}</td>
            <td>{{ item.package }}</td>
            <td>{{ item.node }}</td>
            <td>{{ item.temp }}</td>
            <td>
              <span :class="['status', item.status === '正常' ? 'ok' : 'warn']">{{ item.status }}</span>
            </td>
            <td>
              <button class="link" @click="openModal('detail', item)">详情</button>
              <button class="link" @click="openModal('route', item)">轨迹</button>
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
      <template v-if="modalState.type === 'create'">
        <form class="form">
          <label>批次号<input placeholder="请输入批次号" /></label>
          <label>目的地<input placeholder="请输入目的地" /></label>
          <label>冷链等级<input placeholder="如：2-8℃" /></label>
          <label>承运单位<input placeholder="请输入承运单位" /></label>
        </form>
      </template>
      <template v-else-if="modalState.type === 'temperature'">
        <div class="modal-info">
          <p>今日温控记录已上传 26 条。</p>
          <div class="progress">
            <div class="progress-bar" :style="{ width: progress + '%' }"></div>
          </div>
          <span>数据上传进度：{{ progress }}%</span>
        </div>
      </template>
      <template v-else-if="modalState.type === 'track'">
        <div class="modal-info">
          <p>选择批次后可查看实时物流轨迹。</p>
          <input class="input" placeholder="请输入批次号" />
        </div>
      </template>
      <template v-else-if="modalState.type === 'scan'">
        <div class="modal-info">
          <p>扫码后自动更新当前节点与时间信息。</p>
          <div class="scan-box">扫描设备已连接</div>
        </div>
      </template>
      <template v-else-if="modalState.type === 'storage'">
        <div class="modal-info">
          <p>仓储调整将更新库存与冷链容量。</p>
          <form class="form">
            <label>仓库编号<input placeholder="请输入仓库编号" /></label>
            <label>调整原因<input placeholder="如：库容优化" /></label>
          </form>
        </div>
      </template>
      <template v-else-if="modalState.type === 'detail'">
        <div class="modal-info">
          <p>批次 {{ modalState.payload?.id }} 当前处于 {{ modalState.payload?.node }}。</p>
          <p>预计到达：{{ modalState.payload?.eta }}</p>
          <p>负责人：{{ modalState.payload?.manager }}</p>
        </div>
      </template>
      <template v-else-if="modalState.type === 'route'">
        <div class="modal-info">
          <p>物流轨迹：采收基地 → 冷链中心 → 配送站 → {{ modalState.payload?.node }}</p>
          <p>已记录 4 个节点、2 次温控。</p>
        </div>
      </template>
    </BaseModal>
  </section>
</template>

<script setup>
import { ref } from "vue";
import BaseModal from "../components/BaseModal.vue";

const records = Array.from({ length: 22 }, (_, index) => ({
  id: `LG-${String(index + 1).padStart(3, "0")}`,
  product: index % 2 === 0 ? "高山蔬菜" : "生态水果",
  package: index % 3 === 0 ? "10kg/箱" : "5kg/箱",
  node: ["分级中心", "冷链仓", "配送站", "批发市场"][index % 4],
  temp: index % 2 === 0 ? "2-8℃" : "0-4℃",
  status: index % 6 === 0 ? "异常" : "正常",
  eta: `2024-08-${String((index % 28) + 1).padStart(2, "0")} 16:00`,
  manager: `调度员${index % 4 + 1}`
}));

const chartData = [
  { label: "分级中心", value: 95 },
  { label: "冷链仓", value: 92 },
  { label: "配送站", value: 88 },
  { label: "批发市场", value: 90 }
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
  modalState.value.footer = !["temperature"].includes(type);
  modalState.value.title =
    type === "create"
      ? "新建物流批次"
      : type === "temperature"
      ? "温控记录"
      : type === "track"
      ? "物流追踪"
      : type === "scan"
      ? "节点扫描"
      : type === "storage"
      ? "仓储调整"
      : type === "detail"
      ? "批次详情"
      : "物流轨迹";
  if (type === "temperature") {
    progress.value = 0;
    clearInterval(timer);
    timer = setInterval(() => {
      if (progress.value < 100) {
        progress.value += 15;
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
  background: linear-gradient(90deg, #38bdf8, #0ea5e9);
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

.modal-info {
  display: grid;
  gap: 10px;
  color: #475569;
}

.scan-box {
  background: #f1f5f9;
  padding: 12px;
  border-radius: 10px;
  color: #0f172a;
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
