<template>
  <div class="page">
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">投放与智能策略</h3>
        <div class="btn-group">
          <button class="btn primary" @click="openForm">新增投放计划</button>
          <button class="btn" @click="openProgress">智能调优</button>
          <button class="btn warning" @click="openTip">策略提示</button>
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
      <h3 class="card-title">投放计划执行情况</h3>
      <table class="table">
        <thead>
          <tr>
            <th>计划名称</th>
            <th>投放渠道</th>
            <th>曝光</th>
            <th>点击率</th>
            <th>成本</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in tableData" :key="row.plan">
            <td>{{ row.plan }}</td>
            <td>{{ row.channel }}</td>
            <td>{{ row.impressions }}</td>
            <td>{{ row.ctr }}</td>
            <td>{{ row.cost }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseModal :show="showForm" title="新增投放计划" @close="showForm = false">
      <form class="modal-form" @submit.prevent="submitForm">
        <label>
          计划名称
          <input v-model="form.name" type="text" required />
        </label>
        <label>
          投放渠道
          <select v-model="form.channel">
            <option>直播平台首页</option>
            <option>站外短视频</option>
            <option>社群私域</option>
            <option>电商搜索位</option>
          </select>
        </label>
        <label>
          预算额度
          <input v-model="form.budget" type="text" required />
        </label>
        <button class="btn primary" type="submit">提交计划</button>
      </form>
    </BaseModal>

    <BaseModal :show="showProgress" title="智能调优中" @close="showProgress = false">
      <p>正在自动调整人群包与投放时段。</p>
      <div class="progress">
        <div class="progress-bar" :style="{ width: `${progress}%` }"></div>
      </div>
    </BaseModal>

    <BaseModal :show="showTip" title="策略提示" @close="showTip = false">
      <p>建议夜间时段加大冷启动预算，提高农产品新品曝光。</p>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const chart = [
  { label: '人群匹配度', value: 84 },
  { label: '投放效率', value: 79 },
  { label: '成交转化', value: 72 },
  { label: '素材适配', value: 86 },
  { label: '预算利用率', value: 77 }
];

const tableData = [
  { plan: '绿色蔬菜专场', channel: '直播平台首页', impressions: '128万', ctr: '3.4%', cost: '￥42,000' },
  { plan: '水果礼盒拉新', channel: '站外短视频', impressions: '116万', ctr: '3.1%', cost: '￥38,500' },
  { plan: '粮油复购', channel: '社群私域', impressions: '84万', ctr: '4.2%', cost: '￥27,600' },
  { plan: '农旅特产推广', channel: '电商搜索位', impressions: '92万', ctr: '3.6%', cost: '￥31,800' },
  { plan: '夏季清凉瓜果', channel: '直播平台首页', impressions: '110万', ctr: '3.2%', cost: '￥36,400' },
  { plan: '健康早餐杂粮', channel: '站外短视频', impressions: '98万', ctr: '2.9%', cost: '￥29,900' },
  { plan: '有机蔬菜复购', channel: '社群私域', impressions: '76万', ctr: '4.0%', cost: '￥22,700' },
  { plan: '精品茶叶推广', channel: '电商搜索位', impressions: '88万', ctr: '3.5%', cost: '￥26,800' },
  { plan: '生态蜂蜜专场', channel: '直播平台首页', impressions: '95万', ctr: '3.3%', cost: '￥30,500' },
  { plan: '农产加工新品', channel: '站外短视频', impressions: '90万', ctr: '3.0%', cost: '￥28,200' }
];

const showForm = ref(false);
const showProgress = ref(false);
const showTip = ref(false);
const progress = ref(0);
let timer = null;

const form = reactive({
  name: '',
  channel: '直播平台首页',
  budget: ''
});

const openForm = () => {
  showForm.value = true;
};

const submitForm = () => {
  showForm.value = false;
  form.name = '';
  form.budget = '';
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
      progress.value += 20;
    }
  }, 240);
};

const openTip = () => {
  showTip.value = true;
};
</script>

<style scoped>
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
