<template>
  <div class="card">
    <header style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; margin-bottom: 12px;">
      <div>
        <h3 style="margin: 0;">订单处理</h3>
        <p class="tagline">跟进分拣、包装、配送节点</p>
      </div>
      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        <button class="btn" @click="openOrderNote">添加备注</button>
        <button class="btn secondary" @click="openProgress">包装进度</button>
      </div>
    </header>
    <div style="overflow-x: auto;">
      <table class="table">
        <thead>
          <tr>
            <th>订单号</th>
            <th>客户</th>
            <th>品类</th>
            <th>数量</th>
            <th>状态</th>
            <th>分拣员</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.id">
            <td>{{ order.id }}</td>
            <td>{{ order.client }}</td>
            <td>{{ order.category }}</td>
            <td>{{ order.qty }}</td>
            <td><span class="badge" :class="badgeClass(order.status)">{{ order.status }}</span></td>
            <td>{{ order.operator }}</td>
            <td style="display: flex; gap: 6px; flex-wrap: wrap;">
              <button class="btn" @click="openStatus(order)">更新状态</button>
              <button class="btn danger" @click="openHold(order)">挂起</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <ModalDialog v-model="showStatus" title="更新订单状态" @confirm="confirmStatus">
    <p>为订单 {{ currentOrder.id }} 选择状态</p>
    <select class="input" v-model="currentOrder.status">
      <option>待分拣</option>
      <option>分拣中</option>
      <option>已发出</option>
      <option>已完成</option>
    </select>
  </ModalDialog>

  <ModalDialog v-model="showHold" title="挂起订单" @confirm="confirmHold">
    <p>将订单 {{ currentOrder.id }} 挂起以等待异常处理？</p>
  </ModalDialog>

  <ModalDialog v-model="showNote" title="新增备注" @confirm="saveNote">
    <label>订单号</label>
    <input class="input" v-model="noteForm.id" placeholder="输入相关订单号" />
    <label>备注内容</label>
    <textarea class="input" style="height: 90px;" v-model="noteForm.content" placeholder="描述包装要求或客户特殊说明"></textarea>
  </ModalDialog>

  <ModalDialog v-model="showProgress" title="包装进度">
    <p>{{ progressText }}</p>
    <div class="progress-bar">
      <div class="progress-fill" :style="{ width: `${progress}%` }"></div>
    </div>
    <template #footer>
      <button class="btn" @click="simulateProgress">刷新进度</button>
      <button class="btn secondary" @click="showProgress = false">关闭</button>
    </template>
  </ModalDialog>
</template>

<script setup>
import { reactive, ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const orders = reactive([
  { id: 'O-9001', client: '悦禾鲜生', category: '水果组合', qty: 25, status: '待分拣', operator: '李倩' },
  { id: 'O-9002', client: '社区团购', category: '蔬菜包', qty: 60, status: '分拣中', operator: '刘强' },
  { id: 'O-9003', client: '田园餐厅', category: '粮油', qty: 18, status: '待分拣', operator: '王岚' },
  { id: 'O-9004', client: '邻里超市', category: '禽蛋', qty: 45, status: '已发出', operator: '张敏' },
  { id: 'O-9005', client: '营养餐吧', category: '杂粮', qty: 22, status: '已完成', operator: '刘强' },
  { id: 'O-9006', client: '百果鲜', category: '水果组合', qty: 36, status: '分拣中', operator: '李倩' },
  { id: 'O-9007', client: '乡味厨房', category: '蔬菜包', qty: 40, status: '待分拣', operator: '王岚' },
  { id: 'O-9008', client: '晨光社区店', category: '粮油', qty: 28, status: '已发出', operator: '张敏' },
  { id: 'O-9009', client: '山楂铺子', category: '水果组合', qty: 18, status: '已完成', operator: '李倩' },
  { id: 'O-9010', client: '膳食社', category: '杂粮', qty: 32, status: '待分拣', operator: '刘强' }
]);

const showStatus = ref(false);
const showHold = ref(false);
const showNote = ref(false);
const showProgress = ref(false);

const currentOrder = reactive({});
const noteForm = reactive({ id: '', content: '' });
const progress = ref(35);
const progressText = ref('打包准备中…');

const badgeClass = (status) => {
  if (status === '已完成' || status === '已发出') return 'success';
  if (status === '分拣中') return 'warning';
  return 'danger';
};

const openStatus = (order) => {
  Object.assign(currentOrder, order);
  showStatus.value = true;
};

const openHold = (order) => {
  Object.assign(currentOrder, order);
  showHold.value = true;
};

const openOrderNote = () => {
  Object.assign(noteForm, { id: '', content: '' });
  showNote.value = true;
};

const openProgress = () => {
  showProgress.value = true;
};

const confirmStatus = () => {
  const index = orders.findIndex((o) => o.id === currentOrder.id);
  if (index > -1) {
    orders[index].status = currentOrder.status;
  }
  showStatus.value = false;
};

const confirmHold = () => {
  const index = orders.findIndex((o) => o.id === currentOrder.id);
  if (index > -1) {
    orders[index].status = '待分拣';
  }
  showHold.value = false;
};

const saveNote = () => {
  showNote.value = false;
  showProgress.value = true;
  simulateProgress();
};

const simulateProgress = () => {
  progress.value = Math.min(100, progress.value + 15);
  if (progress.value >= 100) {
    progressText.value = '包装完成，可交付运输';
  } else if (progress.value >= 70) {
    progressText.value = '封箱中，准备贴单';
  } else {
    progressText.value = '打包准备中…';
  }
};
</script>
