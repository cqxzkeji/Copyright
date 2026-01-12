<template>
  <section class="page">
    <div class="toolbar">
      <button class="primary" @click="openModal('filter')">指标筛选</button>
      <button class="ghost" @click="openModal('report')">生成报告</button>
      <button class="ghost" @click="openModal('download')">导出图表</button>
      <button class="ghost" @click="openModal('guide')">分析提示</button>
    </div>

    <div class="grid">
      <div class="panel">
        <header>
          <h3>项目交付趋势</h3>
          <button class="ghost" @click="openModal('trend')">查看趋势说明</button>
        </header>
        <svg viewBox="0 0 320 160" class="line-chart" aria-label="交付趋势图">
          <polyline
            fill="none"
            stroke="#2563eb"
            stroke-width="4"
            :points="linePoints"
          />
          <circle v-for="point in lineDots" :key="point.x" :cx="point.x" :cy="point.y" r="5" fill="#38bdf8" />
        </svg>
      </div>
      <div class="panel">
        <header>
          <h3>预算与收益</h3>
          <button class="ghost" @click="openModal('budget')">调整指标</button>
        </header>
        <div class="kpi-grid">
          <div class="kpi" v-for="item in kpis" :key="item.label">
            <p>{{ item.label }}</p>
            <h2>{{ item.value }}</h2>
            <span>{{ item.note }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="panel">
      <header>
        <h3>数据分析明细</h3>
        <button class="ghost" @click="openModal('export')">导出数据</button>
      </header>
      <table>
        <thead>
          <tr>
            <th>指标编号</th>
            <th>项目名称</th>
            <th>收入</th>
            <th>成本</th>
            <th>完成率</th>
            <th>负责人</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in rows" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.revenue }}</td>
            <td>{{ item.cost }}</td>
            <td>{{ item.rate }}%</td>
            <td>{{ item.owner }}</td>
            <td>
              <button class="table-btn" @click="openRow(item)">查看详情</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseModal :open="modalKey === 'filter'" title="指标筛选" @close="closeModal">
      <form class="modal-form">
        <label>
          时间范围
          <select v-model="filterForm.range">
            <option>近 30 天</option>
            <option>近 90 天</option>
            <option>年度累计</option>
          </select>
        </label>
        <label>
          项目类型
          <select v-model="filterForm.type">
            <option>咨询</option>
            <option>交付</option>
            <option>运维</option>
          </select>
        </label>
        <label>
          说明
          <textarea v-model="filterForm.note" rows="3"></textarea>
        </label>
      </form>
      <template #footer>
        <button class="ghost" type="button" @click="closeModal">取消</button>
        <button class="primary" type="button" @click="closeModal">应用筛选</button>
      </template>
    </BaseModal>

    <BaseModal :open="modalKey === 'report'" title="生成报告" @close="closeModal">
      <p>报告将包含趋势图、关键指标与分析建议。</p>
      <template #footer>
        <button class="ghost" type="button" @click="closeModal">取消</button>
        <button class="primary" type="button" @click="closeModal">生成报告</button>
      </template>
    </BaseModal>

    <BaseModal :open="modalKey === 'download'" title="导出图表" @close="closeModal">
      <p>请选择导出格式。</p>
      <div class="export-options">
        <button class="ghost" type="button" @click="closeModal">PNG</button>
        <button class="ghost" type="button" @click="closeModal">PDF</button>
      </div>
    </BaseModal>

    <BaseModal :open="modalKey === 'guide'" title="分析提示" @close="closeModal">
      <ul class="tip-list">
        <li>关注高收益项目的成本波动。</li>
        <li>结合交付趋势预测资源需求。</li>
        <li>定期导出报告供决策使用。</li>
      </ul>
    </BaseModal>

    <BaseModal :open="modalKey === 'trend'" title="趋势说明" @close="closeModal">
      <p>趋势线展示各月份项目交付完成度变化。</p>
    </BaseModal>

    <BaseModal :open="modalKey === 'budget'" title="预算与收益调整" @close="closeModal">
      <form class="modal-form">
        <label>
          目标收益
          <input v-model="budgetForm.revenue" type="number" />
        </label>
        <label>
          目标成本
          <input v-model="budgetForm.cost" type="number" />
        </label>
      </form>
      <template #footer>
        <button class="ghost" type="button" @click="closeModal">取消</button>
        <button class="primary" type="button" @click="closeModal">保存指标</button>
      </template>
    </BaseModal>

    <BaseModal :open="modalKey === 'export'" title="导出数据" @close="closeModal">
      <p>数据分析明细支持 Excel 与 CSV 导出。</p>
      <template #footer>
        <button class="ghost" type="button" @click="closeModal">取消</button>
        <button class="primary" type="button" @click="closeModal">确认导出</button>
      </template>
    </BaseModal>

    <BaseModal :open="modalKey === 'row'" title="指标详情" @close="closeModal">
      <div v-if="activeRow" class="detail">
        <p>项目名称：{{ activeRow.name }}</p>
        <p>收入：{{ activeRow.revenue }}</p>
        <p>成本：{{ activeRow.cost }}</p>
        <p>完成率：{{ activeRow.rate }}%</p>
        <p>负责人：{{ activeRow.owner }}</p>
      </div>
    </BaseModal>
  </section>
</template>

<script setup>
import { computed, reactive, ref } from "vue";
import BaseModal from "../components/BaseModal.vue";

const modalKey = ref("");
const activeRow = ref(null);

const lineDots = [
  { x: 20, y: 120 },
  { x: 80, y: 90 },
  { x: 140, y: 70 },
  { x: 200, y: 60 },
  { x: 260, y: 50 },
  { x: 300, y: 40 }
];

const linePoints = computed(() => lineDots.map((point) => `${point.x},${point.y}`).join(" "));

const kpis = [
  { label: "累计收入", value: "1.26 亿元", note: "年度增长 12%" },
  { label: "累计成本", value: "0.86 亿元", note: "成本控制稳定" },
  { label: "平均交付率", value: "83%", note: "高于目标" }
];

const rows = Array.from({ length: 20 }, (_, index) => ({
  id: `AN-${40 + index}`,
  name: `分析项目 ${index + 1}`,
  revenue: `${120 + index * 3} 万元`,
  cost: `${80 + index * 2} 万元`,
  rate: 70 + (index % 5) * 4,
  owner: ["王立", "李娜", "赵峰", "孙琳"][index % 4]
}));

const filterForm = reactive({
  range: "近 30 天",
  type: "咨询",
  note: ""
});

const budgetForm = reactive({
  revenue: 1200,
  cost: 860
});

const openModal = (key) => {
  modalKey.value = key;
};

const closeModal = () => {
  modalKey.value = "";
  activeRow.value = null;
};

const openRow = (row) => {
  activeRow.value = row;
  modalKey.value = "row";
};
</script>

<style scoped>
.page {
  display: grid;
  gap: 20px;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.primary {
  padding: 10px 18px;
  border-radius: 10px;
  background: #2563eb;
  color: #fff;
}

.ghost {
  padding: 10px 18px;
  border-radius: 10px;
  background: #f1f5f9;
  color: #334155;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 18px;
}

.panel {
  background: #fff;
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
  overflow-x: auto;
  display: grid;
  gap: 16px;
}

.panel header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.line-chart {
  width: 100%;
  height: 160px;
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
}

.kpi {
  background: #f8fafc;
  padding: 14px;
  border-radius: 14px;
  display: grid;
  gap: 6px;
}

.kpi span {
  font-size: 12px;
  color: #64748b;
}

.panel table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.panel th,
.panel td {
  padding: 10px 8px;
  border-bottom: 1px solid #e2e8f0;
  text-align: left;
}

.table-btn {
  padding: 6px 10px;
  border-radius: 8px;
  background: #e0ecff;
  color: #1d4ed8;
}

.modal-form {
  display: grid;
  gap: 14px;
}

.modal-form label {
  display: grid;
  gap: 8px;
  font-size: 14px;
  color: #334155;
}

.modal-form input,
.modal-form select,
.modal-form textarea {
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
}

.export-options {
  display: flex;
  gap: 12px;
  margin-top: 12px;
  flex-wrap: wrap;
}

.tip-list {
  display: grid;
  gap: 10px;
  color: #475569;
  font-size: 14px;
  padding-left: 16px;
}

.detail {
  display: grid;
  gap: 8px;
  color: #334155;
  font-size: 14px;
}
</style>
