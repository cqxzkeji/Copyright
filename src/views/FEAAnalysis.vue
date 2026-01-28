<template>
  <div class="card">
    <div class="section-title">有限元分析管理</div>
    <p>管理零部件与整车模型的有限元分析流程，包括材料、网格与求解设置。</p>
    <div class="action-row">
      <button class="btn" type="button" @click="openModal('model')">创建模型</button>
      <button class="btn secondary" type="button" @click="openModal('solve')">启动求解</button>
      <button class="btn ghost" type="button" @click="openModal('tip')">查看提示</button>
    </div>
  </div>

  <div class="card">
    <div class="section-title">材料与载荷分布图</div>
    <div class="chart-grid">
      <div class="chart-card">
        <strong>网格密度分布</strong>
        <div class="chart-bars">
          <span v-for="(item, index) in chartData" :key="`mesh-${index}`" :style="{ height: item + '%' }"></span>
        </div>
      </div>
      <div class="chart-card">
        <strong>材料强度谱</strong>
        <div class="chart-bars">
          <span v-for="(item, index) in chartDataB" :key="`mat-${index}`" :style="{ height: item + '%' }"></span>
        </div>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="section-title">分析任务清单</div>
    <table class="table">
      <thead>
        <tr>
          <th>任务编号</th>
          <th>零部件</th>
          <th>材料</th>
          <th>网格</th>
          <th>状态</th>
          <th>负责人</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in tableRows" :key="row.id">
          <td>{{ row.id }}</td>
          <td>{{ row.part }}</td>
          <td>{{ row.material }}</td>
          <td>{{ row.mesh }}</td>
          <td>{{ row.status }}</td>
          <td>{{ row.owner }}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <BaseModal v-if="activeModal === 'model'" title="有限元模型创建" @close="closeModal">
    <form @submit.prevent="submitModal">
      <div class="input-field">
        <label>模型名称</label>
        <input v-model="formState.name" placeholder="前纵梁静态分析" required />
      </div>
      <div class="input-field">
        <label>材料库选择</label>
        <select v-model="formState.material">
          <option>高强钢</option>
          <option>铝合金</option>
          <option>复合材料</option>
        </select>
      </div>
      <div class="input-field">
        <label>网格密度</label>
        <select v-model="formState.mesh">
          <option>细</option>
          <option>中</option>
          <option>粗</option>
        </select>
      </div>
      <div class="modal-actions">
        <button class="btn secondary" type="button" @click="closeModal">取消</button>
        <button class="btn" type="submit">提交创建</button>
      </div>
    </form>
  </BaseModal>

  <BaseModal v-if="activeModal === 'solve'" title="自动化求解进度" @close="closeModal">
    <p>求解任务已进入队列，预计完成时间 45 分钟。</p>
    <div class="progress-bar" style="margin-top: 16px;">
      <span style="width: 65%"></span>
    </div>
    <div class="modal-actions">
      <button class="btn" type="button" @click="closeModal">继续监控</button>
    </div>
  </BaseModal>

  <BaseModal v-if="activeModal === 'tip'" title="分析提示" @close="closeModal">
    <p>建议优先完成关键载荷工况校准，并导入最新材料卡片。</p>
    <div class="modal-actions">
      <button class="btn" type="button" @click="closeModal">了解</button>
    </div>
  </BaseModal>
</template>

<script setup>
import { ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const activeModal = ref('');
const formState = ref({
  name: '前纵梁静态分析',
  material: '高强钢',
  mesh: '中',
});

const tableRows = Array.from({ length: 20 }, (_, index) => ({
  id: `FEA-${index + 1}`,
  part: ['前纵梁', '地板总成', 'A柱', '电池包', '副车架'][index % 5],
  material: ['高强钢', '铝合金', '复合材料'][index % 3],
  mesh: ['细', '中', '粗'][index % 3],
  status: ['待求解', '求解中', '已完成'][index % 3],
  owner: ['王敏', '李涛', '陈楠', '孙涵'][index % 4],
}));

const chartData = [35, 55, 70, 45, 65, 80];
const chartDataB = [60, 72, 50, 88, 68, 40];

const openModal = (type) => {
  activeModal.value = type;
};

const closeModal = () => {
  activeModal.value = '';
};

const submitModal = () => {
  activeModal.value = 'solve';
};
</script>

<style scoped>
.action-row {
  margin-top: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
</style>
