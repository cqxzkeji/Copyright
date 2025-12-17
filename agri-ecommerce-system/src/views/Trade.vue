<template>
  <div class="card">
    <div class="flex" style="justify-content: space-between;">
      <div>
        <h2>交易管理</h2>
        <p class="muted">核验交易流水，监控支付与结算节点</p>
      </div>
      <div class="flex">
        <button @click="openProgress('对账中，预计2分钟完成')">发起对账</button>
        <button class="secondary" @click="openInfo('已锁定异常交易并通知财务')">锁定异常</button>
      </div>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th>流水号</th>
          <th>渠道</th>
          <th>买家</th>
          <th>金额</th>
          <th>支付状态</th>
          <th>结算时间</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="trade in trades" :key="trade.id">
          <td>{{ trade.id }}</td>
          <td>{{ trade.channel }}</td>
          <td>{{ trade.customer }}</td>
          <td>￥{{ trade.amount }}</td>
          <td><span :class="['badge', trade.status === '成功' ? 'success' : 'warn']">{{ trade.status }}</span></td>
          <td>{{ trade.settlement }}</td>
          <td><button class="secondary" @click="openForm(trade)">核验</button></td>
        </tr>
      </tbody>
    </table>
  </div>

  <ModalDialog :visible="formModal" title="核验交易" show-actions @close="formModal = false" @confirm="submitVerification">
    <div class="input-group">
      <label>流水号</label>
      <input v-model="current.id" disabled />
    </div>
    <div class="input-group">
      <label>备注</label>
      <textarea v-model="current.note" rows="3" placeholder="填写核验说明"></textarea>
    </div>
  </ModalDialog>

  <ModalDialog :visible="progressModal" title="进度" @close="progressModal = false">
    <p style="margin: 0 0 8px;">{{ progressMessage }}</p>
    <div class="progress"><div class="progress-fill" :style="{ width: progress + '%' }"></div></div>
  </ModalDialog>

  <ModalDialog :visible="infoModal" title="提示" @close="infoModal = false">
    <p>{{ infoMessage }}</p>
  </ModalDialog>
</template>

<script setup>
import { reactive, ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const trades = [
  { id: 'T2024050101', channel: '抖音', customer: '陈女士', amount: 268, status: '成功', settlement: '05-02 09:30' },
  { id: 'T2024050102', channel: '天猫', customer: '王先生', amount: 356, status: '成功', settlement: '05-02 09:45' },
  { id: 'T2024050103', channel: '自营', customer: '刘先生', amount: 189, status: '成功', settlement: '05-02 10:05' },
  { id: 'T2024050104', channel: '拼多多', customer: '李女士', amount: 220, status: '成功', settlement: '05-02 10:20' },
  { id: 'T2024050105', channel: '社区团购', customer: '朱先生', amount: 132, status: '成功', settlement: '05-02 10:33' },
  { id: 'T2024050106', channel: '抖音', customer: '赵女士', amount: 420, status: '成功', settlement: '05-02 10:50' },
  { id: 'T2024050107', channel: '自营', customer: '李先生', amount: 512, status: '成功', settlement: '05-02 11:10' },
  { id: 'T2024050108', channel: '天猫', customer: '段女士', amount: 188, status: '待确认', settlement: '--' },
  { id: 'T2024050109', channel: '拼多多', customer: '范先生', amount: 260, status: '成功', settlement: '05-02 11:40' },
  { id: 'T2024050110', channel: '社区团购', customer: '郭女士', amount: 145, status: '待确认', settlement: '--' },
];

const formModal = ref(false);
const progressModal = ref(false);
const infoModal = ref(false);
const progress = ref(0);
const progressMessage = ref('');
const infoMessage = ref('');
const current = reactive({ id: '', note: '' });

const openForm = (trade) => {
  current.id = trade.id;
  current.note = '';
  formModal.value = true;
};

const submitVerification = () => {
  infoMessage.value = `已提交核验：${current.id}`;
  infoModal.value = true;
  formModal.value = false;
};

const openProgress = (message) => {
  progress.value = 0;
  progressMessage.value = message;
  progressModal.value = true;
  setTimeout(() => (progress.value = 40), 300);
  setTimeout(() => (progress.value = 100), 900);
};

const openInfo = (message) => {
  infoMessage.value = message;
  infoModal.value = true;
};
</script>
