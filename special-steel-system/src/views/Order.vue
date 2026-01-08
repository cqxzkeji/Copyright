<template>
  <div class="page">
    <div class="header card">
      <div>
        <p class="section-title">智能报价与订单管理</p>
        <p class="sub">自动生成报价并跟踪订单执行与调整过程</p>
      </div>
      <div class="actions">
        <button class="action-btn" @click="openModal('quote')">生成报价</button>
        <button class="action-btn secondary" @click="openModal('schedule')">排产调整</button>
        <button class="action-btn secondary" @click="openModal('track')">订单追踪</button>
        <button class="action-btn secondary" @click="openModal('tip')">操作提示</button>
      </div>
    </div>

    <div class="grid">
      <div class="card">
        <p class="section-title">报价概览</p>
        <div class="price-grid">
          <div v-for="price in prices" :key="price.label" class="price">
            <strong>{{ price.value }}</strong>
            <span>{{ price.label }}</span>
          </div>
        </div>
      </div>
      <div class="card">
        <p class="section-title">订单执行进度</p>
        <ul class="order-progress">
          <li v-for="item in orderProgress" :key="item.name">
            <div>
              <strong>{{ item.name }}</strong>
              <p>{{ item.detail }}</p>
            </div>
            <div class="progress-bar">
              <span :style="{ width: `${item.value}%` }"></span>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <div class="card">
      <p class="section-title">订单清单（{{ orders.length }} 条）</p>
      <table class="table">
        <thead>
          <tr>
            <th>订单号</th>
            <th>客户</th>
            <th>匹配标准</th>
            <th>报价(万元)</th>
            <th>交付期</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.id">
            <td>{{ order.id }}</td>
            <td>{{ order.client }}</td>
            <td>{{ order.standard }}</td>
            <td>{{ order.price }}</td>
            <td>{{ order.delivery }}</td>
            <td><span class="badge" :class="order.statusClass">{{ order.status }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <AppModal v-model="modalVisible" :title="modalTitle" @confirm="modalVisible = false">
      <div v-if="modalType === 'quote'" class="form-grid">
        <label>
          客户名称
          <input class="input" placeholder="请输入客户" />
        </label>
        <label>
          标准编号
          <input class="input" placeholder="STD-2024-01" />
        </label>
        <label>
          预计吨位
          <input class="input" placeholder="120" />
        </label>
        <label>
          付款方式
          <select class="input">
            <option>预付款30%</option>
            <option>月结</option>
            <option>现款现货</option>
          </select>
        </label>
      </div>
      <div v-else-if="modalType === 'schedule'" class="modal-block">
        <p>订单排产正在调整中。</p>
        <div class="progress-bar">
          <span :style="{ width: `${scheduleProgress}%` }"></span>
        </div>
        <p class="status">当前排产进度 {{ scheduleProgress }}%</p>
      </div>
      <div v-else-if="modalType === 'track'" class="modal-block">
        <p>请输入订单编号获取最新交付状态：</p>
        <input class="input" placeholder="例如：SO-2024-019" />
        <div class="status-list">
          <div v-for="step in tracking" :key="step.name">
            <strong>{{ step.name }}</strong>
            <span>{{ step.note }}</span>
          </div>
        </div>
      </div>
      <div v-else class="modal-block">
        <p>提示：报价模型会依据标准等级、交期与成本自动推荐价格区间。</p>
        <ul>
          <li>排产调整完成后将同步至订单执行进度。</li>
          <li>可在订单追踪中查看物流节点。</li>
        </ul>
      </div>
    </AppModal>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import AppModal from '../components/AppModal.vue';

const prices = [
  { label: '平均报价', value: '￥86.4万' },
  { label: '本周最高', value: '￥128.0万' },
  { label: '已确认订单', value: '18单' },
  { label: '待谈判', value: '6单' }
];

const orderProgress = [
  { name: '炼钢准备', detail: '原料已入库', value: 90 },
  { name: '轧制加工', detail: '排产进行中', value: 65 },
  { name: '热处理', detail: '工艺审批完成', value: 40 }
];

const orders = ref(
  Array.from({ length: 23 }, (_, i) => ({
    id: `SO-2024-${(i + 1).toString().padStart(3, '0')}`,
    client: ['远洋装备', '高端轴承', '能源装备', '汽车零部件'][i % 4],
    standard: ['STD-2024-03', 'STD-2024-07', 'STD-2024-12'][i % 3],
    price: (80 + i * 1.6).toFixed(1),
    delivery: `2024-0${(i % 7) + 3}-${(i % 20) + 5}`,
    status: i % 3 === 0 ? '执行中' : i % 3 === 1 ? '待确认' : '已交付',
    statusClass: i % 3 === 0 ? 'info' : i % 3 === 1 ? 'warn' : 'success'
  }))
);

const tracking = [
  { name: '合同审核', note: '完成' },
  { name: '排产确认', note: '处理中' },
  { name: '物流准备', note: '待安排' }
];

const modalVisible = ref(false);
const modalType = ref('quote');
const modalTitle = ref('生成报价');
const scheduleProgress = ref(18);

const openModal = (type) => {
  modalType.value = type;
  modalTitle.value =
    type === 'quote' ? '生成报价' : type === 'schedule' ? '排产调整' : type === 'track' ? '订单追踪' : '操作提示';
  modalVisible.value = true;
};

watch(modalVisible, (visible) => {
  if (visible && modalType.value === 'schedule') {
    scheduleProgress.value = 20;
    const timer = setInterval(() => {
      scheduleProgress.value += 20;
      if (scheduleProgress.value >= 100) {
        scheduleProgress.value = 100;
        clearInterval(timer);
      }
    }, 220);
  }
});
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.sub {
  margin: 6px 0 0;
  font-size: 13px;
  color: #6b7a99;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 18px;
}

.price-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
}

.price {
  background: #f4f7ff;
  border-radius: 12px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.order-progress {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.order-progress p {
  margin: 6px 0 0;
  font-size: 12px;
  color: #6b7a99;
}

.modal-block {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.status {
  color: #2f6df6;
}

.status-list {
  display: grid;
  gap: 8px;
}

.status-list span {
  display: block;
  font-size: 12px;
  color: #6b7a99;
}
</style>
