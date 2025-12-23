<template>
  <div class="page">
    <div class="section-card">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div style="font-weight: 700;">订单与物流管理</div>
        <div class="action-row">
          <button class="btn" @click="openCreate">新建订单</button>
          <button class="btn secondary" @click="openDispatch">调度车辆</button>
          <button class="btn warning" @click="openReminder">到货提醒</button>
        </div>
      </div>
      <div class="card-grid" style="margin-top: 16px;">
        <div class="section-card" v-for="stat in stats" :key="stat.label">
          <div style="font-size: 12px; color: #64748b;">{{ stat.label }}</div>
          <div style="font-size: 22px; font-weight: 700; margin-top: 8px;">{{ stat.value }}</div>
          <div class="badge" style="margin-top: 10px;">{{ stat.tag }}</div>
        </div>
      </div>
    </div>

    <div class="section-card">
      <div style="font-weight: 700; margin-bottom: 12px;">冷链运输路线</div>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px;">
        <div class="section-card" v-for="route in routes" :key="route.name">
          <div style="font-weight: 600;">{{ route.name }}</div>
          <div style="font-size: 12px; color: #64748b; margin-top: 6px;">{{ route.detail }}</div>
          <div class="progress" style="margin-top: 12px;">
            <span :style="{ width: route.progress }"></span>
          </div>
        </div>
      </div>
    </div>

    <div class="section-card">
      <div style="font-weight: 700; margin-bottom: 12px;">订单执行清单</div>
      <table class="table">
        <thead>
          <tr>
            <th>订单号</th>
            <th>收货地</th>
            <th>品类</th>
            <th>物流状态</th>
            <th>预计到达</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.id">
            <td>{{ order.id }}</td>
            <td>{{ order.city }}</td>
            <td>{{ order.product }}</td>
            <td>
              <span class="badge">{{ order.status }}</span>
            </td>
            <td>{{ order.time }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseModal :open="createOpen" title="新建订单" :on-close="closeCreate">
      <form class="modal-form" @submit.prevent="submitCreate">
        <div>
          <label>订单号</label>
          <input v-model="form.id" type="text" placeholder="自动生成" />
        </div>
        <div>
          <label>收货地</label>
          <input v-model="form.city" type="text" placeholder="如：成都社区仓" required />
        </div>
        <div>
          <label>品类</label>
          <input v-model="form.product" type="text" placeholder="如：有机水果" required />
        </div>
        <div>
          <label>预计到达</label>
          <input v-model="form.time" type="text" placeholder="如：明日 14:00" required />
        </div>
      </form>
      <template #footer>
        <button class="btn secondary" @click="closeCreate">取消</button>
        <button class="btn" @click="submitCreate">保存订单</button>
      </template>
    </BaseModal>

    <BaseModal :open="dispatchOpen" title="调度车辆进度" :on-close="closeDispatch">
      <p>正在匹配空闲冷链车辆与司机。</p>
      <div class="progress" style="margin-top: 16px;">
        <span :style="{ width: '58%' }"></span>
      </div>
      <p style="margin-top: 12px; color: #64748b;">预计 5 分钟完成调度。</p>
      <template #footer>
        <button class="btn" @click="closeDispatch">我知道了</button>
      </template>
    </BaseModal>

    <BaseModal :open="reminderOpen" title="到货提醒" :on-close="closeReminder">
      <p>订单 SO-2024-008 将于 30 分钟内到达成都社区仓。</p>
      <p>已向站点客服发送卸货准备通知。</p>
      <template #footer>
        <button class="btn" @click="closeReminder">确认</button>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const stats = [
  { label: '当日订单', value: '386 单', tag: '配送及时率 98%' },
  { label: '在途车辆', value: '24 辆', tag: '冷链占比 70%' },
  { label: '站点签收', value: '312 单', tag: '投诉 0.5%' },
  { label: '异常预警', value: '3 单', tag: '已转人工' }
];

const routes = [
  { name: '安和镇 → 成都冷链仓', detail: '生鲜蔬菜 · 冷链 6 车次', progress: '80%' },
  { name: '丰谷镇 → 重庆分拨', detail: '柑橘礼盒 · 冷链 4 车次', progress: '66%' },
  { name: '双桥镇 → 眉山前置仓', detail: '生态大米 · 干线 3 车次', progress: '54%' },
  { name: '石岭镇 → 德阳社区仓', detail: '菌菇组合 · 冷链 2 车次', progress: '70%' }
];

const orders = ref([
  { id: 'SO-2024-001', city: '成都社区仓', product: '高山蔬菜', status: '运输中', time: '今日 16:30' },
  { id: 'SO-2024-002', city: '重庆分拨仓', product: '柑橘礼盒', status: '待发车', time: '今日 18:00' },
  { id: 'SO-2024-003', city: '眉山前置仓', product: '生态大米', status: '已到达', time: '今日 11:20' },
  { id: 'SO-2024-004', city: '德阳社区仓', product: '菌菇组合', status: '运输中', time: '今日 15:40' },
  { id: 'SO-2024-005', city: '南充服务站', product: '蜂蜜制品', status: '待装车', time: '明日 09:00' },
  { id: 'SO-2024-006', city: '广元社区仓', product: '土鸡蛋', status: '运输中', time: '今日 14:10' },
  { id: 'SO-2024-007', city: '遂宁分拨仓', product: '红薯制品', status: '待发车', time: '今日 19:30' },
  { id: 'SO-2024-008', city: '成都社区仓', product: '茶叶礼盒', status: '即将到达', time: '今日 12:50' },
  { id: 'SO-2024-009', city: '资阳前置仓', product: '桑蚕丝', status: '运输中', time: '今日 17:20' },
  { id: 'SO-2024-010', city: '绵阳社区仓', product: '辣椒酱', status: '已签收', time: '今日 10:30' }
]);

const createOpen = ref(false);
const dispatchOpen = ref(false);
const reminderOpen = ref(false);

const form = reactive({
  id: '',
  city: '',
  product: '',
  time: ''
});

const openCreate = () => {
  createOpen.value = true;
};
const closeCreate = () => {
  createOpen.value = false;
};
const submitCreate = () => {
  const newId = form.id || `SO-2024-${String(orders.value.length + 1).padStart(3, '0')}`;
  orders.value.unshift({
    id: newId,
    city: form.city,
    product: form.product,
    status: '待确认',
    time: form.time
  });
  form.id = '';
  form.city = '';
  form.product = '';
  form.time = '';
  createOpen.value = false;
};

const openDispatch = () => {
  dispatchOpen.value = true;
};
const closeDispatch = () => {
  dispatchOpen.value = false;
};

const openReminder = () => {
  reminderOpen.value = true;
};
const closeReminder = () => {
  reminderOpen.value = false;
};
</script>
