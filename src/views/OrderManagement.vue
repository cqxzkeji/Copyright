<template>
  <div class="card">
    <h3>订单与交易管理</h3>
    <div style="display: flex; gap: 10px; margin-bottom: 12px; flex-wrap: wrap;">
      <button @click="showSearch = true">订单筛选</button>
      <button class="secondary" @click="showSettlement = true">批量结算</button>
      <button class="ghost" @click="showRefund = true">退款触达</button>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th>订单号</th>
          <th>买家</th>
          <th>金额</th>
          <th>状态</th>
          <th>支付渠道</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.id">
          <td>{{ order.id }}</td>
          <td>{{ order.buyer }}</td>
          <td>{{ order.amount }}</td>
          <td><span class="badge">{{ order.status }}</span></td>
          <td>{{ order.channel }}</td>
          <td style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button class="ghost" @click="openDetail(order)">详情</button>
            <button class="secondary" @click="openStatus(order)">变更状态</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <ModalDialog v-model="showSearch" title="筛选订单">
    <div class="form-grid">
      <div>
        <label>日期</label>
        <input v-model="filters.date" type="date" />
      </div>
      <div>
        <label>状态</label>
        <select v-model="filters.status">
          <option>全部</option>
          <option>待发货</option>
          <option>待收货</option>
          <option>已完成</option>
        </select>
      </div>
      <div>
        <label>买家</label>
        <input v-model="filters.buyer" placeholder="输入买家名称" />
      </div>
      <div>
        <label>支付渠道</label>
        <select v-model="filters.channel">
          <option>不限</option>
          <option>微信</option>
          <option>支付宝</option>
          <option>银联</option>
        </select>
      </div>
    </div>
    <template #footer>
      <button class="ghost" @click="showSearch = false">关闭</button>
      <button @click="applyFilter">应用筛选</button>
    </template>
  </ModalDialog>

  <ModalDialog v-model="showSettlement" title="批量结算进度">
    <p style="margin-top: 0;">已核对 10 单，正在发起清算。</p>
    <div class="progress-track">
      <div class="progress-fill" :style="{ width: settlementProgress + '%' }"></div>
    </div>
    <template #footer>
      <button class="ghost" @click="showSettlement = false">关闭</button>
      <button class="secondary" @click="speedSettle">加速</button>
    </template>
  </ModalDialog>

  <ModalDialog v-model="showRefund" title="退款触达">
    <p style="margin-top: 0;">向退款用户推送到账提醒与挽留优惠券。</p>
    <template #footer>
      <button class="ghost" @click="showRefund = false">取消</button>
      <button @click="sendRefund">推送通知</button>
    </template>
  </ModalDialog>

  <ModalDialog v-model="showOrderDetail" :title="'订单 ' + currentOrder?.id">
    <p style="margin-top: 0; color: var(--muted);">{{ currentOrder?.buyer }} ｜ {{ currentOrder?.amount }}</p>
    <div class="form-grid">
      <div>
        <label>收货地</label>
        <input :value="currentOrder?.address" readonly />
      </div>
      <div>
        <label>物流单号</label>
        <input :value="currentOrder?.logistics" readonly />
      </div>
      <div>
        <label>支付渠道</label>
        <input :value="currentOrder?.channel" readonly />
      </div>
      <div>
        <label>下单时间</label>
        <input :value="currentOrder?.time" readonly />
      </div>
    </div>
    <template #footer>
      <button class="ghost" @click="showOrderDetail = false">关闭</button>
    </template>
  </ModalDialog>

  <ModalDialog v-model="showStatus" :title="'变更 ' + currentOrder?.id + ' 状态'">
    <div class="form-grid">
      <div>
        <label>当前状态</label>
        <input :value="currentOrder?.status" readonly />
      </div>
      <div>
        <label>目标状态</label>
        <select v-model="statusForm.to">
          <option>待发货</option>
          <option>待收货</option>
          <option>已完成</option>
        </select>
      </div>
      <div>
        <label>备注</label>
        <textarea v-model="statusForm.remark" rows="2" placeholder="说明原因"></textarea>
      </div>
    </div>
    <template #footer>
      <button class="ghost" @click="showStatus = false">取消</button>
      <button class="secondary" @click="applyStatus">提交</button>
    </template>
  </ModalDialog>

  <ModalDialog v-model="showInfo" title="操作提示">
    <p style="margin: 0; color: var(--muted);">{{ infoMessage }}</p>
    <template #footer>
      <button class="ghost" @click="showInfo = false">好的</button>
    </template>
  </ModalDialog>
