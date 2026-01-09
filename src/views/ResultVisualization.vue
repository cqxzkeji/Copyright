<template>
  <section class="card">
    <div class="section-header">
      <div>
        <h3>可视化展示与成果输出</h3>
        <p>地图、图表与报告形式展示评估与决策结果。</p>
      </div>
      <div class="section-actions">
        <button class="btn btn-outline" @click="openLegend">地图图例</button>
        <button class="btn btn-primary" @click="openExport">成果输出</button>
      </div>
    </div>
    <div class="map-panel">
      <div class="map-overlay">
        <h4>更新决策热力图</h4>
        <p>颜色越深表示更新优先级越高。</p>
        <button class="btn btn-outline" @click="openLayer">图层管理</button>
      </div>
    </div>
  </section>

  <section class="flex" style="margin-top: 20px;">
    <div class="card" style="flex: 1;">
      <div class="section-header">
        <div>
          <h3>更新成果统计</h3>
          <p>年度更新成果与结构占比</p>
        </div>
        <button class="btn btn-outline" @click="openReport">生成图表</button>
      </div>
      <div class="chart-grid">
        <div v-for="item in chartData" :key="item.label" class="chart-card">
          <div class="circle" :style="{ background: item.color }">{{ item.value }}%</div>
          <p>{{ item.label }}</p>
        </div>
      </div>
    </div>
    <div class="card" style="flex: 0.9;">
      <div class="section-header">
        <div>
          <h3>报告输出进度</h3>
          <p>成果自动归档</p>
        </div>
        <button class="btn btn-primary" @click="openProgress">查看进度</button>
      </div>
      <ul class="report-list">
        <li v-for="report in reportList" :key="report.name">
          <span>{{ report.name }}</span>
          <span class="tag">{{ report.status }}</span>
        </li>
      </ul>
    </div>
  </section>

  <section class="card" style="margin-top: 20px;">
    <div class="section-header">
      <div>
        <h3>成果清单</h3>
        <p>共 {{ tableData.length }} 条成果记录</p>
      </div>
      <button class="btn btn-outline" @click="openArchive">成果归档</button>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th>编号</th>
          <th>成果类型</th>
          <th>覆盖区域</th>
          <th>生成时间</th>
          <th>负责人</th>
          <th>状态</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in tableData" :key="row.id">
          <td>{{ row.id }}</td>
          <td>{{ row.type }}</td>
          <td>{{ row.area }}</td>
          <td>{{ row.time }}</td>
          <td>{{ row.owner }}</td>
          <td>{{ row.status }}</td>
        </tr>
      </tbody>
    </table>
  </section>

  <BaseModal v-model="legendVisible" title="地图图例">
    <ul class="legend">
      <li><span class="legend-color high"></span>高优先级更新单元</li>
      <li><span class="legend-color mid"></span>重点提升单元</li>
      <li><span class="legend-color low"></span>常规更新单元</li>
    </ul>
  </BaseModal>

  <BaseModal v-model="exportVisible" title="成果输出">
    <label>
      输出类型
      <select class="select">
        <option>地图截图 + 报告</option>
        <option>统计图表</option>
        <option>专题图集</option>
      </select>
    </label>
    <label>
      输出格式
      <select class="select">
        <option>PDF</option>
        <option>PPT</option>
        <option>PNG</option>
      </select>
    </label>
  </BaseModal>

  <BaseModal v-model="layerVisible" title="图层管理">
    <label>
      <input type="checkbox" checked /> 更新优先级
    </label>
    <label>
      <input type="checkbox" checked /> 产业布局
    </label>
    <label>
      <input type="checkbox" /> 交通可达性
    </label>
  </BaseModal>

  <BaseModal v-model="reportVisible" title="生成图表">
    <p>系统将生成年度成果统计图表并自动插入报告。</p>
  </BaseModal>

  <BaseModal v-model="progressVisible" title="成果输出进度">
    <div class="progress">
      <div class="progress-bar" style="width: 64%;"></div>
    </div>
    <p class="muted">当前输出 64%</p>
  </BaseModal>

  <BaseModal v-model="archiveVisible" title="成果归档">
    <label>
      归档批次
      <select class="select">
        <option>2024 年度</option>
        <option>2024 上半年</option>
        <option>2024 下半年</option>
      </select>
    </label>
    <p>归档完成后将同步至知识库与审计系统。</p>
  </BaseModal>
</template>

<script setup>
import { ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const chartData = [
  { label: '已更新面积', value: 62, color: '#2f80ed' },
  { label: '产业升级率', value: 48, color: '#3dd598' },
  { label: '公共服务提升', value: 35, color: '#f2994a' },
  { label: '生态修复比例', value: 28, color: '#6fcf97' }
];

const reportList = [
  { name: '更新成果图集', status: '生成中' },
  { name: '更新决策报告', status: '待复核' },
  { name: '专题统计图表', status: '已完成' },
  { name: '更新绩效评估', status: '已归档' }
];

const tableData = Array.from({ length: 21 }).map((_, index) => ({
  id: index + 1,
  type: ['更新成果报告', '专题地图', '统计图表'][index % 3],
  area: ['中心城区', '产业新区', '滨水片区'][index % 3],
  time: `2024-${(index % 12) + 1}-15`,
  owner: ['张工', '李工', '王工'][index % 3],
  status: ['已完成', '审核中', '待归档'][index % 3]
}));

const legendVisible = ref(false);
const exportVisible = ref(false);
const layerVisible = ref(false);
const reportVisible = ref(false);
const progressVisible = ref(false);
const archiveVisible = ref(false);

const openLegend = () => {
  legendVisible.value = true;
};

const openExport = () => {
  exportVisible.value = true;
};

const openLayer = () => {
  layerVisible.value = true;
};

const openReport = () => {
  reportVisible.value = true;
};

const openProgress = () => {
  progressVisible.value = true;
};

const openArchive = () => {
  archiveVisible.value = true;
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

.map-panel {
  height: 320px;
  border-radius: 16px;
  background: radial-gradient(circle at 20% 20%, rgba(47, 128, 237, 0.35), transparent 50%),
    radial-gradient(circle at 70% 30%, rgba(61, 213, 152, 0.35), transparent 50%),
    radial-gradient(circle at 40% 70%, rgba(242, 153, 74, 0.35), transparent 50%),
    #eef2ff;
  position: relative;
  overflow: hidden;
}

.map-overlay {
  position: absolute;
  left: 24px;
  bottom: 24px;
  background: rgba(255, 255, 255, 0.9);
  padding: 16px;
  border-radius: 12px;
  box-shadow: var(--shadow);
}

.chart-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 16px;
}

.chart-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.circle {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: #fff;
  font-weight: 700;
}

.report-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.report-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.legend {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.legend-color {
  display: inline-block;
  width: 14px;
  height: 14px;
  border-radius: 4px;
  margin-right: 8px;
}

.legend-color.high {
  background: #2f80ed;
}

.legend-color.mid {
  background: #3dd598;
}

.legend-color.low {
  background: #f2994a;
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
