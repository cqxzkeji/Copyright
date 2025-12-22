<template>
  <div class="page">
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">数据接入总览</h3>
        <div class="btn-group">
          <button class="btn primary" @click="openForm">新增数据源</button>
          <button class="btn" @click="openProgress">批量校验</button>
          <button class="btn warning" @click="openTip">治理提示</button>
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
      <h3 class="card-title">数据源治理明细</h3>
      <table class="table">
        <thead>
          <tr>
            <th>数据源</th>
            <th>接入方式</th>
            <th>质量评分</th>
            <th>延迟</th>
            <th>负责人</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in tableData" :key="row.source">
            <td>{{ row.source }}</td>
            <td>{{ row.method }}</td>
            <td>{{ row.score }}</td>
            <td>{{ row.delay }}</td>
            <td>{{ row.owner }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseModal :show="showForm" title="新增数据源" @close="showForm = false">
      <form class="modal-form" @submit.prevent="submitForm">
        <label>
          数据源名称
          <input v-model="form.name" type="text" required />
        </label>
        <label>
          接入方式
          <select v-model="form.method">
            <option>API接入</option>
            <option>批量导入</option>
            <option>实时流</option>
          </select>
        </label>
        <label>
          数据负责人
          <input v-model="form.owner" type="text" required />
        </label>
        <button class="btn primary" type="submit">提交接入</button>
      </form>
    </BaseModal>

    <BaseModal :show="showProgress" title="质量校验中" @close="showProgress = false">
      <p>正在执行异常字段扫描与重复性检测。</p>
      <div class="progress">
        <div class="progress-bar" :style="{ width: `${progress}%` }"></div>
      </div>
    </BaseModal>

    <BaseModal :show="showTip" title="治理提示" @close="showTip = false">
      <p>建议本周优先修复“产地供应链”数据的地址缺失字段。</p>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const chart = [
  { label: '字段完整度', value: 92 },
  { label: '数据一致性', value: 88 },
  { label: '重复率控制', value: 76 },
  { label: '时效稳定度', value: 84 },
  { label: '可追溯链路', value: 79 }
];

const tableData = [
  { source: '直播订单中心', method: 'API接入', score: '94', delay: '1.2分钟', owner: '张颖' },
  { source: '产地供应链', method: '实时流', score: '86', delay: '2.4分钟', owner: '王斌' },
  { source: '营销投放平台', method: '批量导入', score: '88', delay: '4.5分钟', owner: '刘畅' },
  { source: '会员画像库', method: 'API接入', score: '90', delay: '1.6分钟', owner: '陈洁' },
  { source: '客服工单', method: '批量导入', score: '82', delay: '6.2分钟', owner: '李娜' },
  { source: '物流履约', method: '实时流', score: '89', delay: '2.1分钟', owner: '周航' },
  { source: '短视频内容', method: 'API接入', score: '91', delay: '1.8分钟', owner: '宋安' },
  { source: '站外媒体监测', method: '批量导入', score: '78', delay: '7.3分钟', owner: '何雨' },
  { source: '直播互动日志', method: '实时流', score: '93', delay: '1.0分钟', owner: '赵磊' },
  { source: '仓储库存', method: 'API接入', score: '87', delay: '3.5分钟', owner: '冯萍' }
];

const showForm = ref(false);
const showProgress = ref(false);
const showTip = ref(false);
const progress = ref(0);
let timer = null;

const form = reactive({
  name: '',
  method: 'API接入',
  owner: ''
});

const openForm = () => {
  showForm.value = true;
};

const submitForm = () => {
  showForm.value = false;
  form.name = '';
  form.owner = '';
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
