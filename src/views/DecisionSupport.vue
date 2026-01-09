<template>
  <section class="card">
    <div class="section-header">
      <div>
        <h3>决策支持与更新优先级排序</h3>
        <p>综合评估结果与政策约束进行评分排序。</p>
      </div>
      <div class="section-actions">
        <button class="btn btn-outline" @click="openPolicy">政策约束</button>
        <button class="btn btn-primary" @click="openScore">综合评分</button>
      </div>
    </div>
    <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));">
      <div v-for="card in scoreCards" :key="card.label" class="card">
        <p>{{ card.label }}</p>
        <h3>{{ card.value }}</h3>
        <div class="tag">{{ card.tag }}</div>
      </div>
    </div>
  </section>

  <section class="flex" style="margin-top: 20px;">
    <div class="card" style="flex: 1;">
      <div class="section-header">
        <div>
          <h3>优先级评分结构</h3>
          <p>评分结构透明可解释</p>
        </div>
        <button class="btn btn-outline" @click="openExplain">评分解释</button>
      </div>
      <div class="score-structure">
        <div v-for="item in scoreStructure" :key="item.name" class="score-row">
          <span>{{ item.name }}</span>
          <div class="score-bar" :style="{ width: item.weight + '%' }"></div>
          <strong>{{ item.weight }}%</strong>
        </div>
      </div>
    </div>
    <div class="card" style="flex: 0.9;">
      <div class="section-header">
        <div>
          <h3>更新资源安排</h3>
          <p>年度资金与指标额度</p>
        </div>
        <button class="btn btn-primary" @click="openResource">调整资源</button>
      </div>
      <ul class="resource-list">
        <li v-for="item in resources" :key="item.name">
          <span>{{ item.name }}</span>
          <span class="tag">{{ item.value }}</span>
        </li>
      </ul>
    </div>
  </section>

  <section class="card" style="margin-top: 20px;">
    <div class="section-header">
      <div>
        <h3>更新项目优先级排序</h3>
        <p>共 {{ tableData.length }} 个项目</p>
      </div>
      <button class="btn btn-outline" @click="openPublish">发布排序</button>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th>排名</th>
          <th>项目名称</th>
          <th>综合评分</th>
          <th>政策匹配度</th>
          <th>更新急迫性</th>
          <th>推荐等级</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in tableData" :key="row.rank">
          <td>{{ row.rank }}</td>
          <td>{{ row.name }}</td>
          <td>{{ row.score }}</td>
          <td>{{ row.policy }}</td>
          <td>{{ row.urgency }}</td>
          <td>{{ row.level }}</td>
        </tr>
      </tbody>
    </table>
  </section>

  <BaseModal v-model="policyVisible" title="政策约束">
    <label>
      约束类型
      <select class="select">
        <option>生态红线</option>
        <option>产业准入</option>
        <option>控规强度</option>
      </select>
    </label>
    <label>
      约束说明
      <textarea class="textarea" rows="3" placeholder="填写政策约束说明"></textarea>
    </label>
  </BaseModal>

  <BaseModal v-model="scoreVisible" title="综合评分">
    <p>系统已完成评分汇总，准备生成优先级排序。</p>
    <div class="progress">
      <div class="progress-bar" style="width: 76%;"></div>
    </div>
    <p class="muted">正在汇总 76%</p>
  </BaseModal>

  <BaseModal v-model="explainVisible" title="评分解释">
    <p>综合评分 = 价值评估 40% + 更新潜力 30% + 政策约束 20% + 社会效益 10%。</p>
  </BaseModal>

  <BaseModal v-model="resourceVisible" title="调整资源">
    <label>
      年度资金
      <input class="input" value="32 亿元" />
    </label>
    <label>
      更新指标
      <input class="input" value="45 个项目" />
    </label>
  </BaseModal>

  <BaseModal v-model="publishVisible" title="发布排序">
    <p>发布后将同步至审批系统与项目管理平台。</p>
    <div class="tag">预计推送 3 分钟</div>
  </BaseModal>
</template>

<script setup>
import { ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const scoreCards = [
  { label: '综合评分均值', value: '82.6', tag: '优' },
  { label: '政策匹配度', value: '91%', tag: '已核查' },
  { label: '高优先级项目', value: '24 个', tag: '重点推进' },
  { label: '资金需求', value: '32 亿元', tag: '年度预算' }
];

const scoreStructure = [
  { name: '价值评估', weight: 40 },
  { name: '更新潜力', weight: 30 },
  { name: '政策约束', weight: 20 },
  { name: '社会效益', weight: 10 }
];

const resources = [
  { name: '年度资金', value: '32 亿元' },
  { name: '更新指标', value: '45 个' },
  { name: '储备项目', value: '18 个' },
  { name: '协调部门', value: '6 个' }
];

const tableData = Array.from({ length: 24 }).map((_, index) => ({
  rank: index + 1,
  name: `更新项目-${index + 1}`,
  score: (92 - index * 0.6).toFixed(1),
  policy: (88 - index * 0.4).toFixed(1),
  urgency: (90 - index * 0.5).toFixed(1),
  level: ['优先推进', '重点关注', '储备观察'][index % 3]
}));

const policyVisible = ref(false);
const scoreVisible = ref(false);
const explainVisible = ref(false);
const resourceVisible = ref(false);
const publishVisible = ref(false);

const openPolicy = () => {
  policyVisible.value = true;
};

const openScore = () => {
  scoreVisible.value = true;
};

const openExplain = () => {
  explainVisible.value = true;
};

const openResource = () => {
  resourceVisible.value = true;
};

const openPublish = () => {
  publishVisible.value = true;
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

.score-structure {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.score-row {
  display: grid;
  grid-template-columns: 80px 1fr 50px;
  gap: 10px;
  align-items: center;
  font-size: 13px;
}

.score-bar {
  height: 10px;
  border-radius: 999px;
  background: linear-gradient(90deg, #2f80ed, #3dd598);
}

.resource-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.resource-list li {
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
  background: var(--accent);
  height: 100%;
}

.muted {
  color: var(--muted);
  font-size: 13px;
}
</style>
