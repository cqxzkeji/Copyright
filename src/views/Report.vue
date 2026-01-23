<template>
  <div class="page">
    <section class="panel">
      <div class="panel-header">
        <div>
          <h2>结果归档</h2>
          <p>验收报告生成与数据统计，沉淀项目验收成果。</p>
        </div>
        <div class="action-group">
          <button class="primary-btn" @click="openModal('generate')">生成报告</button>
          <button class="secondary-btn" @click="openModal('export')">导出统计</button>
          <button class="secondary-btn" @click="openModal('archive')">归档入库</button>
        </div>
      </div>
      <div class="summary">
        <div class="summary-card">
          <h4>报告生成</h4>
          <p>本月已生成 26 份</p>
        </div>
        <div class="summary-card">
          <h4>归档率</h4>
          <p>91%</p>
        </div>
        <div class="summary-card">
          <h4>数据统计</h4>
          <p>覆盖 148 项指标</p>
        </div>
      </div>
      <div class="chart">
        <div v-for="item in chart" :key="item.label" class="chart-item">
          <div class="chart-value">{{ item.value }}</div>
          <div class="chart-label">{{ item.label }}</div>
        </div>
      </div>
    </section>

    <section class="panel">
      <h3>验收报告归档表</h3>
      <div class="table-wrapper">
        <table class="table">
          <thead>
            <tr>
              <th>报告编号</th>
              <th>楼宇</th>
              <th>完成时间</th>
              <th>结论</th>
              <th>归档人</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in rows" :key="row.id">
              <td>{{ row.id }}</td>
              <td>{{ row.project }}</td>
              <td>{{ row.date }}</td>
              <td>{{ row.result }}</td>
              <td>{{ row.owner }}</td>
              <td>
                <div class="action-group">
                  <button class="secondary-btn" @click="openModal('detail', row)">查看</button>
                  <button class="secondary-btn" @click="openModal('download', row)">下载</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <BaseModal v-if="activeModal" :title="modalTitle" @close="closeModal" @confirm="confirmModal">
      <template v-if="activeModal === 'generate'">
        <p>即将生成综合验收报告，包含各部门会签结果与整改清单。</p>
      </template>
      <template v-else-if="activeModal === 'export'">
        <p>统计数据将导出为 Excel 与 PDF，包含验收进度与问题类型。</p>
      </template>
      <template v-else-if="activeModal === 'archive'">
        <p>归档入库后将同步到项目管理与验收计划模块。</p>
      </template>
      <template v-else-if="activeModal === 'detail'">
        <p>报告 {{ selected?.id }} 结论为 {{ selected?.result }}，归档人 {{ selected?.owner }}。</p>
      </template>
      <template v-else>
        <p>已为 {{ selected?.project }} 准备报告下载链接。</p>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const chart = [
  { label: '已完成', value: '82%' },
  { label: '待归档', value: '9%' },
  { label: '整改中', value: '6%' },
  { label: '待复核', value: '3%' }
];

const rows = Array.from({ length: 20 }, (_, index) => ({
  id: `REP-${5001 + index}`,
  project: `滨江中心 ${index + 1} 号楼`,
  date: `2024-0${(index % 9) + 1}-15`,
  result: ['通过', '需整改', '复核中'][index % 3],
  owner: ['赵主管', '钱主管', '孙主管'][index % 3]
}));

const activeModal = ref('');
const selected = ref(null);

const modalTitle = computed(() => {
  const map = {
    generate: '生成报告',
    export: '导出统计',
    archive: '归档入库',
    detail: '报告详情',
    download: '下载报告'
  };
  return map[activeModal.value] || '提示';
});

function openModal(type, row) {
  activeModal.value = type;
  selected.value = row || null;
}

function closeModal() {
  activeModal.value = '';
}

function confirmModal() {
  closeModal();
}
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.panel {
  background: #fff;
  padding: 24px;
  border-radius: 18px;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.06);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 20px;
}

.summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.summary-card {
  background: #f8fafc;
  padding: 16px;
  border-radius: 14px;
}

.chart {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.chart-item {
  background: linear-gradient(135deg, #e0f2fe, #fef9c3);
  padding: 14px;
  border-radius: 14px;
  text-align: center;
}

.chart-value {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 4px;
}

.chart-label {
  font-size: 12px;
  color: #64748b;
}

@media (max-width: 960px) {
  .summary {
    grid-template-columns: 1fr;
  }

  .chart {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
