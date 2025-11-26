<template>
  <div class="grid" style="grid-template-columns: 1.2fr 1fr; align-items: start">
    <div class="card">
      <div class="section-head">
        <div>
          <p class="eyebrow">专题地图</p>
          <h3>综合可视化与空间分析</h3>
        </div>
        <button class="action-btn" @click="showMap = true">空间分析</button>
      </div>
      <div class="map-panel">
        <div class="map-placeholder">专题地图载入中</div>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>指标</th>
            <th>值</th>
            <th>趋势</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="metric in metrics" :key="metric.name">
            <td>{{ metric.name }}</td>
            <td>{{ metric.value }}</td>
            <td>
              <div class="chart-bar" :style="{ width: metric.trend + '%' }"></div>
              <small>{{ metric.trend }}%</small>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="card">
      <div class="section-head">
        <div>
          <p class="eyebrow">看板</p>
          <h3>指标看板与趋势分析</h3>
        </div>
        <button class="action-btn secondary" @click="showDashboard = true">自定义</button>
      </div>
      <ul class="ledger">
        <li v-for="item in dashboard" :key="item.title">
          <div>
            <strong>{{ item.title }}</strong>
            <p class="muted">{{ item.desc }}</p>
            <div class="progress-track">
              <div class="progress-bar" :style="{ width: item.rate + '%' }"></div>
            </div>
          </div>
          <span class="badge info">{{ item.rate }}%</span>
        </li>
      </ul>
    </div>

    <div class="card" style="grid-column: 1 / span 2">
      <div class="section-head">
        <div>
          <p class="eyebrow">成果输出</p>
          <h3>评估报告与地块卡片</h3>
        </div>
        <button class="action-btn" @click="showReport = true">生成报告</button>
      </div>
      <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(240px, 1fr))">
        <div v-for="card in parcelCards" :key="card.name" class="card" style="border: 1px dashed var(--border)">
          <p class="muted">{{ card.code }}</p>
          <h4 style="margin: 4px 0">{{ card.name }}</h4>
          <p>{{ card.highlight }}</p>
          <span class="badge" :class="card.tag">潜力 {{ card.score }}</span>
        </div>
      </div>
    </div>

    <div v-if="showMap" class="modal-mask" @click.self="showMap = false">
      <div class="modal-container">
        <div class="modal-header">
          <h3>空间分析</h3>
          <button class="action-btn secondary" @click="showMap = false">关闭</button>
        </div>
        <label>叠加专题<select><option>土地效率</option><option>产业绩效</option><option>交通便捷度</option></select></label>
        <div class="progress-track">
          <div class="progress-bar" :style="{ width: '55%' }"></div>
        </div>
        <p class="muted">正在生成空间叠加结果…</p>
      </div>
    </div>

    <div v-if="showDashboard" class="modal-mask" @click.self="showDashboard = false">
      <div class="modal-container">
        <div class="modal-header">
          <h3>自定义看板</h3>
          <button class="action-btn secondary" @click="showDashboard = false">关闭</button>
        </div>
        <div class="form-row">
          <label>指标类型<select><option>产出强度</option><option>就业密度</option><option>能耗强度</option></select></label>
          <label>时间范围<select><option>近 12 个月</option><option>近 3 年</option></select></label>
        </div>
        <button class="action-btn" style="margin-top: 12px">应用</button>
      </div>
    </div>

    <div v-if="showReport" class="modal-mask" @click.self="showReport = false">
      <div class="modal-container">
        <div class="modal-header">
          <h3>生成评估报告</h3>
          <button class="action-btn secondary" @click="showReport = false">关闭</button>
        </div>
        <div class="form-row">
          <label>输出格式<select><option>PDF</option><option>Word</option></select></label>
          <label>包含附件<select><option>地图截图</option><option>数据明细</option></select></label>
        </div>
        <div class="progress-track">
          <div class="progress-bar" :style="{ width: '78%' }"></div>
        </div>
        <p class="muted">正在生成，预计 5 秒</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const showMap = ref(false);
const showDashboard = ref(false);
const showReport = ref(false);

const metrics = ref([
  { name: '土地效率提升', value: '8.6%', trend: 74 },
  { name: '产业能耗下降', value: '12%', trend: 62 },
  { name: '公共设施覆盖', value: '92%', trend: 84 },
  { name: '绿色出行占比', value: '68%', trend: 57 },
  { name: '财政平衡率', value: '108%', trend: 71 },
]);

const dashboard = ref([
  { title: '年度投资完成', desc: '完成 43.2 亿，占年度计划 68%', rate: 68 },
  { title: '搬迁签约进度', desc: '累计签约 3120 户', rate: 62 },
  { title: '施工安全', desc: '零重大安全事故', rate: 95 },
  { title: '公众满意度', desc: '线上问卷满意度 87%', rate: 87 },
]);

const parcelCards = ref([
  { code: 'PD-001', name: '科创智谷', highlight: '科创+居住混合街区', score: 86, tag: 'success' },
  { code: 'PD-002', name: '机场北物流', highlight: '空铁联运枢纽升级', score: 74, tag: 'info' },
  { code: 'PD-003', name: '老港工业园', highlight: '腾笼换鸟、产城融合', score: 68, tag: 'warning' },
  { code: 'PD-004', name: '南湾居住片', highlight: '社区完善+保障房', score: 79, tag: 'success' },
]);
</script>

<style scoped>
.section-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.ledger {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 12px;
}

.ledger li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid var(--border);
  padding: 12px;
  border-radius: 10px;
}

.map-panel {
  background: linear-gradient(145deg, #e8f3ff, #f8fbff);
  border-radius: 12px;
  border: 1px dashed var(--border);
  padding: 14px;
  margin: 14px 0;
}

.map-placeholder {
  height: 180px;
  background: repeating-linear-gradient(
    135deg,
    rgba(46, 139, 255, 0.2),
    rgba(46, 139, 255, 0.2) 10px,
    rgba(255, 255, 255, 0.6) 10px,
    rgba(255, 255, 255, 0.6) 20px
  );
  border-radius: 10px;
  display: grid;
  place-items: center;
  color: #2e8bff;
  font-weight: 700;
}
</style>
