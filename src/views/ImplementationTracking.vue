<template>
  <div class="grid two">
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <div>
          <div class="tag">实施计划</div>
          <h3 style="margin:6px 0 0;">里程碑与进度</h3>
        </div>
        <div style="display:flex;gap:8px;">
          <button class="btn" @click="openPlan">编制计划</button>
          <button class="btn secondary" @click="openMilestone">拆解里程碑</button>
        </div>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>阶段</th>
            <th>里程碑</th>
            <th>计划完成</th>
            <th>实际完成</th>
            <th>偏差</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in milestones" :key="item.name">
            <td>{{ item.phase }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.plan }}</td>
            <td>{{ item.actual }}</td>
            <td><span class="badge" :class="item.deviation.includes('-') ? 'success' : 'warn'">{{ item.deviation }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <h3 style="margin:0;">投入产出动态对比</h3>
        <button class="btn warning" @click="openCost">对比设置</button>
      </div>
      <div style="display:flex;gap:12px;align-items:flex-end;flex-wrap:wrap;">
        <div v-for="item in cashflow" :key="item.month" style="flex:1;min-width:70px;text-align:center;">
          <div style="background:linear-gradient(180deg, rgba(127,214,178,0.3), rgba(127,214,178,0.9)); border-radius:10px 10px 4px 4px;" :style="{height: item.invest + 'px'}"></div>
          <small style="display:block;color:var(--muted);">投入 {{ item.invest }}%</small>
          <div style="background:linear-gradient(180deg, rgba(62,157,246,0.3), rgba(62,157,246,0.9)); border-radius:10px 10px 4px 4px;margin-top:6px;" :style="{height: item.output + 'px'}"></div>
          <small style="display:block;color:var(--muted);">产出 {{ item.output }}%</small>
          <div style="margin-top:4px;font-weight:700;">{{ item.month }}</div>
        </div>
      </div>
      <div class="progress-bar"><span :style="{ width: '64%' }"></span></div>
      <small style="color:var(--muted);">实时对比累计投入与产出。</small>
    </div>
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <h3 style="margin:0;">计划编制与分解</h3>
        <button class="btn secondary" @click="openPlan">更新计划</button>
      </div>
      <div class="grid three">
        <div v-for="plan in planCards" :key="plan.title" class="card" style="padding:12px;">
          <div style="display:flex;align-items:center;gap:8px;">
            <div class="badge info">{{ plan.phase }}</div>
            <div style="font-weight:700;">{{ plan.title }}</div>
          </div>
          <p style="color:var(--muted);margin:8px 0 0;">{{ plan.desc }}</p>
          <div class="progress-bar"><span :style="{ width: plan.progress + '%' }"></span></div>
          <small style="color:var(--muted);">进度 {{ plan.progress }}% / 负责人 {{ plan.owner }}</small>
        </div>
      </div>
    </div>
  </div>

  <div v-if="showPlan" class="overlay" @click.self="showPlan=false">
    <div class="modal">
      <h3>计划编制</h3>
      <div class="form-row"><label>阶段</label><select><option>策划</option><option>方案</option><option>实施</option></select></div>
      <div class="form-row"><label>时间</label><input type="month" /></div>
      <div class="form-row"><label>负责人</label><input placeholder="填写负责人" /></div>
      <button class="btn" @click="showPlan=false" style="align-self:flex-end;">保存</button>
    </div>
  </div>

  <div v-if="showMilestone" class="overlay" @click.self="showMilestone=false">
    <div class="modal">
      <h3>里程碑拆解</h3>
      <div v-for="item in milestones" :key="item.name" class="form-row">
        <label>{{ item.name }}</label>
        <input :value="item.plan" />
      </div>
      <button class="btn secondary" @click="showMilestone=false" style="align-self:flex-end;">完成</button>
    </div>
  </div>

  <div v-if="showCost" class="overlay" @click.self="showCost=false">
    <div class="modal">
      <h3>对比阈值</h3>
      <p>设置投入与产出的阈值预警。</p>
      <div class="form-row"><label>投入警戒%</label><input type="number" value="70" /></div>
      <div class="form-row"><label>产出目标%</label><input type="number" value="85" /></div>
      <button class="btn" @click="showCost=false" style="align-self:flex-end;">确认</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const milestones = [
  { phase: '策划', name: '方案确认', plan: '2024-05', actual: '2024-05', deviation: '-0.1月' },
  { phase: '前期', name: '立项批复', plan: '2024-07', actual: '2024-08', deviation: '+0.8月' },
  { phase: '实施', name: '征收安置', plan: '2024-12', actual: '2025-01', deviation: '+1.0月' },
  { phase: '实施', name: '基础施工', plan: '2025-05', actual: '2025-04', deviation: '-0.6月' },
  { phase: '运营', name: '竣工验收', plan: '2026-03', actual: '2026-03', deviation: '0.0月' },
];

const cashflow = [
  { month: '1月', invest: 60, output: 10 },
  { month: '2月', invest: 70, output: 18 },
  { month: '3月', invest: 80, output: 26 },
  { month: '4月', invest: 76, output: 38 },
  { month: '5月', invest: 68, output: 52 },
  { month: '6月', invest: 55, output: 64 },
];

const planCards = [
  { phase: '策划', title: '实施方案深化', progress: 68, owner: '张雷', desc: '整合规划、交通、生态专题成果' },
  { phase: '方案', title: '专项审批联动', progress: 54, owner: '陈曦', desc: '控规、文物、消防并行报批' },
  { phase: '实施', title: '征收安置执行', progress: 72, owner: '李倩', desc: '签约交房、临迁安置跟踪' },
];

const showPlan = ref(false);
const showMilestone = ref(false);
const showCost = ref(false);

const openPlan = () => (showPlan.value = true);
const openMilestone = () => (showMilestone.value = true);
const openCost = () => (showCost.value = true);
</script>
