<template>
  <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));">
    <div v-for="metric in metrics" :key="metric.label" class="card metric-card">
      <div>
        <p class="metric-label">{{ metric.label }}</p>
        <h3>{{ metric.value }}</h3>
      </div>
      <span class="tag">{{ metric.tag }}</span>
    </div>
  </div>

  <section class="flex" style="margin-top: 20px;">
    <div class="card" style="flex: 1.2;">
      <div class="section-header">
        <div>
          <h3>全市更新强度分布</h3>
          <p>基于 6 类评估指标的综合评分</p>
        </div>
        <div class="section-actions">
          <button class="btn btn-outline" @click="openRefresh">刷新指标</button>
          <button class="btn btn-primary" @click="openBrief">生成简报</button>
        </div>
      </div>
      <div class="chart">
        <div v-for="bar in chartData" :key="bar.name" class="bar">
          <span>{{ bar.name }}</span>
          <div class="bar-track">
            <div class="bar-fill" :style="{ width: bar.value + '%' }"></div>
          </div>
          <strong>{{ bar.value }}%</strong>
        </div>
      </div>
    </div>
    <div class="card" style="flex: 0.8;">
      <div class="section-header">
        <div>
          <h3>更新任务提醒</h3>
          <p>近期需跟进的项目清单</p>
        </div>
        <button class="btn btn-outline" @click="openNotice">发送提醒</button>
      </div>
      <ul class="todo">
        <li v-for="item in todoList" :key="item.id">
          <span>{{ item.name }}</span>
          <span class="tag">{{ item.time }}</span>
        </li>
      </ul>
    </div>
  </section>

  <section class="card" style="margin-top: 20px;">
    <div class="section-header">
      <div>
        <h3>重点更新单元清单</h3>
        <p>更新潜力分级结果（共 {{ tableData.length }} 条）</p>
      </div>
      <button class="btn btn-primary" @click="openExport">导出表格</button>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th>编号</th>
          <th>更新单元</th>
          <th>片区</th>
          <th>潜力等级</th>
          <th>综合得分</th>
          <th>建议策略</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in tableData" :key="row.id">
          <td>{{ row.id }}</td>
          <td>{{ row.name }}</td>
          <td>{{ row.area }}</td>
          <td>{{ row.level }}</td>
          <td>{{ row.score }}</td>
          <td>{{ row.strategy }}</td>
        </tr>
      </tbody>
    </table>
  </section>

  <BaseModal v-model="refreshVisible" title="刷新指标">
    <p>系统将重新汇总最新数据并刷新综合指标。</p>
    <div class="progress">
      <div class="progress-bar" style="width: 72%;"></div>
    </div>
    <p class="muted">正在加载 72% ...</p>
  </BaseModal>

  <BaseModal v-model="briefVisible" title="生成简报">
    <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));">
      <label>
        简报范围
        <select class="select">
          <option>全市</option>
          <option>中心城区</option>
          <option>产业园区</option>
        </select>
      </label>
      <label>
        输出格式
        <select class="select">
          <option>PDF</option>
          <option>PPT</option>
          <option>DOCX</option>
        </select>
      </label>
    </div>
    <label>
      补充说明
      <textarea class="textarea" rows="3" placeholder="填写备注说明"></textarea>
    </label>
  </BaseModal>

  <BaseModal v-model="noticeVisible" title="发送提醒">
    <label>
      提醒对象
      <input class="input" placeholder="输入项目负责人" />
    </label>
    <label>
      提醒内容
      <textarea class="textarea" rows="3" placeholder="请填写提醒说明"></textarea>
    </label>
  </BaseModal>

  <BaseModal v-model="exportVisible" title="导出清单">
    <p>已选择导出重点更新单元清单，共 {{ tableData.length }} 条记录。</p>
    <div class="tag">导出格式：XLSX + 地图截图</div>
  </BaseModal>
</template>

<script setup>
import { ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const metrics = [
  { label: '存量用地总量', value: '12,480 公顷', tag: '动态更新' },
  { label: '低效用地占比', value: '18.6%', tag: '重点关注' },
  { label: '更新项目储备', value: '86 个', tag: '季度刷新' },
  { label: '综合收益提升', value: '+24%', tag: '情景对比' }
];

const chartData = [
  { name: '核心更新', value: 82 },
  { name: '优化提升', value: 68 },
  { name: '产业升级', value: 74 },
  { name: '综合治理', value: 56 },
  { name: '储备观测', value: 42 }
];

const todoList = [
  { id: 1, name: '北城仓储区更新方案复核', time: '今日' },
  { id: 2, name: '南站片区控规修编数据核对', time: '2 天内' },
  { id: 3, name: '旧厂区拆迁评估汇报', time: '本周' },
  { id: 4, name: '生态修复项目绩效评估', time: '本月' }
];

const tableData = Array.from({ length: 24 }).map((_, index) => ({
  id: index + 1,
  name: `更新单元-${String(index + 1).padStart(2, '0')}`,
  area: ['中心城区', '产业新区', '滨水片区', '老工业区'][index % 4],
  level: ['A级', 'B级', 'C级'][index % 3],
  score: (86 - index).toFixed(1),
  strategy: ['综合提升', '产业导入', '功能复合'][index % 3]
}));

const refreshVisible = ref(false);
const briefVisible = ref(false);
const noticeVisible = ref(false);
const exportVisible = ref(false);

const openRefresh = () => {
  refreshVisible.value = true;
};

const openBrief = () => {
  briefVisible.value = true;
};

const openNotice = () => {
  noticeVisible.value = true;
};

const openExport = () => {
  exportVisible.value = true;
};
</script>

<style scoped>
.metric-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.metric-label {
  margin: 0;
  color: var(--muted);
  font-size: 13px;
}

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

.chart {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.bar {
  display: grid;
  grid-template-columns: 90px 1fr 60px;
  gap: 12px;
  align-items: center;
  font-size: 13px;
}

.bar-track {
  background: #f0f4ff;
  border-radius: 999px;
  height: 10px;
  overflow: hidden;
}

.bar-fill {
  background: linear-gradient(90deg, #2f80ed, #56ccf2);
  height: 100%;
}

.todo {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.todo li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px dashed var(--border);
  padding-bottom: 8px;
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
