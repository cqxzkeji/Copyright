<template>
  <div class="content-card">
    <div class="section-title">销售与订单管理</div>
    <div class="actions-row">
      <button class="primary-btn" @click="showOrderModal = true">创建销售订单</button>
      <button class="secondary-btn" @click="startShipping">批量发货</button>
      <button class="secondary-btn" @click="showAlertModal = true">订单提醒</button>
    </div>

    <div class="card-grid" style="margin-top: 16px; align-items: stretch;">
      <div class="stat-card" style="grid-column: span 2; min-width: 320px;">
        <strong>品类销售结构</strong>
        <canvas ref="salesCanvas" height="120"></canvas>
      </div>
      <div class="stat-card">
        <div class="stat-label">今日订单</div>
        <div class="stat-value">126</div>
        <span class="badge">线上 96 · 线下 30</span>
      </div>
      <div class="stat-card">
        <div class="stat-label">待发货</div>
        <div class="stat-value">42</div>
        <span class="badge">冷链 24 · 常温 18</span>
      </div>
    </div>

    <div class="table-wrapper" style="margin-top: 18px;">
      <div style="display:flex;justify-content:space-between;align-items:center; margin-bottom: 8px;">
        <strong>订单看板</strong>
        <span class="tag">总计 {{ orderList.length }} 条</span>
      </div>
      <table>
        <thead>
          <tr>
            <th>订单号</th>
            <th>客户</th>
            <th>品类</th>
            <th>数量</th>
            <th>金额(元)</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in orderList" :key="row.id">
            <td>{{ row.id }}</td>
            <td>{{ row.customer }}</td>
            <td>{{ row.category }}</td>
            <td>{{ row.qty }}</td>
            <td>{{ row.amount }}</td>
            <td>
              <span class="badge" :style="{ background: row.status === '待发货' ? '#fff4e6' : '#e5fbef', color: '#1d3557' }">{{ row.status }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <Modal title="创建销售订单" :show="showOrderModal" @close="showOrderModal = false">
    <form class="form-grid" @submit.prevent="submitOrder">
      <label>客户名称<input v-model="orderForm.customer" required /></label>
      <label>品类<select v-model="orderForm.category">
        <option>番茄</option>
        <option>草莓</option>
        <option>生菜</option>
        <option>玉米</option>
        <option>小麦</option>
      </select></label>
      <label>数量(箱)<input type="number" min="1" v-model.number="orderForm.qty" required /></label>
      <label>单价(元)<input type="number" min="0" v-model.number="orderForm.price" required /></label>
      <label style="grid-column: span 2;">配送方式<select v-model="orderForm.shipping">
        <option>冷链</option>
        <option>常温</option>
      </select></label>
      <div style="grid-column: span 2; display:flex; gap:10px; justify-content:flex-end;">
        <button type="button" class="secondary-btn" @click="showOrderModal = false">取消</button>
        <button type="submit" class="primary-btn">创建</button>
      </div>
    </form>
  </Modal>

  <Modal title="发货批次同步" :show="showShipModal" @close="showShipModal = false">
    <p>正在打包并推送物流单号。</p>
    <div class="progress-track" style="margin: 12px 0;">
      <div class="progress-bar" :style="{ width: shipProgress + '%' }"></div>
    </div>
    <p style="margin:0;">当前进度：{{ shipProgress }}%</p>
  </Modal>

  <Modal title="订单提醒" :show="showAlertModal" @close="showAlertModal = false">
    <ul>
      <li>渠道团购订单 6 笔，需在 16:00 前发车。</li>
      <li>生鲜超市 3 家催货，要求冷链，温控 4℃。</li>
      <li>跨省电商订单需补充产地证与检测报告。</li>
    </ul>
  </Modal>
</template>

<script setup>
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import Chart from 'chart.js/auto';
import Modal from '../components/Modal.vue';

const orderList = [
  { id: 'SO-8801', customer: '盒马门店', category: '番茄', qty: 120, amount: 8400, status: '待发货' },
  { id: 'SO-8802', customer: '山姆仓', category: '草莓', qty: 90, amount: 12600, status: '拣货中' },
  { id: 'SO-8803', customer: '社区团购A', category: '生菜', qty: 200, amount: 5200, status: '待发货' },
  { id: 'SO-8804', customer: '生鲜档口', category: '玉米', qty: 160, amount: 6400, status: '已发货' },
  { id: 'SO-8805', customer: '校园食堂', category: '番茄', qty: 140, amount: 9800, status: '待发货' },
  { id: 'SO-8806', customer: '品牌连锁', category: '草莓', qty: 110, amount: 15400, status: '拣货中' },
  { id: 'SO-8807', customer: '批发市场', category: '土豆', qty: 260, amount: 7800, status: '已发货' },
  { id: 'SO-8808', customer: '农贸市场', category: '青椒', qty: 180, amount: 7200, status: '待发货' },
  { id: 'SO-8809', customer: '社区团购B', category: '黄瓜', qty: 210, amount: 8400, status: '待发货' },
  { id: 'SO-8810', customer: '连锁餐饮', category: '生菜', qty: 240, amount: 7200, status: '已发货' }
];

const showOrderModal = ref(false);
const showShipModal = ref(false);
const showAlertModal = ref(false);
const shipProgress = ref(0);
const timer = ref(null);

const orderForm = reactive({ customer: '', category: '番茄', qty: 1, price: 1, shipping: '冷链' });

const salesCanvas = ref(null);
let chartInstance;

onMounted(() => {
  chartInstance = new Chart(salesCanvas.value, {
    type: 'doughnut',
    data: {
      labels: ['番茄', '草莓', '生菜', '玉米', '小麦', '其他'],
      datasets: [
        {
          data: [32, 24, 14, 12, 9, 9],
          backgroundColor: ['#36b3f9', '#2ec4b6', '#ffd166', '#ef476f', '#9b8cfe', '#8ecae6']
        }
      ]
    },
    options: { plugins: { legend: { position: 'bottom' } } }
  });
});

onBeforeUnmount(() => {
  if (chartInstance) chartInstance.destroy();
  clearInterval(timer.value);
});

const submitOrder = () => {
  const total = orderForm.qty * orderForm.price;
  alert(`已创建订单：${orderForm.customer} · 金额 ${total} 元`);
  showOrderModal.value = false;
};

const startShipping = () => {
  shipProgress.value = 0;
  showShipModal.value = true;
  clearInterval(timer.value);
  timer.value = setInterval(() => {
    if (shipProgress.value >= 100) {
      clearInterval(timer.value);
      return;
    }
    shipProgress.value += 15;
  }, 420);
};
</script>
