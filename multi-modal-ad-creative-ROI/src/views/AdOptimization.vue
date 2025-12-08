<template>
  <div class="card" style="margin-bottom: 1rem;">
    <div style="display: flex; justify-content: space-between; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
      <div>
        <h3 style="margin: 0;">优化控制台</h3>
        <p class="helper-text" style="margin: 0.2rem 0 0;">针对当前投放批次进行调优与推荐，按钮均弹出模态窗口</p>
      </div>
      <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
        <button class="primary-btn" @click="showStart = true">启动优化</button>
        <button class="secondary-btn" @click="showRecommend = true">推荐方案</button>
        <button class="secondary-btn" @click="showPause = true">批量暂停</button>
      </div>
    </div>
  </div>

  <div class="card">
    <div style="display: flex; justify-content: space-between; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
      <div>
        <h3 style="margin: 0;">投放批次</h3>
        <p class="helper-text" style="margin: 0.25rem 0 0;">10+ 条计划，支持个性化操作</p>
      </div>
      <button class="secondary-btn" @click="showBudget = true">预算分配</button>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th>计划名称</th>
          <th>渠道</th>
          <th>预算</th>
          <th>出价</th>
          <th>目标</th>
          <th>状态</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="plan in plans" :key="plan.name">
          <td>{{ plan.name }}</td>
          <td>{{ plan.channel }}</td>
          <td>¥{{ plan.budget }}</td>
          <td>¥{{ plan.bid }}</td>
          <td>{{ plan.goal }}</td>
          <td><span class="tag">{{ plan.status }}</span></td>
          <td class="table-actions">
            <button class="secondary-btn" @click="openPlanModal(plan)">详情</button>
            <button class="secondary-btn" @click="openHint(plan)">提示</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <ModalDialog v-if="showStart" title="启动优化" subtitle="表单弹窗" @close="showStart = false">
    <div class="form-grid">
      <label>
        <span class="helper-text">优化目标</span>
        <select class="input" v-model="startForm.goal">
          <option>CTR 提升</option>
          <option>CVR 提升</option>
          <option>CPA 降低</option>
        </select>
      </label>
      <label>
        <span class="helper-text">实验比例</span>
        <input class="input" type="number" min="5" max="50" v-model="startForm.ratio" />
      </label>
      <label>
        <span class="helper-text">持续时间 (天)</span>
        <input class="input" type="number" min="1" v-model="startForm.days" />
      </label>
    </div>
    <template #footer>
      <button class="secondary-btn" @click="showStart = false">取消</button>
      <button class="primary-btn" @click="startOptimization">开始优化</button>
    </template>
  </ModalDialog>

  <ModalDialog v-if="showRecommend" title="推荐方案" subtitle="提示信息弹窗" @close="showRecommend = false">
    <div class="grid">
      <div v-for="(tip, idx) in recommendations" :key="idx" class="card" style="box-shadow: none; border: 1px solid #e2e8f0;">
        <strong>{{ tip.title }}</strong>
        <p class="helper-text" style="margin: 0.35rem 0 0;">{{ tip.desc }}</p>
      </div>
    </div>
  </ModalDialog>

  <ModalDialog v-if="showPause" title="批量暂停" subtitle="提示信息弹窗" @close="showPause = false">
    <p class="helper-text">选择需要暂停的计划，暂停动作将实时同步到投放平台。</p>
    <div class="chip-row">
      <label v-for="plan in plans.slice(0, 6)" :key="plan.name" style="display: flex; align-items: center; gap: 0.4rem;">
        <input type="checkbox" v-model="plan.selected" />
        <span class="badge">{{ plan.name }}</span>
      </label>
    </div>
    <template #footer>
      <button class="secondary-btn" @click="showPause = false">取消</button>
      <button class="primary-btn" @click="confirmPause">确认暂停</button>
    </template>
  </ModalDialog>

  <ModalDialog v-if="showBudget" title="预算分配" subtitle="表单弹窗" @close="showBudget = false">
    <p class="helper-text">按照 ROI 排名自动分配预算，您也可以手动调整。</p>
    <div class="form-grid">
      <label v-for="plan in plans.slice(0, 4)" :key="plan.name">
        <span class="helper-text">{{ plan.name }}</span>
        <input class="input" type="number" v-model="plan.budget" />
      </label>
    </div>
    <template #footer>
      <button class="secondary-btn" @click="showBudget = false">取消</button>
      <button class="primary-btn" @click="showBudget = false">保存</button>
    </template>
  </ModalDialog>

  <ModalDialog v-if="showPlan" :title="currentPlan?.name" subtitle="计划详情" @close="showPlan = false">
    <p class="helper-text">渠道：{{ currentPlan?.channel }} · 目标：{{ currentPlan?.goal }}</p>
    <div class="progress-shell" style="margin: 0.5rem 0;">
      <div class="progress-inner" :style="{ width: currentPlan?.health + '%' }"></div>
    </div>
    <p class="helper-text">计划健康度 {{ currentPlan?.health }}%，建议保持 24 小时观察。</p>
  </ModalDialog>

  <ModalDialog v-if="showHint" title="操作提示" subtitle="按钮提示信息弹窗" @close="showHint = false">
    <p class="helper-text">{{ hintText }}</p>
  </ModalDialog>

  <ModalDialog v-if="showProgress" title="优化中" subtitle="进度条弹窗" @close="showProgress = false">
    <p class="helper-text">优化实验正在执行，预计 3 分钟完成资源分配。</p>
    <div class="progress-shell" style="margin-top: 0.5rem;">
      <div class="progress-inner" :style="{ width: progress + '%' }"></div>
    </div>
  </ModalDialog>
