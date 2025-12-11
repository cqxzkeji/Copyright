<template>
  <div class="grid" style="gap: 18px">
    <div class="card">
      <header class="section">
        <div>
          <p class="section-title">设计报告生成</p>
          <p class="hint">汇总渐变色方案、布局与定制记录，导出 PDF 报告。</p>
        </div>
        <button class="btn btn-primary" @click="generateReport">一键生成</button>
      </header>
      <div class="chart-wrap">
        <div class="chart" aria-label="渐变色使用分布">
          <div v-for="item in chartData" :key="item.label" class="bar" :style="{ width: item.value + '%', background: item.gradient }">
            <span>{{ item.label }} · {{ item.value }}%</span>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <p class="section-title">设计摘要表（10 条）</p>
      <table class="table">
        <thead>
          <tr>
            <th>空间</th>
            <th>主题</th>
            <th>预算</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.space + row.theme">
            <td>{{ row.space }}</td>
            <td>{{ row.theme }}</td>
            <td>{{ row.budget }}</td>
            <td><span class="badge">{{ row.status }}</span></td>
            <td>
              <button class="btn btn-secondary" @click="openRow(row)">预览</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div v-if="showRowModal" class="modal-backdrop" @click.self="closeModals">
    <div class="modal">
      <header>
        <span>摘要详情</span>
        <button class="btn btn-secondary" @click="closeModals">关闭</button>
      </header>
      <div class="body">
        <p>{{ activeRow.space }} · {{ activeRow.theme }}</p>
        <p>预算：{{ activeRow.budget }}</p>
        <p>状态：{{ activeRow.status }}</p>
      </div>
      <footer>
        <button class="btn btn-primary" @click="closeModals">完成</button>
      </footer>
    </div>
  </div>

  <div v-if="showProgress" class="modal-backdrop" @click.self="closeModals">
    <div class="modal">
      <header>
        <span>生成报告</span>
        <button class="btn btn-secondary" @click="closeModals">关闭</button>
      </header>
      <div class="body">
        <p>正在合并模块数据，准备生成 PDF。</p>
        <div class="progress-bar"><span :style="{ width: progress + '%' }"></span></div>
      </div>
      <footer>
        <button class="btn btn-primary" @click="closeModals">完成</button>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const chartData = reactive([
  { label: '客厅', value: 24, gradient: 'linear-gradient(90deg,#f6d365,#fda085)' },
  { label: '卧室', value: 18, gradient: 'linear-gradient(90deg,#a1c4fd,#c2e9fb)' },
  { label: '书房', value: 15, gradient: 'linear-gradient(90deg,#a8edea,#fed6e3)' },
  { label: '儿童房', value: 12, gradient: 'linear-gradient(90deg,#84fab0,#8fd3f4)' },
  { label: '餐厅', value: 10, gradient: 'linear-gradient(90deg,#fbd786,#f7797d)' }
]);

const rows = reactive([
  { space: '客厅', theme: '晨光暖橙', budget: '26w', status: '已完成' },
  { space: '卧室', theme: '星云紫', budget: '12w', status: '交付中' },
  { space: '书房', theme: '松露绿光', budget: '9w', status: '调整中' },
  { space: '餐厅', theme: '麦田风', budget: '10w', status: '已确认' },
  { space: '厨房', theme: '极地光', budget: '14w', status: '建模中' },
  { space: '阳台', theme: '水岸蓝', budget: '5w', status: '排产中' },
  { space: '玄关', theme: '星云紫', budget: '4w', status: '已确认' },
  { space: '儿童房', theme: '森林调', budget: '11w', status: '调整中' },
  { space: '卫浴', theme: '海雾灰', budget: '7w', status: '交付中' },
  { space: '影音室', theme: '暮霭粉', budget: '18w', status: '已完成' }
]);

const showProgress = ref(false);
const showRowModal = ref(false);
const activeRow = reactive({});
const progress = ref(20);

const generateReport = () => {
  progress.value = 15;
  showProgress.value = true;
  const loop = setInterval(() => {
    progress.value += 18;
    if (progress.value >= 100) clearInterval(loop);
  }, 420);
};

const openRow = (row) => {
  Object.assign(activeRow, row);
  showRowModal.value = true;
};

const closeModals = () => {
  showProgress.value = false;
  showRowModal.value = false;
};
</script>

<style scoped>
.section {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-wrap {
  padding: 6px;
}

.chart {
  display: grid;
  gap: 10px;
  background: #f8fafc;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

.chart .bar {
  color: #0f172a;
  font-weight: 700;
  padding: 10px;
  border-radius: 12px;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.5);
}
</style>
