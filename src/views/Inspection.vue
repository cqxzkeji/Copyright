<template>
  <section class="module">
    <header class="module-header">
      <div>
        <h2>检测检验与批次溯源</h2>
        <p>整合农残检测、质量抽检与第三方检测数据，实现“一批一码”。</p>
      </div>
      <div class="actions">
        <button @click="openModal('new')">新增检测</button>
        <button class="secondary" @click="openModal('code')">生成溯源码</button>
        <button class="secondary" @click="openModal('report')">质量报告</button>
      </div>
    </header>

    <div class="cards">
      <div class="card">
        <h3>检测批次</h3>
        <p>{{ records.length }} 批</p>
        <span>本月新增 8 批次</span>
      </div>
      <div class="card">
        <h3>合格率</h3>
        <p>97.8%</p>
        <span>风险批次 2 批</span>
      </div>
      <div class="card">
        <h3>第三方协同</h3>
        <p>12 家</p>
        <span>实时共享检测数据</span>
      </div>
    </div>

    <div class="chart-panel">
      <div>
        <h3>检验类型占比</h3>
        <p>检测方式与频次占比。</p>
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
        <h3>检测批次列表</h3>
        <div class="table-actions">
          <button class="ghost" @click="openModal('trace')">批次追溯</button>
          <button class="ghost" @click="openModal('warning')">异常上报</button>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>批次号</th>
            <th>品类</th>
            <th>检测项目</th>
            <th>检测机构</th>
            <th>检测日期</th>
            <th>结果</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in records" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.category }}</td>
            <td>{{ item.item }}</td>
            <td>{{ item.lab }}</td>
            <td>{{ item.date }}</td>
            <td>
              <span :class="['status', item.status === '合格' ? 'ok' : 'warn']">{{ item.status }}</span>
            </td>
            <td>
              <button class="link" @click="openModal('detail', item)">查看</button>
              <button class="link" @click="openModal('chain', item)">溯源</button>
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
      <template v-if="modalState.type === 'new'">
        <form class="form">
          <label>批次号<input placeholder="请输入检测批次号" /></label>
          <label>检测项目<input placeholder="如：农残、重金属" /></label>
          <label>检测机构<input placeholder="选择检测机构" /></label>
          <label>采样人<input placeholder="填写采样人" /></label>
        </form>
      </template>
      <template v-else-if="modalState.type === 'code'">
        <div class="modal-info">
          <p>已为本月检测批次生成 120 个溯源码。</p>
          <div class="code-box">QR-TRACE-2024-0815</div>
          <span>可导出并打印张贴。</span>
        </div>
      </template>
      <template v-else-if="modalState.type === 'report'">
        <div class="modal-info">
          <p>质量报告已完成汇总，包含 7 项关键指标。</p>
          <ul>
            <li>农残合格率 98%</li>
            <li>重金属合格率 96%</li>
            <li>抽检覆盖率 87%</li>
          </ul>
        </div>
      </template>
      <template v-else-if="modalState.type === 'trace'">
        <div class="modal-info">
          <p>请输入批次号后可查询生产、检测、流通全链路。</p>
          <input class="input" placeholder="例如：QC-015" />
        </div>
      </template>
      <template v-else-if="modalState.type === 'warning'">
        <div class="modal-info">
          <p>异常上报将同步监管部门并触发预警。</p>
          <textarea class="textarea" rows="4" placeholder="填写异常情况说明"></textarea>
        </div>
      </template>
      <template v-else-if="modalState.type === 'detail'">
        <div class="modal-info">
          <p>批次号：{{ modalState.payload?.id }}</p>
          <p>检测项目：{{ modalState.payload?.item }}</p>
          <p>检测结果：{{ modalState.payload?.status }}</p>
          <p>检测结论：符合国家标准。</p>
        </div>
      </template>
      <template v-else-if="modalState.type === 'chain'">
        <div class="modal-info">
          <p>批次 {{ modalState.payload?.id }} 已关联 4 条生产记录与 2 条物流节点。</p>
          <p>系统已生成“批次一码”溯源档案。</p>
        </div>
      </template>
    </BaseModal>
  </section>
</template>

<script setup>
import { ref } from "vue";
import BaseModal from "../components/BaseModal.vue";

const records = Array.from({ length: 22 }, (_, index) => ({
  id: `QC-${String(index + 1).padStart(3, "0")}`,
  category: index % 2 === 0 ? "蔬菜" : "水果",
  item: index % 3 === 0 ? "农残" : "重金属",
  lab: `检测机构${index % 5 + 1}`,
  date: `2024-07-${String((index % 28) + 1).padStart(2, "0")}`,
  status: index % 7 === 0 ? "异常" : "合格"
}));

const chartData = [
  { label: "农残检测", value: 48 },
  { label: "重金属", value: 22 },
  { label: "微生物", value: 18 },
  { label: "营养品质", value: 12 }
];

const modalState = ref({
  visible: false,
  type: "",
  title: "",
  footer: true,
  width: "520px",
  payload: null
});

const openModal = (type, payload = null) => {
  modalState.value.visible = true;
  modalState.value.type = type;
  modalState.value.payload = payload;
  modalState.value.footer = !["code"].includes(type);
  modalState.value.title =
    type === "new"
      ? "新增检测"
      : type === "code"
      ? "溯源码生成"
      : type === "report"
      ? "质量报告"
      : type === "trace"
      ? "批次溯源查询"
      : type === "warning"
      ? "异常上报"
      : type === "detail"
      ? "检测详情"
      : "溯源链路";
};

const closeModal = () => {
  modalState.value.visible = false;
};

const confirmModal = () => {
  modalState.value.visible = false;
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
  background: linear-gradient(90deg, #f97316, #f59e0b);
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
