<template>
  <div class="grid-layout">
    <div>
      <div class="flex-between">
        <h3>订单管理</h3>
        <div class="flex" style="gap: 8px;">
          <button class="btn" @click="openCreate">新增订单</button>
          <button class="btn secondary" @click="openProgress">审核进度</button>
          <button class="btn secondary" @click="openReminder">提醒客户</button>
        </div>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>订单号</th>
            <th>客户</th>
            <th>产品</th>
            <th>数量(吨)</th>
            <th>交期</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.id">
            <td>{{ order.id }}</td>
            <td>{{ order.client }}</td>
            <td>{{ order.product }}</td>
            <td>{{ order.qty }}</td>
            <td>{{ order.date }}</td>
            <td><span class="badge">{{ order.status }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="card">
      <h4>状态分布</h4>
      <div class="chart">
        <div v-for="item in chartData" :key="item.label" class="chart-bar" :style="{ height: item.value * 6 + 'px' }">
          <div>{{ item.value }}</div>
          <small>{{ item.label }}</small>
        </div>
      </div>
    </div>
  </div>

  <div v-if="showCreate" class="overlay">
    <div class="modal">
      <header>
        <h3>新增订单</h3>
        <button class="btn secondary" @click="showCreate = false">关闭</button>
      </header>
      <div class="form-grid">
        <label>客户名称<input v-model="form.client" class="input" /></label>
        <label>产品规格<input v-model="form.product" class="input" /></label>
        <label>数量(吨)<input v-model.number="form.qty" type="number" class="input" /></label>
        <label>交期<input v-model="form.date" type="date" class="input" /></label>
      </div>
      <footer>
        <button class="btn secondary" @click="showCreate = false">取消</button>
        <button class="btn" @click="submitOrder">保存</button>
      </footer>
    </div>
  </div>

  <div v-if="showProgress" class="overlay">
    <div class="modal">
      <header>
        <h3>审核进度</h3>
        <button class="btn secondary" @click="showProgress = false">关闭</button>
      </header>
      <div v-for="step in steps" :key="step.label" style="margin-bottom: 8px;">
        <div class="flex-between">
          <span>{{ step.label }}</span>
          <span class="badge">{{ step.percent }}%</span>
        </div>
        <div class="progress-bar">
          <span :style="{ width: step.percent + '%' }"></span>
        </div>
      </div>
    </div>
  </div>

  <div v-if="showReminder" class="overlay">
    <div class="modal">
      <header>
        <h3>提示</h3>
        <button class="btn secondary" @click="showReminder = false">关闭</button>
      </header>
      <p>将向所有待确认客户发送微信提醒，确保按期确认需求。</p>
      <footer>
        <button class="btn" @click="showReminder = false">好的</button>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue';

const orders = ref([
  { id: 'SO-2301', client: '华北钢贸', product: '20CrMnTi', qty: 120, date: '2024-06-12', status: '待审核' },
  { id: 'SO-2302', client: '江南模具', product: '42CrMo', qty: 80, date: '2024-06-15', status: '生产中' },
  { id: 'SO-2303', client: '西域轨道', product: 'GCr15', qty: 140, date: '2024-06-18', status: '待审核' },
  { id: 'SO-2304', client: '华南汽配', product: '35CrMo', qty: 60, date: '2024-06-20', status: '已排产' },
  { id: 'SO-2305', client: '东方石化', product: '1Cr18Ni9Ti', qty: 90, date: '2024-06-22', status: '生产中' },
  { id: 'SO-2306', client: '西部能源', product: 'P91', qty: 130, date: '2024-06-25', status: '待审核' },
  { id: 'SO-2307', client: '中原机械', product: '38CrMoAl', qty: 50, date: '2024-06-26', status: '已排产' },
  { id: 'SO-2308', client: '鲁南矿业', product: '65Mn', qty: 110, date: '2024-06-28', status: '生产中' },
  { id: 'SO-2309', client: '北方重工', product: '17-4PH', qty: 95, date: '2024-06-30', status: '待审核' },
  { id: 'SO-2310', client: '东海造船', product: 'EH36', qty: 160, date: '2024-07-02', status: '生产中' },
  { id: 'SO-2311', client: '南方机车', product: '20CrNiMo', qty: 75, date: '2024-07-04', status: '已排产' }
]);

const form = reactive({ client: '', product: '', qty: 10, date: '' });
const showCreate = ref(false);
const showProgress = ref(false);
const showReminder = ref(false);

const steps = [
  { label: '商务审核', percent: 90 },
  { label: '技术确认', percent: 70 },
  { label: '排产准备', percent: 55 },
  { label: '质检计划', percent: 40 }
];

const chartData = computed(() => {
  const groups = orders.value.reduce(
    (acc, cur) => {
      acc[cur.status] = (acc[cur.status] || 0) + 1;
      return acc;
    },
    { 待审核: 0, 已排产: 0, 生产中: 0 }
  );
  return [
    { label: '待审核', value: groups['待审核'] },
    { label: '已排产', value: groups['已排产'] },
    { label: '生产中', value: groups['生产中'] }
  ];
});

const openCreate = () => (showCreate.value = true);
const openProgress = () => (showProgress.value = true);
const openReminder = () => (showReminder.value = true);

const submitOrder = () => {
  if (!form.client || !form.product || !form.date) {
    alert('请完善订单信息');
    return;
  }
  const newOrder = {
    id: `SO-${Math.floor(Math.random() * 9000) + 2000}`,
    client: form.client,
    product: form.product,
    qty: form.qty,
    date: form.date,
    status: '待审核'
  };
  orders.value = [newOrder, ...orders.value];
  showCreate.value = false;
};
</script>
