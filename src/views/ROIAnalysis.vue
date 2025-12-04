<template>
  <div class="card">
    <h2>ROI 明细</h2>
    <p class="muted">按渠道拆分的投入与回收（10条以上）</p>
    <table class="table">
      <thead>
        <tr>
          <th>渠道</th>
          <th>消耗</th>
          <th>收入</th>
          <th>ROI</th>
          <th>建议</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in roiRows" :key="row.channel">
          <td>{{ row.channel }}</td>
          <td>{{ row.cost }}</td>
          <td>{{ row.revenue }}</td>
          <td>{{ row.roi }}</td>
          <td>{{ row.suggestion }}</td>
        </tr>
      </tbody>
    </table>
    <div class="btn-row">
      <button class="btn" @click="showBudget = true">添加预算测试</button>
      <button class="btn secondary" @click="startCalc">计算 ROI</button>
      <button class="btn danger" @click="showTips = true">查看建议</button>
    </div>
  </div>

  <div class="grid-2">
    <div class="card">
      <h2>投产比分布</h2>
      <div v-for="item in roiChart" :key="item.label" class="chart-row">
        <span>{{ item.label }}</span>
        <div class="chart-bar" :style="{ width: item.value + '%' }"></div>
        <strong>{{ item.value }}%</strong>
      </div>
    </div>
    <div class="card">
      <h2>分段收益</h2>
      <div v-for="gain in gains" :key="gain.stage" class="chart-row">
        <span>{{ gain.stage }}</span>
        <div class="chart-bar" :style="{ width: gain.value + '%' }"></div>
        <strong>{{ gain.value }}%</strong>
      </div>
    </div>
  </div>

  <ModalDialog title="预算测试" v-model="showBudget">
    <form class="login-form" @submit.prevent="submitBudget">
      <label>渠道</label>
      <input v-model="budget.channel" placeholder="如：抖音" required />
      <label>计划投放</label>
      <input v-model="budget.amount" placeholder="如：￥30,000" />
      <div class="modal-footer">
        <button type="button" class="btn secondary" @click="showBudget = false">取消</button>
        <button type="submit" class="btn">提交</button>
      </div>
    </form>
  </ModalDialog>

  <ModalDialog title="ROI 计算" v-model="calculating">
    <p>正在根据分渠道数据计算投产比。</p>
    <div class="progress-bar">
      <div class="progress" :style="{ width: calcProgress + '%' }"></div>
    </div>
    <div class="modal-footer">
      <button class="btn" :disabled="calcProgress < 100" @click="calculating = false">完成</button>
    </div>
  </ModalDialog>

  <ModalDialog title="优化建议" v-model="showTips">
    <p>优先提升 ROI &gt; 400% 的渠道预算占比，并下线 ROI &lt; 100% 的低效组合。</p>
    <div class="modal-footer">
      <button class="btn" @click="showTips = false">关闭</button>
    </div>
  </ModalDialog>
</template>

<script setup>
import { ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const roiRows = [
  { channel: '抖音', cost: '￥35,000', revenue: '￥210,000', roi: '600%', suggestion: '继续放量' },
  { channel: '快手', cost: '￥22,000', revenue: '￥90,000', roi: '309%', suggestion: '稳步增长' },
  { channel: '信息流', cost: '￥48,000', revenue: '￥180,000', roi: '375%', suggestion: '保持' },
  { channel: '朋友圈', cost: '￥20,000', revenue: '￥52,000', roi: '160%', suggestion: '降低预算' },
  { channel: '知乎', cost: '￥18,000', revenue: '￥84,000', roi: '466%', suggestion: '增加预算' },
  { channel: '小红书', cost: '￥28,000', revenue: '￥120,000', roi: '428%', suggestion: '保持' },
  { channel: 'B站', cost: '￥12,000', revenue: '￥30,000', roi: '250%', suggestion: '优化素材' },
  { channel: '微博', cost: '￥15,000', revenue: '￥36,000', roi: '240%', suggestion: '降低出价' },
  { channel: '搜索广告', cost: '￥25,000', revenue: '￥150,000', roi: '600%', suggestion: '强势投放' },
  { channel: '短信', cost: '￥6,000', revenue: '￥12,000', roi: '200%', suggestion: '精准触达' },
  { channel: '联盟', cost: '￥8,000', revenue: '￥10,000', roi: '125%', suggestion: '更换渠道' }
];

const roiChart = [
  { label: 'ROI &gt; 500%', value: 36 },
  { label: 'ROI 300%-500%', value: 28 },
  { label: 'ROI 150%-300%', value: 22 },
  { label: 'ROI &lt; 150%', value: 14 }
];

const gains = [
  { stage: '冷启动', value: 12 },
  { stage: '初步验证', value: 24 },
  { stage: '高效期', value: 48 },
  { stage: '稳定期', value: 16 }
];

const showBudget = ref(false);
const calculating = ref(false);
const showTips = ref(false);
const calcProgress = ref(0);
const budget = ref({ channel: '', amount: '' });
let calcTimer;

const submitBudget = () => {
  showBudget.value = false;
};

const startCalc = () => {
  calculating.value = true;
  calcProgress.value = 0;
  clearInterval(calcTimer);
  calcTimer = setInterval(() => {
    if (calcProgress.value >= 100) {
      clearInterval(calcTimer);
      return;
    }
    calcProgress.value += 18;
  }, 350);
};
</script>
