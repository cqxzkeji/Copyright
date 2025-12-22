<template>
  <div class="page">
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">商品与活动分析</h3>
        <div class="btn-group">
          <button class="btn primary" @click="openForm">创建活动</button>
          <button class="btn" @click="openProgress">更新销量预测</button>
          <button class="btn warning" @click="openTip">活动提示</button>
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
      <h3 class="card-title">重点商品表现</h3>
      <table class="table">
        <thead>
          <tr>
            <th>商品</th>
            <th>活动</th>
            <th>销量</th>
            <th>客单价</th>
            <th>活动ROI</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in tableData" :key="row.product">
            <td>{{ row.product }}</td>
            <td>{{ row.campaign }}</td>
            <td>{{ row.sales }}</td>
            <td>{{ row.price }}</td>
            <td>{{ row.roi }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseModal :show="showForm" title="创建促销活动" @close="showForm = false">
      <form class="modal-form" @submit.prevent="submitForm">
        <label>
          活动名称
          <input v-model="form.name" type="text" required />
        </label>
        <label>
          目标品类
          <select v-model="form.category">
            <option>水果礼盒</option>
            <option>特色杂粮</option>
            <option>有机蔬菜</option>
            <option>农产加工品</option>
          </select>
        </label>
        <label>
          优惠力度
          <input v-model="form.discount" type="text" required />
        </label>
        <button class="btn primary" type="submit">发布活动</button>
      </form>
    </BaseModal>

    <BaseModal :show="showProgress" title="销量预测更新" @close="showProgress = false">
      <p>正在根据库存与人群画像更新销量预测。</p>
      <div class="progress">
        <div class="progress-bar" :style="{ width: `${progress}%` }"></div>
      </div>
    </BaseModal>

    <BaseModal :show="showTip" title="活动提示" @close="showTip = false">
      <p>建议在周末增加“家庭装”组合包，预计ROI提升9%。</p>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const chart = [
  { label: '活动曝光', value: 88 },
  { label: '加购转化', value: 73 },
  { label: '优惠触达', value: 81 },
  { label: '库存健康', value: 76 },
  { label: '复购意向', value: 69 }
];

const tableData = [
  { product: '生态草莓礼盒', campaign: '春日尝鲜', sales: '8,420件', price: '￥92', roi: '2.4' },
  { product: '高原苹果箱', campaign: '产地直供', sales: '7,980件', price: '￥108', roi: '2.2' },
  { product: '有机蔬菜组合', campaign: '轻食周', sales: '7,420件', price: '￥86', roi: '2.1' },
  { product: '五谷杂粮包', campaign: '健康早餐', sales: '6,960件', price: '￥58', roi: '1.9' },
  { product: '海南椰青', campaign: '清凉补给', sales: '6,540件', price: '￥72', roi: '2.0' },
  { product: '云南咖啡豆', campaign: '下午茶专场', sales: '6,120件', price: '￥98', roi: '1.8' },
  { product: '山地蜂蜜', campaign: '滋补季', sales: '5,880件', price: '￥128', roi: '2.3' },
  { product: '橙汁礼盒', campaign: '果汁促销', sales: '5,540件', price: '￥76', roi: '1.7' },
  { product: '黑米杂粮', campaign: '高纤套餐', sales: '5,220件', price: '￥64', roi: '1.6' },
  { product: '冻干蔬菜包', campaign: '轻食升级', sales: '4,980件', price: '￥52', roi: '1.5' }
];

const showForm = ref(false);
const showProgress = ref(false);
const showTip = ref(false);
const progress = ref(0);
let timer = null;

const form = reactive({
  name: '',
  category: '水果礼盒',
  discount: ''
});

const openForm = () => {
  showForm.value = true;
};

const submitForm = () => {
  showForm.value = false;
  form.name = '';
  form.discount = '';
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
  }, 220);
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
