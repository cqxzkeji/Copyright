<template>
  <section class="module">
    <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));">
      <div class="card">
        <h3 class="section-title">分子模拟状态</h3>
        <p class="module-desc">当前模拟体系包含 {{ simulationData.length }} 个关键构象。</p>
        <div class="badge">实时刷新中</div>
      </div>
      <div class="card">
        <h3 class="section-title">互动展示窗口</h3>
        <img :src="simulationImage" alt="分子模拟示意" />
      </div>
      <div class="card">
        <h3 class="section-title">模拟控制</h3>
        <div class="button-group">
          <button class="btn" @click="openRunModal">启动模拟</button>
          <button class="btn secondary" @click="openFormModal">调整参数</button>
          <button class="btn ghost" @click="openTipModal">交互提示</button>
        </div>
      </div>
    </div>

    <div class="grid" style="grid-template-columns: 1fr 1fr; margin-top: 24px;">
      <div class="card">
        <h3 class="section-title">能量变化曲线</h3>
        <div class="curve">
          <div v-for="point in energyCurve" :key="point.step" class="curve-point">
            <span>Step {{ point.step }}</span>
            <div class="curve-bar">
              <div class="curve-fill" :style="{ width: point.value + '%' }"></div>
            </div>
            <strong>{{ point.value }}%</strong>
          </div>
        </div>
      </div>
      <div class="card">
        <h3 class="section-title">交互结果摘要</h3>
        <ul class="notes">
          <li>关键位点氢键数量增加，预计提升结合稳定性。</li>
          <li>分子内应力下降，构象更趋于平稳。</li>
          <li>温度升高会增强构象采样范围，可用于探索新构象。</li>
        </ul>
      </div>
    </div>

    <div class="card" style="margin-top: 24px;">
      <h3 class="section-title">模拟构象记录</h3>
      <table class="table">
        <thead>
          <tr>
            <th>构象编号</th>
            <th>能量 (kcal/mol)</th>
            <th>关键相互作用</th>
            <th>稳定性</th>
            <th>备注</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in simulationData" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.energy }}</td>
            <td>{{ item.interaction }}</td>
            <td>{{ item.stability }}</td>
            <td>{{ item.note }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseModal :show="showRunModal" title="分子模拟进度" @close="showRunModal = false">
      <p>系统正在进行动力学模拟并刷新构象列表。</p>
      <div class="progress" style="margin: 16px 0;">
        <div class="progress-bar" :style="{ width: runProgress + '%' }"></div>
      </div>
      <p>当前进度：{{ runProgress }}%</p>
      <div class="modal-actions">
        <button class="btn" type="button" @click="completeRun">生成模拟报告</button>
      </div>
    </BaseModal>

    <BaseModal :show="showFormModal" title="调整模拟参数" @close="showFormModal = false">
      <form class="form-grid" @submit.prevent="submitParams">
        <label class="form-field">
          模拟温度 (K)
          <input v-model="form.temperature" type="number" min="250" max="450" />
        </label>
        <label class="form-field">
          时间步长 (fs)
          <input v-model="form.step" type="number" min="1" max="5" />
        </label>
        <label class="form-field">
          构象数量
          <input v-model="form.conformations" type="number" min="10" max="200" />
        </label>
        <label class="form-field">
          约束条件
          <select v-model="form.constraint">
            <option>无</option>
            <option>保持主链刚性</option>
            <option>限制极性基团</option>
          </select>
        </label>
        <label class="form-field">
          备注
          <textarea v-model="form.note" rows="3" placeholder="说明特殊要求"></textarea>
        </label>
        <div class="modal-actions" style="grid-column: 1 / -1;">
          <button class="btn secondary" type="button" @click="showFormModal = false">取消</button>
          <button class="btn" type="submit">保存参数</button>
        </div>
      </form>
    </BaseModal>

    <BaseModal :show="showTipModal" title="交互提示" @close="showTipModal = false">
      <p>
        你可以拖动分子结构节点观察构象变化，系统会实时计算能量与关键相互作用。
      </p>
      <p>
        建议将模拟温度与时间步长结合调整，以获得更稳定的构象分布。
      </p>
      <div class="modal-actions">
        <button class="btn" type="button" @click="showTipModal = false">好的</button>
      </div>
    </BaseModal>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const simulationImage =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="360" height="200" viewBox="0 0 360 200" fill="none">
      <rect width="360" height="200" rx="20" fill="#F2F6FF"/>
      <circle cx="110" cy="90" r="24" fill="#2F5BFF" opacity="0.3"/>
      <circle cx="200" cy="120" r="32" fill="#54B8FF" opacity="0.4"/>
      <circle cx="270" cy="80" r="18" fill="#2F5BFF" opacity="0.3"/>
      <path d="M110 90L200 120L270 80" stroke="#2F5BFF" stroke-width="5" stroke-linecap="round"/>
    </svg>`
  );

const simulationData = ref([
  { id: 'C-01', energy: -32.4, interaction: '氢键 x2', stability: '高', note: '构象稳定' },
  { id: 'C-02', energy: -30.8, interaction: '疏水作用', stability: '中', note: '轻微漂移' },
  { id: 'C-03', energy: -31.2, interaction: '盐桥', stability: '高', note: '结合紧密' },
  { id: 'C-04', energy: -28.5, interaction: 'π-π 堆叠', stability: '中', note: '需优化' },
  { id: 'C-05', energy: -33.1, interaction: '氢键 x3', stability: '高', note: '稳定构象' },
  { id: 'C-06', energy: -29.7, interaction: '疏水作用', stability: '中', note: '轻微摆动' },
  { id: 'C-07', energy: -27.4, interaction: '盐桥', stability: '低', note: '构象不稳' },
  { id: 'C-08', energy: -34.2, interaction: '氢键 x2', stability: '高', note: '优选构象' },
  { id: 'C-09', energy: -30.1, interaction: 'π-π 堆叠', stability: '中', note: '对接良好' },
  { id: 'C-10', energy: -29.0, interaction: '疏水作用', stability: '中', note: '待优化' },
  { id: 'C-11', energy: -31.8, interaction: '盐桥', stability: '高', note: '稳定' },
  { id: 'C-12', energy: -28.9, interaction: '氢键 x1', stability: '中', note: '可改善' },
  { id: 'C-13', energy: -33.7, interaction: '氢键 x3', stability: '高', note: '高稳定' },
  { id: 'C-14', energy: -27.9, interaction: '疏水作用', stability: '低', note: '构象松散' },
  { id: 'C-15', energy: -32.0, interaction: '盐桥', stability: '高', note: '紧密结合' },
  { id: 'C-16', energy: -30.4, interaction: 'π-π 堆叠', stability: '中', note: '结构合理' },
  { id: 'C-17', energy: -29.3, interaction: '氢键 x2', stability: '中', note: '稳定' },
  { id: 'C-18', energy: -33.0, interaction: '疏水作用', stability: '高', note: '稳定构象' },
  { id: 'C-19', energy: -28.6, interaction: '盐桥', stability: '中', note: '适中' },
  { id: 'C-20', energy: -34.5, interaction: '氢键 x3', stability: '高', note: '优选构象' }
]);

const energyCurve = [
  { step: 1, value: 30 },
  { step: 2, value: 45 },
  { step: 3, value: 60 },
  { step: 4, value: 72 },
  { step: 5, value: 85 }
];

const showRunModal = ref(false);
const showFormModal = ref(false);
const showTipModal = ref(false);
const runProgress = ref(0);

const form = ref({
  temperature: 310,
  step: 2,
  conformations: 80,
  constraint: '无',
  note: ''
});

const openRunModal = () => {
  showRunModal.value = true;
  runProgress.value = 0;
};

const openFormModal = () => {
  showFormModal.value = true;
};

const openTipModal = () => {
  showTipModal.value = true;
};

const completeRun = () => {
  runProgress.value = 100;
};

const submitParams = () => {
  showFormModal.value = false;
};

onMounted(() => {
  const interval = setInterval(() => {
    if (!showRunModal.value) return;
    if (runProgress.value < 94) {
      runProgress.value += 5;
    }
  }, 420);
  return () => clearInterval(interval);
});
</script>

<style scoped>
.module-desc {
  color: #5f6c8a;
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.curve {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.curve-point {
  display: grid;
  grid-template-columns: 80px 1fr 50px;
  gap: 12px;
  align-items: center;
  font-size: 14px;
}

.curve-bar {
  background: #eef3ff;
  border-radius: 999px;
  overflow: hidden;
  height: 10px;
}

.curve-fill {
  height: 100%;
  background: linear-gradient(90deg, #2f5bff, #54b8ff);
}

.notes {
  margin: 0;
  padding-left: 20px;
  color: #5f6c8a;
  line-height: 1.8;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 18px;
}
</style>
