<template>
  <div class="grid two">
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <div>
          <div class="tag">风险事件监测</div>
          <h3 style="margin:6px 0 0;">风险清单</h3>
        </div>
        <div style="display:flex;gap:8px;">
          <button class="btn" @click="openAlert">触发预警</button>
          <button class="btn secondary" @click="openExport">导出报表</button>
        </div>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>风险事件</th>
            <th>类别</th>
            <th>影响</th>
            <th>阈值</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in risks" :key="item.name">
            <td>{{ item.name }}</td>
            <td>{{ item.type }}</td>
            <td>{{ item.impact }}</td>
            <td>{{ item.threshold }}</td>
            <td><span class="badge" :class="item.level">{{ item.status }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <h3 style="margin:0;">风险矩阵</h3>
        <button class="btn warning" @click="openTip">查看提示</button>
      </div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;">
        <div v-for="cell in matrix" :key="cell.label" :style="{background: cell.color, padding:'12px', borderRadius:'12px', color:'#fff', fontWeight:'700'}">
          <div>{{ cell.label }}</div>
          <small style="display:block;color:rgba(255,255,255,0.85);">{{ cell.desc }}</small>
        </div>
      </div>
      <small style="color:var(--muted);">矩阵基于发生概率与影响度计算。</small>
    </div>
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <h3 style="margin:0;">区域项目风险排序</h3>
        <button class="btn secondary" @click="openExport">导出排序</button>
      </div>
      <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:flex-end;">
        <div v-for="item in ranking" :key="item.name" style="flex:1;min-width:180px;">
          <div class="card" style="padding:12px;">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <div style="font-weight:700;">{{ item.name }}</div>
              <span class="badge warn">{{ item.score }}</span>
            </div>
            <div class="progress-bar"><span :style="{ width: item.score + '%' }"></span></div>
            <small style="color:var(--muted);">{{ item.desc }}</small>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-if="showAlert" class="overlay" @click.self="showAlert=false">
    <div class="modal">
      <h3>风险预警</h3>
      <div class="form-row"><label>事件</label><input placeholder="如：资金拨付滞后" /></div>
      <div class="form-row"><label>阈值</label><input type="number" placeholder="设定阈值" /></div>
      <div class="form-row"><label>措施</label><textarea rows="2" placeholder="应急预案、责任人"></textarea></div>
      <div style="display:flex;justify-content:flex-end;gap:10px;">
        <button class="btn" @click="showAlert=false">确认</button>
      </div>
    </div>
  </div>

  <div v-if="showExport" class="overlay" @click.self="showExport=false">
    <div class="modal">
      <h3>报表导出</h3>
      <p>正在生成风险报告...</p>
      <div class="progress-bar"><span :style="{ width: exportProgress + '%' }"></span></div>
      <button class="btn secondary" @click="simulateExport" style="align-self:flex-end;">刷新</button>
    </div>
  </div>

  <div v-if="showTip" class="overlay" @click.self="showTip=false">
    <div class="modal">
      <h3>矩阵说明</h3>
      <p>根据概率/影响度自动填充矩阵颜色，对应预警等级。</p>
      <button class="btn" @click="showTip=false">关闭</button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';

const risks = [
  { name: '资金拨付滞后', type: '资金', impact: '现金流', threshold: '≥30天', status: '预警', level: 'warn' },
  { name: '征收补偿纠纷', type: '社会', impact: '安置进度', threshold: '≥5起', status: '关注', level: 'info' },
  { name: '施工安全事故', type: '施工', impact: '安全', threshold: '≥1起', status: '重点', level: 'warn' },
  { name: '审批流程延迟', type: '审批', impact: '时间', threshold: '≥20天', status: '预警', level: 'warn' },
  { name: '市场销售放缓', type: '市场', impact: '回款', threshold: '去化<60%', status: '关注', level: 'info' },
];

const matrix = [
  { label: '高概率 / 高影响', desc: '立即处置', color: '#ff7f72' },
  { label: '中概率 / 高影响', desc: '重点跟踪', color: '#ffb266' },
  { label: '低概率 / 高影响', desc: '制定预案', color: '#ffd580' },
  { label: '高概率 / 中影响', desc: '调整计划', color: '#7fd6b2' },
  { label: '中概率 / 中影响', desc: '常规监测', color: '#52d1f2' },
  { label: '低概率 / 中影响', desc: '记录观察', color: '#9ed4ff' },
  { label: '高概率 / 低影响', desc: '快速响应', color: '#b3e4d1' },
  { label: '中概率 / 低影响', desc: '例行检查', color: '#cde9ff' },
  { label: '低概率 / 低影响', desc: '信息归档', color: '#e3f2ff' },
];

const ranking = [
  { name: '产业活力片区', score: 78, desc: '征收与资金双压力' },
  { name: 'TOD综合枢纽', score: 72, desc: '审批流程复杂' },
  { name: '滨河活力社区', score: 66, desc: '安置诉求高' },
  { name: '滨水文化街区', score: 62, desc: '保护与开发平衡' },
];

const showAlert = ref(false);
const showExport = ref(false);
const showTip = ref(false);
const exportProgress = ref(20);

const openAlert = () => (showAlert.value = true);
const openExport = () => {
  showExport.value = true;
  simulateExport();
};
const openTip = () => (showTip.value = true);

const simulateExport = () => {
  exportProgress.value = 30;
  setTimeout(() => (exportProgress.value = 65), 400);
  setTimeout(() => (exportProgress.value = 100), 800);
};

onMounted(() => simulateExport());
</script>
