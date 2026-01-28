<template>
  <div class="card">
    <div class="section-title">结构优化与性能评估</div>
    <p>基于仿真结果进行结构优化设计与敏感度分析，提升性能并减重。</p>
    <div class="action-row">
      <button class="btn" type="button" @click="openModal('opt')">创建优化方案</button>
      <button class="btn secondary" type="button" @click="openModal('run')">启动优化计算</button>
      <button class="btn ghost" type="button" @click="openModal('tip')">优化提示</button>
    </div>
  </div>

  <div class="card">
    <div class="section-title">性能提升趋势图</div>
    <div class="chart-grid">
      <div class="chart-card">
        <strong>轻量化收益</strong>
        <div class="chart-bars">
          <span v-for="(item, index) in chartData" :key="`weight-${index}`" :style="{ height: item + '%' }"></span>
        </div>
      </div>
      <div class="chart-card">
        <strong>刚度提升率</strong>
        <div class="chart-bars">
          <span v-for="(item, index) in chartDataB" :key="`stiff-${index}`" :style="{ height: item + '%' }"></span>
        </div>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="section-title">结构优化项目</div>
    <table class="table">
      <thead>
        <tr>
          <th>项目编号</th>
          <th>优化对象</th>
          <th>目标指标</th>
          <th>算法</th>
          <th>状态</th>
          <th>负责人</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in tableRows" :key="row.id">
          <td>{{ row.id }}</td>
          <td>{{ row.target }}</td>
          <td>{{ row.metric }}</td>
          <td>{{ row.method }}</td>
          <td>{{ row.status }}</td>
          <td>{{ row.owner }}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <BaseModal v-if="activeModal === 'opt'" title="结构优化方案配置" @close="closeModal">
    <form @submit.prevent="submitModal">
      <div class="input-field">
        <label>优化对象</label>
        <input v-model="formState.target" placeholder="前围板结构" />
      </div>
      <div class="input-field">
        <label>目标指标</label>
        <select v-model="formState.metric">
          <option>轻量化</option>
          <option>刚度提升</option>
          <option>成本最小化</option>
        </select>
      </div>
      <div class="input-field">
        <label>优化算法</label>
        <select v-model="formState.method">
          <option>拓扑优化</option>
          <option>多目标遗传算法</option>
          <option>灵敏度分析</option>
        </select>
      </div>
      <div class="modal-actions">
        <button class="btn secondary" type="button" @click="closeModal">取消</button>
        <button class="btn" type="submit">提交方案</button>
      </div>
    </form>
  </BaseModal>

  <BaseModal v-if="activeModal === 'run'" title="优化计算进度" @close="closeModal">
    <p>优化迭代正在执行，第 8 代 / 15 代。</p>
    <div class="progress-bar" style="margin-top: 16px;">
      <span style="width: 53%"></span>
    </div>
    <div class="modal-actions">
      <button class="btn" type="button" @click="closeModal">继续迭代</button>
    </div>
  </BaseModal>

  <BaseModal v-if="activeModal === 'tip'" title="优化提示" @close="closeModal">
    <p>建议先完成敏感度分析，再调整关键零件厚度分布。</p>
    <div class="modal-actions">
      <button class="btn" type="button" @click="closeModal">确认</button>
    </div>
  </BaseModal>
</template>

<script setup>
import { ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const activeModal = ref('');
const formState = ref({
  target: '前围板结构',
  metric: '轻量化',
  method: '拓扑优化',
});

const tableRows = Array.from({ length: 20 }, (_, index) => ({
  id: `OPT-${index + 1}`,
  target: ['前围板', '门槛梁', '底盘横梁'][index % 3],
  metric: ['轻量化', '刚度', '成本'][index % 3],
  method: ['拓扑优化', '灵敏度分析', '遗传算法'][index % 3],
  status: ['待评估', '优化中', '已完成'][index % 3],
  owner: ['何俊', '邹雨', '任哲', '卢琪'][index % 4],
}));

const chartData = [42, 55, 70, 58, 76, 64];
const chartDataB = [50, 62, 78, 66, 80, 72];

const openModal = (type) => {
  activeModal.value = type;
};

const closeModal = () => {
  activeModal.value = '';
};

const submitModal = () => {
  activeModal.value = 'run';
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
