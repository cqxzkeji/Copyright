<template>
  <div class="module">
    <div class="module-header">
      <div>
        <h2>成型工艺管理与设备控制</h2>
        <p>统一配置冲压、锻造成型工艺参数，监控设备运行状态与异常报警。</p>
      </div>
      <div class="actions">
        <button class="btn" type="button" @click="openRecipe">下发工艺配方</button>
        <button class="btn ghost" type="button" @click="openStart">启动设备</button>
        <button class="btn ghost" type="button" @click="openAlarm">异常报警</button>
      </div>
    </div>

    <div class="grid">
      <div class="card">
        <h3>设备状态图</h3>
        <svg viewBox="0 0 360 160" class="chart">
          <rect x="10" y="20" width="60" height="120" fill="#93c5fd" />
          <rect x="90" y="40" width="60" height="100" fill="#60a5fa" />
          <rect x="170" y="30" width="60" height="110" fill="#3b82f6" />
          <rect x="250" y="60" width="60" height="80" fill="#1d4ed8" />
        </svg>
        <div class="legend">
          <span>冲压</span>
          <span>锻造</span>
          <span>热处理</span>
          <span>整形</span>
        </div>
      </div>
      <div class="card">
        <h3>关键参数</h3>
        <div class="kpi-list">
          <div>
            <strong>620 kN</strong>
            <span>冲压力峰值</span>
          </div>
          <div>
            <strong>880 ℃</strong>
            <span>锻造温度</span>
          </div>
          <div>
            <strong>42 s</strong>
            <span>平均节拍</span>
          </div>
          <div>
            <strong>2.1%</strong>
            <span>不合格率</span>
          </div>
        </div>
      </div>
    </div>

    <div class="table-card">
      <div class="table-header">
        <h3>成型工艺参数清单</h3>
        <button class="btn ghost" type="button" @click="openInspect">参数抽检</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>设备编号</th>
            <th>工艺配方</th>
            <th>冲压力(kN)</th>
            <th>温度(℃)</th>
            <th>速度(mm/s)</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.id">
            <td>{{ row.device }}</td>
            <td>{{ row.recipe }}</td>
            <td>{{ row.pressure }}</td>
            <td>{{ row.temp }}</td>
            <td>{{ row.speed }}</td>
            <td><span :class="['tag', row.statusClass]">{{ row.status }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <Modal :open="recipeModal" title="下发工艺配方" confirm-text="确认下发" @close="recipeModal = false" @confirm="confirmRecipe">
      <div class="form-grid">
        <label>
          设备组
          <select v-model="recipe.deviceGroup">
            <option>冲压 1-4 号线</option>
            <option>锻造 1-3 号线</option>
            <option>整形 1-2 号线</option>
          </select>
        </label>
        <label>
          配方编号
          <input v-model="recipe.code" type="text" placeholder="FC-2024-08" />
        </label>
        <label>
          目标温度(℃)
          <input v-model="recipe.temp" type="number" />
        </label>
        <label>
          目标压力(kN)
          <input v-model="recipe.pressure" type="number" />
        </label>
        <label class="full">
          备注
          <textarea v-model="recipe.note" rows="2" placeholder="加工重点说明"></textarea>
        </label>
      </div>
    </Modal>

    <Modal :open="startModal" title="设备启动进度" @close="startModal = false">
      <p>正在执行开机自检与预热流程。</p>
      <div class="progress">
        <div class="progress-bar" :style="{ width: `${startProgress}%` }"></div>
      </div>
      <p class="muted">预计 45 秒完成，完成后自动切换至运行模式。</p>
    </Modal>

    <Modal :open="alarmModal" title="异常报警" confirm-text="立即处理" @close="alarmModal = false" @confirm="alarmModal = false">
      <ul class="notice-list">
        <li>冲压 2 号线压力波动超限，建议检查液压系统。</li>
        <li>锻造 1 号线温控偏高，请确认冷却水流量。</li>
      </ul>
    </Modal>

    <Modal :open="inspectModal" title="参数抽检" confirm-text="生成抽检单" @close="inspectModal = false" @confirm="inspectModal = false">
      <div class="form-grid">
        <label>
          抽检批次
          <input v-model="inspect.batch" type="text" />
        </label>
        <label>
          抽检比例
          <select v-model="inspect.ratio">
            <option>5%</option>
            <option>10%</option>
            <option>20%</option>
          </select>
        </label>
        <label class="full">
          说明
          <textarea v-model="inspect.note" rows="2"></textarea>
        </label>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watchEffect } from 'vue';
