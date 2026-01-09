<template>
  <div class="page">
    <section class="panel">
      <div class="panel-header">
        <div>
          <h3>数据分析与决策支持</h3>
          <p>可视化关键指标，辅助标准优化与销售策略。</p>
        </div>
        <div class="actions">
          <button class="primary" type="button" @click="openModal('filter')">筛选指标</button>
          <button class="secondary" type="button" @click="openModal('download')">下载分析</button>
          <button class="secondary" type="button" @click="openModal('share')">共享看板</button>
        </div>
      </div>
      <div class="analysis-grid">
        <div class="chart-card">
          <h4>标准使用频率分布</h4>
          <svg viewBox="0 0 300 160" class="chart">
            <rect x="30" y="60" width="30" height="80" fill="#60a5fa" />
            <rect x="80" y="40" width="30" height="100" fill="#34d399" />
            <rect x="130" y="20" width="30" height="120" fill="#f59e0b" />
            <rect x="180" y="50" width="30" height="90" fill="#818cf8" />
            <rect x="230" y="30" width="30" height="110" fill="#f472b6" />
          </svg>
          <p>高频标准集中在 42CrMo、20CrMnTi、GCr15。</p>
        </div>
        <div class="chart-card">
          <h4>订单转化效率</h4>
          <svg viewBox="0 0 300 160" class="chart">
            <circle cx="80" cy="80" r="60" fill="#e2e8f0" />
            <path d="M80 20 A60 60 0 1 1 30 120" fill="none" stroke="#2563eb" stroke-width="14" />
            <text x="80" y="90" text-anchor="middle" font-size="20" fill="#1e3a8a">86%</text>
          </svg>
          <p>报价转化率提升 4%，定制化项目贡献 22%。</p>
        </div>
      </div>
    </section>

    <section class="panel">
      <div class="panel-header">
        <h3>关键指标明细</h3>
        <button class="secondary" type="button" @click="openModal('alert')">异常提示</button>
      </div>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>指标</th>
              <th>当前值</th>
              <th>目标值</th>
              <th>趋势</th>
              <th>责任部门</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in tableRows" :key="row.metric">
              <td>{{ row.metric }}</td>
              <td>{{ row.current }}</td>
              <td>{{ row.target }}</td>
              <td>{{ row.trend }}</td>
              <td>{{ row.owner }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <Modal :show="modalVisible" :title="modalTitle" @close="modalVisible = false">
      <div v-if="modalType === 'filter'" class="modal-content">
        <label>
          时间范围
          <select>
            <option>近 7 天</option>
            <option>近 30 天</option>
            <option>本季度</option>
          </select>
        </label>
        <label>
          指标类型
          <select>
            <option>标准使用</option>
            <option>销售转化</option>
            <option>订单合规</option>
          </select>
        </label>
      </div>
      <div v-else-if="modalType === 'download'" class="modal-content">
        <label>
          文件格式
          <select>
            <option>PDF</option>
            <option>Excel</option>
            <option>PPT</option>
          </select>
        </label>
        <label>
          是否包含图表
          <select>
            <option>包含</option>
            <option>不包含</option>
          </select>
        </label>
      </div>
      <div v-else-if="modalType === 'share'" class="modal-content">
        <label>
          共享对象
          <input type="text" placeholder="输入邮箱或部门" />
        </label>
        <label>
          权限级别
          <select>
            <option>只读</option>
            <option>可编辑</option>
          </select>
        </label>
      </div>
      <div v-else class="modal-content">
        <p>存在 2 项指标低于目标值：</p>
        <ul>
          <li>标准匹配成功率 91%（目标 95%）</li>
          <li>订单变更回溯率 78%（目标 85%）</li>
        </ul>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Modal from '../components/Modal.vue';

const tableRows = [
  { metric: '标准使用频率', current: '328 次', target: '300 次', trend: '上升', owner: '技术部' },
  { metric: '销售需求匹配率', current: '92.6%', target: '95%', trend: '上升', owner: '销售部' },
  { metric: '订单合规率', current: '98.1%', target: '97%', trend: '稳定', owner: '质量部' },
  { metric: '定制化占比', current: '27%', target: '30%', trend: '上升', owner: '销售部' },
  { metric: '标准修订周期', current: '12 天', target: '10 天', trend: '下降', owner: '技术部' },
  { metric: '标准评审通过率', current: '88%', target: '90%', trend: '上升', owner: '质量部' },
  { metric: '订单转化效率', current: '86%', target: '88%', trend: '上升', owner: '销售部' },
  { metric: '超标预警次数', current: '3 次', target: '2 次', trend: '下降', owner: '质量部' },
  { metric: '临时标准占比', current: '12%', target: '10%', trend: '上升', owner: '技术部' },
  { metric: '需求建模时效', current: '1.2 天', target: '1 天', trend: '稳定', owner: '销售部' },
  { metric: '订单变更回溯率', current: '78%', target: '85%', trend: '下降', owner: '技术部' },
  { metric: '标准培训覆盖率', current: '91%', target: '95%', trend: '上升', owner: '管理部' },
  { metric: '协同任务准时率', current: '88%', target: '90%', trend: '稳定', owner: '管理部' },
  { metric: '销售匹配成功率', current: '89%', target: '92%', trend: '上升', owner: '销售部' },
  { metric: '质量复核通过率', current: '93%', target: '95%', trend: '上升', owner: '质量部' },
  { metric: '订单补充次数', current: '5 次', target: '3 次', trend: '下降', owner: '销售部' },
  { metric: '标准库更新频率', current: '每周', target: '每周', trend: '稳定', owner: '技术部' },
  { metric: '重点客户覆盖率', current: '82%', target: '85%', trend: '上升', owner: '销售部' },
  { metric: '标准审计通过率', current: '96%', target: '97%', trend: '稳定', owner: '质量部' },
  { metric: '需求响应时效', current: '8 小时', target: '6 小时', trend: '下降', owner: '销售部' },
  { metric: '标准执行合规性', current: '98%', target: '99%', trend: '上升', owner: '质量部' },
  { metric: '协同闭环率', current: '90%', target: '92%', trend: '上升', owner: '管理部' }
];

const modalVisible = ref(false);
const modalType = ref('');
const modalTitle = ref('');

const titles = {
  filter: '筛选指标',
  download: '下载分析报告',
  share: '共享看板',
  alert: '异常提示'
};

const openModal = (type) => {
  modalType.value = type;
  modalTitle.value = titles[type];
  modalVisible.value = true;
};
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.panel {
  background: white;
  border-radius: 18px;
  padding: 20px;
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.06);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.panel-header p {
  color: #64748b;
  font-size: 13px;
}

.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.primary,
.secondary {
  border: none;
  border-radius: 10px;
  padding: 8px 14px;
  cursor: pointer;
}

.primary {
  background: #2563eb;
  color: white;
}

.secondary {
  background: #e0e7ff;
  color: #1e3a8a;
}

.analysis-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
}

.chart-card {
  background: #f8fafc;
  border-radius: 16px;
  padding: 16px;
  display: grid;
  gap: 10px;
}

.chart {
  width: 100%;
  height: auto;
}

.chart-card p {
  color: #64748b;
  font-size: 12px;
}

.table-wrapper {
  overflow-x: auto;
}

th,
 td {
  padding: 10px 12px;
  border-bottom: 1px solid #e2e8f0;
  text-align: left;
  font-size: 14px;
}

th {
  background: #f8fafc;
  color: #475569;
}

.modal-content {
  display: grid;
  gap: 12px;
}

.modal-content label {
  display: grid;
  gap: 6px;
  font-size: 14px;
}

input,
select {
  border: 1px solid #cbd5f5;
  border-radius: 8px;
  padding: 8px 10px;
}
</style>
