<template>
  <div class="grid" style="gap:16px;">
    <div class="section-header">
      <div>
        <h3 class="section-title">定制化引擎</h3>
        <p style="margin:0;color:var(--muted);">快速生成个性化方案与报价</p>
      </div>
      <div style="display:flex;gap:10px;flex-wrap:wrap;">
        <button class="primary" @click="openPlan">创建定制方案</button>
        <button class="ghost" @click="simulate">模拟性能计算</button>
      </div>
    </div>

    <div class="responsive-two">
      <div class="card">
        <h4 class="section-title" style="margin-bottom:6px;">方案列表</h4>
        <p style="margin-top:0;color:var(--muted);">聚焦热处理、机械性能及工艺路线</p>
        <table class="table">
          <thead>
            <tr>
              <th>方案名称</th>
              <th>客户</th>
              <th>核心指标</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in plans" :key="item.name">
              <td>{{ item.name }}</td>
              <td>{{ item.customer }}</td>
              <td>{{ item.metric }}</td>
              <td><span class="tag" :class="item.tag">{{ item.status }}</span></td>
              <td style="display:flex;gap:8px;flex-wrap:wrap;">
                <button class="ghost" @click="viewPlan(item)">查看</button>
                <button class="primary" @click="quote(item)">生成报价</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="card">
        <h4 class="section-title" style="margin-bottom:6px;">性能雷达图</h4>
        <svg viewBox="0 0 300 300" style="width:100%; height:260px;">
          <g transform="translate(150,150)">
            <polygon :points="polygonPoints" fill="rgba(37,99,235,0.2)" stroke="#2563eb" stroke-width="2" />
            <g v-for="(axis, idx) in axes" :key="axis.label">
              <line x1="0" y1="0" :x2="axis.x" :y2="axis.y" stroke="#e2e8f0" />
              <text :x="axis.x * 1.1" :y="axis.y * 1.1" text-anchor="middle" font-size="12">{{ axis.label }}</text>
            </g>
          </g>
        </svg>
        <p style="color:var(--muted);">数据来自最新热处理模拟</p>
      </div>
    </div>

    <ModalDialog :open="planModal" title="创建方案" @close="planModal = false">
      <div class="form-row">
        <div>
          <label>方案名称</label>
          <input v-model="planForm.name" placeholder="如：风电主轴高韧性方案" />
        </div>
        <div>
          <label>客户</label>
          <input v-model="planForm.customer" placeholder="客户名称" />
        </div>
      </div>
      <div class="form-row">
        <div>
          <label>核心指标</label>
          <input v-model="planForm.metric" placeholder="冲击功≥50J" />
        </div>
        <div>
          <label>状态</label>
          <select v-model="planForm.status">
            <option>设计中</option>
            <option>待验证</option>
            <option>已通过</option>
          </select>
        </div>
      </div>
      <button class="primary" @click="savePlan">保存方案</button>
    </ModalDialog>

    <ModalDialog :open="simulateModal" title="性能模拟" @close="simulateModal = false">
      <p style="margin:0 0 10px;">基于热处理-组织-性能模型快速计算中…</p>
      <div class="progress"><div class="bar" :style="{ width: simulateProgress + '%' }"></div></div>
      <p style="color:var(--muted);">{{ simulateText }}</p>
    </ModalDialog>

    <ModalDialog :open="!!current" :title="current?.name" @close="current = null">
      <p style="margin:0 0 8px;">客户：{{ current?.customer }} · 核心指标：{{ current?.metric }}</p>
      <p style="color:var(--muted); margin:0;">状态：{{ current?.status }}</p>
    </ModalDialog>

    <ModalDialog :open="quoteModal" title="方案报价" @close="quoteModal = false">
      <p style="margin:0 0 8px;">正在生成材料、热处理、加工的分项报价</p>
      <div class="progress"><div class="bar" :style="{ width: quoteProgress + '%' }"></div></div>
      <p style="color:var(--muted);">完成后自动推送给销售</p>
    </ModalDialog>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const plans = ref([
  { name: '风电主轴韧性提升', customer: '启明风电', metric: '冲击功 ≥ 50J', status: '设计中', tag: 'warning' },
  { name: '轨交齿轮耐磨', customer: '南方机车', metric: '硬度 58HRC', status: '待验证', tag: 'info' },
  { name: '矿山刀圈抗裂', customer: '锦程矿山', metric: '冲击功 ≥ 40J', status: '设计中', tag: 'warning' },
  { name: '燃机叶片耐蚀', customer: '华润燃机', metric: '高温持久 100h', status: '待验证', tag: 'info' },
  { name: '海工锚链强韧', customer: '中远海运', metric: '屈服强度 ≥ 750MPa', status: '设计中', tag: 'warning' },
  { name: '船轴低温韧性', customer: '星河船舶', metric: '冲击功 ≥ 60J', status: '已通过', tag: 'success' },
  { name: '输电塔高韧性', customer: '华电重工', metric: '冲击功 ≥ 45J', status: '设计中', tag: 'warning' },
  { name: '油气井口耐磨', customer: '科陆能源', metric: '硬度 32HRC', status: '待验证', tag: 'info' },
  { name: '工程机械主轴', customer: '北冶特材', metric: '冲击功 ≥ 38J', status: '设计中', tag: 'warning' },
  { name: '液压缸低摩擦', customer: '中车四方', metric: '摩擦系数 0.1', status: '待验证', tag: 'info' },
  { name: '特种轴承寿命', customer: '北极星特钢', metric: 'L10 寿命 +25%', status: '设计中', tag: 'warning' }
]);

