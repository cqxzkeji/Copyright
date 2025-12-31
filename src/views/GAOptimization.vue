<template>
  <div>
    <div class="section-header">
      <h3>遗传算法调度优化</h3>
      <div class="tag-row">
        <button class="btn" @click="showConfig = true">参数配置</button>
        <button class="btn secondary" @click="openSolveProgress">启动求解</button>
        <button class="btn" @click="showReplay = true">方案可复现</button>
      </div>
    </div>

    <div class="chart-row">
      <div class="chart-card">
        <div class="section-header">
          <strong>适应度收敛</strong>
          <span>代数: {{ generations }}</span>
        </div>
        <div v-for="item in fitness" :key="item.label" style="margin-bottom: 6px;">
          <div class="section-header" style="margin: 0;">
            <span>{{ item.label }}</span>
            <span>{{ item.value }}</span>
          </div>
          <div class="progress-track">
            <div class="bar" :style="{ width: `${item.percent}%` }"></div>
          </div>
        </div>
      </div>
      <div class="chart-card">
        <div class="section-header">
          <strong>资源冲突修复</strong>
          <span>约束 penalty</span>
        </div>
        <div class="grid-2">
          <div v-for="fix in repairs" :key="fix.label">
            <div class="section-header" style="margin: 0;">
              <span>{{ fix.label }}</span>
              <span>{{ fix.count }} 次</span>
            </div>
            <div class="progress-track">
              <div class="bar" :style="{ width: `${fix.percent}%` }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>方案</th>
          <th>完工时间</th>
          <th>等待</th>
          <th>能耗</th>
          <th>换位</th>
          <th>适应度</th>
          <th>备注</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="plan in plans" :key="plan.name">
          <td>{{ plan.name }}</td>
          <td>{{ plan.makespan }} h</td>
          <td>{{ plan.wait }} min</td>
          <td>{{ plan.energy }} kWh</td>
          <td>{{ plan.rehandles }}</td>
          <td><span class="badge success">{{ plan.fitness }}</span></td>
          <td>{{ plan.note }}</td>
        </tr>
      </tbody>
    </table>

    <BaseModal v-model="showConfig" title="遗传算法参数配置">
      <div class="form-grid">
        <div class="input-group">
          <label>种群规模</label>
          <input v-model.number="config.population" type="number" />
        </div>
        <div class="input-group">
          <label>最大代数</label>
          <input v-model.number="config.generations" type="number" />
        </div>
        <div class="input-group">
          <label>交叉率</label>
          <input v-model.number="config.crossover" type="number" step="0.01" />
        </div>
        <div class="input-group">
          <label>变异率</label>
          <input v-model.number="config.mutation" type="number" step="0.01" />
        </div>
        <div class="input-group">
          <label>惩罚系数</label>
          <input v-model.number="config.penalty" type="number" />
        </div>
      </div>
      <div class="section-header" style="margin-top: 12px;">
        <span>参数调整后可生成多方案并行求解。</span>
        <button class="btn" @click="applyConfig">保存并预热</button>
      </div>
    </BaseModal>

    <ProgressModal v-model="showProgress" :message="progressMessage" />

    <BaseModal v-model="showReplay" title="方案可复现与导出">
      <p>保存当前随机种子、参数、解码器与约束修复策略，以便重放。</p>
      <div class="input-group">
        <label>方案标签</label>
        <input v-model="replayTag" placeholder="夜班方案-A" />
      </div>
      <div class="section-header" style="margin-top: 12px;">
        <span>导出 JSON/CSV 包含任务序列与设备分配。</span>
        <button class="btn" @click="exportReplay">导出</button>
      </div>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';
import ProgressModal from '../components/ProgressModal.vue';