</template>

<script setup>
import { reactive, ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const showStart = ref(false);
const showRecommend = ref(false);
const showPause = ref(false);
const showBudget = ref(false);
const showPlan = ref(false);
const showHint = ref(false);
const showProgress = ref(false);
const hintText = ref('');
const currentPlan = ref(null);
const progress = ref(40);

const startForm = reactive({ goal: 'CTR 提升', ratio: 15, days: 7 });
const recommendations = reactive([
  { title: '减少高频曝光人群', desc: '通过冷启动人群扩量，降低频控带来的疲劳度。' },
  { title: '测试 3 套新素材', desc: '结合高转化文案自动生成 3 套多模态创意，并分配 30% 流量。' },
  { title: '优化落地页加载', desc: '将落地页首屏资源压缩 30%，预计停留时长提升 8%。' },
  { title: '提升高 ROI 计划预算', desc: '对 ROI>2 的计划增加 20% 日预算，并保持出价不变。' },
]);

const plans = reactive([
  { name: 'A 计划', channel: '信息流', budget: 15000, bid: 1.2, goal: '线索', status: '投放中', health: 82 },
  { name: 'B 计划', channel: '短视频', budget: 18000, bid: 1.1, goal: '成交', status: '投放中', health: 76 },
  { name: 'C 计划', channel: '搜索', budget: 12000, bid: 0.9, goal: '下载', status: '审核通过', health: 91 },
  { name: 'D 计划', channel: '展示', budget: 9000, bid: 0.8, goal: '曝光', status: '优化中', health: 64 },
  { name: 'E 计划', channel: 'OTT', budget: 6000, bid: 1.5, goal: '曝光', status: '投放中', health: 59 },
  { name: 'F 计划', channel: '联盟', budget: 7000, bid: 0.7, goal: '线索', status: '投放中', health: 71 },
  { name: 'G 计划', channel: 'KOL', budget: 11000, bid: 1.8, goal: '成交', status: '排期中', health: 80 },
  { name: 'H 计划', channel: '信息流', budget: 5000, bid: 0.65, goal: '线索', status: '投放中', health: 74 },
  { name: 'I 计划', channel: '短视频', budget: 10500, bid: 1.05, goal: '成交', status: '优化中', health: 69 },
  { name: 'J 计划', channel: '展示', budget: 4800, bid: 0.6, goal: '曝光', status: '投放中', health: 66 },
  { name: 'K 计划', channel: '搜索', budget: 16000, bid: 1.0, goal: '下载', status: '审核通过', health: 88 },
]);

const startOptimization = () => {
  showStart.value = false;
  showProgress.value = true;
  progress.value = 25;
  setTimeout(() => (progress.value = 55), 200);
  setTimeout(() => (progress.value = 100), 400);
};

const confirmPause = () => {
  showPause.value = false;
  hintText.value = '暂停指令已发送，预计 10 秒内完成同步。';
  showHint.value = true;
};

const openPlanModal = (plan) => {
  currentPlan.value = plan;
  showPlan.value = true;
};

const openHint = (plan) => {
  hintText.value = `${plan.name} 已接入智能出价策略，今日 ROI 预估提升 12%。`;
  showHint.value = true;
};
</script>
