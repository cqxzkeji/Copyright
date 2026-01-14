<template>
  <div class="page-container">
    <div class="grid chain-grid">
      <div class="card">
        <div class="section-header">
          <h2 class="section-title">链上存证概览</h2>
          <div class="actions">
            <button class="button" @click="openModal('evidence')">新增存证</button>
            <button class="button secondary" @click="openModal('contract')">合约校验</button>
          </div>
        </div>
        <div class="chain-summary">
          <div class="summary-item">
            <strong>12,648</strong>
            <span>累计存证</span>
          </div>
          <div class="summary-item">
            <strong>16</strong>
            <span>联盟节点</span>
          </div>
          <div class="summary-item">
            <strong>99.8%</strong>
            <span>校验通过率</span>
          </div>
          <div class="summary-item">
            <strong>38</strong>
            <span>智能合约触发</span>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="section-header">
          <h2 class="section-title">合约协同任务</h2>
          <button class="button ghost" @click="openModal('task')">下发任务</button>
        </div>
        <ul class="task-list">
          <li v-for="task in tasks" :key="task.name">
            <div>
              <strong>{{ task.name }}</strong>
              <p>{{ task.desc }}</p>
            </div>
            <span class="tag">{{ task.status }}</span>
          </li>
        </ul>
      </div>
    </div>

    <div class="card">
      <div class="section-header">
        <h2 class="section-title">链上凭证查询</h2>
        <div class="actions">
          <button class="button" @click="openModal('query')">凭证查询</button>
          <button class="button secondary" @click="openModal('progress')">批量上链</button>
          <button class="button ghost" @click="openModal('tips')">提示</button>
        </div>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>凭证类型</th>
            <th>关联业务</th>
            <th>哈希摘要</th>
            <th>上链时间</th>
            <th>发起节点</th>
            <th>状态</th>
            <th>合约触发</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in evidenceTable" :key="row.hash">
            <td>{{ row.type }}</td>
            <td>{{ row.biz }}</td>
            <td>{{ row.hash }}</td>
            <td>{{ row.time }}</td>
            <td>{{ row.node }}</td>
            <td><span class="badge">{{ row.status }}</span></td>
            <td>{{ row.contract }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <ModalDialog :show="modal.show" :title="modal.title" @close="closeModal">
      <template v-if="modal.type === 'evidence'">
        <div class="modal-form">
          <label>存证类型
            <select class="input" v-model="form.type">
              <option>确权结果</option>
              <option>评估报告摘要</option>
              <option>抵押登记证明</option>
              <option>放款凭证</option>
            </select>
          </label>
          <label>业务编号
            <input class="input" v-model="form.bizId" placeholder="请输入业务编号" />
          </label>
          <label>哈希摘要
            <input class="input" v-model="form.hash" placeholder="自动生成或导入" />
          </label>
        </div>
      </template>
      <template v-else-if="modal.type === 'contract'">
        <div class="modal-form">
          <label>合约名称
            <input class="input" v-model="form.contractName" placeholder="到期提醒合约" />
          </label>
          <label>触发条件
            <input class="input" v-model="form.trigger" placeholder="评估到期/逾期/异常" />
          </label>
          <label>关联节点
            <input class="input" v-model="form.nodes" placeholder="银行/担保/监管" />
          </label>
        </div>
      </template>
      <template v-else-if="modal.type === 'task'">
        <div class="modal-form">
          <label>协同任务
            <input class="input" v-model="form.task" placeholder="巡检记录上链" />
          </label>
          <label>执行时间
            <input class="input" v-model="form.taskDate" placeholder="YYYY-MM-DD" />
          </label>
          <label>任务说明
            <input class="input" v-model="form.taskDesc" placeholder="任务目标与验收方式" />
          </label>
        </div>
      </template>
      <template v-else-if="modal.type === 'query'">
        <div class="modal-form">
          <label>凭证哈希
            <input class="input" v-model="form.queryHash" placeholder="输入哈希摘要" />
          </label>
          <label>业务类型
            <select class="input" v-model="form.queryType">
              <option>确权</option>
              <option>评估</option>
              <option>审批</option>
              <option>放款</option>
            </select>
          </label>
          <label>时间范围
            <input class="input" v-model="form.queryTime" placeholder="YYYY-MM-DD ~ YYYY-MM-DD" />
          </label>
        </div>
      </template>
      <template v-else-if="modal.type === 'progress'">
        <div class="progress">
          <div class="progress-bar" :style="{ width: '58%' }"></div>
        </div>
        <p class="progress-text">批量上链 14/24 条，预计 28 秒完成。</p>
      </template>
      <template v-else>
        <p>提示：链上凭证支持与链下原文双向溯源，确保审计一致性。</p>
      </template>
      <template #footer>
        <button class="button secondary" type="button" @click="closeModal">取消</button>
        <button class="button" type="button" @click="confirmModal">提交</button>
      </template>
    </ModalDialog>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const tasks = [
  { name: '到期提醒合约', desc: '自动触发续评与风险排查', status: '运行中' },
  { name: '异常拦截合约', desc: '材料缺失或权属冲突自动冻结', status: '运行中' },
  { name: '审批流转合约', desc: '跨节点审批流转与审计', status: '待更新' }
];

const evidenceTable = Array.from({ length: 22 }, (_, index) => ({
  type: ['确权结果', '评估摘要', '审批意见', '放款凭证'][index % 4],
  biz: `业务-${1200 + index}`,
  hash: `0x${(140000 + index).toString(16)}`,
  time: `2024-09-${String((index % 28) + 1).padStart(2, '0')}`,
  node: ['银行节点', '担保节点', '村集体节点', '监管节点'][index % 4],
  status: ['已确认', '待确认'][index % 2],
  contract: ['自动触发', '人工确认'][index % 2]
}));

const modal = reactive({
  show: false,
  type: 'tips',
  title: ''
});

const form = reactive({
  type: '确权结果',
  bizId: '',
  hash: '',
  contractName: '',
  trigger: '',
  nodes: '',
  task: '',
  taskDate: '',
  taskDesc: '',
  queryHash: '',
  queryType: '确权',
  queryTime: ''
});

const openModal = (type) => {
  modal.show = true;
  modal.type = type;
  modal.title =
    type === 'evidence'
      ? '新增链上存证'
      : type === 'contract'
        ? '智能合约校验'
        : type === 'task'
          ? '下发协同任务'
          : type === 'query'
            ? '链上凭证查询'
            : type === 'progress'
              ? '批量上链进度'
              : '按钮提示';
};

const closeModal = () => {
  modal.show = false;
};

const confirmModal = () => {
  modal.show = false;
};
</script>

<style scoped>
.chain-grid {
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  margin-bottom: 20px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}

.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.chain-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
}

.summary-item {
  padding: 12px;
  border-radius: 12px;
  background: #f8fafc;
  display: grid;
  gap: 4px;
}

.summary-item strong {
  font-size: 20px;
}

.summary-item span {
  color: #64748b;
  font-size: 12px;
}

.task-list {
  display: grid;
  gap: 12px;
  list-style: none;
}

.task-list li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f8fafc;
  padding: 12px;
  border-radius: 12px;
  gap: 12px;
}

.task-list p {
  font-size: 12px;
  color: #64748b;
}

.modal-form {
  display: grid;
  gap: 12px;
  font-size: 14px;
  color: #475569;
}

.modal-form label {
  display: grid;
  gap: 6px;
}

.progress {
  width: 100%;
  height: 10px;
  border-radius: 999px;
  background: #e2e8f0;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #22d3ee, #3b82f6);
}

.progress-text {
  margin-top: 12px;
  color: #64748b;
  font-size: 13px;
}
</style>
