<template>
  <section class="module">
    <div class="module-header">
      <div>
        <h3>精准运动控制与轨迹规划</h3>
        <p>基于运动学模型实现多关节协同控制与高精度轨迹规划。</p>
      </div>
      <div class="module-actions">
        <button class="secondary" type="button" @click="openModal('point')">点位控制</button>
        <button class="secondary" type="button" @click="openModal('trajectory')">轨迹插补</button>
        <button class="primary" type="button" @click="openModal('progress')">生成规划</button>
      </div>
    </div>
    <div class="summary-grid">
      <div class="card">
        <h4>轨迹库</h4>
        <p class="metric">42 条</p>
        <span>覆盖焊接、搬运与装配场景</span>
      </div>
      <div class="card">
        <h4>重复定位精度</h4>
        <p class="metric">±0.04 mm</p>
        <span>优化加速度曲线与轨迹平滑度</span>
      </div>
      <div class="card">
        <h4>当前运行模式</h4>
        <p class="metric">协同插补</p>
        <span>实时速度约束已启用</span>
      </div>
    </div>
    <div class="panel">
      <div class="panel-header">
        <h4>轨迹任务列表</h4>
        <button class="ghost" type="button" @click="openModal('notice')">规划提示</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>任务编号</th>
            <th>轨迹类型</th>
            <th>速度上限</th>
            <th>加速度上限</th>
            <th>关节数量</th>
            <th>平滑等级</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="task in tasks" :key="task.id">
            <td>{{ task.id }}</td>
            <td>{{ task.type }}</td>
            <td>{{ task.speed }}</td>
            <td>{{ task.acceleration }}</td>
            <td>{{ task.joints }}</td>
            <td>{{ task.smooth }}</td>
            <td>
              <button class="table-button" type="button" @click="openRowModal(task)">加载任务</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <BaseModal
      v-if="activeModal"
      :title="modalTitle"
      :show-footer="activeModal !== 'progress'"
      @close="closeModal"
      @confirm="closeModal"
    >
      <template v-if="activeModal === 'point'">
        <p>设置点位控制参数并生成目标姿态。</p>
        <div class="modal-grid">
          <label>
            目标坐标 (mm)
            <input v-model="modalForm.position" type="text" />
          </label>
          <label>
            姿态角度 (°)
            <input v-model="modalForm.pose" type="text" />
          </label>
          <label>
            速度比例
            <input v-model="modalForm.speedRatio" type="number" />
          </label>
        </div>
      </template>
      <template v-else-if="activeModal === 'trajectory'">
        <p>配置连续轨迹插补策略。</p>
        <div class="modal-grid">
          <label>
            插补算法
            <select v-model="modalForm.algorithm">
              <option value="spline">样条插补</option>
              <option value="blend">过渡平滑</option>
              <option value="linear">线性插补</option>
            </select>
          </label>
          <label>
            速度约束
            <input v-model="modalForm.velocity" type="text" />
          </label>
          <label>
            加速度约束
            <input v-model="modalForm.accel" type="text" />
          </label>
        </div>
      </template>
      <template v-else-if="activeModal === 'notice'">
        <p>轨迹规划将根据任务需求动态调整速度与加速度曲线。</p>
        <ul>
          <li>推荐开启平滑等级 3 以减少关节冲击。</li>
          <li>插补路径支持多段拼接与过渡。</li>
          <li>规划完成后可导出为控制指令模板。</li>
        </ul>
      </template>
      <template v-else-if="activeModal === 'row'">
        <p>即将加载任务 {{ selectedTask?.id }} 并同步参数。</p>
        <div class="modal-grid">
          <label>
            轨迹优先级
            <select v-model="modalForm.priority">
              <option value="high">高</option>
              <option value="medium">中</option>
              <option value="low">低</option>
            </select>
          </label>
          <label>
            缓冲区
            <input v-model="modalForm.buffer" type="number" />
          </label>
        </div>
      </template>
      <template v-else-if="activeModal === 'progress'">
        <p>正在生成轨迹规划与速度曲线。</p>
        <div class="progress">
          <div class="progress-bar" :style="{ width: progress + '%' }"></div>
        </div>
        <p>当前进度 {{ progress }}%</p>
      </template>
    </BaseModal>
  </section>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const activeModal = ref('');
const progress = ref(72);
const selectedTask = ref(null);

const modalForm = reactive({
  position: 'X:240 Y:80 Z:160',
  pose: 'RX:0 RY:45 RZ:90',
  speedRatio: 80,
  algorithm: 'spline',
  velocity: '1.2 m/s',
  accel: '2.8 m/s²',
  priority: 'high',
  buffer: 12
});

const tasks = Array.from({ length: 24 }, (_, index) => ({
  id: `TP-${(index + 1).toString().padStart(3, '0')}`,
  type: ['点位', '连续', '多段插补'][index % 3],
  speed: `${1.1 + index * 0.03} m/s`,
  acceleration: `${2.4 + index * 0.05} m/s²`,
  joints: 6,
  smooth: ['L2', 'L3', 'L4'][index % 3]
}));

const modalTitle = computed(() => {
  const titles = {
    point: '点位控制设置',
    trajectory: '轨迹插补配置',
    notice: '规划提示',
    row: '任务加载确认',
    progress: '规划进度'
  };
  return titles[activeModal.value] || '';
});

const openModal = (type) => {
  activeModal.value = type;
};

const openRowModal = (task) => {
  selectedTask.value = task;
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

.progress {
  width: 100%;
  background: #e5eefc;
  border-radius: 8px;
  overflow: hidden;
  height: 12px;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #2563eb);
}
</style>
