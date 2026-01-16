<template>
  <section class="card">
    <div class="card-header">
      <div>
        <div class="card-title">数据分析与决策支持</div>
        <div style="color: var(--muted); font-size: 13px;">生产数据汇总分析、产量预测与决策建议。</div>
      </div>
      <div style="display: flex; gap: 12px; flex-wrap: wrap;">
        <button class="button-secondary" type="button" @click="showScenarioModal = true">风险模拟</button>
        <button class="button-secondary" type="button" @click="showForecastModal = true">产量预测</button>
        <button class="button-secondary" type="button" @click="startReport">生成报告</button>
        <button class="button-primary" type="button" @click="showInsightModal = true">查看分析要点</button>
      </div>
    </div>
    <div class="grid-3">
      <div class="card" style="box-shadow: none; border: 1px solid var(--border);">
        <div style="color: var(--muted); font-size: 13px;">综合评分</div>
        <div style="font-size: 26px; font-weight: 700;">87 分</div>
        <div style="color: var(--accent); font-size: 13px;">健康度提升 6%</div>
      </div>
      <div class="card" style="box-shadow: none; border: 1px solid var(--border);">
        <div style="color: var(--muted); font-size: 13px;">预测总产量</div>
        <div style="font-size: 26px; font-weight: 700;">52.4 吨</div>
        <div style="color: var(--accent); font-size: 13px;">达成目标 96%</div>
      </div>
      <div class="card" style="box-shadow: none; border: 1px solid var(--border);">
        <div style="color: var(--muted); font-size: 13px;">潜在风险</div>
        <div style="font-size: 26px; font-weight: 700;">3 项</div>
        <div style="color: #f97316; font-size: 13px;">重点关注虫害</div>
      </div>
    </div>
  </section>

  <section class="card">
    <div class="card-header">
      <div class="card-title">数据分析趋势</div>
      <span class="chip">预测收益 / 风险指数 / 资源利用率</span>
    </div>
    <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 20px;">
      <svg viewBox="0 0 600 220" style="width: 100%; height: 220px;">
        <rect x="20" y="80" width="60" height="120" fill="#1f8fdd" opacity="0.35" />
        <rect x="110" y="60" width="60" height="140" fill="#1f8fdd" opacity="0.45" />
        <rect x="200" y="45" width="60" height="155" fill="#1f8fdd" opacity="0.55" />
        <rect x="290" y="30" width="60" height="170" fill="#1f8fdd" opacity="0.65" />
        <rect x="380" y="40" width="60" height="160" fill="#1f8fdd" opacity="0.75" />
        <rect x="470" y="55" width="60" height="145" fill="#1f8fdd" opacity="0.85" />
      </svg>
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <div class="card" style="box-shadow: none; border: 1px solid var(--border);">
          <div style="font-size: 14px; color: var(--muted);">收益指数</div>
          <div style="font-size: 22px; font-weight: 700;">88%</div>
        </div>
        <div class="card" style="box-shadow: none; border: 1px solid var(--border);">
          <div style="font-size: 14px; color: var(--muted);">资源利用率</div>
          <div style="font-size: 22px; font-weight: 700;">81%</div>
        </div>
        <div class="card" style="box-shadow: none; border: 1px solid var(--border);">
          <div style="font-size: 14px; color: var(--muted);">风险指数</div>
          <div style="font-size: 22px; font-weight: 700;">0.26</div>
        </div>
      </div>
    </div>
  </section>

  <section class="card">
    <div class="card-header">
      <div class="card-title">产量预测清单</div>
      <button class="button-ghost" type="button" @click="showTipModal = true">指标说明</button>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th>地块</th>
          <th>作物</th>
          <th>当前产量预估</th>
          <th>目标产量</th>
          <th>风险等级</th>
          <th>建议策略</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in forecastRows" :key="row.plot">
          <td>{{ row.plot }}</td>
          <td>{{ row.crop }}</td>
          <td>{{ row.current }}</td>
          <td>{{ row.target }}</td>
          <td><span class="chip">{{ row.risk }}</span></td>
          <td>{{ row.action }}</td>
        </tr>
      </tbody>
    </table>
  </section>

  <BaseModal
    :open="showForecastModal"
    title="产量预测模型"
    @close="showForecastModal = false"
    @confirm="confirmForecast"
  >
    <div class="form-grid">
      <div class="form-field">
        <label>预测周期</label>
        <select v-model="forecastForm.period">
          <option>未来 7 天</option>
          <option>未来 30 天</option>
          <option>本季度</option>
        </select>
      </div>
      <div class="form-field">
        <label>模型版本</label>
        <select v-model="forecastForm.model">
          <option>产量预测 V2</option>
          <option>产量预测 V3</option>
          <option>专家经验模型</option>
        </select>
      </div>
      <div class="form-field">
        <label>重点关注地块</label>
        <input v-model="forecastForm.plot" placeholder="例如：温室 B 区" />
      </div>
      <div class="form-field">
        <label>备注</label>
        <input v-model="forecastForm.note" placeholder="补充说明" />
      </div>
    </div>
  </BaseModal>

  <BaseModal
    :open="showScenarioModal"
    title="风险模拟配置"
    @close="showScenarioModal = false"
    @confirm="confirmScenario"
  >
    <div class="form-grid">
      <div class="form-field">
        <label>模拟类型</label>
        <select v-model="scenarioForm.type">
          <option>极端降雨</option>
          <option>病虫害</option>
          <option>高温干旱</option>
        </select>
      </div>
      <div class="form-field">
        <label>影响等级</label>
        <select v-model="scenarioForm.level">
          <option>低</option>
          <option>中</option>
          <option>高</option>
        </select>
      </div>
      <div class="form-field">
        <label>模拟范围</label>
        <input v-model="scenarioForm.range" placeholder="例如：南区 1-3 号地" />
      </div>
      <div class="form-field">
        <label>联动措施</label>
        <input v-model="scenarioForm.action" placeholder="例如：提前调度排涝" />
      </div>
    </div>
  </BaseModal>

  <BaseModal
    :open="showReportModal"
    title="生成报告"
    @close="closeReport"
    @confirm="closeReport"
  >
    <p>报告正在生成，预计 20 秒完成。</p>
    <div class="progress-bar">
      <span :style="{ width: reportProgress + '%' }"></span>
    </div>
    <div style="color: var(--muted); font-size: 13px;">{{ reportProgress }}% 已完成</div>
  </BaseModal>

  <BaseModal
    :open="showInsightModal"
    title="分析要点"
    @close="showInsightModal = false"
    @confirm="showInsightModal = false"
  >
    <ul style="line-height: 1.8; color: var(--muted);">
      <li>建议在南区增加两次滴灌以缓解蒸散影响。</li>
      <li>温室 B 区光照略低，可调整补光时长。</li>
      <li>西区玉米可能受虫害影响，需提前喷施生物防治。</li>
    </ul>
  </BaseModal>

  <BaseModal
    :open="showTipModal"
    title="指标说明"
    @close="showTipModal = false"
    @confirm="showTipModal = false"
  >
    <p style="color: var(--muted); line-height: 1.6;">
      产量预测基于近 30 天环境数据与历史产量模型计算，风险等级分为低、中、高。
    </p>
  </BaseModal>
