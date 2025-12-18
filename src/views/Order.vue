<template>
  <section class="module">
    <div class="section-header">
      <div>
        <h3>采购与订单协同</h3>
        <p class="muted">从采购计划到发运签收的全链路状态联动。</p>
      </div>
      <div class="section-actions">
        <button class="btn" @click="showPlan = true">新建采购计划</button>
        <button class="btn secondary" @click="showSync = true">订单状态推送</button>
        <button class="btn outline" @click="showNotice = true">到货提醒</button>
      </div>
    </div>

    <div class="grid two">
      <div class="table-card">
        <div class="table-head">
          <h4>订单履约看板</h4>
          <small class="muted">含采购、发运、到货环节</small>
        </div>
        <table>
          <thead>
            <tr>
              <th>订单号</th>
              <th>品类</th>
              <th>数量</th>
              <th>采购商</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in orders" :key="item.id">
              <td>{{ item.id }}</td>
              <td>{{ item.product }}</td>
              <td>{{ item.qty }}</td>
              <td>{{ item.buyer }}</td>
              <td :class="item.statusColor">{{ item.status }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="table-card">
        <div class="table-head">
          <h4>履约进度</h4>
          <small class="muted">周度发运完成率</small>
        </div>
        <Line :data="lineData" :options="lineOptions" />
      </div>
    </div>
  </section>

  <div v-if="showPlan" class="modal-overlay" @click.self="showPlan = false">
    <div class="modal">
      <h3>新建采购计划</h3>
      <form @submit.prevent="submitPlan">
        <label>品类<select v-model="plan.product"><option>玉米</option><option>生菜</option><option>柑橘</option><option>牛奶</option></select></label>
        <label>需求量(吨)<input v-model.number="plan.qty" type="number" min="1" required /></label>
        <label>期望到货时间<input v-model="plan.date" type="date" required /></label>
        <label>备注<textarea v-model="plan.note" rows="3" placeholder="写下执行要求"></textarea></label>
        <div class="actions">
          <button class="btn outline" type="button" @click="showPlan = false">取消</button>
          <button class="btn" type="submit">提交计划</button>
        </div>
      </form>
    </div>
  </div>

  <div v-if="showSync" class="modal-overlay" @click.self="showSync = false">
    <div class="modal">
      <h3>订单状态推送</h3>
      <p>将最新发运和收货节点推送给采购方。</p>
      <div class="progress">
        <div class="bar" style="width: 64%"></div>
      </div>
      <div class="actions">
        <button class="btn" @click="showSync = false">完成</button>
      </div>
    </div>
  </div>

  <div v-if="showNotice" class="modal-overlay" @click.self="showNotice = false">
    <div class="modal">
      <h3>到货提醒</h3>
      <p>已向收货仓发送到货提醒，收货组可提前预约卸货。</p>
      <div class="actions">
        <button class="btn" @click="showNotice = false">关闭提示</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Line } from 'vue-chartjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const orders = ref([
  { id: 'PO20240501', product: '甜玉米', qty: '80 吨', buyer: '华东商超', status: '生产中', statusColor: 'status-blue' },
  { id: 'PO20240502', product: '叶菜组合', qty: '45 吨', buyer: '社区团购A', status: '发运中', statusColor: 'status-purple' },
  { id: 'PO20240503', product: '赣南脐橙', qty: '60 吨', buyer: '华南仓', status: '已到仓', statusColor: 'status-green' },
  { id: 'PO20240504', product: '进口香蕉', qty: '100 吨', buyer: '生鲜平台B', status: '质检中', statusColor: 'status-orange' },
  { id: 'PO20240505', product: '土豆', qty: '120 吨', buyer: '西北仓', status: '生产中', statusColor: 'status-blue' },
  { id: 'PO20240506', product: '冷鲜牛奶', qty: '30 吨', buyer: '华北商超', status: '发运中', statusColor: 'status-purple' },
  { id: 'PO20240507', product: '油麦菜', qty: '25 吨', buyer: '餐饮连锁', status: '待排产', statusColor: 'status-orange' },
  { id: 'PO20240508', product: '小龙虾', qty: '18 吨', buyer: '华中仓', status: '已到仓', statusColor: 'status-green' },
  { id: 'PO20240509', product: '高山苹果', qty: '90 吨', buyer: '西南仓', status: '生产中', statusColor: 'status-blue' },
  { id: 'PO20240510', product: '鲜切花', qty: '15 吨', buyer: '礼品渠道', status: '发运中', statusColor: 'status-purple' },
]);

const lineData = ref({
  labels: ['周1', '周2', '周3', '周4', '周5', '周6', '周7'],
  datasets: [
    {
      label: '发运完成率',
      data: [42, 55, 60, 68, 74, 82, 90],
      fill: false,
      borderColor: '#3a86ff',
      tension: 0.3,
    },
    {
      label: '到货完成率',
      data: [30, 48, 55, 63, 70, 77, 84],
      fill: false,
      borderColor: '#ff9f1c',
      tension: 0.3,
    },
  ],
});

const lineOptions = ref({
  responsive: true,
  plugins: { legend: { position: 'bottom' } },
  scales: {
    y: { ticks: { color: '#6b7280' }, grid: { color: '#e5e7eb' } },
    x: { ticks: { color: '#6b7280' }, grid: { display: false } },
  },
});

const showPlan = ref(false);
const showSync = ref(false);
const showNotice = ref(false);
const plan = ref({ product: '玉米', qty: 20, date: '', note: '' });

const submitPlan = () => {
  showPlan.value = false;
  alert('已创建采购计划：' + plan.value.product + ' ' + plan.value.qty + '吨');
};
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.muted {
  color: var(--muted);
}

.table-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 8px;
}

.progress {
  background: #f3f4f6;
  border-radius: 999px;
  height: 10px;
  overflow: hidden;
  margin-top: 10px;
}

.bar {
  height: 100%;
  background: linear-gradient(135deg, #3a86ff, #8338ec);
}
</style>
