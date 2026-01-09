<template>
  <div class="page">
    <section class="panel">
      <div class="panel-header">
        <div>
          <h3>流程协同与权限控制</h3>
          <p>覆盖技术、销售、质量多角色协作与审批。</p>
        </div>
        <div class="actions">
          <button class="primary" type="button" @click="openModal('assign')">任务分派</button>
          <button class="secondary" type="button" @click="openModal('approve')">节点审批</button>
          <button class="secondary" type="button" @click="openModal('track')">进度跟踪</button>
          <button class="secondary" type="button" @click="openModal('permission')">权限申请</button>
        </div>
      </div>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>流程编号</th>
              <th>事项</th>
              <th>角色</th>
              <th>节点</th>
              <th>状态</th>
              <th>截止日期</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in tableRows" :key="row.id">
              <td>{{ row.id }}</td>
              <td>{{ row.task }}</td>
              <td>{{ row.role }}</td>
              <td>{{ row.step }}</td>
              <td>{{ row.status }}</td>
              <td>{{ row.deadline }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section class="panel">
      <div class="panel-header">
        <h3>权限矩阵概览</h3>
        <button class="secondary" type="button" @click="openModal('matrix')">查看权限矩阵</button>
      </div>
      <div class="grid">
        <div class="stat">
          <h4>技术角色</h4>
          <p>18 项权限</p>
          <span>标准、订单编辑</span>
        </div>
        <div class="stat">
          <h4>销售角色</h4>
          <p>12 项权限</p>
          <span>需求录入、报价</span>
        </div>
        <div class="stat">
          <h4>质量角色</h4>
          <p>9 项权限</p>
          <span>审核、放行</span>
        </div>
      </div>
    </section>

    <Modal :show="modalVisible" :title="modalTitle" @close="modalVisible = false">
      <div v-if="modalType === 'assign'" class="modal-content">
        <label>
          任务名称
          <input type="text" placeholder="输入任务名称" />
        </label>
        <label>
          执行角色
          <select>
            <option>技术部</option>
            <option>销售部</option>
            <option>质量部</option>
          </select>
        </label>
        <label>
          截止日期
          <input type="date" />
        </label>
      </div>
      <div v-else-if="modalType === 'approve'" class="modal-content">
        <p>节点审批进度 60%。</p>
        <div class="progress">
          <div class="progress-bar" :style="{ width: '60%' }"></div>
        </div>
        <label>
          审批意见
          <textarea rows="3" placeholder="填写审批意见"></textarea>
        </label>
      </div>
      <div v-else-if="modalType === 'track'" class="modal-content">
        <p>流程 PR-004 当前处于“质量复核”阶段。</p>
        <ul>
          <li>技术确认：已完成</li>
          <li>销售确认：已完成</li>
          <li>质量复核：进行中</li>
        </ul>
      </div>
      <div v-else-if="modalType === 'permission'" class="modal-content">
        <label>
          申请模块
          <select>
            <option>标准管理</option>
            <option>订单协同</option>
            <option>数据分析</option>
          </select>
        </label>
        <label>
          申请说明
          <textarea rows="3" placeholder="填写申请原因"></textarea>
        </label>
      </div>
      <div v-else class="modal-content">
        <p>权限矩阵已更新，下一次同步时间为 18:00。</p>
        <ul>
          <li>技术角色新增“标准修订”权限。</li>
          <li>销售角色新增“需求驳回”权限。</li>
        </ul>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Modal from '../components/Modal.vue';

const tableRows = [
  { id: 'PR-001', task: 'ST-002 修订评审', role: '技术', step: '评审', status: '进行中', deadline: '2024-03-15' },
  { id: 'PR-002', task: 'DM-004 新需求建模', role: '销售', step: '建模', status: '已完成', deadline: '2024-03-12' },
  { id: 'PR-003', task: 'SO-8804 超标处理', role: '质量', step: '复核', status: '进行中', deadline: '2024-03-14' },
  { id: 'PR-004', task: 'ST-011 复审', role: '质量', step: '复核', status: '进行中', deadline: '2024-03-16' },
  { id: 'PR-005', task: 'SO-8806 订单校验', role: '技术', step: '校验', status: '已完成', deadline: '2024-03-11' },
  { id: 'PR-006', task: 'DM-006 匹配模拟', role: '销售', step: '模拟', status: '进行中', deadline: '2024-03-13' },
  { id: 'PR-007', task: 'ST-006 发布审批', role: '管理', step: '审批', status: '待处理', deadline: '2024-03-18' },
  { id: 'PR-008', task: 'SO-8814 超标评估', role: '质量', step: '复核', status: '待处理', deadline: '2024-03-19' },
  { id: 'PR-009', task: 'ST-003 评审意见汇总', role: '技术', step: '汇总', status: '进行中', deadline: '2024-03-17' },
  { id: 'PR-010', task: 'DM-010 需求确认', role: '销售', step: '确认', status: '已完成', deadline: '2024-03-10' },
  { id: 'PR-011', task: 'SO-8819 参数补充', role: '销售', step: '补充', status: '待处理', deadline: '2024-03-18' },
  { id: 'PR-012', task: 'ST-014 修订评审', role: '技术', step: '评审', status: '进行中', deadline: '2024-03-20' },
  { id: 'PR-013', task: 'DM-012 新标准立项', role: '管理', step: '立项', status: '待处理', deadline: '2024-03-22' },
  { id: 'PR-014', task: 'SO-8802 订单复核', role: '质量', step: '复核', status: '进行中', deadline: '2024-03-14' },
  { id: 'PR-015', task: 'ST-008 修订发布', role: '管理', step: '发布', status: '待处理', deadline: '2024-03-21' },
  { id: 'PR-016', task: 'DM-015 匹配复核', role: '技术', step: '复核', status: '进行中', deadline: '2024-03-19' },
  { id: 'PR-017', task: 'SO-8820 订单执行', role: '销售', step: '执行', status: '已完成', deadline: '2024-03-09' },
  { id: 'PR-018', task: 'ST-019 标准培训', role: '管理', step: '培训', status: '待处理', deadline: '2024-03-23' },
  { id: 'PR-019', task: 'DM-018 需求补充', role: '销售', step: '补充', status: '进行中', deadline: '2024-03-17' },
  { id: 'PR-020', task: 'SO-8811 订单归档', role: '质量', step: '归档', status: '待处理', deadline: '2024-03-24' },
  { id: 'PR-021', task: 'ST-021 新标准宣贯', role: '管理', step: '宣贯', status: '待处理', deadline: '2024-03-25' },
  { id: 'PR-022', task: 'DM-021 需求评估', role: '技术', step: '评估', status: '进行中', deadline: '2024-03-18' }
];

const modalVisible = ref(false);
const modalType = ref('');
const modalTitle = ref('');

const titles = {
  assign: '任务分派',
  approve: '节点审批',
  track: '进度跟踪',
  permission: '权限申请',
  matrix: '权限矩阵提示'
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
</style>
