<template>
  <section class="card">
    <div class="section-header">
      <div>
        <h3>用地价值评估与潜力分析</h3>
        <p>区位、开发强度、产业适配度综合评估。</p>
      </div>
      <div class="section-actions">
        <button class="btn btn-outline" @click="openModel">配置评估模型</button>
        <button class="btn btn-primary" @click="openRun">开始评估</button>
      </div>
    </div>
    <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));">
      <div v-for="score in scoreCards" :key="score.label" class="card">
        <p>{{ score.label }}</p>
        <h3>{{ score.value }}</h3>
        <div class="tag">{{ score.tag }}</div>
      </div>
    </div>
  </section>

  <section class="flex" style="margin-top: 20px;">
    <div class="card" style="flex: 1.1;">
      <div class="section-header">
        <div>
          <h3>价值评估分布</h3>
          <p>综合得分区间统计</p>
        </div>
        <button class="btn btn-outline" @click="openGrade">生成潜力分级</button>
      </div>
      <div class="distribution">
        <div v-for="item in distribution" :key="item.label" class="distribution-item">
          <span>{{ item.label }}</span>
          <div class="distribution-bar" :style="{ width: item.value + '%' }"></div>
          <strong>{{ item.value }}%</strong>
        </div>
      </div>
    </div>
    <div class="card" style="flex: 0.9;">
      <div class="section-header">
        <div>
          <h3>重点评估指标</h3>
          <p>当前权重设置</p>
        </div>
        <button class="btn btn-primary" @click="openWeight">调整权重</button>
      </div>
      <ul class="weight-list">
        <li v-for="item in weights" :key="item.name">
          <span>{{ item.name }}</span>
          <span class="tag">{{ item.weight }}</span>
        </li>
      </ul>
    </div>
  </section>

  <section class="card" style="margin-top: 20px;">
    <div class="section-header">
      <div>
        <h3>评估结果清单</h3>
        <p>共 {{ tableData.length }} 个地块</p>
      </div>
      <button class="btn btn-outline" @click="openReport">导出评估报告</button>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th>地块</th>
          <th>区位指数</th>
          <th>开发强度</th>
          <th>产业适配度</th>
          <th>综合得分</th>
          <th>潜力等级</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in tableData" :key="row.name">
          <td>{{ row.name }}</td>
          <td>{{ row.location }}</td>
          <td>{{ row.intensity }}</td>
          <td>{{ row.industry }}</td>
          <td>{{ row.score }}</td>
          <td>{{ row.level }}</td>
        </tr>
      </tbody>
    </table>
  </section>

  <BaseModal v-model="modelVisible" title="配置评估模型">
    <label>
      模型版本
      <select class="select">
        <option>2024 优化版</option>
        <option>2023 标准版</option>
        <option>产业适配增强版</option>
      </select>
    </label>
    <label>
      数据范围
      <select class="select">
        <option>全市范围</option>
        <option>主城区</option>
        <option>重点片区</option>
      </select>
    </label>
  </BaseModal>

  <BaseModal v-model="runVisible" title="开始评估">
    <p>系统正在计算综合评分，请稍候。</p>
    <div class="progress">
      <div class="progress-bar" style="width: 48%;"></div>
    </div>
    <p class="muted">计算进度 48%</p>
  </BaseModal>

  <BaseModal v-model="gradeVisible" title="生成潜力分级">
    <label>
      分级标准
      <select class="select">
        <option>五级分级</option>
        <option>三级分级</option>
        <option>两级分级</option>
      </select>
    </label>
    <label>
      目标阈值
      <input class="input" placeholder="例如：80" />
    </label>
  </BaseModal>

  <BaseModal v-model="weightVisible" title="调整权重">
    <label>
      区位权重
      <input class="input" value="30%" />
    </label>
    <label>
      开发强度权重
      <input class="input" value="35%" />
    </label>
    <label>
      产业适配度权重
      <input class="input" value="35%" />
    </label>
  </BaseModal>

  <BaseModal v-model="reportVisible" title="导出评估报告">
    <p>将导出 {{ tableData.length }} 个地块评估结果。</p>
    <div class="tag">格式：PDF + 指标图表</div>
  </BaseModal>
</template>

<script setup>
import { ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const scoreCards = [
  { label: '平均综合得分', value: '78.4', tag: '全市均值' },
  { label: '高潜力地块', value: '38 个', tag: 'A级以上' },
  { label: '低效用地', value: '26 个', tag: '需更新' },
  { label: '产业适配指数', value: '0.82', tag: '稳步提升' }
];

const distribution = [
  { label: '90-100', value: 18 },
  { label: '80-90', value: 34 },
  { label: '70-80', value: 26 },
  { label: '60-70', value: 15 },
  { label: '60 以下', value: 7 }
];

const weights = [
  { name: '区位条件', weight: '30%' },
  { name: '开发强度', weight: '35%' },
  { name: '产业适配度', weight: '35%' },
  { name: '公共服务', weight: '10%' }
];

const tableData = Array.from({ length: 25 }).map((_, index) => ({
  name: `评估地块-${index + 1}`,
  location: (85 - index * 0.6).toFixed(1),
  intensity: (78 - index * 0.4).toFixed(1),
  industry: (82 - index * 0.5).toFixed(1),
  score: (80 - index * 0.45).toFixed(1),
  level: ['A', 'B', 'C'][index % 3]
}));

const modelVisible = ref(false);
const runVisible = ref(false);
const gradeVisible = ref(false);
const weightVisible = ref(false);
const reportVisible = ref(false);

const openModel = () => {
  modelVisible.value = true;
};

const openRun = () => {
  runVisible.value = true;
};

const openGrade = () => {
  gradeVisible.value = true;
};

const openWeight = () => {
  weightVisible.value = true;
};

const openReport = () => {
  reportVisible.value = true;
};
</script>

<style scoped>
.section-header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: center;
  margin-bottom: 16px;
}

.section-header h3 {
  margin: 0 0 4px;
}

.section-header p {
  margin: 0;
  color: var(--muted);
  font-size: 13px;
}

.section-actions {
  display: flex;
  gap: 10px;
}

.distribution {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.distribution-item {
  display: grid;
  grid-template-columns: 80px 1fr 50px;
  gap: 10px;
  align-items: center;
  font-size: 13px;
}

.distribution-bar {
  height: 10px;
  border-radius: 999px;
  background: linear-gradient(90deg, #ffb020, #f2994a);
}

.weight-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.weight-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.progress {
  background: #f1f5f9;
  border-radius: 999px;
  height: 10px;
  overflow: hidden;
}

.progress-bar {
  background: var(--warning);
  height: 100%;
}

.muted {
  color: var(--muted);
  font-size: 13px;
}
</style>