</template>

<script setup>
import { onBeforeUnmount, reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const forecastRows = Array.from({ length: 24 }, (_, index) => ({
  plot: `${['北区', '南区', '东区', '西区'][index % 4]} ${index % 6 + 1} 号地`,
  crop: ['水稻', '玉米', '番茄', '辣椒'][index % 4],
  current: `${42 + index % 6} 吨`,
  target: `${45 + index % 5} 吨`,
  risk: index % 5 === 0 ? '中' : '低',
  action: ['加强灌溉', '优化肥料', '提升光照'][index % 3]
}));

const showForecastModal = ref(false);
const showScenarioModal = ref(false);
const showReportModal = ref(false);
const showInsightModal = ref(false);
const showTipModal = ref(false);

const forecastForm = reactive({
  period: '未来 30 天',
  model: '产量预测 V3',
  plot: '',
  note: ''
});

const scenarioForm = reactive({
  type: '极端降雨',
  level: '中',
  range: '',
  action: ''
});

const reportProgress = ref(0);
let timer;

const startReport = () => {
  reportProgress.value = 0;
  showReportModal.value = true;
  if (timer) {
    clearInterval(timer);
  }
  timer = setInterval(() => {
    if (reportProgress.value < 100) {
      reportProgress.value += 12;
    } else {
      clearInterval(timer);
    }
  }, 260);
};

const closeReport = () => {
  showReportModal.value = false;
  reportProgress.value = 100;
};

const confirmForecast = () => {
  showForecastModal.value = false;
};

const confirmScenario = () => {
  showScenarioModal.value = false;
};

onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer);
  }
});
</script>
