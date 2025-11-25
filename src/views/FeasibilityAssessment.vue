<template>
  <div class="grid two">
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <div>
          <div class="tag">经济可行性测算</div>
          <h3 style="margin:6px 0 0;">收益与成本测算</h3>
        </div>
        <div style="display:flex;gap:8px;">
          <button class="btn" @click="runAssessment">运行测算</button>
          <button class="btn secondary" @click="openExport">导出结果</button>
        </div>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>方案</th>
            <th>投资额(亿)</th>
            <th>IRR</th>
            <th>净现值(亿)</th>
            <th>回收期(年)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in economics" :key="row.name">
            <td>{{ row.name }}</td>
            <td>{{ row.capex }}</td>
            <td>{{ row.irr }}%</td>
            <td>{{ row.npv }}</td>
            <td>{{ row.payback }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <h3 style="margin:0;">社会与环境影响</h3>
        <button class="btn warning" @click="openTip">查看说明</button>
      </div>
      <div class="grid three">
        <div v-for="impact in impacts" :key="impact.name" class="card" style="padding:12px;">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <span style="font-weight:700;">{{ impact.name }}</span>
            <span class="badge success">{{ impact.score }} 分</span>
          </div>
          <div class="progress-bar"><span :style="{ width: impact.score + '%' }"></span></div>
          <small style="color:var(--muted);">{{ impact.desc }}</small>
        </div>
      </div>
    </div>
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <h3 style="margin:0;">综合可行性评分</h3>
        <button class="btn secondary" @click="openGrade">评分分级</button>
      </div>
      <div style="display:flex;gap:18px;flex-wrap:wrap;align-items:center;">
        <div style="flex:1;min-width:260px;">
          <div class="progress-bar" style="height:18px;"><span :style="{ width: totalScore + '%'}"></span></div>
          <div style="display:flex;justify-content:space-between;margin-top:6px;font-weight:700;">
            <span>综合得分</span>
            <span>{{ totalScore }} / 100</span>
          </div>
          <p style="color:var(--muted);">评分模板来源：经济、社会、环境、风险维度。</p>
        </div>
        <div style="flex:1;min-width:260px;display:flex;gap:12px;align-items:flex-end;">
          <div v-for="item in scoreBreakdown" :key="item.name" style="flex:1;text-align:center;">
            <div :style="{ height: item.value + 'px', background: item.color, borderRadius: '10px 10px 4px 4px' }"></div>
            <div style="margin-top:6px;font-weight:700;">{{ item.name }}</div>
            <small style="color:var(--muted);">{{ item.value }} 分</small>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-if="showAssessment" class="overlay" @click.self="showAssessment=false">
    <div class="modal">
      <h3>测算进度</h3>
      <p>正在汇总成本、收益与敏感性分析。</p>
      <div class="progress-bar"><span :style="{ width: assessmentProgress + '%' }"></span></div>
      <div style="display:flex;justify-content:flex-end;gap:10px;">
        <button class="btn" @click="simulateAssessment">刷新</button>
        <button class="btn secondary" @click="showAssessment=false">关闭</button>
      </div>
    </div>
  </div>

  <div v-if="showExport" class="overlay" @click.self="showExport=false">
    <div class="modal">
      <h3>导出报告</h3>
      <div class="form-row"><label>格式</label><select><option>PDF</option><option>Excel</option></select></div>
      <div class="form-row"><label>章节</label><input value="经济、社会、环境、风险" /></div>
      <button class="btn" @click="showExport=false" style="align-self:flex-end;">开始导出</button>
    </div>
  </div>

  <div v-if="showTip" class="overlay" @click.self="showTip=false">
    <div class="modal">
      <h3>说明</h3>
      <p>社会与环境评分参考公众参与、生态修复、碳排放约束等指标。</p>
      <button class="btn" @click="showTip=false">关闭</button>
    </div>
  </div>

  <div v-if="showGrade" class="overlay" @click.self="showGrade=false">
    <div class="modal">
      <h3>分级说明</h3>
      <p>90-100 A级可实施，75-89 B级有条件实施，60-74 C级需优化，60以下暂缓。</p>
      <button class="btn secondary" @click="showGrade=false" style="align-self:flex-end;">知道了</button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';

const economics = [
  { name: '方案A 分期滚动', capex: 62, irr: 8.6, npv: 6.8, payback: 9.5 },
  { name: '方案B TOD驱动', capex: 78, irr: 9.8, npv: 9.4, payback: 8.7 },
  { name: '方案C 产城融合', capex: 85, irr: 10.2, npv: 11.1, payback: 8.2 },
  { name: '方案D 文旅复合', capex: 55, irr: 8.2, npv: 5.9, payback: 9.9 },
  { name: '方案E 生态修复+', capex: 48, irr: 7.6, npv: 3.6, payback: 10.5 },
];

const impacts = [
  { name: '居民安置满意度', score: 88, desc: '安置房品质与配套提升' },
  { name: '就业与产业带动', score: 84, desc: '新增岗位与税收贡献' },
  { name: '绿色与低碳表现', score: 82, desc: '装配式/海绵城市/光伏' },
  { name: '文化与风貌保护', score: 78, desc: '保留历史街区与公共空间' },
  { name: '出行可达性提升', score: 86, desc: '轨道+慢行+公交接驳优化' },
];

const scoreBreakdown = [
  { name: '经济', value: 88, color: '#3e9df6' },
  { name: '社会', value: 82, color: '#7fd6b2' },
  { name: '环境', value: 80, color: '#ffc94a' },
  { name: '风险', value: 76, color: '#ff9f7f' },
];

const totalScore = 85;

const showAssessment = ref(false);
const showExport = ref(false);
const showTip = ref(false);
const showGrade = ref(false);
const assessmentProgress = ref(30);

const runAssessment = () => {
  showAssessment.value = true;
  simulateAssessment();
};

const simulateAssessment = () => {
  assessmentProgress.value = 35;
  setTimeout(() => (assessmentProgress.value = 70), 400);
  setTimeout(() => (assessmentProgress.value = 100), 900);
};

const openExport = () => (showExport.value = true);
const openTip = () => (showTip.value = true);
const openGrade = () => (showGrade.value = true);

onMounted(() => simulateAssessment());
</script>
