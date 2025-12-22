<template>
  <div class="page">
    <div class="section-grid">
      <div class="card" v-for="metric in metrics" :key="metric.label">
        <h3 class="card-title">{{ metric.label }}</h3>
        <p class="metric">{{ metric.value }}</p>
        <span class="metric-note">{{ metric.note }}</span>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <h3 class="card-title">直播营销趋势</h3>
        <div class="btn-group">
          <button class="btn primary" @click="openForm">新增看板指标</button>
          <button class="btn" @click="openProgress">刷新数据</button>
          <button class="btn warning" @click="openTip">查看提示</button>
        </div>
      </div>
      <div class="chart">
        <div class="chart-item" v-for="item in chart" :key="item.label">
          <span>{{ item.label }}</span>
          <div class="chart-bar">
            <div class="chart-fill" :style="{ width: `${item.value}%` }"></div>
          </div>
          <strong>{{ item.value }}%</strong>
        </div>
      </div>
    </div>

    <div class="card">
      <h3 class="card-title">直播间实时数据</h3>
      <table class="table">
        <thead>
          <tr>
            <th>直播间</th>
            <th>场次</th>
            <th>在线人数</th>
            <th>转化率</th>
            <th>GMV</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in tableData" :key="row.room">
            <td>{{ row.room }}</td>
            <td>{{ row.session }}</td>
            <td>{{ row.online }}</td>
            <td>{{ row.rate }}</td>
            <td>{{ row.gmv }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseModal :show="showForm" title="新增看板指标" @close="showForm = false">
      <form class="modal-form" @submit.prevent="submitForm">
        <label>
          指标名称
          <input v-model="form.name" type="text" required />
        </label>
        <label>
          数据来源
          <select v-model="form.source">
            <option>实时直播</option>
            <option>订单中心</option>
            <option>投放平台</option>
          </select>
        </label>
        <label>
          展示周期
          <select v-model="form.period">
            <option>今日</option>
            <option>近7天</option>
            <option>近30天</option>
          </select>
        </label>
        <button class="btn primary" type="submit">保存指标</button>
      </form>
    </BaseModal>

    <BaseModal :show="showProgress" title="数据刷新中" @close="showProgress = false">
      <p>正在同步直播营销数据，请保持窗口打开。</p>
      <div class="progress">
        <div class="progress-bar" :style="{ width: `${progress}%` }"></div>
      </div>
    </BaseModal>

    <BaseModal :show="showTip" title="运营提示" @close="showTip = false">
      <p>今晚黄金时段建议优先推广“生态果蔬礼盒”，预计转化提升12%。</p>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const metrics = [
  { label: '今日观看人数', value: '128,640', note: '较昨日 +8.4%' },
  { label: '场均成交额', value: '￥32,800', note: '较昨日 +5.1%' },
  { label: '成交转化率', value: '6.8%', note: '较昨日 +0.6%' },
  { label: '新增粉丝', value: '3,820', note: '较昨日 +9.3%' }
];

const chart = [
  { label: '互动热度', value: 82 },
  { label: '点击加购', value: 74 },
  { label: '支付完成', value: 68 },
  { label: '复购意向', value: 61 },
  { label: '分享扩散', value: 58 }
];

const tableData = [
  { room: '山东果园专场', session: '第12场', online: 8420, rate: '7.2%', gmv: '￥168,000' },
  { room: '海南瓜果直采', session: '第7场', online: 7120, rate: '6.5%', gmv: '￥142,000' },
  { room: '东北粮油专场', session: '第9场', online: 6950, rate: '6.1%', gmv: '￥136,500' },
  { room: '云南鲜花果蔬', session: '第5场', online: 6120, rate: '6.9%', gmv: '￥128,400' },
  { room: '广西柑橘直发', session: '第4场', online: 5890, rate: '6.3%', gmv: '￥121,700' },
  { room: '河北杂粮专场', session: '第8场', online: 5440, rate: '5.9%', gmv: '￥118,900' },
  { room: '浙江海鲜联播', session: '第3场', online: 5200, rate: '6.0%', gmv: '￥113,200' },
  { room: '四川菌菇基地', session: '第6场', online: 4980, rate: '5.7%', gmv: '￥108,600' },
  { room: '甘肃苹果专场', session: '第11场', online: 4620, rate: '6.4%', gmv: '￥102,300' },
  { room: '湖南米粉直播', session: '第2场', online: 4390, rate: '5.5%', gmv: '￥96,800' }
];

const showForm = ref(false);
const showProgress = ref(false);
const showTip = ref(false);
const progress = ref(0);
let timer = null;

const form = reactive({
  name: '',
  source: '实时直播',
  period: '今日'
});

const openForm = () => {
  showForm.value = true;
};

const submitForm = () => {
  showForm.value = false;
  form.name = '';
};

const openProgress = () => {
  showProgress.value = true;
  progress.value = 0;
  if (timer) clearInterval(timer);
  timer = setInterval(() => {
    if (progress.value >= 100) {
      clearInterval(timer);
      showProgress.value = false;
    } else {
      progress.value += 25;
    }
  }, 250);
};

const openTip = () => {
  showTip.value = true;
};
</script>

<style scoped>
.metric {
  font-size: 26px;
  margin: 0 0 6px;
  font-weight: 700;
}

.metric-note {
  color: #6b7a99;
  font-size: 13px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.modal-form {
  display: grid;
  gap: 12px;
}

.modal-form label {
  display: grid;
  gap: 6px;
  color: #52607b;
  font-size: 14px;
}

.modal-form input,
.modal-form select {
  border: 1px solid #e0e6f1;
  border-radius: 10px;
  padding: 8px 10px;
}
</style>
