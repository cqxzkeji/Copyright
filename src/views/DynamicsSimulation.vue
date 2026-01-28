<template>
  <div class="card">
    <div class="section-title">动力学仿真分析</div>
    <p>对发动机、悬挂与制动系统开展多体动力学与振动噪声仿真。</p>
    <div class="action-row">
      <button class="btn" type="button" @click="openModal('mbd')">新建多体仿真</button>
      <button class="btn secondary" type="button" @click="openModal('run')">启动动力学求解</button>
      <button class="btn ghost" type="button" @click="openModal('tip')">优化建议</button>
    </div>
  </div>

  <div class="card">
    <div class="section-title">动态响应图</div>
    <div class="chart-grid">
      <div class="chart-card">
        <strong>悬挂位移响应</strong>
        <div class="chart-bars">
          <span v-for="(item, index) in chartData" :key="`susp-${index}`" :style="{ height: item + '%' }"></span>
        </div>
      </div>
      <div class="chart-card">
        <strong>制动扭矩波动</strong>
        <div class="chart-bars">
          <span v-for="(item, index) in chartDataB" :key="`brake-${index}`" :style="{ height: item + '%' }"></span>
        </div>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="section-title">仿真记录</div>
    <table class="table">
      <thead>
        <tr>
          <th>任务编号</th>
          <th>系统</th>
          <th>工况</th>
          <th>响应指标</th>
          <th>状态</th>
          <th>分析师</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in tableRows" :key="row.id">
          <td>{{ row.id }}</td>
          <td>{{ row.system }}</td>
          <td>{{ row.condition }}</td>
          <td>{{ row.metric }}</td>
          <td>{{ row.status }}</td>
          <td>{{ row.owner }}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <BaseModal v-if="activeModal === 'mbd'" title="多体动力学仿真设置" @close="closeModal">
    <form @submit.prevent="submitModal">
      <div class="input-field">
        <label>仿真系统</label>
        <select v-model="formState.system">
          <option>悬挂系统</option>
          <option>动力总成</option>
          <option>制动系统</option>
        </select>
      </div>
      <div class="input-field">
        <label>载荷工况</label>
        <input v-model="formState.condition" placeholder="城市道路起伏" />
      </div>
      <div class="input-field">
        <label>输出指标</label>
        <select v-model="formState.metric">
          <option>车身加速度</option>
          <option>悬挂行程</option>
          <option>传动扭矩</option>
        </select>
      </div>
      <div class="modal-actions">
        <button class="btn secondary" type="button" @click="closeModal">取消</button>
        <button class="btn" type="submit">保存设置</button>
      </div>
    </form>
  </BaseModal>

  <BaseModal v-if="activeModal === 'run'" title="动力学求解进度" @close="closeModal">
    <p>多体动力学求解已启动，将实时输出振动响应曲线。</p>
    <div class="progress-bar" style="margin-top: 16px;">
      <span style="width: 72%"></span>
    </div>
    <div class="modal-actions">
      <button class="btn" type="button" @click="closeModal">继续观察</button>
    </div>
  </BaseModal>

  <BaseModal v-if="activeModal === 'tip'" title="优化建议" @close="closeModal">
    <p>建议提升悬挂阻尼系数，以降低40-60Hz频段共振。</p>
    <div class="modal-actions">
      <button class="btn" type="button" @click="closeModal">收到</button>
    </div>
  </BaseModal>
</template>

<script setup>
import { ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const activeModal = ref('');
const formState = ref({
  system: '悬挂系统',
  condition: '城市道路起伏',
  metric: '悬挂行程',
});

const tableRows = Array.from({ length: 20 }, (_, index) => ({
  id: `DYN-${index + 1}`,
  system: ['悬挂系统', '动力总成', '制动系统'][index % 3],
  condition: ['高速稳态', '城市道路', '山路弯道'][index % 3],
  metric: ['车身加速度', '扭矩波动', '噪声级'][index % 3],
  status: ['待校准', '求解中', '已完成'][index % 3],
  owner: ['徐晨', '冯越', '杜蕾', '周博'][index % 4],
}));

const chartData = [38, 52, 75, 60, 82, 66];
const chartDataB = [48, 60, 70, 58, 76, 64];

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
