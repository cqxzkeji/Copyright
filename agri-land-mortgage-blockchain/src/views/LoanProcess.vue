<template>
  <div class="page-container">
    <div class="card">
      <div class="section-header">
        <h2 class="section-title">贷款流程总览</h2>
        <div class="actions">
          <button class="button" @click="openModal('application')">新增申请</button>
          <button class="button secondary" @click="openModal('assessment')">启动评估</button>
          <button class="button ghost" @click="openModal('reminder')">节点提醒</button>
        </div>
      </div>
      <div class="steps">
        <div v-for="step in steps" :key="step.title" class="step">
          <strong>{{ step.title }}</strong>
          <span>{{ step.desc }}</span>
          <small>{{ step.time }}</small>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="section-header">
        <h2 class="section-title">业务办理清单</h2>
        <div class="actions">
          <button class="button" @click="openModal('contract')">生成合同/借据</button>
          <button class="button secondary" @click="openModal('register')">抵押登记</button>
          <button class="button ghost" @click="openModal('progress')">放款进度</button>
        </div>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>申请编号</th>
            <th>借款主体</th>
            <th>抵押地块</th>
            <th>评估价值</th>
            <th>审批状态</th>
            <th>节点时限</th>
            <th>异常拦截</th>
            <th>链上合同哈希</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in loanTable" :key="row.id">
            <td>{{ row.id }}</td>
            <td>{{ row.borrower }}</td>
            <td>{{ row.asset }}</td>
            <td>{{ row.value }}</td>
            <td><span class="badge">{{ row.status }}</span></td>
            <td>{{ row.deadline }}</td>
            <td>{{ row.exception }}</td>
            <td>{{ row.hash }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <ModalDialog :show="modal.show" :title="modal.title" @close="closeModal">
      <template v-if="modal.type === 'application'">
        <div class="modal-form">
          <label>借款主体
            <input class="input" v-model="form.borrower" placeholder="合作社/家庭农场" />
          </label>
          <label>抵押地块编号
            <input class="input" v-model="form.asset" placeholder="请输入地块编号" />
          </label>
          <label>申请金额
            <input class="input" v-model="form.amount" placeholder="例如 200 万" />
          </label>
          <label>材料清单
            <input class="input" v-model="form.docs" placeholder="身份证明/权属证明/经营方案" />
          </label>
        </div>
      </template>
      <template v-else-if="modal.type === 'assessment'">
        <div class="modal-form">
          <label>评估机构
            <input class="input" v-model="form.agency" placeholder="县域评估中心" />
          </label>
          <label>评估基准日
            <input class="input" v-model="form.date" placeholder="YYYY-MM-DD" />
          </label>
          <label>评估类型
            <select class="input" v-model="form.kind">
              <option>收益法</option>
              <option>市场法</option>
              <option>成本法</option>
            </select>
          </label>
        </div>
      </template>
      <template v-else-if="modal.type === 'contract'">
        <div class="modal-form">
          <label>合同模板
            <select class="input" v-model="form.template">
              <option>标准抵押合同</option>
              <option>涉农专项合同</option>
            </select>
          </label>
          <label>借据编号
            <input class="input" v-model="form.note" placeholder="系统自动生成或手工录入" />
          </label>
          <label>签署方式
            <select class="input" v-model="form.sign">
              <option>电子签</option>
              <option>线下签署</option>
            </select>
          </label>
        </div>
      </template>
      <template v-else-if="modal.type === 'register'">
        <div class="modal-form">
          <label>登记部门
            <input class="input" v-model="form.registerOffice" placeholder="不动产登记中心" />
          </label>
          <label>登记证明号
            <input class="input" v-model="form.registerNo" placeholder="请输入登记证明号" />
          </label>
          <label>登记日期
            <input class="input" v-model="form.registerDate" placeholder="YYYY-MM-DD" />
          </label>
        </div>
      </template>
      <template v-else-if="modal.type === 'progress'">
        <div class="progress">
          <div class="progress-bar" :style="{ width: '74%' }"></div>
        </div>
        <p class="progress-text">放款批次 2024-09 正在出账，预计 12 分钟后完成。</p>
      </template>
      <template v-else>
        <p>节点提醒：评估报告到期前 3 日将自动触发续评流程。</p>
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

const steps = [
  { title: '申请受理', desc: '材料清单校验完成率 96%', time: 'T+0.5天' },
  { title: '尽调评估', desc: '抵押物绑定 182 宗', time: 'T+2天' },
  { title: '抵押登记', desc: '登记证明 127 份', time: 'T+3天' },
  { title: '审批放款', desc: '审批通过率 84%', time: 'T+4天' },
  { title: '贷后管理', desc: '巡检记录 312 次', time: '持续' }
];

const loanTable = Array.from({ length: 24 }, (_, index) => ({
  id: `DK-${2024}${String(index + 1).padStart(3, '0')}`,
  borrower: ['丰收合作社', '沃土家庭农场', '润禾农业'][index % 3],
  asset: `LD-${110 + index}`,
  value: `¥ ${(120 + index * 2).toFixed(0)}万`,
  status: ['审批中', '待补正', '已放款'][index % 3],
  deadline: `${2 + (index % 4)}天`,
  exception: ['无', '材料缺失', '评估过期'][index % 3],
  hash: `0x${(90000 + index).toString(16)}`
}));

const modal = reactive({
  show: false,
  type: 'application',
  title: ''
});

const form = reactive({
  borrower: '',
  asset: '',
  amount: '',
  docs: '',
  agency: '',
  date: '',
  kind: '收益法',
  template: '标准抵押合同',
  note: '',
  sign: '电子签',
  registerOffice: '',
  registerNo: '',
  registerDate: ''
});

const openModal = (type) => {
  modal.show = true;
  modal.type = type;
  modal.title =
    type === 'application'
      ? '贷款申请录入'
      : type === 'assessment'
        ? '启动抵押物评估'
        : type === 'contract'
          ? '合同与借据生成'
          : type === 'register'
            ? '抵押登记登记'
            : type === 'progress'
              ? '放款进度'
              : '节点提醒';
};

const closeModal = () => {
  modal.show = false;
};

const confirmModal = () => {
  modal.show = false;
};
</script>

<style scoped>
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

.steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 14px;
}

.step {
  padding: 12px;
  border-radius: 12px;
  background: #f8fafc;
  display: grid;
  gap: 6px;
  font-size: 13px;
}

.step strong {
  font-size: 15px;
}

.step span {
  color: #64748b;
}

.step small {
  color: #94a3b8;
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
