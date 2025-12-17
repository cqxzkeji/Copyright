<template>
  <div class="card">
    <div class="flex" style="justify-content: space-between;">
      <div>
        <h2>订单管理</h2>
        <p class="muted">跟踪订单履约、分拨与物流信息</p>
      </div>
      <div class="flex">
        <button @click="openProgress('批量打印面单...')">打印面单</button>
        <button class="secondary" @click="openInfo('已推送物流订阅到买家')">物流提醒</button>
      </div>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th>订单号</th>
          <th>买家</th>
          <th>商品</th>
          <th>数量</th>
          <th>金额</th>
          <th>发货仓</th>
          <th>履约</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.id">
          <td>{{ order.id }}</td>
          <td>{{ order.customer }}</td>
          <td>{{ order.item }}</td>
          <td>{{ order.qty }}</td>
          <td>￥{{ order.amount }}</td>
          <td>{{ order.warehouse }}</td>
          <td><span :class="['badge', order.status === '待发货' ? 'warn' : 'success']">{{ order.status }}</span></td>
          <td><button class="secondary" @click="openForm(order)">分拨</button></td>
        </tr>
      </tbody>
    </table>
  </div>

  <ModalDialog :visible="formModal" title="分拨设置" show-actions @close="formModal = false" @confirm="saveAssignment">
    <div class="input-group">
      <label>订单号</label>
      <input v-model="current.id" disabled />
    </div>
    <div class="input-group">
      <label>目标仓</label>
      <select v-model="current.warehouse">
        <option>华北仓</option>
        <option>华东仓</option>
        <option>华南仓</option>
        <option>西南仓</option>
      </select>
    </div>
    <div class="input-group">
      <label>备注</label>
      <textarea v-model="current.note" rows="2" placeholder="填写分拨说明"></textarea>
    </div>
  </ModalDialog>

  <ModalDialog :visible="progressModal" title="处理进度" @close="progressModal = false">
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

const orders = [
  { id: 'O-1001', customer: '陈女士', item: '有机西红柿', qty: 3, amount: 86.4, warehouse: '华北仓', status: '待发货' },
  { id: 'O-1002', customer: '王先生', item: '赣南脐橙', qty: 2, amount: 59.8, warehouse: '华东仓', status: '已发货' },
  { id: 'O-1003', customer: '李女士', item: '长粒香大米', qty: 1, amount: 68.0, warehouse: '华南仓', status: '已发货' },
  { id: 'O-1004', customer: '刘先生', item: '散养土鸡蛋', qty: 2, amount: 50.0, warehouse: '华北仓', status: '待发货' },
  { id: 'O-1005', customer: '赵先生', item: '初榨菜籽油', qty: 1, amount: 78.0, warehouse: '华东仓', status: '已发货' },
  { id: 'O-1006', customer: '周女士', item: '寒地蓝莓', qty: 4, amount: 180.0, warehouse: '华南仓', status: '待发货' },
  { id: 'O-1007', customer: '吴先生', item: '生态散养鸡', qty: 1, amount: 99.0, warehouse: '华北仓', status: '待发货' },
  { id: 'O-1008', customer: '郑女士', item: '芦笋', qty: 5, amount: 110.0, warehouse: '华东仓', status: '已发货' },
  { id: 'O-1009', customer: '钱先生', item: '紫薯', qty: 6, amount: 72.0, warehouse: '华南仓', status: '已发货' },
  { id: 'O-1010', customer: '孙女士', item: '砂糖橘', qty: 3, amount: 59.7, warehouse: '华南仓', status: '待发货' },
];

const formModal = ref(false);
const progressModal = ref(false);
const infoModal = ref(false);
const progress = ref(0);
const progressMessage = ref('');
const infoMessage = ref('');
const current = reactive({ id: '', warehouse: '华北仓', note: '' });

const openForm = (order) => {
  current.id = order.id;
  current.warehouse = order.warehouse;
  current.note = '';
  formModal.value = true;
};

const saveAssignment = () => {
  infoMessage.value = `已更新分拨：${current.id} → ${current.warehouse}`;
  infoModal.value = true;
  formModal.value = false;
};

const openProgress = (message) => {
  progressMessage.value = message;
  progress.value = 0;
  progressModal.value = true;
  setTimeout(() => (progress.value = 60), 300);
  setTimeout(() => (progress.value = 100), 900);
};

const openInfo = (message) => {
  infoMessage.value = message;
  infoModal.value = true;
};
</script>
