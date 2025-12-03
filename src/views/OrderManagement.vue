<template>
  <div class="grid" style="gap:16px;">
    <div class="section-header">
      <div>
        <h3 class="section-title">订单管理</h3>
        <p style="margin:0;color:var(--muted);">跟踪排产、交付、收款进度</p>
      </div>
      <div style="display:flex;gap:10px;flex-wrap:wrap;">
        <button class="primary" @click="openOrder">创建订单</button>
        <button class="ghost" @click="triggerShipment">批量发货</button>
      </div>
    </div>

    <div class="responsive-three">
      <div class="card" v-for="card in summary" :key="card.label">
        <div style="color:var(--muted);font-size:13px;">{{ card.label }}</div>
        <div style="font-size:26px;font-weight:800;">{{ card.value }}</div>
        <div class="progress" style="margin-top:10px;"><div class="bar" :style="{ width: card.progress + '%' }"></div></div>
      </div>
    </div>

    <div class="card">
      <div class="section-header">
        <h4 class="section-title">订单列表</h4>
        <button class="ghost" @click="clearFilter">清除筛选</button>
      </div>
      <div style="overflow-x:auto;">
        <table class="table">
          <thead>
            <tr>
              <th>订单号</th>
              <th>客户</th>
              <th>产品</th>
              <th>数量(吨)</th>
              <th>状态</th>
              <th>发运</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in filteredOrders" :key="order.id">
              <td>{{ order.id }}</td>
              <td>{{ order.customer }}</td>
              <td>{{ order.product }}</td>
              <td>{{ order.qty }}</td>
              <td><span class="tag" :class="order.tag">{{ order.status }}</span></td>
              <td>{{ order.shipDate }}</td>
              <td style="display:flex;gap:8px;flex-wrap:wrap;">
                <button class="ghost" @click="viewOrder(order)">详情</button>
                <button class="primary" @click="schedule(order)">排产计划</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <ModalDialog :open="orderModal" title="创建订单" @close="orderModal = false">
      <div class="form-row">
        <div>
          <label>客户</label>
          <input v-model="orderForm.customer" placeholder="输入客户名称" />
        </div>
        <div>
          <label>产品</label>
          <input v-model="orderForm.product" placeholder="如：30CrNiMo φ210" />
        </div>
      </div>
      <div class="form-row">
        <div>
          <label>数量(吨)</label>
          <input v-model.number="orderForm.qty" type="number" />
        </div>
        <div>
          <label>期望发运时间</label>
          <input v-model="orderForm.shipDate" placeholder="如：9月12日" />
        </div>
      </div>
      <button class="primary" @click="createOrder">保存</button>
    </ModalDialog>

    <ModalDialog :open="shipmentModal" title="批量发货" @close="shipmentModal = false">
      <p style="margin:0 0 10px;">对已排产完成的订单生成发货指令</p>
      <div class="progress"><div class="bar" :style="{ width: shipmentProgress + '%' }"></div></div>
      <p style="color:var(--muted);">{{ shipmentText }}</p>
    </ModalDialog>

    <ModalDialog :open="!!current" :title="current?.id" @close="current = null">
      <p style="margin:0 0 8px;">客户：{{ current?.customer }} · 产品：{{ current?.product }}</p>
      <p style="margin:0 0 8px;">数量：{{ current?.qty }} 吨 · 状态：{{ current?.status }}</p>
      <p style="color:var(--muted); margin:0;">发运计划：{{ current?.shipDate }}</p>
    </ModalDialog>

    <ModalDialog :open="scheduleModal" title="排产模拟" @close="scheduleModal = false">
      <p style="margin:0 0 10px;">正在为订单排产，匹配轧机、热处理产线</p>
      <div class="progress"><div class="bar" :style="{ width: scheduleProgress + '%' }"></div></div>
      <p style="color:var(--muted);">{{ scheduleText }}</p>
    </ModalDialog>

    <ModalDialog :open="infoOpen" title="提示" @close="infoOpen = false">
      <p style="margin:0;">{{ infoText }}</p>
    </ModalDialog>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const summary = [
  { label: '本月签单(万元)', value: '2,870', progress: 78 },
  { label: '排产完成', value: '19 单', progress: 64 },
  { label: '回款进度', value: '63%', progress: 63 }
];

