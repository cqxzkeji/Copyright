<template>
  <div class="grid grid-3">
    <div class="card">
      <div class="section-title">验收完成率</div>
      <div class="stat-ring">
        <div class="stat-ring-value">86%</div>
        <div class="stat-ring-label">本月完成率</div>
      </div>
      <button class="btn" @click="openModal('生成验收汇总表', 'summary')">生成汇总表</button>
    </div>
    <div class="card">
      <div class="section-title">资料合格率</div>
      <div class="chart">
        <div v-for="bar in bars" :key="bar.label" class="chart-row">
          <span>{{ bar.label }}</span>
          <div class="progress-track">
            <div class="progress-value" :style="{ width: bar.value + '%' }"></div>
          </div>
          <span>{{ bar.value }}%</span>
        </div>
      </div>
      <button class="btn secondary" @click="openModal('导出统计报表', 'export')">导出报表</button>
    </div>
    <div class="card">
      <div class="section-title">分析提示</div>
      <div class="notice">
        资料合格率已连续三周保持在 95% 以上，建议加快末端归档。
      </div>
      <button class="btn light" @click="openModal('统计分析说明', 'note')">查看说明</button>
    </div>
  </div>

  <div class="card" style="margin-top: 20px">
    <div class="section-title">验收成果清单</div>
    <table class="table">
      <thead>
        <tr>
          <th>报表编号</th>
          <th>项目名称</th>
          <th>统计周期</th>
          <th>完成率</th>
          <th>合格率</th>
          <th>生成时间</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in reports" :key="item.code">
          <td>{{ item.code }}</td>
          <td>{{ item.project }}</td>
          <td>{{ item.period }}</td>
          <td>{{ item.complete }}</td>
          <td>{{ item.quality }}</td>
          <td>{{ item.date }}</td>
          <td class="actions">
            <button class="btn light" @click="openModal('查看统计详情', 'detail', item)">详情</button>
            <button class="btn" @click="openModal('导出 PDF', 'pdf', item)">PDF</button>
            <button class="btn secondary" @click="openModal('导出 Excel', 'excel', item)">Excel</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <AppModal :open="modalOpen" :title="modalTitle" @close="modalOpen = false" @confirm="modalOpen = false">
    <template v-if="modalType === 'note'">
      <div class="notice">统计依据：《建筑工程施工质量验收统一标准》GB50300。</div>
    </template>
    <template v-else-if="modalType === 'export'">
      <div class="notice">将导出最近 30 天验收统计数据，格式可选。</div>
      <div class="form-row">
        <label><input type="radio" checked /> PDF</label>
        <label><input type="radio" /> Excel</label>
      </div>
    </template>
    <template v-else-if="modalType === 'summary'">
      <div class="notice">已生成分部分项验收汇总表，正在准备下载。</div>
      <div class="progress-track">
        <div class="progress-value" style="width: 90%"></div>
      </div>
    </template>
    <template v-else>
      <div class="form-grid">
        <label>
          项目名称
          <input :value="activeItem?.project || ''" placeholder="请输入项目" />
        </label>
        <label>
          统计周期
          <input :value="activeItem?.period || ''" placeholder="2024-08" />
        </label>
        <label>
          备注
          <input placeholder="请输入备注" />
        </label>
      </div>
    </template>
  </AppModal>
</template>

<script setup>
import { ref } from "vue";
import AppModal from "../components/AppModal.vue";

const modalOpen = ref(false);
const modalTitle = ref("");
const modalType = ref("summary");
const activeItem = ref(null);

const bars = [
  { label: "土建分部", value: 94 },
  { label: "机电分部", value: 92 },
  { label: "装修分部", value: 96 },
  { label: "消防分部", value: 90 }
];

const reports = Array.from({ length: 20 }, (_, index) => ({
  code: `RP-${String(index + 1).padStart(3, "0")}`,
  project: `智慧综合体 ${index + 1} 号楼`,
  period: `2024-${String((index % 6) + 1).padStart(2, "0")}`,
  complete: `${80 + (index % 20)}%`,
  quality: `${90 + (index % 10)}%`,
  date: `2024-08-${String((index % 28) + 1).padStart(2, "0")}`
}));

const openModal = (title, type, item = null) => {
  modalTitle.value = title;
  modalType.value = type;
  activeItem.value = item;
  modalOpen.value = true;
};
</script>

<style scoped>
.stat-ring {
  display: grid;
  justify-items: center;
  gap: 6px;
  padding: 20px 0;
}

.stat-ring-value {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: conic-gradient(#60a5fa 0 86%, #e2e8f0 86% 100%);
  font-size: 22px;
  font-weight: 700;
  color: #1d4ed8;
}

.stat-ring-label {
  font-size: 13px;
  color: #64748b;
}

.chart {
  display: grid;
  gap: 12px;
  margin-bottom: 16px;
}

.chart-row {
  display: grid;
  grid-template-columns: 70px 1fr 50px;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

.actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.form-grid {
  display: grid;
  gap: 12px;
}

.form-grid label {
  display: grid;
  gap: 6px;
  font-size: 14px;
}

.form-row {
  display: flex;
  gap: 18px;
  align-items: center;
}
</style>
