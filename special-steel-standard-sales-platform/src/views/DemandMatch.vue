<template>
  <div class="page">
    <section class="panel">
      <div class="panel-header">
        <div>
          <h3>销售需求建模</h3>
          <p>支持钢种、规格、性能指标多维度需求输入。</p>
        </div>
        <div class="actions">
          <button class="primary" type="button" @click="openModal('new')">新增需求</button>
          <button class="secondary" type="button" @click="openModal('match')">自动匹配</button>
          <button class="secondary" type="button" @click="openModal('simulate')">模拟调整</button>
          <button class="secondary" type="button" @click="openModal('report')">输出匹配报告</button>
        </div>
      </div>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>需求编号</th>
              <th>客户</th>
              <th>钢种</th>
              <th>规格</th>
              <th>性能指标</th>
              <th>匹配结果</th>
              <th>负责人</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in tableRows" :key="row.id">
              <td>{{ row.id }}</td>
              <td>{{ row.customer }}</td>
              <td>{{ row.grade }}</td>
              <td>{{ row.size }}</td>
              <td>{{ row.metric }}</td>
              <td>{{ row.match }}</td>
              <td>{{ row.owner }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section class="panel">
      <div class="panel-header">
        <h3>标准匹配概览</h3>
        <button class="secondary" type="button" @click="openModal('tips')">匹配策略提示</button>
      </div>
      <div class="grid">
        <div class="stat">
          <h4>可直接应用</h4>
          <p>14 项</p>
          <span>覆盖 62% 需求</span>
        </div>
        <div class="stat">
          <h4>需调整标准</h4>
          <p>6 项</p>
          <span>建议修订 3 项</span>
        </div>
        <div class="stat">
          <h4>需新制定标准</h4>
          <p>4 项</p>
          <span>重点跟踪客户</span>
        </div>
      </div>
    </section>

    <Modal :show="modalVisible" :title="modalTitle" @close="modalVisible = false">
      <div v-if="modalType === 'new'" class="modal-content">
        <label>
          客户名称
          <input type="text" placeholder="输入客户名称" />
        </label>
        <label>
          钢种/牌号
          <input type="text" placeholder="例如 42CrMo" />
        </label>
        <label>
          关键指标
          <textarea rows="3" placeholder="输入性能指标"></textarea>
        </label>
      </div>
      <div v-else-if="modalType === 'match'" class="modal-content">
        <p>系统正在匹配标准库，请稍候。</p>
        <div class="progress">
          <div class="progress-bar" :style="{ width: '82%' }"></div>
        </div>
        <p class="hint">已匹配 18/22 项需求。</p>
      </div>
      <div v-else-if="modalType === 'simulate'" class="modal-content">
        <p>选择标准调整策略以评估影响。</p>
        <label>
          调整方式
          <select>
            <option>化学成分微调</option>
            <option>热处理制度优化</option>
            <option>尺寸公差放宽</option>
          </select>
        </label>
        <label>
          影响范围
          <select>
            <option>重点客户</option>
            <option>全部需求</option>
            <option>试点订单</option>
          </select>
        </label>
      </div>
      <div v-else-if="modalType === 'report'" class="modal-content">
        <label>
          报告格式
          <select>
            <option>PDF</option>
            <option>Excel</option>
            <option>Word</option>
          </select>
        </label>
        <label>
          接收邮箱
          <input type="email" placeholder="sales-team@company.com" />
        </label>
      </div>
      <div v-else class="modal-content">
        <p>推荐策略：优先调整已使用频率高的标准，缩短新标制定周期。</p>
        <ul>
          <li>保持主流钢种参数不变，降低审批阻力。</li>
          <li>对新客户需求建立临时标准，期限 30 天。</li>
        </ul>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Modal from '../components/Modal.vue';

const tableRows = [
  { id: 'DM-001', customer: '华北重工', grade: '42CrMo', size: 'Φ85×3200', metric: '抗拉≥1080MPa', match: '直接应用', owner: '陈晓' },
  { id: 'DM-002', customer: '明达轴承', grade: 'GCr15', size: 'Φ60×6000', metric: '洁净度≤1.5', match: '需调整', owner: '王慧' },
  { id: 'DM-003', customer: '恒新齿轮', grade: '20CrMnTi', size: 'Φ120×4000', metric: '渗碳层≥1.2', match: '直接应用', owner: '李峰' },
  { id: 'DM-004', customer: '高原机械', grade: '35CrMo', size: 'Φ150×5000', metric: '冲击功≥40J', match: '需新制定', owner: '刘颖' },
  { id: 'DM-005', customer: '东部车辆', grade: '45Cr', size: 'Φ70×3000', metric: '硬度HB229-269', match: '直接应用', owner: '赵斌' },
  { id: 'DM-006', customer: '汇川装备', grade: '30CrMo', size: 'Φ90×2600', metric: '淬透性≥32', match: '需调整', owner: '孙悦' },
  { id: 'DM-007', customer: '立新电机', grade: '40Cr', size: 'Φ55×2600', metric: '硬度HB220-255', match: '直接应用', owner: '徐娜' },
  { id: 'DM-008', customer: '天泽轴承', grade: 'GCr15', size: 'Φ75×4200', metric: '氧含量≤10ppm', match: '需调整', owner: '王浩' },
  { id: 'DM-009', customer: '众成弹簧', grade: '60Si2Mn', size: 'Φ38×6000', metric: '疲劳寿命≥1e6', match: '直接应用', owner: '陈玉' },
  { id: 'DM-010', customer: '锐虎机械', grade: '20MnCr5', size: 'Φ110×3800', metric: '硬度HRC58-62', match: '直接应用', owner: '邓倩' },
  { id: 'DM-011', customer: '力拓能源', grade: '15CrMo', size: 'Φ95×4200', metric: '高温强度≥520', match: '需调整', owner: '李雯' },
  { id: 'DM-012', customer: '瑞科制造', grade: '30CrNiMo8', size: 'Φ130×4500', metric: '屈服≥900MPa', match: '需新制定', owner: '周宁' },
  { id: 'DM-013', customer: '中盈轴类', grade: '35SiMn', size: 'Φ65×2800', metric: '硬度HB235-255', match: '直接应用', owner: '吴杰' },
  { id: 'DM-014', customer: '兴沃装备', grade: '17CrNiMo6', size: 'Φ160×5000', metric: '冲击功≥45J', match: '需调整', owner: '王天' },
  { id: 'DM-015', customer: '宏源矿机', grade: '25Cr2MoV', size: 'Φ180×6000', metric: '淬透性≥35', match: '需新制定', owner: '刘博' },
  { id: 'DM-016', customer: '德信轴承', grade: 'GCr15', size: 'Φ40×3000', metric: '夹杂物≤1.0', match: '直接应用', owner: '吴怡' },
  { id: 'DM-017', customer: '新港齿轮', grade: '20CrNiMo', size: 'Φ125×3600', metric: '渗碳层≥1.1', match: '直接应用', owner: '杨杰' },
  { id: 'DM-018', customer: '南山机械', grade: '50CrV', size: 'Φ45×4500', metric: '疲劳强度≥600', match: '需调整', owner: '郑鹏' },
  { id: 'DM-019', customer: '力航重工', grade: '20Cr2Ni4A', size: 'Φ200×5500', metric: '硬度HRC55-60', match: '需新制定', owner: '孙倩' },
  { id: 'DM-020', customer: '瑞德装备', grade: '40Cr', size: 'Φ80×3200', metric: '冲击功≥35J', match: '直接应用', owner: '陈楠' },
  { id: 'DM-021', customer: '海力重载', grade: '35CrMo', size: 'Φ140×4500', metric: '强度≥980MPa', match: '需调整', owner: '罗欣' },
  { id: 'DM-022', customer: '启航制造', grade: '30CrMo', size: 'Φ90×3600', metric: '硬度HB240-260', match: '直接应用', owner: '朱倩' }
];

const modalVisible = ref(false);
const modalType = ref('');
const modalTitle = ref('');

const titles = {
  new: '新增销售需求',
  match: '标准自动匹配',
  simulate: '匹配调整模拟',
  report: '输出匹配报告',
  tips: '匹配策略提示'
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
