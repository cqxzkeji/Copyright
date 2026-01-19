<template>
  <section class="module">
    <header class="module-header">
      <div>
        <h2>产地与主体档案管理</h2>
        <p>统一管理地块、基地、经营主体与资质信息，夯实源头数据基础。</p>
      </div>
      <div class="actions">
        <button @click="openModal('create')">新增档案</button>
        <button class="secondary" @click="openModal('export')">导出档案</button>
        <button class="secondary" @click="openModal('tips')">操作提示</button>
      </div>
    </header>

    <div class="cards">
      <div class="card">
        <h3>产地总数</h3>
        <p>{{ records.length }} 个</p>
        <span>覆盖 12 个县区</span>
      </div>
      <div class="card">
        <h3>主体资质有效率</h3>
        <p>98.6%</p>
        <span>近30天新增 6 条资质</span>
      </div>
      <div class="card">
        <h3>重点监管地块</h3>
        <p>18 个</p>
        <span>建议加强巡查</span>
      </div>
    </div>

    <div class="chart-panel">
      <div>
        <h3>地块类型分布</h3>
        <p>根据登记类型生成的比例。</p>
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
        <h3>主体档案列表</h3>
        <div class="table-actions">
          <button class="ghost" @click="openModal('map')">地图查看</button>
          <button class="ghost" @click="openModal('batch')">批量校验</button>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>档案编号</th>
            <th>产地/基地</th>
            <th>作物品种</th>
            <th>主体名称</th>
            <th>负责人</th>
            <th>资质状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in records" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.area }}</td>
            <td>{{ item.crop }}</td>
            <td>{{ item.owner }}</td>
            <td>{{ item.manager }}</td>
            <td>
              <span :class="['status', item.status === '有效' ? 'ok' : 'warn']">{{ item.status }}</span>
            </td>
            <td>
              <button class="link" @click="openModal('edit', item)">编辑</button>
              <button class="link" @click="openModal('qualification', item)">资质</button>
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
          <label>产地名称<input placeholder="请输入产地/基地名称" /></label>
          <label>作物品种<input placeholder="请输入主要作物" /></label>
          <label>主体资质<input placeholder="如：绿色认证、有机认证" /></label>
          <label>负责人<input placeholder="请输入负责人" /></label>
        </form>
      </template>
      <template v-else-if="modalState.type === 'edit'">
        <div class="modal-info">
          <p>当前编辑档案：{{ modalState.payload?.id }} - {{ modalState.payload?.owner }}</p>
          <form class="form">
            <label>基地名称<input :value="modalState.payload?.area" /></label>
            <label>作物品种<input :value="modalState.payload?.crop" /></label>
            <label>负责人<input :value="modalState.payload?.manager" /></label>
          </form>
        </div>
      </template>
      <template v-else-if="modalState.type === 'qualification'">
        <div class="modal-info">
          <p>资质类型：{{ modalState.payload?.qualification }}</p>
          <p>有效期：{{ modalState.payload?.expiry }}</p>
          <p>审核状态：{{ modalState.payload?.status }}</p>
        </div>
      </template>
      <template v-else-if="modalState.type === 'map'">
        <div class="modal-map">
          <div class="map-placeholder">GIS 地图占位（展示产地分布）</div>
          <p>可视化展示产地位置及风险等级。</p>
        </div>
      </template>
      <template v-else-if="modalState.type === 'batch'">
        <div class="modal-info">
          <p>批量校验即将对 {{ records.length }} 条档案进行资质与地块信息核验。</p>
          <div class="progress">
            <div class="progress-bar" :style="{ width: progress + '%' }"></div>
          </div>
          <span>校验进度：{{ progress }}%</span>
        </div>
      </template>
      <template v-else-if="modalState.type === 'export'">
        <div class="modal-info">
          <p>正在生成档案导出文件，请勿关闭窗口。</p>
          <div class="progress">
            <div class="progress-bar" :style="{ width: progress + '%' }"></div>
          </div>
          <span>导出进度：{{ progress }}%</span>
        </div>
      </template>
      <template v-else-if="modalState.type === 'tips'">
        <ul class="tips">
          <li>新增档案时请填写完整地块信息，确保可追溯。</li>
          <li>资质到期将自动提示，请及时更新。</li>
          <li>地图查看支持风险分级与巡检路线规划。</li>
        </ul>
      </template>
    </BaseModal>
  </section>
</template>

<script setup>
import { ref } from "vue";
import BaseModal from "../components/BaseModal.vue";

const records = Array.from({ length: 22 }, (_, index) => ({
  id: `OR-${String(index + 1).padStart(3, "0")}`,
  area: `示范基地-${index + 1}号`,
  crop: index % 2 === 0 ? "水稻" : "蔬菜",
  owner: `合作社${index + 1}号`,
  manager: `负责人${index + 1}`,
  qualification: index % 3 === 0 ? "有机认证" : "绿色认证",
  expiry: `202${index % 4 + 4}-12-31`,
  status: index % 5 === 0 ? "预警" : "有效"
}));

const chartData = [
  { label: "种植基地", value: 45 },
  { label: "养殖场", value: 25 },
  { label: "合作社", value: 20 },
  { label: "加工企业", value: 10 }
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
  modalState.value.footer = !["map", "batch", "export"].includes(type);
  modalState.value.width = type === "map" ? "720px" : "520px";
  modalState.value.title =
    type === "create"
      ? "新增产地档案"
      : type === "edit"
      ? "编辑档案"
      : type === "qualification"
      ? "资质详情"
      : type === "map"
      ? "产地分布地图"
      : type === "batch"
      ? "批量校验进度"
      : type === "export"
      ? "导出档案"
      : "操作提示";
  if (type === "batch" || type === "export") {
    progress.value = 0;
    clearInterval(timer);
    timer = setInterval(() => {
      if (progress.value < 100) {
        progress.value += 10;
      }
    }, 300);
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

.module-header h2 {
  margin: 0 0 6px;
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
  background: linear-gradient(90deg, #38bdf8, #2563eb);
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

.modal-map {
  display: grid;
  gap: 12px;
}

.map-placeholder {
  background: repeating-linear-gradient(45deg, #e2e8f0, #e2e8f0 10px, #f8fafc 10px, #f8fafc 20px);
  height: 220px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
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

.tips {
  margin: 0;
  padding-left: 18px;
  color: #475569;
  display: grid;
  gap: 8px;
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