const generations = 120;
const fitness = [
  { label: '最优适应度', value: 0.92, percent: 92 },
  { label: '平均适应度', value: 0.81, percent: 81 },
  { label: '最差适应度', value: 0.65, percent: 65 }
];
const repairs = [
  { label: '桥吊干涉修复', count: 16, percent: 80 },
  { label: '堆场容量修复', count: 12, percent: 60 },
  { label: '路径冲突修复', count: 10, percent: 50 },
  { label: '安全间隔惩罚', count: 8, percent: 40 }
];
const plans = [
  { name: '方案-A1', makespan: 18.6, wait: 46, energy: 920, rehandles: 14, fitness: 0.92, note: '平衡岸桥与AGV' },
  { name: '方案-A2', makespan: 19.2, wait: 60, energy: 960, rehandles: 18, fitness: 0.89, note: '换位略多' },
  { name: '方案-B1', makespan: 20.1, wait: 58, energy: 880, rehandles: 12, fitness: 0.87, note: '低能耗优先' },
  { name: '方案-B2', makespan: 18.9, wait: 52, energy: 950, rehandles: 16, fitness: 0.9, note: '桥吊干涉控制' },
  { name: '方案-C1', makespan: 21.0, wait: 70, energy: 890, rehandles: 20, fitness: 0.84, note: '堆场压力大' },
  { name: '方案-C2', makespan: 19.5, wait: 64, energy: 910, rehandles: 17, fitness: 0.86, note: '班组换班缓冲' },
  { name: '方案-D1', makespan: 22.3, wait: 82, energy: 870, rehandles: 24, fitness: 0.8, note: '场桥瓶颈' },
  { name: '方案-D2', makespan: 23.1, wait: 88, energy: 860, rehandles: 26, fitness: 0.78, note: '兼顾潮窗' },
  { name: '方案-E1', makespan: 17.9, wait: 44, energy: 940, rehandles: 13, fitness: 0.91, note: 'AGV 路径优化' },
  { name: '方案-E2', makespan: 19.0, wait: 55, energy: 905, rehandles: 15, fitness: 0.88, note: '安全惩罚降低' },
  { name: '方案-F1', makespan: 20.5, wait: 68, energy: 915, rehandles: 18, fitness: 0.85, note: '场桥利用平衡' },
  { name: '方案-F2', makespan: 21.7, wait: 75, energy: 900, rehandles: 21, fitness: 0.82, note: 'AGV 余量不足' },
  { name: '方案-G1', makespan: 18.4, wait: 48, energy: 930, rehandles: 14, fitness: 0.9, note: '桥吊分配均衡' },
  { name: '方案-G2', makespan: 22.0, wait: 80, energy: 880, rehandles: 23, fitness: 0.81, note: '夜班能耗低' },
  { name: '方案-H1', makespan: 19.3, wait: 62, energy: 970, rehandles: 16, fitness: 0.86, note: '换位稍高' },
  { name: '方案-H2', makespan: 18.2, wait: 50, energy: 950, rehandles: 13, fitness: 0.91, note: '等待优化' },
  { name: '方案-I1', makespan: 20.7, wait: 72, energy: 890, rehandles: 19, fitness: 0.83, note: '潮窗受限' },
  { name: '方案-I2', makespan: 21.5, wait: 78, energy: 900, rehandles: 22, fitness: 0.82, note: '设备维护避让' },
  { name: '方案-J1', makespan: 19.1, wait: 57, energy: 940, rehandles: 15, fitness: 0.88, note: '班组换班平滑' },
  { name: '方案-J2', makespan: 18.8, wait: 53, energy: 960, rehandles: 14, fitness: 0.89, note: '追求准点率' },
  { name: '方案-K1', makespan: 17.8, wait: 42, energy: 975, rehandles: 12, fitness: 0.93, note: '最优当前代' }
];

const showConfig = ref(false);
const showProgress = ref(false);
const showReplay = ref(false);
const progressMessage = ref('');

const config = reactive({
  population: 120,
  generations: 200,
  crossover: 0.82,
  mutation: 0.08,
  penalty: 12
});

const replayTag = ref('');

const applyConfig = () => {
  progressMessage.value = `参数已保存，正在预热求解器（种群 ${config.population}、代数 ${config.generations}）...`;
  showConfig.value = false;
  showProgress.value = true;
};

const openSolveProgress = () => {
  progressMessage.value = '启动遗传算法求解，评估适应度、修复约束并生成多方案...';
  showProgress.value = true;
};

const exportReplay = () => {
  progressMessage.value = `方案 ${replayTag.value || '未命名'} 导出中，包含随机种子与解码器配置...`;
  showReplay.value = false;
  showProgress.value = true;
};
</script>