import Modal from '../components/Modal.vue';

const recipeModal = ref(false);
const startModal = ref(false);
const alarmModal = ref(false);
const inspectModal = ref(false);
const startProgress = ref(0);
let startTimer;

const recipe = reactive({
  deviceGroup: '冲压 1-4 号线',
  code: 'FC-2024-08',
  temp: 880,
  pressure: 620,
  note: '确保预热完成后再升速。'
});

const inspect = reactive({
  batch: 'SN-2024-082',
  ratio: '10%',
  note: '重点关注尺寸偏差。'
});

const rows = computed(() =>
  Array.from({ length: 22 }, (_, index) => {
    const id = index + 1;
    return {
      id,
      device: `FC-${String(id).padStart(2, '0')}`,
      recipe: `P-${2024 + (id % 2)}-${String(10 + (id % 9)).padStart(2, '0')}`,
      pressure: 580 + (id % 5) * 12,
      temp: 840 + (id % 6) * 8,
      speed: 220 + (id % 4) * 15,
      status: id % 5 === 0 ? '待维护' : '运行中',
      statusClass: id % 5 === 0 ? 'warn' : 'good'
    };
  })
);

const openRecipe = () => {
  recipeModal.value = true;
};

const confirmRecipe = () => {
  recipeModal.value = false;
};

const openStart = () => {
  startModal.value = true;
};

const openAlarm = () => {
  alarmModal.value = true;
};

const openInspect = () => {
  inspectModal.value = true;
};

watchEffect(() => {
  if (startModal.value) {
    startProgress.value = 0;
    startTimer = setInterval(() => {
      startProgress.value = Math.min(startProgress.value + 8, 100);
      if (startProgress.value === 100) {
        clearInterval(startTimer);
      }
    }, 200);
  } else if (startTimer) {
    clearInterval(startTimer);
  }
});
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.module-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.module-header h2 {
  margin: 0;
  font-size: 20px;
}

.module-header p {
  margin: 6px 0 0;
  color: #64748b;
}

.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.btn {
  border: none;
  background: #2563eb;
  color: #fff;
  padding: 8px 14px;
  border-radius: 10px;
  cursor: pointer;
}

.btn.ghost {
  background: #e2e8f0;
  color: #1e293b;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}

.card {
  background: #f8fafc;
  border-radius: 16px;
  padding: 16px;
}

.chart {
  width: 100%;
  height: 160px;
}

.legend {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #64748b;
}

.kpi-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
}

.kpi-list strong {
  font-size: 18px;
  color: #1d4ed8;
}

.kpi-list span {
  display: block;
  color: #64748b;
  font-size: 12px;
}

.table-card {
  background: #f8fafc;
  padding: 16px;
  border-radius: 16px;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.table-card table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

th,
td {
  padding: 10px 8px;
  text-align: left;
}

thead {
  background: #e2e8f0;
}

tbody tr:nth-child(even) {
  background: #ffffff;
}

.tag {
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 12px;
}

.tag.good {
  background: #dcfce7;
  color: #166534;
}

.tag.warn {
  background: #fee2e2;
  color: #b91c1c;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
}

.form-grid label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
  color: #475569;
}

.form-grid input,
.form-grid select,
.form-grid textarea {
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 8px 10px;
}

.form-grid .full {
  grid-column: 1 / -1;
}

.progress {
  height: 10px;
  background: #e2e8f0;
  border-radius: 999px;
  overflow: hidden;
  margin: 12px 0;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #38bdf8, #2563eb);
  transition: width 0.2s ease;
}

.muted {
  color: #94a3b8;
  font-size: 12px;
}

.notice-list {
  padding-left: 18px;
  color: #475569;
}
</style>
