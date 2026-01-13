<template>
  <section class="module">
    <div class="module-header">
      <div>
        <h3>智能感知与自适应控制</h3>
        <p>融合多源传感数据，实时修正偏差并提升复杂工况下的操作精度。</p>
      </div>
      <div class="module-actions">
        <button class="secondary" type="button" @click="openModal('sensor')">传感融合配置</button>
        <button class="secondary" type="button" @click="openModal('adaptive')">自适应策略</button>
        <button class="primary" type="button" @click="openModal('calibration')">动态校准</button>
      </div>
    </div>
    <div class="summary-grid">
      <div class="card">
        <h4>感知通道</h4>
        <p class="metric">9 路</p>
        <span>位置、力矩、电流等多源数据</span>
      </div>
      <div class="card">
        <h4>实时偏差</h4>
        <p class="metric">0.18°</p>
        <span>自适应滤波已启用</span>
      </div>
      <div class="card">
        <h4>负载变化</h4>
        <p class="metric">+12%</p>
        <span>自动补偿控制输出</span>
      </div>
    </div>
    <div class="panel">
      <div class="panel-header">
        <h4>传感数据流</h4>
        <button class="ghost" type="button" @click="openModal('notice')">数据提示</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>通道</th>
            <th>传感类型</th>
            <th>实时值</th>
            <th>滤波方式</th>
            <th>异常率</th>
            <th>更新频率</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="signal in signals" :key="signal.id">
            <td>{{ signal.id }}</td>
            <td>{{ signal.type }}</td>
            <td>{{ signal.value }}</td>
            <td>{{ signal.filter }}</td>
            <td>{{ signal.anomaly }}</td>
            <td>{{ signal.rate }}</td>
            <td>
              <button class="table-button" type="button" @click="openRowModal(signal)">校验</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <BaseModal v-if="activeModal" :title="modalTitle" @close="closeModal" @confirm="closeModal">
      <template v-if="activeModal === 'sensor'">
        <p>配置多源传感融合权重与采样频率。</p>
        <div class="modal-grid">
          <label>
            位置权重
            <input v-model="modalForm.position" type="number" />
          </label>
          <label>
            力矩权重
            <input v-model="modalForm.torque" type="number" />
          </label>
          <label>
            采样频率
            <input v-model="modalForm.rate" type="number" />
          </label>
        </div>
      </template>
      <template v-else-if="activeModal === 'adaptive'">
        <p>选择自适应控制策略并设置补偿阈值。</p>
        <div class="modal-grid">
          <label>
            控制算法
            <select v-model="modalForm.algorithm">
              <option value="mrac">模型参考自适应</option>
              <option value="pid">自整定 PID</option>
              <option value="rl">强化学习辅助</option>
            </select>
          </label>
          <label>
            补偿阈值
            <input v-model="modalForm.threshold" type="number" />
          </label>
          <label>
            干扰判定
            <input v-model="modalForm.disturbance" type="text" />
          </label>
        </div>
      </template>
      <template v-else-if="activeModal === 'calibration'">
        <p>开始动态校准，系统将实时修正关节偏差。</p>
        <div class="modal-grid">
          <label>
            校准场景
            <select v-model="modalForm.scene">
              <option value="load">带载校准</option>
              <option value="no-load">空载校准</option>
              <option value="precision">高精度校准</option>
            </select>
          </label>
          <label>
            预计耗时
            <input v-model="modalForm.duration" type="text" />
          </label>
        </div>
      </template>
      <template v-else-if="activeModal === 'notice'">
        <p>感知系统正在融合力矩、电流与视觉反馈数据。</p>
        <ul>
          <li>异常率超过 2% 将自动触发再校准。</li>
          <li>可通过自适应算法实时调整关节输出。</li>
          <li>建议保持传感器温度稳定。</li>
        </ul>
      </template>
      <template v-else-if="activeModal === 'row'">
        <p>对 {{ selectedSignal?.id }} 通道执行快速校验。</p>
        <div class="modal-grid">
          <label>
            校验方式
            <select v-model="modalForm.checkMethod">
              <option value="auto">自动校验</option>
              <option value="manual">手动校验</option>
            </select>
          </label>
          <label>
            允许偏差
            <input v-model="modalForm.tolerance" type="text" />
          </label>
        </div>
      </template>
    </BaseModal>
  </section>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const activeModal = ref('');
const selectedSignal = ref(null);

const modalForm = reactive({
  position: 0.4,
  torque: 0.35,
  rate: 2000,
  algorithm: 'mrac',
  threshold: 12,
  disturbance: '电流波动 > 6%',
  scene: 'load',
  duration: '8 分钟',
  checkMethod: 'auto',
  tolerance: '0.3%'
});

const signals = Array.from({ length: 21 }, (_, index) => ({
  id: `CH-${(index + 1).toString().padStart(2, '0')}`,
  type: ['位置', '力矩', '电流', '温度'][index % 4],
  value: `${(index + 2) * 0.8} ${index % 2 === 0 ? 'N·m' : 'A'}`,
  filter: ['卡尔曼', '均值', '低通'][index % 3],
  anomaly: `${(index % 5) * 0.4}%`,
  rate: `${1500 + index * 20} Hz`
}));

const modalTitle = computed(() => {
  const titles = {
    sensor: '传感融合配置',
    adaptive: '自适应控制策略',
    calibration: '动态校准任务',
    notice: '感知提示',
    row: '通道校验'
  };
  return titles[activeModal.value] || '';
});

const openModal = (type) => {
  activeModal.value = type;
};

const openRowModal = (signal) => {
  selectedSignal.value = signal;
  activeModal.value = 'row';
};

const closeModal = () => {
  activeModal.value = '';
};
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.module-header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.module-header p {
  color: #64748b;
  margin-top: 6px;
}

.module-actions {
  display: flex;
  gap: 12px;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.card {
  background: #ffffff;
  padding: 16px;
  border-radius: 16px;
  box-shadow: 0 14px 30px rgba(15, 23, 42, 0.08);
  display: grid;
  gap: 8px;
}

.card .metric {
  font-size: 26px;
  font-weight: 700;
}

.panel {
  background: #ffffff;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 14px 30px rgba(15, 23, 42, 0.08);
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.panel h4 {
  font-size: 18px;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

th,
td {
  text-align: left;
  padding: 10px 8px;
  border-bottom: 1px solid #eef2f7;
}

.table-button {
  border: none;
  background: #e0e7ff;
  color: #1d4ed8;
  padding: 6px 12px;
  border-radius: 8px;
  cursor: pointer;
}

.primary {
  background: #2563eb;
  color: #fff;
  border: none;
  padding: 10px 16px;
  border-radius: 10px;
  cursor: pointer;
}

.secondary {
  background: #e2e8f0;
  border: none;
  padding: 10px 16px;
  border-radius: 10px;
  cursor: pointer;
}

.ghost {
  background: none;
  border: none;
  color: #2563eb;
  cursor: pointer;
}

.modal-grid {
  display: grid;
  gap: 12px;
}
</style>
