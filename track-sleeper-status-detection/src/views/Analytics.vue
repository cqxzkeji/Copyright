<template>
  <div class="grid">
    <section class="card">
      <div class="section-title">
        <h3>预警指标列表</h3>
        <button @click="generate">重新计算</button>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>指标</th>
            <th>当前值</th>
            <th>阈值</th>
            <th>风险级别</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in metrics" :key="item.name">
            <td>{{ item.name }}</td>
            <td>{{ item.value }}</td>
            <td>{{ item.threshold }}</td>
            <td><span :class="['badge', item.levelClass]">{{ item.level }}</span></td>
            <td>
              <button @click="openRule(item)">调整规则</button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <section class="card">
      <div class="section-title">
        <h3>风险占比饼图</h3>
        <button @click="simulate">模拟趋势</button>
      </div>
      <div class="chart">
        <div v-for="slice in slices" :key="slice.label" class="chart-bar" :style="{ height: slice.value + '%' }">
          {{ slice.label }}
        </div>
      </div>
      <p class="note">柱高代表风险占比，模拟趋势用于快速判断预警等级变化。</p>
    </section>
  </div>

  <div v-if="ruleModal" class="modal-backdrop" @click.self="ruleModal = false">
    <div class="modal">
      <h3>阈值调整 - {{ activeRule?.name }}</h3>
      <div class="form-grid">
        <input class="input" v-model.number="activeRule.threshold" placeholder="阈值" />
        <input class="input" v-model="activeRule.desc" placeholder="说明" />
      </div>
      <div class="actions-row">
        <button @click="saveRule">保存</button>
        <button class="ghost" @click="ruleModal = false">关闭</button>
      </div>
    </div>
  </div>

  <div v-if="progressModal" class="modal-backdrop" @click.self="progressModal = false">
    <div class="modal">
      <h3>模型计算</h3>
      <div class="progress-bar">
        <div class="fill" :style="{ width: progress + '%' }"></div>
      </div>
      <p>正在加载特征重要性，进度 {{ progress }}%</p>
      <div class="actions-row">
        <button @click="step">刷新</button>
        <button class="ghost" @click="progressModal = false">关闭</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const metrics = ref([
  { name: '沉降超限率', value: '8%', threshold: '10%', level: '正常', levelClass: 'success', desc: '月度沉降超限比例' },
  { name: '裂纹增长率', value: '12%', threshold: '15%', level: '关注', levelClass: 'warning', desc: '本周裂纹增长比例' },
  { name: '磨耗加速度', value: '0.18', threshold: '0.25', level: '正常', levelClass: 'success', desc: '磨耗趋势斜率' },
  { name: '轨距偏差', value: '5mm', threshold: '8mm', level: '正常', levelClass: 'success', desc: '轨距变化最大值' },
  { name: '温漂系数', value: '0.65', threshold: '0.8', level: '关注', levelClass: 'warning', desc: '温度漂移耦合系数' },
]);

const slices = ref([
  { label: '正常', value: 55 },
  { label: '关注', value: 28 },
  { label: '预警', value: 17 },
]);

const ruleModal = ref(false);
const progressModal = ref(false);
const progress = ref(20);
const activeRule = ref(null);

const openRule = (item) => {
  activeRule.value = { ...item };
  ruleModal.value = true;
};

const saveRule = () => {
  if (activeRule.value) {
    const idx = metrics.value.findIndex((m) => m.name === activeRule.value.name);
    if (idx !== -1) metrics.value[idx] = activeRule.value;
  }
  ruleModal.value = false;
};

const generate = () => {
  progress.value = 20;
  progressModal.value = true;
};

const step = () => {
  progress.value = Math.min(100, progress.value + 30);
};

const simulate = () => {
  slices.value = slices.value.map((s) => ({ ...s, value: Math.max(10, Math.min(90, s.value + 5)) }));
};
</script>

<style scoped>
.grid {
  display: grid;
  gap: 14px;
}

.actions-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 12px;
}

.note {
  color: #6b7280;
  margin-top: 6px;
}

.ghost {
  background: #eef2f7;
  color: #1f2937;
  box-shadow: none;
}
</style>
