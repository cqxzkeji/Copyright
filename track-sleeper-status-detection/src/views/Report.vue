<template>
  <div class="grid">
    <section class="card">
      <div class="section-title">
        <h3>报告列表</h3>
        <button @click="openGen">生成报告</button>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>报告名</th>
            <th>覆盖区段</th>
            <th>状态</th>
            <th>更新时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="report in reports" :key="report.name">
            <td>{{ report.name }}</td>
            <td>{{ report.section }}</td>
            <td><span :class="['badge', report.levelClass]">{{ report.status }}</span></td>
            <td>{{ report.time }}</td>
            <td>
              <button @click="view(report)">查看</button>
              <button @click="exportPdf(report)">导出</button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <section class="card">
      <div class="section-title">
        <h3>可视化总览</h3>
        <button @click="refresh">刷新概览</button>
      </div>
      <div class="chart">
        <div v-for="item in overview" :key="item.label" class="chart-bar" :style="{ height: item.value + '%' }">
          {{ item.label }}
        </div>
      </div>
      <p class="note">柱高展示各类型风险的占比，用于生成报告摘要。</p>
    </section>
  </div>

  <div v-if="showGen" class="modal-backdrop" @click.self="showGen = false">
    <div class="modal">
      <h3>生成报告</h3>
      <div class="form-grid">
        <input class="input" v-model="form.title" placeholder="报告名称" />
        <input class="input" v-model="form.range" placeholder="区段" />
        <input class="input" v-model="form.note" placeholder="摘要" />
      </div>
      <div class="actions-row">
        <button @click="startGen">开始生成</button>
        <button class="ghost" @click="showGen = false">关闭</button>
      </div>
    </div>
  </div>

  <div v-if="progressModal" class="modal-backdrop" @click.self="progressModal = false">
    <div class="modal">
      <h3>{{ progressTitle }}</h3>
      <div class="progress-bar">
        <div class="fill" :style="{ width: progress + '%' }"></div>
      </div>
      <p>正在渲染图表与排版，进度 {{ progress }}%</p>
      <div class="actions-row">
        <button @click="stepProgress">刷新</button>
        <button class="ghost" @click="progressModal = false">关闭</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const reports = ref([
  { name: '周报-01', section: 'K12-K38', status: '草稿', levelClass: 'warning', time: '2024-04-10' },
  { name: '专项-裂纹', section: '隧道口', status: '已发布', levelClass: 'success', time: '2024-04-08' },
  { name: '月报-北段', section: '北环线', status: '已发布', levelClass: 'success', time: '2024-03-30' },
  { name: '临时-检修', section: '桥梁跨中', status: '处理中', levelClass: 'warning', time: '2024-04-09' },
  { name: '巡检-夜班', section: '正线 300km', status: '草稿', levelClass: 'warning', time: '2024-04-11' },
]);

const overview = ref([
  { label: '结构风险', value: 45 },
  { label: '环境风险', value: 30 },
  { label: '运维风险', value: 25 },
  { label: '图像异常', value: 35 },
  { label: '传感器异常', value: 28 },
]);

const showGen = ref(false);
const progressModal = ref(false);
const progress = ref(15);
const progressTitle = ref('');
const form = reactive({ title: '周报-自动', range: 'K12-K38', note: '自动生成' });

const openGen = () => {
  showGen.value = true;
};

const startGen = () => {
  progressTitle.value = `生成 ${form.title}`;
  progress.value = 15;
  progressModal.value = true;
};

const stepProgress = () => {
  progress.value = Math.min(100, progress.value + 35);
};

const view = (report) => {
  alert(`${report.name} 预览：覆盖 ${report.section}`);
};

const exportPdf = (report) => {
  alert(`已导出 ${report.name} 为 PDF。`);
};

const refresh = () => {
  overview.value = overview.value.map((item) => ({ ...item, value: Math.min(95, item.value + 3) }));
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
