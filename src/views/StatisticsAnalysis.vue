<template>
  <div class="grid" aria-label="数据统计分析与可视化">
    <div class="section-title">
      <h2>统计分析与可视化</h2>
      <div class="actions">
        <button @click="openTrend">刷新趋势</button>
        <button class="secondary" @click="showExport = true">导出报表</button>
        <button class="accent" @click="showInsight = true">查看洞察</button>
      </div>
    </div>

    <div class="responsive-grid">
      <div class="card">
        <h3>分期人群分布</h3>
        <div v-for="stage in stageDistribution" :key="stage.stage" class="chart-bar">
          <span style="width: 60px;">{{ stage.stage }}</span>
          <div class="bar-track">
            <div class="bar-fill" :style="{ width: stage.value + '%', background: '#0ea5e9' }"></div>
          </div>
          <span>{{ stage.value }}%</span>
        </div>
      </div>
      <div class="card">
        <h3>风险等级变化</h3>
        <div v-for="item in riskShift" :key="item.label" class="chart-bar">
          <span style="width: 80px;">{{ item.label }}</span>
          <div class="bar-track">
            <div class="bar-fill" :style="{ width: item.rate + '%', background: '#f59e0b' }"></div>
          </div>
          <span>{{ item.rate }}%</span>
        </div>
      </div>
      <div class="card">
        <h3>随访完成率</h3>
        <div v-for="item in followCompletion" :key="item.dept" class="chart-bar">
          <span style="width: 80px;">{{ item.dept }}</span>
          <div class="bar-track">
            <div class="bar-fill" :style="{ width: item.rate + '%', background: '#22c55e' }"></div>
          </div>
          <span>{{ item.rate }}%</span>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="section-title">
        <h3>趋势明细</h3>
        <button class="secondary" @click="showDetail = true">查看明细</button>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>月份</th>
            <th>新增患者</th>
            <th>高风险比例</th>
            <th>随访完成率</th>
            <th>平均eGFR</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in monthly" :key="row.month">
            <td>{{ row.month }}</td>
            <td>{{ row.newPatients }}</td>
            <td>{{ row.highRisk }}%</td>
            <td>{{ row.followRate }}%</td>
            <td>{{ row.egfr }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="trendModal" class="overlay" @click.self="trendModal = false">
      <div class="modal">
        <h3>趋势刷新</h3>
        <p>已根据最新随访记录重算趋势，预计本周高风险人群下降 2.3%。</p>
        <div class="actions" style="justify-content: flex-end;">
          <button @click="trendModal = false">好的</button>
        </div>
      </div>
    </div>

    <div v-if="showExport" class="overlay" @click.self="showExport = false">
      <div class="modal">
        <h3>导出统计报表</h3>
        <div class="form-grid">
          <label>时间范围<input type="month" /></label>
          <label>包含字段<select><option>全部指标</option><option>分期分布</option><option>风险等级</option><option>随访完成率</option></select></label>
        </div>
        <div class="progress-bar" style="margin: 10px 0;"><span :style="{ width: '55%', background: '#0ea5e9' }"></span></div>
        <small>生成进度</small>
        <div class="actions" style="justify-content: flex-end;">
          <button class="secondary" @click="showExport = false">下载CSV</button>
        </div>
      </div>
    </div>

    <div v-if="showInsight" class="overlay" @click.self="showInsight = false">
      <div class="modal">
        <h3>管理洞察</h3>
        <ul>
          <li>高风险人群集中在 55-70 岁，建议加强生活方式指导。</li>
          <li>阶段下降速率超过 5 ml/min 的患者需要提前干预。</li>
          <li>随访逾期率在节假日期间上升，需提前推送提醒。</li>
        </ul>
        <div class="actions" style="justify-content: flex-end;">
          <button @click="showInsight = false">关闭</button>
        </div>
      </div>
    </div>

    <div v-if="showDetail" class="overlay" @click.self="showDetail = false">
      <div class="modal">
        <h3>趋势明细</h3>
        <p>近 12 个月按风险等级的转移矩阵与随访完成率分段展示。</p>
        <ul>
          <li v-for="row in monthly" :key="row.month">{{ row.month }} - 高风险 {{ row.highRisk }}%，完成率 {{ row.followRate }}%</li>
        </ul>
        <div class="actions" style="justify-content: flex-end;">
          <button @click="showDetail = false">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const trendModal = ref(false);
const showExport = ref(false);
const showInsight = ref(false);
const showDetail = ref(false);

const stageDistribution = [
  { stage: 'G1', value: 28 },
  { stage: 'G2', value: 34 },
  { stage: 'G3', value: 22 },
  { stage: 'G4', value: 10 },
  { stage: 'G5', value: 6 }
];

const riskShift = [
  { label: '高→中', rate: 18 },
  { label: '中→低', rate: 24 },
  { label: '保持高风险', rate: 12 },
  { label: '保持中风险', rate: 30 },
  { label: '保持低风险', rate: 16 }
];

const followCompletion = [
  { dept: '肾内科', rate: 88 },
  { dept: '内分泌', rate: 76 },
  { dept: '心内科', rate: 69 },
  { dept: '全科', rate: 62 }
];

const monthly = [
  { month: '2023-07', newPatients: 85, highRisk: 18, followRate: 72, egfr: 82 },
  { month: '2023-08', newPatients: 91, highRisk: 19, followRate: 74, egfr: 81 },
  { month: '2023-09', newPatients: 95, highRisk: 20, followRate: 75, egfr: 80 },
  { month: '2023-10', newPatients: 102, highRisk: 21, followRate: 77, egfr: 79 },
  { month: '2023-11', newPatients: 98, highRisk: 22, followRate: 76, egfr: 79 },
  { month: '2023-12', newPatients: 110, highRisk: 23, followRate: 78, egfr: 78 },
  { month: '2024-01', newPatients: 120, highRisk: 24, followRate: 79, egfr: 78 },
  { month: '2024-02', newPatients: 105, highRisk: 22, followRate: 77, egfr: 79 },
  { month: '2024-03', newPatients: 125, highRisk: 21, followRate: 80, egfr: 80 },
  { month: '2024-04', newPatients: 130, highRisk: 20, followRate: 82, egfr: 82 },
  { month: '2024-05', newPatients: 118, highRisk: 19, followRate: 84, egfr: 83 },
  { month: '2024-06', newPatients: 122, highRisk: 18, followRate: 85, egfr: 84 }
];

const openTrend = () => {
  trendModal.value = true;
};
</script>
