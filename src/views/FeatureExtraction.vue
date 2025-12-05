<template>
  <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));">
    <div class="card">
      <div class="section-head">特征方案</div>
      <div class="form-row">
        <label>模型选择</label>
        <select v-model="plan.model" class="input">
          <option>ResNet50</option>
          <option>DenseNet121</option>
          <option>ViT-Small</option>
        </select>
        <label>输出维度</label>
        <input v-model="plan.dimension" class="input" />
        <label>样本抽样比例</label>
        <input v-model="plan.sample" class="input" />
      </div>
      <div class="actions" style="margin-top: 1rem;">
        <button class="btn" @click="run">开始提取</button>
        <button class="btn secondary" @click="showConfig = true">保存配置</button>
      </div>
    </div>
    <div class="card">
      <div class="section-head">特征摘要</div>
      <table class="table">
        <thead>
          <tr>
            <th>维度</th>
            <th>均值</th>
            <th>方差</th>
            <th>特征得分</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in summary" :key="item.dim">
            <td>{{ item.dim }}</td>
            <td>{{ item.mean }}</td>
            <td>{{ item.var }}</td>
            <td>{{ item.score }}</td>
          </tr>
        </tbody>
      </table>
      <div class="actions" style="margin-top: 0.75rem;">
        <button class="btn" @click="showChart = true">查看分布</button>
        <button class="btn secondary" @click="shuffle">重新采样</button>
      </div>
    </div>
  </div>

  <ModalDialog v-model="showConfig" title="保存配置" confirm-text="保存" @confirm="saveConfig">
    <div class="form-row">
      <label>配置名称</label>
      <input v-model="plan.name" class="input" placeholder="输入自定义名称" />
      <label>备注</label>
      <textarea v-model="plan.note" class="input" rows="3" placeholder="记录使用场景"></textarea>
    </div>
  </ModalDialog>

  <ModalDialog v-model="showChart" title="特征分布" confirm-text="关闭" @confirm="showChart = false">
    <div class="chart-row">
      <div v-for="bar in bars" :key="bar.label" class="bar" :style="{ height: bar.value + '%' }">{{ bar.label }}</div>
    </div>
  </ModalDialog>
</template>

<script setup>
import { reactive, ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const plan = reactive({ model: 'ResNet50', dimension: 512, sample: '80%', name: '默认方案', note: '' });
const summary = ref([
  { dim: '0-127', mean: 0.12, var: 0.08, score: 0.74 },
  { dim: '128-255', mean: 0.22, var: 0.14, score: 0.69 },
  { dim: '256-383', mean: 0.18, var: 0.09, score: 0.71 },
  { dim: '384-511', mean: 0.33, var: 0.21, score: 0.83 }
]);
const bars = ref([
  { label: '低频', value: 40 },
  { label: '中频', value: 65 },
  { label: '高频', value: 52 },
  { label: '纹理', value: 70 }
]);
const showConfig = ref(false);
const showChart = ref(false);

const run = () => {
  bars.value = bars.value.map((bar) => ({ ...bar, value: Math.min(100, bar.value + 5) }));
  showChart.value = true;
};

const saveConfig = () => {
  showConfig.value = false;
};

const shuffle = () => {
  summary.value = summary.value
    .map((row) => ({ ...row, score: Number((row.score + Math.random() * 0.05).toFixed(2)) }))
    .sort((a, b) => b.score - a.score);
};
</script>

<style scoped>
.section-head {
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.5rem;
}

.chart-row {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.75rem;
  align-items: end;
  height: 180px;
}

.bar {
  background: linear-gradient(120deg, #22d3ee, #6366f1);
  color: #fff;
  border-radius: 10px 10px 4px 4px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 0.35rem;
  font-weight: 700;
}
</style>
