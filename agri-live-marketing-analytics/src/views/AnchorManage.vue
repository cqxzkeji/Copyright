<template>
  <div class="page">
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">主播内容表现</h3>
        <div class="btn-group">
          <button class="btn primary" @click="openForm">新增主播档案</button>
          <button class="btn" @click="openProgress">更新评分模型</button>
          <button class="btn warning" @click="openTip">内容提示</button>
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
      <h3 class="card-title">主播与内容排行</h3>
      <table class="table">
        <thead>
          <tr>
            <th>主播</th>
            <th>核心品类</th>
            <th>内容评分</th>
            <th>互动率</th>
            <th>粉丝增长</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in tableData" :key="row.name">
            <td>{{ row.name }}</td>
            <td>{{ row.category }}</td>
            <td>{{ row.score }}</td>
            <td>{{ row.interaction }}</td>
            <td>{{ row.fans }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseModal :show="showForm" title="新增主播档案" @close="showForm = false">
      <form class="modal-form" @submit.prevent="submitForm">
        <label>
          主播姓名
          <input v-model="form.name" type="text" required />
        </label>
        <label>
          擅长品类
          <select v-model="form.category">
            <option>果蔬生鲜</option>
            <option>粮油副食</option>
            <option>特色加工</option>
            <option>农旅特产</option>
          </select>
        </label>
        <label>
          账号定位
          <input v-model="form.position" type="text" required />
        </label>
        <button class="btn primary" type="submit">保存档案</button>
      </form>
    </BaseModal>

    <BaseModal :show="showProgress" title="评分模型更新" @close="showProgress = false">
      <p>模型正在学习最新弹幕、成交与复购数据。</p>
      <div class="progress">
        <div class="progress-bar" :style="{ width: `${progress}%` }"></div>
      </div>
    </BaseModal>

    <BaseModal :show="showTip" title="内容优化提示" @close="showTip = false">
      <p>建议加入“农场溯源”短视频片段，提升可信度与分享率。</p>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const chart = [
  { label: '互动粘性', value: 86 },
  { label: '内容节奏', value: 79 },
  { label: '价格讲解', value: 83 },
  { label: '场景真实感', value: 88 },
  { label: '品类匹配度', value: 81 }
];

const tableData = [
  { name: '李晓禾', category: '果蔬生鲜', score: '92', interaction: '13.8%', fans: '+1,240' },
  { name: '周小山', category: '粮油副食', score: '90', interaction: '12.5%', fans: '+1,080' },
  { name: '杨柳', category: '特色加工', score: '88', interaction: '11.9%', fans: '+980' },
  { name: '张小柠', category: '果蔬生鲜', score: '87', interaction: '11.5%', fans: '+940' },
  { name: '赵小满', category: '农旅特产', score: '86', interaction: '10.8%', fans: '+910' },
  { name: '陈小豆', category: '粮油副食', score: '85', interaction: '10.4%', fans: '+870' },
  { name: '孙小溪', category: '果蔬生鲜', score: '84', interaction: '10.1%', fans: '+820' },
  { name: '何小麦', category: '特色加工', score: '83', interaction: '9.9%', fans: '+780' },
  { name: '马小果', category: '果蔬生鲜', score: '82', interaction: '9.6%', fans: '+740' },
  { name: '卢小村', category: '农旅特产', score: '81', interaction: '9.2%', fans: '+700' }
];

const showForm = ref(false);
const showProgress = ref(false);
const showTip = ref(false);
const progress = ref(0);
let timer = null;

const form = reactive({
  name: '',
  category: '果蔬生鲜',
  position: ''
});

const openForm = () => {
  showForm.value = true;
};

const submitForm = () => {
  showForm.value = false;
  form.name = '';
  form.position = '';
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
  }, 230);
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
