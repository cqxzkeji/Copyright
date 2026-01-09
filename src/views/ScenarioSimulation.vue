<template>
  <section class="card">
    <div class="section-header">
      <div>
        <h3>更新情景模拟与方案比选</h3>
        <p>对不同更新方式的经济、社会、空间影响进行模拟。</p>
      </div>
      <div class="section-actions">
        <button class="btn btn-outline" @click="openScenario">新建情景</button>
        <button class="btn btn-primary" @click="openRun">运行模拟</button>
      </div>
    </div>
    <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));">
      <div v-for="scene in scenes" :key="scene.name" class="card scene-card">
        <h4>{{ scene.name }}</h4>
        <p>{{ scene.desc }}</p>
        <div class="tag">综合评分 {{ scene.score }}</div>
      </div>
    </div>
  </section>

  <section class="flex" style="margin-top: 20px;">
    <div class="card" style="flex: 1;">
      <div class="section-header">
        <div>
          <h3>方案效益对比</h3>
          <p>经济、社会与空间结构指标</p>
        </div>
        <button class="btn btn-outline" @click="openCompare">比选说明</button>
      </div>
      <div class="compare">
        <div v-for="row in compareData" :key="row.metric" class="compare-row">
          <span>{{ row.metric }}</span>
          <div class="compare-bars">
            <div class="bar blue" :style="{ width: row.a + '%' }"></div>
            <div class="bar green" :style="{ width: row.b + '%' }"></div>
            <div class="bar orange" :style="{ width: row.c + '%' }"></div>
          </div>
          <strong>{{ row.a }}/{{ row.b }}/{{ row.c }}</strong>
        </div>
      </div>
    </div>
    <div class="card" style="flex: 0.9;">
      <div class="section-header">
        <div>
          <h3>模拟进度监测</h3>
          <p>当前运行任务</p>
        </div>
        <button class="btn btn-primary" @click="openQueue">查看队列</button>
      </div>
      <ul class="queue">
        <li v-for="task in tasks" :key="task.id">
          <div>
            <strong>{{ task.name }}</strong>
            <p>{{ task.desc }}</p>
          </div>
          <span class="tag">{{ task.progress }}</span>
        </li>
      </ul>
    </div>
  </section>

  <section class="card" style="margin-top: 20px;">
    <div class="section-header">
      <div>
        <h3>情景模拟结果明细</h3>
        <p>共 {{ tableData.length }} 条对比记录</p>
      </div>
      <button class="btn btn-outline" @click="openExport">导出对比</button>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th>方案</th>
          <th>经济效益</th>
          <th>社会效益</th>
          <th>空间结构</th>
          <th>综合评分</th>
          <th>推荐度</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in tableData" :key="row.id">
          <td>{{ row.name }}</td>
          <td>{{ row.economic }}</td>
          <td>{{ row.social }}</td>
          <td>{{ row.spatial }}</td>
          <td>{{ row.score }}</td>
          <td>{{ row.level }}</td>
        </tr>
      </tbody>
    </table>
  </section>

  <BaseModal v-model="scenarioVisible" title="新建情景">
    <label>
      情景名称
      <input class="input" placeholder="输入情景名称" />
    </label>
    <label>
      更新方式
      <select class="select">
        <option>整体改造</option>
        <option>局部提升</option>
        <option>功能置换</option>
      </select>
    </label>
    <label>
      目标定位
      <textarea class="textarea" rows="3" placeholder="描述情景目标"></textarea>
    </label>
  </BaseModal>

  <BaseModal v-model="runVisible" title="运行模拟">
    <p>情景模型正在运行，请保持页面。</p>
    <div class="progress">
      <div class="progress-bar" style="width: 58%;"></div>
    </div>
    <p class="muted">当前完成 58%</p>
  </BaseModal>

  <BaseModal v-model="compareVisible" title="比选说明">
    <p>蓝色、绿色、橙色分别代表三种更新方案的评分占比。</p>
    <p>综合评分依据经济、社会、空间结构加权计算。</p>
  </BaseModal>

  <BaseModal v-model="queueVisible" title="模拟队列">
    <ul class="queue-detail">
      <li>产业升级情景 - 已完成 68%</li>
      <li>综合治理情景 - 已完成 42%</li>
      <li>公共服务强化情景 - 排队中</li>
    </ul>
  </BaseModal>

  <BaseModal v-model="exportVisible" title="导出对比结果">
    <p>将生成对比报告与图表附件。</p>
    <div class="tag">支持 PDF / Excel / PPT</div>
  </BaseModal>
</template>

<script setup>
import { ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const scenes = [
  { name: '方案 A：产业升级', desc: '导入高端制造与研发服务。', score: 86 },
  { name: '方案 B：综合治理', desc: '提升公共服务与社区功能。', score: 81 },
  { name: '方案 C：功能置换', desc: '置换低效仓储为商务办公。', score: 78 }
];

const compareData = [
  { metric: '经济效益', a: 80, b: 68, c: 72 },
  { metric: '社会效益', a: 70, b: 84, c: 62 },
  { metric: '空间结构', a: 76, b: 72, c: 81 },
  { metric: '绿色指标', a: 66, b: 78, c: 60 }
];

const tasks = [
  { id: 1, name: '产业升级情景', desc: '预计 12 分钟完成', progress: '68%' },
  { id: 2, name: '综合治理情景', desc: '预计 9 分钟完成', progress: '42%' },
  { id: 3, name: '公共服务强化', desc: '排队中', progress: '等待' }
];

const tableData = Array.from({ length: 23 }).map((_, index) => ({
  id: index + 1,
  name: `情景方案-${index + 1}`,
  economic: (85 - index * 0.5).toFixed(1),
  social: (80 - index * 0.4).toFixed(1),
  spatial: (78 - index * 0.3).toFixed(1),
  score: (82 - index * 0.35).toFixed(1),
  level: ['推荐', '可选', '观察'][index % 3]
}));

const scenarioVisible = ref(false);
const runVisible = ref(false);
const compareVisible = ref(false);
const queueVisible = ref(false);
const exportVisible = ref(false);

const openScenario = () => {
  scenarioVisible.value = true;
};

const openRun = () => {
  runVisible.value = true;
};

const openCompare = () => {
  compareVisible.value = true;
};

const openQueue = () => {
  queueVisible.value = true;
};

const openExport = () => {
  exportVisible.value = true;
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

.scene-card h4 {
  margin-top: 0;
}

.compare {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.compare-row {
  display: grid;
  grid-template-columns: 90px 1fr 80px;
  gap: 12px;
  align-items: center;
  font-size: 13px;
}

.compare-bars {
  display: flex;
  gap: 6px;
  align-items: center;
}

.bar {
  height: 10px;
  border-radius: 999px;
}

.bar.blue {
  background: #2f80ed;
}

.bar.green {
  background: #3dd598;
}

.bar.orange {
  background: #f2994a;
}

.queue {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.queue li {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  border-bottom: 1px dashed var(--border);
  padding-bottom: 8px;
}

.queue li p {
  margin: 6px 0 0;
  color: var(--muted);
  font-size: 12px;
}

.queue-detail {
  margin: 0;
  padding-left: 18px;
  color: var(--muted);
}

.progress {
  background: #f1f5f9;
  border-radius: 999px;
  height: 10px;
  overflow: hidden;
}

.progress-bar {
  background: var(--primary);
  height: 100%;
}

.muted {
  color: var(--muted);
  font-size: 13px;
}
</style>
