<template>
  <section class="grid-2">
    <div class="card">
      <h3>数据库配置管理</h3>
      <p style="color: #6b7280; margin: 8px 0 16px;">集中维护连接参数、实例规格与标签。</p>
      <div class="action-bar">
        <button class="primary-button" type="button" @click="openForm('新增数据库配置')">新增配置</button>
        <button class="secondary-button" type="button" @click="openProgress('同步配置到集群')">同步配置</button>
        <button class="secondary-button" type="button" @click="openInfo('配置管理支持批量导入、标签化管理与版本回滚。')">操作指引</button>
      </div>
    </div>
    <div class="card">
      <h3>配置版本趋势</h3>
      <p style="color: #6b7280; margin: 8px 0 16px;">近一周变更次数统计。</p>
      <div class="chart">
        <div v-for="value in chartData" :key="value" class="chart-bar" :style="{ height: `${value}%` }"></div>
      </div>
    </div>
  </section>

  <section class="card">
    <h3>配置清单</h3>
    <table class="data-table">
      <thead>
        <tr>
          <th>实例名称</th>
          <th>版本</th>
          <th>负责人</th>
          <th>状态</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.id">
          <td>{{ row.name }}</td>
          <td>{{ row.version }}</td>
          <td>{{ row.owner }}</td>
          <td><span class="tag">{{ row.status }}</span></td>
          <td>
            <button class="secondary-button" type="button" @click="openDetails(row)">查看</button>
            <button class="secondary-button" type="button" @click="openForm('编辑配置', row)">编辑</button>
          </td>
        </tr>
      </tbody>
    </table>
  </section>

  <AppModal v-model="showModal" :title="modalTitle">
    <div v-if="modalType === 'form'" class="form-grid">
      <label>
        实例名称
        <input v-model="formState.name" type="text" placeholder="输入实例名称" />
      </label>
      <label>
        版本
        <input v-model="formState.version" type="text" placeholder="例如 PostgreSQL 15" />
      </label>
      <label>
        负责人
        <input v-model="formState.owner" type="text" placeholder="负责人姓名" />
      </label>
      <label>
        标签说明
        <textarea v-model="formState.note" rows="3" placeholder="输入配置说明"></textarea>
      </label>
      <div class="modal-actions">
        <button class="secondary-button" type="button" @click="showModal = false">取消</button>
        <button class="primary-button" type="button" @click="submitForm">保存配置</button>
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

const chartData = [40, 55, 38, 70, 62, 80, 48];
const rows = Array.from({ length: 20 }, (_, index) => ({
  id: index + 1,
  name: `核心库-${index + 1}`,
  version: `PostgreSQL ${14 + (index % 2)}`,
  owner: ['王强', '李娜', '陈晨', '赵敏'][index % 4],
  status: '运行中'
}));

const showModal = ref(false);
const modalTitle = ref('');
const modalType = ref('info');
const modalMessage = ref('');
const progress = ref(0);
const formState = reactive({
  name: '',
  version: '',
  owner: '',
  note: ''
});
let timer;

const openForm = (title, row) => {
  modalTitle.value = title;
  modalType.value = 'form';
  formState.name = row?.name ?? '';
  formState.version = row?.version ?? '';
  formState.owner = row?.owner ?? '';
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
    progress.value += 10;
  }, 300);
};

const openInfo = (message) => {
  modalTitle.value = '提示信息';
  modalType.value = 'info';
  modalMessage.value = message;
  showModal.value = true;
};

const openDetails = (row) => {
  modalTitle.value = '配置详情';
  modalType.value = 'info';
  modalMessage.value = `实例 ${row.name} 运行在 ${row.version}，负责人：${row.owner}。`;
  showModal.value = true;
};

const submitForm = () => {
  modalTitle.value = '保存成功';
  modalType.value = 'info';
  modalMessage.value = '配置已进入版本管理队列，可随时回滚。';
};
</script>
