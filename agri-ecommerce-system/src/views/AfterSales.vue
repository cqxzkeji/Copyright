<template>
  <div class="card">
    <div class="flex" style="justify-content: space-between;">
      <div>
        <h2>库存与售后</h2>
        <p class="muted">追踪库存安全线、售后申请与补寄处理</p>
      </div>
      <div class="flex">
        <button @click="openProgress('库存盘点中，预计5分钟完成')">盘点库存</button>
        <button class="secondary" @click="openInfo('已提醒客服跟进未处理工单')">催办工单</button>
      </div>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th>工单号</th>
          <th>类型</th>
          <th>商品</th>
          <th>数量</th>
          <th>状态</th>
          <th>预计补货</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="ticket in tickets" :key="ticket.id">
          <td>{{ ticket.id }}</td>
          <td>{{ ticket.type }}</td>
          <td>{{ ticket.product }}</td>
          <td>{{ ticket.qty }}</td>
          <td><span :class="['badge', ticket.status === '处理中' ? 'warn' : 'success']">{{ ticket.status }}</span></td>
          <td>{{ ticket.restock }}</td>
          <td><button class="secondary" @click="openForm(ticket)">处理</button></td>
        </tr>
      </tbody>
    </table>
  </div>

  <ModalDialog :visible="formModal" title="售后处理" show-actions @close="formModal = false" @confirm="saveTicket">
    <div class="input-group">
      <label>工单号</label>
      <input v-model="current.id" disabled />
    </div>
    <div class="input-group">
      <label>处理方案</label>
      <select v-model="current.solution">
        <option>补寄</option>
        <option>退款</option>
        <option>拒绝</option>
      </select>
    </div>
    <div class="input-group">
      <label>备注</label>
      <textarea v-model="current.note" rows="3" placeholder="记录处理过程"></textarea>
    </div>
  </ModalDialog>

  <ModalDialog :visible="progressModal" title="执行进度" @close="progressModal = false">
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

const tickets = [
  { id: 'S-01', type: '缺件', product: '有机西红柿', qty: 1, status: '处理中', restock: '05-05' },
  { id: 'S-02', type: '破损', product: '赣南脐橙', qty: 1, status: '已完成', restock: '05-04' },
  { id: 'S-03', type: '破损', product: '初榨菜籽油', qty: 1, status: '处理中', restock: '05-06' },
  { id: 'S-04', type: '漏发', product: '散养土鸡蛋', qty: 2, status: '已完成', restock: '05-03' },
  { id: 'S-05', type: '退货', product: '寒地蓝莓', qty: 1, status: '处理中', restock: '05-06' },
  { id: 'S-06', type: '退货', product: '生态散养鸡', qty: 1, status: '处理中', restock: '05-07' },
  { id: 'S-07', type: '补寄', product: '芦笋', qty: 3, status: '已完成', restock: '05-02' },
  { id: 'S-08', type: '退货', product: '砂糖橘', qty: 2, status: '处理中', restock: '05-06' },
  { id: 'S-09', type: '破损', product: '紫薯', qty: 2, status: '已完成', restock: '05-03' },
  { id: 'S-10', type: '漏发', product: '长粒香大米', qty: 1, status: '处理中', restock: '05-05' },
];

const formModal = ref(false);
const progressModal = ref(false);
const infoModal = ref(false);
const progress = ref(0);
const progressMessage = ref('');
const infoMessage = ref('');
const current = reactive({ id: '', solution: '补寄', note: '' });

const openForm = (ticket) => {
  current.id = ticket.id;
  current.solution = '补寄';
  current.note = '';
  formModal.value = true;
};

const saveTicket = () => {
  infoMessage.value = `已提交方案：${current.id} → ${current.solution}`;
  infoModal.value = true;
  formModal.value = false;
};

const openProgress = (message) => {
  progressMessage.value = message;
  progress.value = 0;
  progressModal.value = true;
  setTimeout(() => (progress.value = 35), 250);
  setTimeout(() => (progress.value = 80), 700);
  setTimeout(() => (progress.value = 100), 1100);
};

const openInfo = (message) => {
  infoMessage.value = message;
  infoModal.value = true;
};
</script>
