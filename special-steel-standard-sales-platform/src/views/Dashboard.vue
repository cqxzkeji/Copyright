<template>
  <div class="page">
    <section class="summary">
      <div class="card">
        <h3>标准库总量</h3>
        <p class="value">328</p>
        <span>本月新增 12</span>
      </div>
      <div class="card">
        <h3>需求匹配成功率</h3>
        <p class="value">92.6%</p>
        <span>较上月 +1.8%</span>
      </div>
      <div class="card">
        <h3>订单合规率</h3>
        <p class="value">98.1%</p>
        <span>超标预警 3 单</span>
      </div>
      <div class="card">
        <h3>定制化占比</h3>
        <p class="value">27%</p>
        <span>重点跟进 8 项</span>
      </div>
    </section>

    <section class="panel">
      <div class="panel-header">
        <h3>标准与销售联动趋势</h3>
        <div class="actions">
          <button class="secondary" type="button" @click="openModal('refresh')">刷新数据</button>
          <button class="secondary" type="button" @click="openModal('export')">导出看板</button>
          <button class="secondary" type="button" @click="openModal('alert')">查看告警</button>
        </div>
      </div>
      <div class="chart-grid">
        <svg viewBox="0 0 420 180" class="chart">
          <polyline
            points="20,140 80,120 140,90 200,105 260,70 320,65 380,40"
            fill="none"
            stroke="#2563eb"
            stroke-width="3"
          />
          <polyline
            points="20,150 80,130 140,110 200,115 260,90 320,85 380,60"
            fill="none"
            stroke="#14b8a6"
            stroke-width="3"
          />
        </svg>
        <div class="legend">
          <div>
            <span class="dot primary"></span> 标准匹配率
          </div>
          <div>
            <span class="dot secondary"></span> 订单转化率
          </div>
          <div class="note">
            <p>本周重点：45Cr、42CrMo 等标准使用频次提升。</p>
            <p>销售端反馈：电机轴用钢需求增加 12%。</p>
          </div>
        </div>
      </div>
    </section>

    <section class="panel">
      <div class="panel-header">
        <h3>最新标准执行清单</h3>
        <button class="primary" type="button" @click="openModal('task')">生成督办任务</button>
      </div>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>标准编号</th>
              <th>钢种</th>
              <th>版本</th>
              <th>状态</th>
              <th>使用频次</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in tableRows" :key="row.code">
              <td>{{ row.code }}</td>
              <td>{{ row.grade }}</td>
              <td>{{ row.version }}</td>
              <td>{{ row.status }}</td>
              <td>{{ row.usage }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <Modal :show="modalVisible" :title="modalTitle" @close="modalVisible = false">
      <div v-if="modalType === 'refresh'" class="modal-content">
        <p>正在同步销售与标准库数据，请稍候。</p>
        <div class="progress">
          <div class="progress-bar" :style="{ width: '76%' }"></div>
        </div>
        <p class="hint">已完成 76%，预计 12 秒。</p>
      </div>
      <div v-else-if="modalType === 'export'" class="modal-content">
        <label>
          导出范围
          <select>
            <option>全部指标</option>
            <option>标准与销售匹配</option>
            <option>订单合规与预警</option>
          </select>
        </label>
        <label>
          文件格式
          <select>
            <option>PDF</option>
            <option>Excel</option>
            <option>PNG 图片</option>
          </select>
        </label>
      </div>
      <div v-else-if="modalType === 'alert'" class="modal-content">
        <p>当前存在 3 条超标预警，请及时处理。</p>
        <ul>
          <li>订单 SO-8842：屈服强度偏离标准 +6%</li>
          <li>订单 SO-8899：冲击功缺项</li>
          <li>订单 SO-8904：尺寸公差未匹配</li>
        </ul>
      </div>
      <div v-else class="modal-content">
        <label>
          任务名称
          <input type="text" placeholder="请输入督办任务名称" />
        </label>
        <label>
          截止日期
          <input type="date" />
        </label>
        <label>
          责任部门
          <select>
            <option>技术部</option>
            <option>质量部</option>
            <option>销售部</option>
          </select>
        </label>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Modal from '../components/Modal.vue';

const tableRows = [
  { code: 'ST-001', grade: '40Cr', version: 'V3.2', status: '执行中', usage: '48 次' },
  { code: 'ST-002', grade: '42CrMo', version: 'V2.1', status: '执行中', usage: '44 次' },
  { code: 'ST-003', grade: '35CrMo', version: 'V1.9', status: '复审中', usage: '39 次' },
  { code: 'ST-004', grade: '20CrMnTi', version: 'V2.4', status: '执行中', usage: '36 次' },
  { code: 'ST-005', grade: 'GCr15', version: 'V4.0', status: '执行中', usage: '35 次' },
  { code: 'ST-006', grade: '30CrMo', version: 'V2.7', status: '修订中', usage: '32 次' },
  { code: 'ST-007', grade: '45Cr', version: 'V3.0', status: '执行中', usage: '31 次' },
  { code: 'ST-008', grade: '38CrMoAl', version: 'V1.5', status: '执行中', usage: '29 次' },
  { code: 'ST-009', grade: '55SiCr', version: 'V2.0', status: '执行中', usage: '28 次' },
  { code: 'ST-010', grade: '60Si2Mn', version: 'V1.8', status: '执行中', usage: '27 次' },
  { code: 'ST-011', grade: '17CrNiMo6', version: 'V2.2', status: '复审中', usage: '26 次' },
  { code: 'ST-012', grade: '20MnCr5', version: 'V1.6', status: '执行中', usage: '25 次' },
  { code: 'ST-013', grade: '34CrNiMo6', version: 'V2.3', status: '执行中', usage: '24 次' },
  { code: 'ST-014', grade: '25Cr2MoV', version: 'V1.4', status: '修订中', usage: '23 次' },
  { code: 'ST-015', grade: '30CrNiMo8', version: 'V2.1', status: '执行中', usage: '22 次' },
  { code: 'ST-016', grade: '16MnCr5', version: 'V1.3', status: '执行中', usage: '21 次' },
  { code: 'ST-017', grade: '20Cr2Ni4A', version: 'V2.9', status: '执行中', usage: '20 次' },
  { code: 'ST-018', grade: '45Mn2', version: 'V1.5', status: '复审中', usage: '19 次' },
  { code: 'ST-019', grade: '35SiMn', version: 'V1.7', status: '执行中', usage: '18 次' },
  { code: 'ST-020', grade: '50CrV', version: 'V1.9', status: '执行中', usage: '17 次' },
  { code: 'ST-021', grade: '15CrMo', version: 'V2.0', status: '执行中', usage: '16 次' },
  { code: 'ST-022', grade: '20CrNi2Mo', version: 'V1.8', status: '修订中', usage: '15 次' }
];

const modalVisible = ref(false);
const modalType = ref('');
const modalTitle = ref('');

const titles = {
  refresh: '数据刷新进度',
  export: '导出看板',
  alert: '异常预警',
  task: '生成督办任务'
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

.summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.card {
  background: white;
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.08);
}

.card .value {
  font-size: 28px;
  margin: 8px 0;
  font-weight: 700;
}

.card span {
  color: #64748b;
  font-size: 13px;
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
  flex-wrap: wrap;
  gap: 12px;
}

.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.secondary,
.primary {
  border: none;
  border-radius: 10px;
  padding: 8px 14px;
  cursor: pointer;
}

.secondary {
  background: #e0e7ff;
  color: #1e3a8a;
}

.primary {
  background: #2563eb;
  color: white;
}

.chart-grid {
  display: grid;
  grid-template-columns: minmax(240px, 1fr) 220px;
  gap: 20px;
  align-items: center;
}

.chart {
  width: 100%;
  background: #f8fafc;
  border-radius: 12px;
  padding: 12px;
}

.legend {
  display: grid;
  gap: 12px;
  font-size: 14px;
  color: #475569;
}

.dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 6px;
}

.dot.primary {
  background: #2563eb;
}

.dot.secondary {
  background: #14b8a6;
}

.note {
  background: #eff6ff;
  padding: 10px;
  border-radius: 10px;
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

select,
input[type='text'],
input[type='date'] {
  border: 1px solid #cbd5f5;
  border-radius: 8px;
  padding: 8px 10px;
}

.progress {
  width: 100%;
  background: #e2e8f0;
  border-radius: 999px;
  height: 10px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #2563eb, #14b8a6);
}

.hint {
  font-size: 12px;
  color: #64748b;
}

@media (max-width: 960px) {
  .chart-grid {
    grid-template-columns: 1fr;
  }
}
</style>
