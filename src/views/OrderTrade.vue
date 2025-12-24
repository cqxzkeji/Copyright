<template>
  <div class="grid">
    <ChartPanel
      title="订单履约状态"
      subtitle="本周趋势"
      :labels="orderChart.labels"
      :values="orderChart.values"
    />
    <div class="card">
      <div class="section-title">
        <h3>订单与履约</h3>
        <div class="actions">
          <button class="btn" @click="showShip = true">批量发货</button>
          <button class="btn secondary" @click="startSync">订单同步</button>
          <button class="btn ghost" @click="showAlert = true">风险提醒</button>
        </div>
      </div>
      <div class="table-wrapper">
        <table class="table">
          <thead>
            <tr>
              <th>订单号</th>
              <th>买家</th>
              <th>金额</th>
              <th>状态</th>
              <th class="hide-mobile">发货地</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in orders" :key="order.id">
              <td>{{ order.id }}</td>
              <td>{{ order.buyer }}</td>
              <td>¥{{ order.amount }}</td>
              <td><span class="status-pill" :class="order.status === '已签收' ? 'success' : order.status === '待发货' ? 'warning' : ''">{{ order.status }}</span></td>
              <td class="hide-mobile">{{ order.origin }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <BaseModal v-model="showShip" title="批量发货">
    <div class="form-grid">
      <label>物流公司
        <select v-model="shipForm.company">
          <option>中通</option>
          <option>顺丰</option>
          <option>京东</option>
        </select>
      </label>
      <label>发货批次号<input v-model="shipForm.batch" placeholder="如：CN20240518" /></label>
      <label class="full-width">备注
        <textarea v-model="shipForm.remark" rows="3" placeholder="填写发货注意事项"></textarea>
      </label>
    </div>
    <template #actions>
      <button class="btn ghost" @click="showShip = false">取消</button>
      <button class="btn" @click="submitShip">确认发货</button>
    </template>
  </BaseModal>

  <BaseModal v-model="showAlert" title="风险提醒">
    <div class="toast">高温生鲜订单请启用冷链物流，超48小时未妥投自动回访买家。</div>
  </BaseModal>

  <BaseModal v-model="showProgress" title="订单同步中">
    <p>正在与渠道订单池完成核对。</p>
    <div class="progress-bar"><div class="progress-bar__fill" :style="{ width: progress + '%' }"></div></div>
    <p>{{ progress }}% 已完成</p>
  </BaseModal>
</template>

<script setup>
import { reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';
import ChartPanel from '../components/ChartPanel.vue';

const showShip = ref(false);
const showAlert = ref(false);
const showProgress = ref(false);
const progress = ref(0);

const orderChart = {
  labels: ['待付款', '待发货', '运输中', '已签收', '售后中'],
  values: [15, 35, 20, 60, 10]
};

const orders = ref([
  { id: 'SO2024051801', buyer: '陈晨', amount: 458, status: '已签收', origin: '福建南平' },
  { id: 'SO2024051802', buyer: '林雪', amount: 129, status: '运输中', origin: '四川眉山' },
  { id: 'SO2024051803', buyer: '王月', amount: 268, status: '待发货', origin: '浙江安吉' },
  { id: 'SO2024051804', buyer: '黄磊', amount: 399, status: '已签收', origin: '江西九江' },
  { id: 'SO2024051805', buyer: '程浩', amount: 189, status: '运输中', origin: '山东泰安' },
  { id: 'SO2024051806', buyer: '李想', amount: 520, status: '已签收', origin: '黑龙江五常' },
  { id: 'SO2024051807', buyer: '周鑫', amount: 305, status: '待发货', origin: '广西玉林' },
  { id: 'SO2024051808', buyer: '赵梅', amount: 240, status: '运输中', origin: '湖南邵阳' },
  { id: 'SO2024051809', buyer: '丁一', amount: 175, status: '已签收', origin: '河南南阳' },
  { id: 'SO2024051810', buyer: '蔡舟', amount: 650, status: '待发货', origin: '四川蒲江' }
]);

const shipForm = reactive({ company: '中通', batch: '', remark: '' });

const submitShip = () => {
  showShip.value = false;
};

const startSync = () => {
  progress.value = 0;
  showProgress.value = true;
  const timer = setInterval(() => {
    progress.value += 25;
    if (progress.value >= 100) {
      progress.value = 100;
      clearInterval(timer);
      setTimeout(() => (showProgress.value = false), 700);
    }
  }, 350);
};
</script>

<style scoped>
.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
</style>
