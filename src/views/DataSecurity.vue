<template>
  <section class="grid-2">
    <div class="card">
      <h3>数据加密与解密管理</h3>
      <p style="color: #6b7280; margin: 8px 0 16px;">统一密钥托管与加密策略配置。</p>
      <div class="action-bar">
        <button class="primary-button" type="button" @click="openForm('创建加密策略')">创建策略</button>
        <button class="secondary-button" type="button" @click="openProgress('正在轮换密钥并同步策略')">轮换密钥</button>
        <button class="secondary-button" type="button" @click="openInfo('支持国密与AES算法，满足监管合规要求。')">策略说明</button>
      </div>
    </div>
    <div class="card">
      <h3>合规检查评分</h3>
      <p style="color: #6b7280; margin: 8px 0 16px;">本周合规指标评分趋势。</p>
      <div class="chart">
        <div v-for="value in chartData" :key="value" class="chart-bar" :style="{ height: `${value}%` }"></div>
      </div>
    </div>
  </section>

  <section class="card">
    <h3>审计日志</h3>
    <table class="data-table">
      <thead>
        <tr>
          <th>时间</th>
          <th>操作人</th>
          <th>操作内容</th>
          <th>风险等级</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.id">
          <td>{{ row.time }}</td>
          <td>{{ row.user }}</td>
          <td>{{ row.action }}</td>
          <td><span class="tag">{{ row.level }}</span></td>
          <td>
            <button class="secondary-button" type="button" @click="openDetails(row)">查看</button>
            <button class="secondary-button" type="button" @click="openForm('生成合规报告', row)">报告</button>
          </td>
        </tr>
      </tbody>
    </table>
  </section>

  <AppModal v-model="showModal" :title="modalTitle">
    <div v-if="modalType === 'form'" class="form-grid">
      <label>
        策略名称
        <input v-model="formState.name" type="text" placeholder="例如 核心数据加密" />
      </label>
      <label>
        加密算法
        <select v-model="formState.algorithm">
          <option value="AES-256">AES-256</option>
          <option value="SM4">SM4 国密</option>
          <option value="RSA">RSA 非对称</option>
        </select>
      </label>
      <label>
        适用范围
        <input v-model="formState.scope" type="text" placeholder="库/表/字段" />
      </label>
      <label>
        备注说明
        <textarea v-model="formState.note" rows="3" placeholder="说明策略用途"></textarea>
      </label>
      <div class="modal-actions">
        <button class="secondary-button" type="button" @click="showModal = false">取消</button>
        <button class="primary-button" type="button" @click="submitForm">提交策略</button>
      </div>
    </div>
    <div v-else-if="modalType === 'progress'" class="form-grid">
      <p>{{ modalMessage }}</p>
      <div class="progress-track">
        <div class="progress-bar" :style="{ width: `${progress}%` }"></div>
      </div>
      <p>进度：{{ progress }}%</p>
      <div class="modal-actions">
        <button class="primary-button" type="button" @click="showModal = false">完成</button>
      </div>
    </div>
    <div v-else class="form-grid">
      <p>{{ modalMessage }}</p>
      <div class="modal-actions">
        <button class="primary-button" type="button" @click="showModal = false">知道了</button>
      </div>
    </div>
  </AppModal>
</template>

<script setup>
import { reactive, ref } from 'vue';
import AppModal from '../components/AppModal.vue';

const chartData = [70, 76, 82, 60, 88, 90, 84];
const rows = Array.from({ length: 20 }, (_, index) => ({
  id: index + 1,
  time: `2024-06-${(index + 1).toString().padStart(2, '0')} 10:30`,
  user: ['审计员A', '审计员B', '安全官'][index % 3],
  action: ['导出审计日志', '密钥轮换', '权限变更'][index % 3],
  level: ['低', '中', '高'][index % 3]
}));

const showModal = ref(false);
const modalTitle = ref('');
const modalType = ref('info');
const modalMessage = ref('');
const progress = ref(0);
const formState = reactive({
  name: '',
  algorithm: 'AES-256',
  scope: '',
  note: ''
});
let timer;

const openForm = (title, row) => {
  modalTitle.value = title;
  modalType.value = 'form';
  formState.name = row?.action ?? '';
  formState.algorithm = 'AES-256';
  formState.scope = '';
  formState.note = '';
  showModal.value = true;
};

const openProgress = (message) => {
  modalTitle.value = '任务进度';
  modalType.value = 'progress';
  modalMessage.value = message;
  progress.value = 0;
  showModal.value = true;
  clearInterval(timer);
  timer = setInterval(() => {
    if (progress.value >= 100) {
      clearInterval(timer);
      return;
    }
    progress.value += 15;
  }, 280);
};

const openInfo = (message) => {
  modalTitle.value = '提示信息';
  modalType.value = 'info';
  modalMessage.value = message;
  showModal.value = true;
};

const openDetails = (row) => {
  modalTitle.value = '审计详情';
  modalType.value = 'info';
  modalMessage.value = `${row.time} 由 ${row.user} 执行 ${row.action}，风险等级 ${row.level}。`;
  showModal.value = true;
};

const submitForm = () => {
  modalTitle.value = '提交成功';
  modalType.value = 'info';
  modalMessage.value = '合规策略已进入审批流程，预计 5 分钟内完成。';
};
</script>
