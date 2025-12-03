<template>
  <div class="grid-layout">
    <div>
      <div class="flex-between">
        <h3>产品定制</h3>
        <div class="flex" style="gap: 8px;">
          <button class="btn" @click="showCreate = true">新增方案</button>
          <button class="btn secondary" @click="showTrial = true">试制进度</button>
          <button class="btn secondary" @click="openExport">导出方案</button>
        </div>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>方案号</th>
            <th>客户需求</th>
            <th>材料</th>
            <th>热处理</th>
            <th>表面</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="plan in plans" :key="plan.id">
            <td>{{ plan.id }}</td>
            <td>{{ plan.need }}</td>
            <td>{{ plan.material }}</td>
            <td>{{ plan.heat }}</td>
            <td>{{ plan.surface }}</td>
            <td><span class="badge">{{ plan.status }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="card">
      <h4>成本估算 (万元)</h4>
      <div class="chart">
        <div v-for="cost in costChart" :key="cost.label" class="chart-bar" :style="{ height: cost.value * 4 + 'px' }">
          <div>{{ cost.value }}</div>
          <small>{{ cost.label }}</small>
        </div>
      </div>
    </div>
  </div>

  <div v-if="showCreate" class="overlay">
    <div class="modal">
      <header>
        <h3>新增定制方案</h3>
        <button class="btn secondary" @click="showCreate = false">关闭</button>
      </header>
      <div class="form-grid">
        <label>客户需求<input v-model="form.need" class="input" /></label>
        <label>材料<input v-model="form.material" class="input" /></label>
        <label>热处理<input v-model="form.heat" class="input" /></label>
        <label>表面工艺<input v-model="form.surface" class="input" /></label>
      </div>
      <footer>
        <button class="btn secondary" @click="showCreate = false">取消</button>
        <button class="btn" @click="submitPlan">保存</button>
      </footer>
    </div>
  </div>

  <div v-if="showTrial" class="overlay">
    <div class="modal">
      <header>
        <h3>试制进度</h3>
        <button class="btn secondary" @click="showTrial = false">关闭</button>
      </header>
      <div v-for="trial in trials" :key="trial.label" style="margin-bottom: 8px;">
        <div class="flex-between">
          <span>{{ trial.label }}</span>
          <span class="badge">{{ trial.percent }}%</span>
        </div>
        <div class="progress-bar">
          <span :style="{ width: trial.percent + '%' }"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue';

const plans = ref([
  { id: 'PC-001', need: '轴承寿命 1.5 倍', material: 'GCr15-ESR', heat: '淬火+回火', surface: 'QPQ', status: '评估' },
  { id: 'PC-002', need: '抗腐蚀 120h', material: '1Cr17Ni2', heat: '固溶', surface: '钝化', status: '设计中' },
  { id: 'PC-003', need: '耐磨 60HRC', material: 'Cr12MoV', heat: '真空淬火', surface: '氮化', status: '小试' },
  { id: 'PC-004', need: '冲击韧性 60J', material: '20CrNiMo', heat: '渗碳+回火', surface: '喷丸', status: '复核' },
  { id: 'PC-005', need: '高温 650℃', material: 'GH4169', heat: '固溶+时效', surface: '钝化', status: '小试' },
  { id: 'PC-006', need: '耐蚀+高强', material: '17-4PH', heat: '固溶+时效', surface: '镜面抛光', status: '评估' },
  { id: 'PC-007', need: '减重 12%', material: 'Ti-6Al-4V', heat: '固溶', surface: '喷砂', status: '设计中' },
  { id: 'PC-008', need: '耐磨 58HRC', material: '20CrMnTi', heat: '渗碳淬火', surface: '滚压强化', status: '设计中' },
  { id: 'PC-009', need: '耐低温 -60℃', material: 'AISI 4140', heat: '调质', surface: '镀锌', status: '评估' },
  { id: 'PC-010', need: '高导热', material: 'H13', heat: '真空淬火', surface: '抛光', status: '小试' },
  { id: 'PC-011', need: '尺寸稳定', material: '9Cr18Mo', heat: '冷处理', surface: '镀铬', status: '复核' }
]);

const form = reactive({ need: '', material: '', heat: '', surface: '' });
const showCreate = ref(false);
const showTrial = ref(false);

const trials = [
  { label: '材料试验', percent: 85 },
  { label: '热处理窗口', percent: 70 },
  { label: '加工验证', percent: 55 },
  { label: '装配试制', percent: 40 }
];

const costChart = computed(() =>
  plans.value.slice(0, 6).map((p, idx) => ({
    label: p.id,
    value: 18 + idx * 2
  }))
);

const submitPlan = () => {
  if (!form.need || !form.material) {
    alert('请填写需求与材料');
    return;
  }
  plans.value = [
    {
      id: `PC-${String(plans.value.length + 1).padStart(3, '0')}`,
      ...form,
      status: '评估'
    },
    ...plans.value
  ];
  showCreate.value = false;
};

const openExport = () => {
  alert('已将方案导出为标准模板，发送至技术中心。');
};
</script>
