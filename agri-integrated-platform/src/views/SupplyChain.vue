<template>
  <div class="content-card">
    <div class="section-title">采购与供应链管理</div>
    <div class="actions-row">
      <button class="primary-btn" @click="showProcureModal = true">发布采购需求</button>
      <button class="secondary-btn" @click="showVendorModal = true">供应商准入</button>
      <button class="secondary-btn" @click="startLogistics">物流跟踪</button>
    </div>

    <div class="card-grid" style="margin-top: 16px; align-items: stretch;">
      <div class="stat-card" style="grid-column: span 2; min-width: 320px;">
        <strong>供应商履约率</strong>
        <canvas ref="vendorCanvas" height="120"></canvas>
      </div>
      <div class="stat-card">
        <div class="stat-label">本周采购完成</div>
        <div class="stat-value">86%</div>
        <span class="badge">准时到货 12 / 14</span>
      </div>
      <div class="stat-card">
        <div class="stat-label">在途物流</div>
        <div class="stat-value">8</div>
        <span class="badge">冷链 5 · 常温 3</span>
      </div>
    </div>

    <div class="table-wrapper" style="margin-top: 18px;">
      <div style="display:flex;justify-content:space-between;align-items:center; margin-bottom: 8px;">
        <strong>采购订单与到货</strong>
        <span class="tag">总计 {{ orders.length }} 条</span>
      </div>
      <table>
        <thead>
          <tr>
            <th>订单号</th>
            <th>物料</th>
            <th>数量</th>
            <th>供应商</th>
            <th>期望到货</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in orders" :key="row.id">
            <td>{{ row.id }}</td>
            <td>{{ row.item }}</td>
            <td>{{ row.qty }}</td>
            <td>{{ row.vendor }}</td>
            <td>{{ row.date }}</td>
            <td>
              <span class="badge" :style="{ background: row.status === '在途' ? '#fff4e6' : '#e5fbef', color: '#1d3557' }">{{ row.status }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <Modal title="发布采购需求" :show="showProcureModal" @close="showProcureModal = false">
    <form class="form-grid" @submit.prevent="submitProcure">
      <label>物料名称<input v-model="procureForm.item" required /></label>
      <label>需求数量<input type="number" min="1" v-model.number="procureForm.qty" required /></label>
      <label>希望到货日<input v-model="procureForm.date" type="date" required /></label>
      <label>供应商<select v-model="procureForm.vendor">
        <option value="">待比选</option>
        <option>华丰农资</option>
        <option>绿源肥料</option>
        <option>鲁西农化</option>
      </select></label>
      <label style="grid-column: span 2;">备注<textarea rows="3" v-model="procureForm.note"></textarea></label>
      <div style="grid-column: span 2; display:flex; gap:10px; justify-content:flex-end;">
        <button type="button" class="secondary-btn" @click="showProcureModal = false">取消</button>
        <button type="submit" class="primary-btn">提交需求</button>
      </div>
    </form>
  </Modal>

  <Modal title="供应商准入审核" :show="showVendorModal" @close="showVendorModal = false">
    <form class="form-grid" @submit.prevent="submitVendor">
      <label>供应商名称<input v-model="vendorForm.name" required /></label>
      <label>资质等级<select v-model="vendorForm.level">
        <option>AAA</option>
        <option>AA</option>
        <option>A</option>
      </select></label>
      <label>主营范围<input v-model="vendorForm.scope" /></label>
      <label>联系人<input v-model="vendorForm.contact" /></label>
      <label style="grid-column: span 2;">说明<textarea rows="3" v-model="vendorForm.desc"></textarea></label>
      <div style="grid-column: span 2; display:flex; gap:10px; justify-content:flex-end;">
        <button type="button" class="secondary-btn" @click="showVendorModal = false">取消</button>
        <button type="submit" class="primary-btn">提交准入</button>
      </div>
    </form>
  </Modal>

  <Modal title="物流跟踪" :show="showLogisticsModal" @close="showLogisticsModal = false">
    <p>正在同步冷链车载温度与定位。</p>
    <div class="progress-track" style="margin: 12px 0;">
      <div class="progress-bar" :style="{ width: logisticsProgress + '%' }"></div>
    </div>
    <p style="margin:0;">跟踪刷新：{{ logisticsProgress }}%</p>
  </Modal>
</template>

<script setup>
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import Chart from 'chart.js/auto';
import Modal from '../components/Modal.vue';

const orders = [
  { id: 'PO-9811', item: '有机肥', qty: '8 吨', vendor: '绿源肥料', date: '2024-04-03', status: '在途' },
  { id: 'PO-9812', item: '滴灌管', qty: '1200 米', vendor: '华丰农资', date: '2024-04-05', status: '已签收' },
  { id: 'PO-9813', item: '棚膜', qty: '5000 平方', vendor: '苏北塑业', date: '2024-04-06', status: '在途' },
  { id: 'PO-9814', item: '种子-番茄', qty: '20000 粒', vendor: '川农种业', date: '2024-04-02', status: '已签收' },
  { id: 'PO-9815', item: '除草剂', qty: '600 升', vendor: '鲁西农化', date: '2024-04-09', status: '在途' },
  { id: 'PO-9816', item: '复合肥', qty: '10 吨', vendor: '绿源肥料', date: '2024-04-11', status: '在途' },
  { id: 'PO-9817', item: '生物菌剂', qty: '1500 升', vendor: '华丰农资', date: '2024-04-08', status: '已签收' },
  { id: 'PO-9818', item: '滴灌头', qty: '3000 只', vendor: '华丰农资', date: '2024-04-06', status: '在途' },
  { id: 'PO-9819', item: '黄板', qty: '12000 张', vendor: '粤丰农资', date: '2024-04-04', status: '已签收' },
  { id: 'PO-9820', item: '温控设备', qty: '12 套', vendor: '北斗智慧物联', date: '2024-04-12', status: '在途' }
];

const showProcureModal = ref(false);
const showVendorModal = ref(false);
const showLogisticsModal = ref(false);
const logisticsProgress = ref(0);
const timer = ref(null);

const procureForm = reactive({ item: '', qty: 1, date: '', vendor: '', note: '' });
const vendorForm = reactive({ name: '', level: 'AAA', scope: '', contact: '', desc: '' });

const vendorCanvas = ref(null);
let chartInstance;

onMounted(() => {
  chartInstance = new Chart(vendorCanvas.value, {
    type: 'bar',
    data: {
      labels: ['华丰农资', '绿源肥料', '鲁西农化', '川农种业', '苏北塑业', '北斗智慧物联', '粤丰农资', '宏达物流', '远诚冷链', '西北牧业'],
      datasets: [
        {
          label: '履约率%',
          data: [96, 91, 89, 94, 87, 92, 90, 85, 93, 88],
          backgroundColor: '#2ec4b6'
        }
      ]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true, max: 100 } }
    }
  });
});

onBeforeUnmount(() => {
  if (chartInstance) chartInstance.destroy();
  clearInterval(timer.value);
});

const submitProcure = () => {
  alert(`已发布采购需求：${procureForm.item} · ${procureForm.qty}`);
  showProcureModal.value = false;
};

const submitVendor = () => {
  alert(`已提交 ${vendorForm.name} 准入审核`);
  showVendorModal.value = false;
};

const startLogistics = () => {
  logisticsProgress.value = 0;
  showLogisticsModal.value = true;
  clearInterval(timer.value);
  timer.value = setInterval(() => {
    if (logisticsProgress.value >= 100) {
      clearInterval(timer.value);
      return;
    }
    logisticsProgress.value += 12;
  }, 420);
};
</script>
