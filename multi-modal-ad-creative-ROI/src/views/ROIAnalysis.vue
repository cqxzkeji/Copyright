<template>
  <div class="card" style="margin-bottom: 1rem;">
    <div style="display: flex; justify-content: space-between; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
      <div>
        <h3 style="margin: 0;">ROI 监控</h3>
        <p class="helper-text" style="margin: 0.25rem 0 0;">自动核算成本与回收，一键生成报告弹窗</p>
      </div>
      <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
        <button class="primary-btn" @click="showReport = true">生成报告</button>
        <button class="secondary-btn" @click="showForecast = true">趋势预测</button>
        <button class="secondary-btn" @click="showShare = true">分享链接</button>
      </div>
    </div>
  </div>

  <div class="card">
    <div style="display: flex; justify-content: space-between; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
      <div>
        <h3 style="margin: 0;">ROI 明细</h3>
        <p class="helper-text" style="margin: 0.25rem 0 0;">不少于 10 条的 ROI 数据表与可视化示意</p>
      </div>
      <button class="secondary-btn" @click="showSummary = true">总结弹窗</button>
    </div>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 0.75rem; margin: 1rem 0;">
      <div class="card" style="box-shadow: none; border: 1px solid #e2e8f0;" v-for="kpi in kpiCards" :key="kpi.title">
        <p class="helper-text" style="margin: 0;">{{ kpi.title }}</p>
        <h2 style="margin: 0.2rem 0 0;">{{ kpi.value }}</h2>
        <p class="helper-text">{{ kpi.desc }}</p>
      </div>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th>渠道</th>
          <th>投入 (¥)</th>
          <th>收入 (¥)</th>
          <th>ROI</th>
          <th>回收周期</th>
          <th>建议</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in roiRows" :key="row.channel">
          <td>{{ row.channel }}</td>
          <td>{{ row.cost.toLocaleString() }}</td>
          <td>{{ row.revenue.toLocaleString() }}</td>
          <td>{{ row.roi }}</td>
          <td>{{ row.payback }} 天</td>
          <td>{{ row.tip }}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <ModalDialog v-if="showReport" title="生成 ROI 报告" subtitle="表单弹窗" @close="showReport = false">
    <div class="form-grid">
      <label>
        <span class="helper-text">报告维度</span>
        <select class="input" v-model="reportForm.dimension">
          <option>渠道</option>
          <option>人群</option>
          <option>素材</option>
        </select>
      </label>
      <label>
        <span class="helper-text">时间范围</span>
        <select class="input" v-model="reportForm.range">
          <option>近 7 天</option>
          <option>近 30 天</option>
          <option>本季度</option>
        </select>
      </label>
      <label>
        <span class="helper-text">发送邮箱</span>
        <input class="input" v-model="reportForm.email" />
      </label>
    </div>
    <template #footer>
      <button class="secondary-btn" @click="showReport = false">取消</button>
      <button class="primary-btn" @click="startReport">生成中</button>
    </template>
  </ModalDialog>

  <ModalDialog v-if="showForecast" title="趋势预测" subtitle="提示信息弹窗" @close="showForecast = false">
    <p class="helper-text">基于过去 30 天表现预测，未来 ROI 将稳步上升 8%-12%。</p>
    <div class="progress-shell" style="margin-top: 0.5rem;">
      <div class="progress-inner" style="width: 78%;"></div>
    </div>
  </ModalDialog>

  <ModalDialog v-if="showShare" title="分享报告" subtitle="提示信息弹窗" @close="showShare = false">
    <p class="helper-text">已为本报告生成可视化链接，团队成员可一键查看。</p>
    <p class="badge" style="margin: 0.35rem 0;">https://roi.demo.link/report/2024Q2</p>
  </ModalDialog>

  <ModalDialog v-if="showSummary" title="结论摘要" subtitle="提示信息弹窗" @close="showSummary = false">
    <p class="helper-text">整体 ROI 2.6，搜索渠道贡献最大，信息流具有扩量潜力。</p>
    <ul class="helper-text" style="padding-left: 1.1rem; display: grid; gap: 0.25rem;">
      <li>保持搜索-品牌高曝光，ROI 4.1</li>
      <li>信息流-冷启动计划 ROI 1.8，可增加预算 25%</li>
      <li>展示渠道 ROI 0.9，需调整素材与定向</li>
    </ul>
  </ModalDialog>

  <ModalDialog v-if="showProgress" title="报告生成中" subtitle="进度条弹窗" @close="showProgress = false">
    <p class="helper-text">报告正在编排图表与结论，完成后将邮件通知。</p>
    <div class="progress-shell" style="margin-top: 0.5rem;">
      <div class="progress-inner" :style="{ width: reportProgress + '%' }"></div>
    </div>
  </ModalDialog>
</template>

<script setup>
import { reactive, ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const showReport = ref(false);
const showForecast = ref(false);
const showShare = ref(false);
const showSummary = ref(false);
const showProgress = ref(false);
const reportProgress = ref(35);

const reportForm = reactive({ dimension: '渠道', range: '近 7 天', email: 'cfo@company.com' });

const kpiCards = reactive([
  { title: '整体 ROI', value: '2.6', desc: '包含付费与自然流量的综合 ROI' },
  { title: '日均消耗', value: '¥68,200', desc: '环比 +6.2%，保持稳步扩量' },
  { title: '拉新成本', value: '¥46.5', desc: '对比上周降低 8.3%' },
  { title: '回收周期', value: '14 天', desc: '主要集中在搜索与短视频渠道' },
]);

const roiRows = reactive([
  { channel: '信息流-冷启动', cost: 168000, revenue: 295000, roi: 1.76, payback: 18, tip: '继续扩量，保持成本控制' },
  { channel: '信息流-复投', cost: 72000, revenue: 185000, roi: 2.57, payback: 12, tip: '提高频控阈值，冲刺爆量' },
  { channel: '短视频-达人', cost: 138000, revenue: 365000, roi: 2.64, payback: 13, tip: '保持达人组合，测试新脚本' },
  { channel: '短视频-素材池', cost: 112000, revenue: 310000, roi: 2.77, payback: 11, tip: '增加高点击文案覆盖' },
  { channel: '搜索-品牌', cost: 56000, revenue: 230000, roi: 4.11, payback: 7, tip: '维持高排名，承接品牌流量' },
  { channel: '搜索-通用', cost: 84000, revenue: 190000, roi: 2.26, payback: 15, tip: '优化长尾词，提升质量得分' },
  { channel: '展示-再营销', cost: 42000, revenue: 68000, roi: 1.62, payback: 20, tip: '更新创意素材，减少频次' },
  { channel: '展示-广泛', cost: 38000, revenue: 34000, roi: 0.89, payback: 26, tip: '暂停低 ROI 单元，重新定向' },
  { channel: 'OTT-客厅', cost: 33000, revenue: 52000, roi: 1.57, payback: 22, tip: '优化落地页交互，缩短加载' },
  { channel: '联盟-再营销', cost: 27000, revenue: 76000, roi: 2.81, payback: 10, tip: '保持频控，适当提高出价' },
  { channel: 'KOL-直播', cost: 62000, revenue: 198000, roi: 3.19, payback: 9, tip: '加大直播间导流，保持福利' },
]);

const startReport = () => {
  showReport.value = false;
  showProgress.value = true;
  reportProgress.value = 40;
  setTimeout(() => (reportProgress.value = 75), 200);
  setTimeout(() => (reportProgress.value = 100), 400);
};
</script>