</template>

<script setup>
import { reactive, ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const orders = ref([
  { id: 'OD240601', buyer: '向阳农社', amount: '¥980', status: '待发货', channel: '微信', address: '杭州西湖区', logistics: 'SF10011', time: '2024-06-01 09:30' },
  { id: 'OD240602', buyer: '绿洲团购', amount: '¥1,320', status: '待收货', channel: '支付宝', address: '南京雨花台', logistics: 'YT29001', time: '2024-06-01 10:12' },
  { id: 'OD240603', buyer: '社区买菜', amount: '¥560', status: '已完成', channel: '微信', address: '苏州工业园', logistics: 'JD88021', time: '2024-06-01 10:35' },
  { id: 'OD240604', buyer: '田间买手', amount: '¥240', status: '待发货', channel: '银联', address: '合肥高新区', logistics: 'STO22310', time: '2024-06-01 11:00' },
  { id: 'OD240605', buyer: '良田商贸', amount: '¥1,120', status: '待收货', channel: '微信', address: '南昌红谷滩', logistics: 'ZTO31100', time: '2024-06-01 12:10' },
  { id: 'OD240606', buyer: '春耕供应链', amount: '¥980', status: '已完成', channel: '支付宝', address: '上海青浦', logistics: 'SF10012', time: '2024-06-01 12:56' },
  { id: 'OD240607', buyer: '源头团购', amount: '¥420', status: '待发货', channel: '微信', address: '长沙雨花', logistics: 'YD99801', time: '2024-06-01 13:15' },
  { id: 'OD240608', buyer: '云上供销', amount: '¥880', status: '待收货', channel: '银联', address: '福州仓山', logistics: 'SF10013', time: '2024-06-01 14:05' },
  { id: 'OD240609', buyer: '安心菜篮', amount: '¥330', status: '已完成', channel: '支付宝', address: '广州番禺', logistics: 'JD88022', time: '2024-06-01 14:40' },
  { id: 'OD240610', buyer: '千亩良田', amount: '¥760', status: '待发货', channel: '微信', address: '成都天府', logistics: 'STO22311', time: '2024-06-01 15:20' }
]);

const filters = reactive({
  date: '',
  status: '全部',
  buyer: '',
  channel: '不限'
});

const settlementProgress = ref(42);
const showSearch = ref(false);
const showSettlement = ref(false);
const showRefund = ref(false);
const showOrderDetail = ref(false);
const showStatus = ref(false);
const currentOrder = ref(null);
const showInfo = ref(false);
const infoMessage = ref('');

const statusForm = reactive({
  to: '待收货',
  remark: ''
});

const applyFilter = () => {
  infoMessage.value = `已应用筛选：${filters.status} / ${filters.channel}`;
  showSearch.value = false;
  showInfo.value = true;
};

const speedSettle = () => {
  settlementProgress.value = Math.min(100, settlementProgress.value + 15);
};

const sendRefund = () => {
  infoMessage.value = '已向退款订单发送到账提醒与优惠券';
  showRefund.value = false;
  showInfo.value = true;
};

const openDetail = (order) => {
  currentOrder.value = order;
  showOrderDetail.value = true;
};

const openStatus = (order) => {
  currentOrder.value = order;
  statusForm.to = order.status;
  statusForm.remark = '';
  showStatus.value = true;
};

const applyStatus = () => {
  infoMessage.value = `订单 ${currentOrder.value?.id} 已更新为 ${statusForm.to}`;
  showStatus.value = false;
  showInfo.value = true;
};
</script>
