<template>
  <div class="page">
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">系统运行监控</h3>
        <div class="btn-group">
          <button class="btn primary" @click="openForm">新增权限角色</button>
          <button class="btn" @click="openProgress">执行健康检查</button>
          <button class="btn warning" @click="openTip">系统提示</button>
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
      <h3 class="card-title">权限与配置列表</h3>
      <table class="table">
        <thead>
          <tr>
            <th>角色</th>
            <th>权限范围</th>
            <th>账号数</th>
            <th>更新时间</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in tableData" :key="row.role">
            <td>{{ row.role }}</td>
            <td>{{ row.scope }}</td>
            <td>{{ row.accounts }}</td>
            <td>{{ row.updated }}</td>
            <td>{{ row.status }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseModal :show="showForm" title="新增权限角色" @close="showForm = false">
      <form class="modal-form" @submit.prevent="submitForm">
        <label>
          角色名称
          <input v-model="form.role" type="text" required />
        </label>
        <label>
          权限范围
          <select v-model="form.scope">
            <option>全域管理</option>
            <option>直播运营</option>
            <option>数据治理</option>
            <option>内容审核</option>
          </select>
        </label>
        <label>
          备注说明
          <input v-model="form.note" type="text" required />
        </label>
        <button class="btn primary" type="submit">保存角色</button>
      </form>
    </BaseModal>

    <BaseModal :show="showProgress" title="健康检查" @close="showProgress = false">
      <p>正在检测系统运行状况与资源占用。</p>
      <div class="progress">
        <div class="progress-bar" :style="{ width: `${progress}%` }"></div>
      </div>
    </BaseModal>

    <BaseModal :show="showTip" title="系统提示" @close="showTip = false">
      <p>推荐在凌晨时段执行数据备份，确保直播高峰稳定。</p>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const chart = [
  { label: '接口可用性', value: 98 },
  { label: '数据同步成功率', value: 95 },
  { label: '任务调度稳定度', value: 91 },
  { label: '权限覆盖度', value: 88 },
  { label: '安全评分', value: 93 }
];

const tableData = [
  { role: '平台管理员', scope: '全域管理', accounts: 6, updated: '2024-06-18', status: '启用' },
  { role: '直播运营', scope: '直播运营', accounts: 12, updated: '2024-06-17', status: '启用' },
  { role: '内容策划', scope: '内容审核', accounts: 9, updated: '2024-06-16', status: '启用' },
  { role: '数据治理', scope: '数据治理', accounts: 8, updated: '2024-06-15', status: '启用' },
  { role: '商品管理员', scope: '直播运营', accounts: 10, updated: '2024-06-14', status: '启用' },
  { role: '投放专员', scope: '直播运营', accounts: 7, updated: '2024-06-13', status: '启用' },
  { role: '分析师', scope: '数据治理', accounts: 11, updated: '2024-06-12', status: '启用' },
  { role: '审计人员', scope: '全域管理', accounts: 4, updated: '2024-06-11', status: '启用' },
  { role: '研发支持', scope: '全域管理', accounts: 5, updated: '2024-06-10', status: '启用' },
  { role: '观察访客', scope: '内容审核', accounts: 3, updated: '2024-06-09', status: '启用' }
];

const showForm = ref(false);
const showProgress = ref(false);
const showTip = ref(false);
const progress = ref(0);
let timer = null;

const form = reactive({
  role: '',
  scope: '全域管理',
  note: ''
});

const openForm = () => {
  showForm.value = true;
};

const submitForm = () => {
  showForm.value = false;
  form.role = '';
  form.note = '';
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