const orders = ref([
  { id: 'SO230901', customer: '华电重工', product: '30CrNiMo φ210', qty: 120, status: '排产中', tag: 'warning', shipDate: '9月20日' },
  { id: 'SO230902', customer: '南方机车', product: '18Cr2Ni4WA φ180', qty: 80, status: '已排产', tag: 'info', shipDate: '9月18日' },
  { id: 'SO230903', customer: '星河船舶', product: '42CrMo φ260', qty: 150, status: '在途', tag: 'success', shipDate: '9月15日' },
  { id: 'SO230904', customer: '锦程矿山', product: '7CrSiMnMoV φ110', qty: 60, status: '排产中', tag: 'warning', shipDate: '9月25日' },
  { id: 'SO230905', customer: '中远海运', product: 'Cr12MoV φ100', qty: 90, status: '已排产', tag: 'info', shipDate: '9月21日' },
  { id: 'SO230906', customer: '北冶特材', product: '20CrMnTi φ120', qty: 110, status: '在途', tag: 'success', shipDate: '9月19日' },
  { id: 'SO230907', customer: '华润燃机', product: 'H13 φ90', qty: 45, status: '待发货', tag: 'info', shipDate: '9月23日' },
  { id: 'SO230908', customer: '启明风电', product: '5CrNiMo φ150', qty: 55, status: '排产中', tag: 'warning', shipDate: '9月28日' },
  { id: 'SO230909', customer: '中车四方', product: 'GCr15 φ90', qty: 140, status: '在途', tag: 'success', shipDate: '9月17日' },
  { id: 'SO230910', customer: '北极星特钢', product: 'S136 φ80', qty: 70, status: '已排产', tag: 'info', shipDate: '9月26日' },
  { id: 'SO230911', customer: '科陆能源', product: '42CrMo φ260', qty: 65, status: '待发货', tag: 'info', shipDate: '9月30日' }
]);

const statusFilter = ref('');
const orderModal = ref(false);
const orderForm = reactive({ customer: '', product: '', qty: 0, shipDate: '' });
const shipmentModal = ref(false);
const shipmentProgress = ref(0);
const shipmentText = ref('未开始');
const current = ref(null);
const scheduleModal = ref(false);
const scheduleProgress = ref(0);
const scheduleText = ref('排产排队中');
const infoOpen = ref(false);
const infoText = ref('');

const filteredOrders = computed(() => {
  if (!statusFilter.value) return orders.value;
  return orders.value.filter((o) => o.status === statusFilter.value);
});

const openOrder = () => { orderModal.value = true; };

const createOrder = () => {
  orders.value.unshift({
    id: `SO${Math.floor(Math.random() * 100000)}`,
    customer: orderForm.customer,
    product: orderForm.product,
    qty: orderForm.qty,
    status: '排产中',
    tag: 'warning',
    shipDate: orderForm.shipDate || '待确认'
  });
  Object.assign(orderForm, { customer: '', product: '', qty: 0, shipDate: '' });
  orderModal.value = false;
};

const triggerShipment = () => {
  shipmentModal.value = true;
  shipmentProgress.value = 0;
  shipmentText.value = '正在生成提单...';
  const timer = setInterval(() => {
    shipmentProgress.value += 30;
    if (shipmentProgress.value >= 100) {
      shipmentText.value = '已同步物流，等待司机接单';
      clearInterval(timer);
    }
  }, 300);
};

const viewOrder = (order) => {
  current.value = order;
};

const schedule = (order) => {
  scheduleModal.value = true;
  scheduleProgress.value = 0;
  scheduleText.value = `为 ${order.id} 匹配产线`;
  const timer = setInterval(() => {
    scheduleProgress.value += 28;
    if (scheduleProgress.value >= 100) {
      scheduleText.value = '排产完成，已下发至MES';
      clearInterval(timer);
    }
  }, 320);
};

const clearFilter = () => {
  statusFilter.value = '';
  infoText.value = '已恢复全部订单视图';
  infoOpen.value = true;
};
</script>
