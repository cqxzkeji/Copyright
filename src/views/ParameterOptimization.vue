<template>
  <div class="card">
    <h2>参数调控与优化</h2>
    <p class="helper-text">基于实验与仿真反馈，优化浆料比例、拉伸速度与干燥时间等关键参数。</p>
    <div class="flex">
      <button @click="showPlan = true">创建优化方案</button>
      <button @click="runOptimization">启动自动优化</button>
      <button @click="showTip = true">参数约束说明</button>
    </div>
    <div class="card" style="margin-top: 16px;">
      <div class="badge">参数影响权重</div>
      <div class="chart">
        <div v-for="item in weightData" :key="item.name" class="bar" :style="{ height: 70 + item.weight * 2 + 'px', background: 'linear-gradient(180deg,#ffd166,#f3722c)' }">
          <span>{{ item.weight }}%</span>
          <small>{{ item.name }}</small>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="badge">迭代结果</div>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>迭代</th>
              <th>固含量 (%)</th>
              <th>拉伸速度 (mm/min)</th>
              <th>干燥时间 (min)</th>
              <th>目标强度 (MPa)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in iterations" :key="row.id">
              <td>{{ row.id }}</td>
              <td>{{ row.solid }}</td>
              <td>{{ row.speed }}</td>
              <td>{{ row.dry }}</td>
              <td>{{ row.strength }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <div v-if="showPlan" class="modal-mask">
    <div class="modal-container">
      <h3>新建优化方案</h3>
      <div class="input-row">
        <label>方案名称</label>
        <input v-model="plan.name" placeholder="例如：低孔隙率增强" />
      </div>
      <div class="grid">
        <div class="input-row">
          <label>固含量范围 (%)</label>
          <input v-model="plan.solid" placeholder="22-28" />
        </div>
        <div class="input-row">
          <label>拉伸速度 (mm/min)</label>
          <input v-model="plan.speed" placeholder="5-15" />
        </div>
        <div class="input-row">
          <label>干燥时间 (min)</label>
          <input v-model="plan.dry" placeholder="35-50" />
        </div>
      </div>
      <div class="flex" style="justify-content: flex-end; margin-top: 12px;">
        <button @click="savePlan">保存方案</button>
      </div>
    </div>
  </div>

  <div v-if="showOptimization" class="modal-mask">
    <div class="modal-container">
      <h3>自动优化</h3>
      <p>正在搜索 Pareto 前沿解，实时调整实验参数。</p>
      <div class="progress"><div :style="{ width: progress + '%' }"></div></div>
      <p class="helper-text">当前适应度：{{ fitness }}</p>
    </div>
  </div>

  <div v-if="showTip" class="modal-mask">
    <div class="modal-container">
      <h3>约束与建议</h3>
      <ul>
        <li>固含量超过 30% 会导致纤维聚集，不建议。</li>
        <li>拉伸速度 8-12 mm/min 时力学性能较稳定。</li>
        <li>干燥时间过短会引起内应力，需要至少 30 分钟。</li>
      </ul>
      <div class="flex" style="justify-content: flex-end;">
        <button @click="showTip = false">关闭</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onBeforeUnmount } from 'vue';

const weightData = [
  { name: '固含量', weight: 32 },
  { name: '拉伸速度', weight: 24 },
  { name: '干燥时间', weight: 18 },
  { name: '浆料温度', weight: 12 },
  { name: '添加剂', weight: 14 }
];

const iterations = [
  { id: 1, solid: 22.5, speed: 9, dry: 38, strength: 148 },
  { id: 2, solid: 23.4, speed: 10, dry: 40, strength: 151 },
  { id: 3, solid: 24.1, speed: 11, dry: 39, strength: 153 },
  { id: 4, solid: 25, speed: 11, dry: 41, strength: 156 },
  { id: 5, solid: 25.6, speed: 12, dry: 42, strength: 158 },
  { id: 6, solid: 26.2, speed: 12, dry: 44, strength: 160 },
  { id: 7, solid: 26.8, speed: 13, dry: 45, strength: 162 },
  { id: 8, solid: 27.1, speed: 13, dry: 46, strength: 163 },
  { id: 9, solid: 27.5, speed: 14, dry: 47, strength: 165 },
  { id: 10, solid: 27.8, speed: 14, dry: 48, strength: 166 }
];

const showPlan = ref(false);
const showOptimization = ref(false);
const showTip = ref(false);
const progress = ref(0);
const fitness = ref(0.82);
let timer;

const plan = reactive({ name: '默认方案', solid: '22-28', speed: '8-14', dry: '35-50' });

const savePlan = () => {
  showPlan.value = false;
};

const runOptimization = () => {
  showOptimization.value = true;
  progress.value = 0;
  fitness.value = 0.82;
  clearInterval(timer);
  timer = setInterval(() => {
    progress.value += 8;
    fitness.value = Math.min(0.95, +(fitness.value + 0.01).toFixed(2));
    if (progress.value >= 100) {
      clearInterval(timer);
      setTimeout(() => (showOptimization.value = false), 800);
    }
  }, 260);
};

onBeforeUnmount(() => clearInterval(timer));
</script>
