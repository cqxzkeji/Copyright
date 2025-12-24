<template>
  <div>
    <div class="flex" style="justify-content: space-between; margin-bottom: 12px; flex-wrap: wrap; gap: 10px;">
      <h3 style="margin: 0;">订单与销售</h3>
      <div class="flex" style="gap: 8px;">
        <button @click="openBatchShip">批量发货</button>
        <button class="secondary" @click="openRefund">售后处理</button>
      </div>
    </div>

    <div class="table-card">
      <h3>订单列表（20 条）</h3>
      <table>
        <thead>
          <tr>
            <th>订单号</th>
            <th>买家</th>
            <th>金额</th>
            <th>状态</th>
            <th>配送</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.id">
            <td>{{ order.id }}</td>
            <td>{{ order.buyer }}</td>
            <td>¥{{ order.amount }}</td>
            <td><span :class="['badge', order.status === '待发货' ? 'warning' : 'success']">{{ order.status }}</span></td>
            <td>{{ order.shipper }}</td>
            <td class="flex" style="gap: 6px;">
              <button class="secondary" @click="openShip(order)">发货</button>
              <button class="accent" @click="openDetail(order)">详情</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <ModalDialog v-model="showShip" title="发货">
      <p>为 {{ currentOrder?.buyer }} 发货</p>
      <select v-model="shipper">
        <option>顺丰</option>
        <option>邮政</option>
        <option>京东</option>
      </select>
      <template #footer>
        <button class="secondary" @click="showShip = false">取消</button>
        <button @click="confirmShip">确认发货</button>
      </template>
    </ModalDialog>

    <ModalDialog v-model="showBatchShip" title="批量发货">
      <p>正为待发货订单生成批量面单...</p>
      <div class="progress-bar">
        <span :style="{ width: batchProgress + '%' }"></span>
      </div>
    </ModalDialog>

    <ModalDialog v-model="showRefund" title="售后处理">
      <p>售后退款/换货方案已推送至客服系统。</p>
      <template #footer>
        <button class="secondary" @click="showRefund = false">完成</button>
      </template>
    </ModalDialog>

    <ModalDialog v-model="showDetail" title="订单详情">
      <p>订单 {{ currentOrder?.id }}，金额 ¥{{ currentOrder?.amount }}，状态 {{ currentOrder?.status }}</p>
      <p>配送方式：{{ currentOrder?.shipper }}，买家 {{ currentOrder?.buyer }}</p>
      <template #footer>
        <button class="secondary" @click="showDetail = false">关闭</button>
      </template>
    </ModalDialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const buyers = ['李强', '王芬', '陈秀', '赵三', '石红', '彭磊', '周一'];
const shippers = ['顺丰', '邮政', '京东'];
const orders = ref(
  Array.from({ length: 20 }).map((_, idx) => ({
    id: `ORD-${8900 + idx}`,
    buyer: buyers[idx % buyers.length],
    amount: (129 + idx * 3).toFixed(2),
    status: idx % 4 === 0 ? '待发货' : '已发货',
    shipper: shippers[idx % shippers.length]
  }))
);

const showShip = ref(false);
const showBatchShip = ref(false);
const showRefund = ref(false);
const showDetail = ref(false);
const shipper = ref('顺丰');
const batchProgress = ref(20);
const currentOrder = ref(null);

const openShip = (order) => {
  currentOrder.value = order;
  shipper.value = order.shipper;
  showShip.value = true;
};

const openBatchShip = () => {
  showBatchShip.value = true;
  batchProgress.value = 20;
  const timer = setInterval(() => {
    if (batchProgress.value >= 100) {
      clearInterval(timer);
      showBatchShip.value = false;
    } else {
      batchProgress.value += 20;
    }
  }, 350);
};

const openRefund = () => {
  showRefund.value = true;
};

const openDetail = (order) => {
  currentOrder.value = order;
  showDetail.value = true;
};

const confirmShip = () => {
  if (currentOrder.value) {
    currentOrder.value.status = '已发货';
    currentOrder.value.shipper = shipper.value;
  }
  showShip.value = false;
};
</script>