const planModal = ref(false);
const simulateModal = ref(false);
const simulateProgress = ref(0);
const simulateText = ref('初始化');
const planForm = reactive({ name: '', customer: '', metric: '', status: '设计中' });
const current = ref(null);
const quoteModal = ref(false);
const quoteProgress = ref(0);

const axes = [
  { label: '强度', value: 0.82 },
  { label: '韧性', value: 0.76 },
  { label: '耐磨', value: 0.68 },
  { label: '抗蚀', value: 0.73 },
  { label: '工艺性', value: 0.85 }
];

const polygonPoints = computed(() => {
  const angle = (Math.PI * 2) / axes.length;
  return axes
    .map((axis, idx) => {
      const x = Math.cos(angle * idx - Math.PI / 2) * axis.value * 100;
      const y = Math.sin(angle * idx - Math.PI / 2) * axis.value * 100;
      axes[idx].x = x;
      axes[idx].y = y;
      return `${x},${y}`;
    })
    .join(' ');
});

const openPlan = () => { planModal.value = true; };
const savePlan = () => {
  plans.value.unshift({ ...planForm, tag: planForm.status === '已通过' ? 'success' : planForm.status === '待验证' ? 'info' : 'warning' });
  Object.assign(planForm, { name: '', customer: '', metric: '', status: '设计中' });
  planModal.value = false;
};

const simulate = () => {
  simulateModal.value = true;
  simulateProgress.value = 0;
  simulateText.value = '加载材料成分...';
  const steps = ['计算热处理曲线...', '预测组织...', '评估性能...', '生成报告'];
  let idx = 0;
  const timer = setInterval(() => {
    simulateProgress.value += 25;
    simulateText.value = steps[idx] || simulateText.value;
    idx += 1;
    if (simulateProgress.value >= 100) {
      simulateText.value = '模拟完成，指标满足客户要求';
      clearInterval(timer);
    }
  }, 320);
};

const viewPlan = (item) => { current.value = item; };

const quote = () => {
  quoteModal.value = true;
  quoteProgress.value = 0;
  const timer = setInterval(() => {
    quoteProgress.value += 30;
    if (quoteProgress.value >= 100) {
      clearInterval(timer);
    }
  }, 280);
};
</script>
