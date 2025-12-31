<template>
  <div class="card">
    <div class="flex-between" style="margin-bottom:12px;">
      <div>
        <h3 style="margin:0">仿真评估与结果对比</h3>
        <p style="margin:4px 0 0 0; color:#4b5563;">尾流评估、AEP、等效满发小时、能量损失分解、方案对比、敏感性分析</p>
      </div>
      <div style="display:flex; gap:8px; flex-wrap: wrap;">
        <button class="button-secondary" @click="openModal('尾流评估', wakeForm)">尾流评估</button>
        <button class="button-secondary" @click="openModal('方案对比', compareForm)">方案对比</button>
        <button class="button-secondary" @click="openModal('敏感性分析配置', sensitivityForm)">敏感性</button>
        <button class="button-primary" @click="openModal('违规检测', violationForm)">约束检测</button>
      </div>
    </div>
    <div class="grid-chart">
      <div class="chart-box">
        <div class="flex-between"><strong>方案 A/B/C 发电量</strong><span class="badge">GWh</span></div>
        <div style="display:flex; gap:10px; align-items:flex-end; height:160px;">
          <div v-for="plan in plans" :key="plan.name" style="flex:1; text-align:center;">
            <div :style="{height: plan.aep*1.2 + 'px', background: plan.color, borderRadius:'10px'}"></div>
            <div style="margin-top:6px; font-weight:700;">{{ plan.name }}</div>
            <small style="color:#475569;">{{ plan.aep }} GWh</small>
          </div>
        </div>
      </div>
      <div class="chart-box">
        <div class="flex-between"><strong>能量损失分解</strong><span class="badge">%</span></div>
        <ul style="margin:6px 0 0 0; padding-left: 16px; color:#4b5563;">
          <li>尾流损失：{{ losses.wake }}%</li>
          <li>可利用率：{{ losses.availability }}%</li>
          <li>电网限制：{{ losses.grid }}%</li>
          <li>冰冻及其他：{{ losses.others }}%</li>
        </ul>
      </div>
      <div class="chart-box">
        <div class="flex-between"><strong>敏感性摘要</strong><span class="badge">风向 &amp; 间距</span></div>
        <p style="margin:0; color:#2563eb;">风向频率 ±10% 与机间距 ±0.5D 对 AEP 的影响</p>
        <div style="margin-top:8px; display:flex; gap:8px;">
          <div class="card" style="padding:8px; flex:1; border:1px solid #e5e7eb;">
            <div class="flex-between"><span>风向频率</span><span class="tag">+1.8%</span></div>
            <small>南偏东频率提升后方案B收益增加</small>
          </div>
          <div class="card" style="padding:8px; flex:1; border:1px solid #e5e7eb;">
            <div class="flex-between"><span>机间距</span><span class="tag">-0.6%</span></div>
            <small>间距放松 0.5D 后 AEP 下降，尾流增加</small>
          </div>
        </div>
      </div>
    </div>
    <div style="margin-top:14px;">
      <div class="flex-between" style="margin-bottom:8px;">
        <strong>约束违规检测结果</strong>
        <span class="badge">{{ violations.length }} 条</span>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>机位</th>
            <th>违规类型</th>
            <th>详情</th>
            <th>惩罚系数</th>
            <th>建议措施</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in violations" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.type }}</td>
            <td>{{ item.detail }}</td>
            <td>{{ item.penalty }}</td>
            <td>{{ item.action }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <ModalDialog v-if="modal.visible" :title="modal.title" @close="closeModal">
    <component :is="modal.component" />
  </ModalDialog>
</template>

<script setup>
import { reactive } from 'vue'
import ModalDialog from '../components/ModalDialog.vue'

const plans = reactive([
  { name: '方案A', aep: 128, color: '#3b82f6' },
  { name: '方案B', aep: 132, color: '#22c55e' },
  { name: '方案C', aep: 125, color: '#f97316' }
])
const losses = reactive({ wake: 6.8, availability: 2.1, grid: 1.6, others: 0.9 })
const violations = reactive([
  { id: 'T-003', type: '噪声', detail: '距居民点 320m，预测 46.5dB', penalty: 1.2, action: '抬高轮毂/夜间降噪模式' },
  { id: 'T-008', type: '间距', detail: '与T-007 距离 3.6D', penalty: 0.8, action: '向北平移 60m' },
  { id: 'T-015', type: '红线', detail: '进入生态缓冲 120m', penalty: 1.5, action: '替换为候选点 C-021' },
  { id: 'T-021', type: '走廊', detail: '距集电线路 65m', penalty: 0.6, action: '避让走廊 40m' }
])

const modal = reactive({ visible: false, title: '', component: null })
const openModal = (title, comp) => {
  modal.visible = true
  modal.title = title
  modal.component = comp
}
const closeModal = () => {
  modal.visible = false
}

const wakeForm = {
  template: `
    <div style='display:grid; gap:10px;'>
      <label>尾流模型：<input value='Jensen + 局地修正' /></label>
      <label>扇区划分：<input value='12 个扇区' /></label>
      <label>湍流强度：<input value='0.12' /></label>
      <div class='progress-track'><div class='progress-bar' style='width:52%'></div></div>
      <p style='margin:0;color:#2563eb;'>尾流计算运行中，预计 18 秒完成</p>
    </div>`
}

const compareForm = {
  template: `
    <div style='display:grid; gap:10px;'>
      <label>对比方案：
        <select>
          <option>方案A</option>
          <option selected>方案B</option>
          <option>方案C</option>
        </select>
      </label>
      <label>指标：<input value='AEP / 等效满发小时 / 尾流损失' /></label>
      <div class='progress-track'><div class='progress-bar' style='width:66%'></div></div>
      <p style='margin:0;color:#16a34a;'>对比图表生成中，可立即查看弹窗结果</p>
    </div>`
}

const sensitivityForm = {
  template: `
    <div style='display:grid; gap:10px;'>
      <label>风向频率扰动(%)：<input value='±10' /></label>
      <label>机间距扰动(D)：<input value='±0.5' /></label>
      <label>惩罚系数范围：<input value='1.0 - 2.0' /></label>
      <div class='progress-track'><div class='progress-bar' style='width:48%'></div></div>
      <p style='margin:0;color:#f97316;'>敏感性计算排队中</p>
    </div>`
}

const violationForm = {
  template: `
    <div style='display:grid; gap:10px;'>
      <label>检测项：<input value='红线/噪声/间距/走廊' /></label>
      <label>惩罚函数：<input value='噪声>45dB 罚1.2; 间距<4D 罚0.8' /></label>
      <div class='progress-track'><div class='progress-bar' style='width:78%'></div></div>
      <p style='margin:0;color:#b91c1c;'>已发现 {{ violations.length }} 条违规，已写入惩罚函数</p>
    </div>`
}
</script>
