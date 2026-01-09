<template>
  <div class="page">
    <section class="panel">
      <div class="panel-header">
        <div>
          <h3>报价与订单协同</h3>
          <p>订单参数自动校验标准一致性，支持变更回溯。</p>
        </div>
        <div class="actions">
          <button class="primary" type="button" @click="openModal('quote')">生成报价</button>
          <button class="secondary" type="button" @click="openModal('check')">标准一致性校验</button>
          <button class="secondary" type="button" @click="openModal('change')">订单变更回溯</button>
          <button class="secondary" type="button" @click="openModal('approve')">审批进度</button>
        </div>
      </div>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>订单编号</th>
              <th>客户</th>
              <th>标准</th>
              <th>规格</th>
              <th>数量</th>
              <th>状态</th>
              <th>校验结果</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in tableRows" :key="row.id">
              <td>{{ row.id }}</td>
              <td>{{ row.customer }}</td>
              <td>{{ row.standard }}</td>
              <td>{{ row.size }}</td>
              <td>{{ row.qty }}</td>
              <td>{{ row.status }}</td>
              <td>{{ row.check }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section class="panel">
      <div class="panel-header">
        <h3>订单参数一致性看板</h3>
        <button class="secondary" type="button" @click="openModal('risk')">风险提示</button>
      </div>
      <div class="grid">
        <div class="stat">
          <h4>一致性通过</h4>
          <p>18 单</p>
          <span>占比 86%</span>
        </div>
        <div class="stat">
          <h4>需补充</h4>
          <p>3 单</p>
          <span>尺寸公差缺失</span>
        </div>
        <div class="stat">
          <h4>存在超标</h4>
          <p>2 单</p>
          <span>已触发预警</span>
        </div>
      </div>
    </section>

    <Modal :show="modalVisible" :title="modalTitle" @close="modalVisible = false">
      <div v-if="modalType === 'quote'" class="modal-content">
        <label>
          订单编号
          <input type="text" placeholder="请输入订单编号" />
        </label>
        <label>
          报价策略
          <select>
            <option>标准价+合金附加</option>
            <option>批量折扣</option>
            <option>定制溢价</option>
          </select>
        </label>
        <label>
          报价有效期
          <input type="date" />
        </label>
      </div>
      <div v-else-if="modalType === 'check'" class="modal-content">
        <p>系统正在校验订单参数与标准一致性。</p>
        <div class="progress">
          <div class="progress-bar" :style="{ width: '74%' }"></div>
        </div>
        <p class="hint">已校验 14/19 单。</p>
      </div>
      <div v-else-if="modalType === 'change'" class="modal-content">
        <label>
          变更原因
          <textarea rows="3" placeholder="填写订单变更原因"></textarea>
        </label>
        <label>
          关联标准
          <select>
            <option>ST-002 / 42CrMo</option>
            <option>ST-006 / 30CrMo</option>
          </select>
        </label>
      </div>
      <div v-else-if="modalType === 'approve'" class="modal-content">
        <p>订单 SO-8899 审批进度 50%。</p>
        <div class="progress">
          <div class="progress-bar" :style="{ width: '50%' }"></div>
        </div>
        <ul>
          <li>销售经理：已审批</li>
          <li>技术负责人：审批中</li>
          <li>质量负责人：待审批</li>
        </ul>
      </div>
      <div v-else class="modal-content">
        <p>当前风险提示：</p>
        <ul>
          <li>SO-8842：屈服强度超标 5%</li>
          <li>SO-8899：冲击功缺项</li>
        </ul>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Modal from '../components/Modal.vue';

const tableRows = [
  { id: 'SO-8801', customer: '华北重工', standard: 'ST-002', size: 'Φ85×3200', qty: '120 吨', status: '执行中', check: '通过' },
  { id: 'SO-8802', customer: '明达轴承', standard: 'ST-004', size: 'Φ60×6000', qty: '80 吨', status: '执行中', check: '需补充' },
  { id: 'SO-8803', customer: '恒新齿轮', standard: 'ST-004', size: 'Φ120×4000', qty: '150 吨', status: '执行中', check: '通过' },
  { id: 'SO-8804', customer: '高原机械', standard: 'ST-003', size: 'Φ150×5000', qty: '60 吨', status: '审批中', check: '超标' },
  { id: 'SO-8805', customer: '东部车辆', standard: 'ST-007', size: 'Φ70×3000', qty: '90 吨', status: '执行中', check: '通过' },
  { id: 'SO-8806', customer: '汇川装备', standard: 'ST-006', size: 'Φ90×2600', qty: '110 吨', status: '执行中', check: '需补充' },
  { id: 'SO-8807', customer: '立新电机', standard: 'ST-001', size: 'Φ55×2600', qty: '70 吨', status: '执行中', check: '通过' },
  { id: 'SO-8808', customer: '天泽轴承', standard: 'ST-005', size: 'Φ75×4200', qty: '95 吨', status: '执行中', check: '通过' },
  { id: 'SO-8809', customer: '众成弹簧', standard: 'ST-009', size: 'Φ38×6000', qty: '40 吨', status: '执行中', check: '通过' },
  { id: 'SO-8810', customer: '锐虎机械', standard: 'ST-010', size: 'Φ110×3800', qty: '130 吨', status: '执行中', check: '通过' },
  { id: 'SO-8811', customer: '力拓能源', standard: 'ST-015', size: 'Φ95×4200', qty: '100 吨', status: '执行中', check: '通过' },
  { id: 'SO-8812', customer: '瑞科制造', standard: 'ST-016', size: 'Φ130×4500', qty: '75 吨', status: '执行中', check: '通过' },
  { id: 'SO-8813', customer: '中盈轴类', standard: 'ST-019', size: 'Φ65×2800', qty: '85 吨', status: '执行中', check: '通过' },
  { id: 'SO-8814', customer: '兴沃装备', standard: 'ST-011', size: 'Φ160×5000', qty: '50 吨', status: '审批中', check: '超标' },
  { id: 'SO-8815', customer: '宏源矿机', standard: 'ST-019', size: 'Φ180×6000', qty: '66 吨', status: '执行中', check: '通过' },
  { id: 'SO-8816', customer: '德信轴承', standard: 'ST-004', size: 'Φ40×3000', qty: '95 吨', status: '执行中', check: '通过' },
  { id: 'SO-8817', customer: '新港齿轮', standard: 'ST-010', size: 'Φ125×3600', qty: '120 吨', status: '执行中', check: '通过' },
  { id: 'SO-8818', customer: '南山机械', standard: 'ST-020', size: 'Φ45×4500', qty: '45 吨', status: '执行中', check: '通过' },
  { id: 'SO-8819', customer: '力航重工', standard: 'ST-017', size: 'Φ200×5500', qty: '70 吨', status: '审批中', check: '需补充' },
  { id: 'SO-8820', customer: '瑞德装备', standard: 'ST-001', size: 'Φ80×3200', qty: '88 吨', status: '执行中', check: '通过' },
  { id: 'SO-8821', customer: '海力重载', standard: 'ST-003', size: 'Φ140×4500', qty: '64 吨', status: '执行中', check: '通过' },
  { id: 'SO-8822', customer: '启航制造', standard: 'ST-006', size: 'Φ90×3600', qty: '72 吨', status: '执行中', check: '通过' }
];

const modalVisible = ref(false);
const modalType = ref('');
const modalTitle = ref('');

const titles = {
  quote: '生成报价',
  check: '标准一致性校验',
  change: '订单变更回溯',
  approve: '审批进度',
  risk: '订单风险提示'
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

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.stat {
  background: #f8fafc;
  border-radius: 14px;
  padding: 16px;
  display: grid;
  gap: 6px;
}

.stat p {
  font-size: 24px;
  font-weight: 700;
}

.stat span {
  color: #64748b;
  font-size: 12px;
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
select,
textarea {
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
</style>
