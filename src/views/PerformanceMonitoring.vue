<template>
  <section class="grid-3">
    <div class="card">
      <h3>实时性能监控</h3>
      <p style="color: #6b7280; margin: 8px 0 16px;">重点指标：CPU 32%，IO 延迟 4ms。</p>
      <div class="action-bar">
        <button class="primary-button" type="button" @click="openProgress('正在拉取实时监控数据')">刷新监控</button>
        <button class="secondary-button" type="button" @click="openForm('设置告警阈值')">告警设置</button>
        <button class="secondary-button" type="button" @click="openInfo('告警支持短信、邮件与企业微信通知。')">通知说明</button>
      </div>
    </div>
    <div class="card">
      <h3>性能指标趋势</h3>
      <p style="color: #6b7280; margin: 8px 0 16px;">响应时间与吞吐变化趋势。</p>
      <div class="chart">
        <div v-for="value in chartData" :key="value" class="chart-bar" :style="{ height: `${value}%` }"></div>
      </div>
    </div>
    <div class="card">
      <h3>资源利用率</h3>
      <div class="form-grid">
        <label>CPU 利用率<input type="text" value="32%" disabled /></label>
        <label>内存利用率<input type="text" value="68%" disabled /></label>
        <label>磁盘利用率<input type="text" value="54%" disabled /></label>
      </div>
    </div>
  </section>

  <section class="card">
    <h3>性能事件列表</h3>
    <table class="data-table">
      <thead>
        <tr>
          <th>时间</th>
          <th>指标</th>
          <th>数值</th>
          <th>影响实例</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.id">
          <td>{{ row.time }}</td>
          <td>{{ row.metric }}</td>
          <td>{{ row.value }}</td>
          <td>{{ row.instance }}</td>
          <td>
            <button class="secondary-button" type="button" @click="openDetails(row)">详情</button>
            <button class="secondary-button" type="button" @click="openForm('生成分析报告', row)">报告</button>
          </td>
        </tr>
      </tbody>
    </table>
  </section>

  <AppModal v-model="showModal" :title="modalTitle">
    <div v-if="modalType === 'form'" class="form-grid">
      <label>
        指标名称
        <input v-model="formState.metric" type="text" placeholder="例如 查询延迟" />
      </label>
      <label>
        告警阈值
        <input v-model="formState.threshold" type="text" placeholder="例如 120ms" />
      </label>
      <label>
        通知对象
        <input v-model="formState.owner" type="text" placeholder="负责人/群组" />
      </label>
      <label>
        说明
        <textarea v-model="formState.note" rows="3" placeholder="补充说明"></textarea>
      </label>
      <div class="modal-actions">
        <button class="secondary-button" type="button" @click="showModal = false">取消</button>
        <button class="primary-button" type="button" @click="submitForm">保存设置</button>
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

const chartData = [32, 58, 46, 72, 64, 48, 80];
const rows = Array.from({ length: 20 }, (_, index) => ({
  id: index + 1,
  time: `09:${(index + 10).toString().padStart(2, '0')}`,
  metric: ['慢查询', '连接数', '事务延迟'][index % 3],
  value: `${40 + index}ms`,
  instance: `业务库-${index + 1}`
}));

const showModal = ref(false);
const modalTitle = ref('');
const modalType = ref('info');
const modalMessage = ref('');
const progress = ref(0);
const formState = reactive({
  metric: '',
  threshold: '',
  owner: '',
  note: ''
});
let timer;

const openForm = (title, row) => {
  modalTitle.value = title;
  modalType.value = 'form';
  formState.metric = row?.metric ?? '';
  formState.threshold = '';
  formState.owner = '';
  formState.note = '';
  showModal.value = true;
};

const openProgress = (message) => {
  modalTitle.value = '数据刷新';
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
    progress.value += 20;
  }, 260);
};

const openInfo = (message) => {
  modalTitle.value = '提示信息';
  modalType.value = 'info';
  modalMessage.value = message;
  showModal.value = true;
};

const openDetails = (row) => {
  modalTitle.value = '性能事件详情';
  modalType.value = 'info';
  modalMessage.value = `指标 ${row.metric} 在 ${row.time} 达到 ${row.value}，影响实例 ${row.instance}。`;
  showModal.value = true;
};

const submitForm = () => {
  modalTitle.value = '配置完成';
  modalType.value = 'info';
  modalMessage.value = '告警阈值已应用并进入实时监控。';
};
</script>
