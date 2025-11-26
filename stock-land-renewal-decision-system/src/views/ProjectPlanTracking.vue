<template>
  <div class="grid" style="grid-template-columns: 1.3fr 1fr; align-items: start">
    <div class="card">
      <div class="section-head">
        <div>
          <p class="eyebrow">年度计划</p>
          <h3>更新项目库与年度计划</h3>
        </div>
        <button class="action-btn" @click="showPlan = true">新增计划</button>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>项目</th>
            <th>年度</th>
            <th>投资(万)</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in plans" :key="row.name">
            <td>{{ row.name }}</td>
            <td>{{ row.year }}</td>
            <td>{{ row.invest }}</td>
            <td><span class="badge" :class="row.statusTag">{{ row.status }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="card">
      <div class="section-head">
        <div>
          <p class="eyebrow">实施跟踪</p>
          <h3>阶段与节点进度</h3>
        </div>
        <button class="action-btn secondary" @click="showTrack = true">更新进度</button>
      </div>
      <ul class="ledger">
        <li v-for="phase in phases" :key="phase.name">
          <div>
            <strong>{{ phase.name }}</strong>
            <p class="muted">{{ phase.note }}</p>
            <div class="progress-track">
              <div class="progress-bar" :style="{ width: phase.progress + '%' }"></div>
            </div>
          </div>
          <span class="badge info">{{ phase.progress }}%</span>
        </li>
      </ul>
    </div>

    <div class="card" style="grid-column: 1 / span 2">
      <div class="section-head">
        <div>
          <p class="eyebrow">进度预警</p>
          <h3>问题记录与提醒</h3>
        </div>
        <button class="action-btn" @click="showAlert = true">记录问题</button>
      </div>
      <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(240px, 1fr))">
        <div v-for="alert in alerts" :key="alert.title" class="card" style="border: 1px dashed var(--border)">
          <p class="muted">{{ alert.date }}</p>
          <h4 style="margin: 6px 0">{{ alert.title }}</h4>
          <p>{{ alert.detail }}</p>
          <span class="badge" :class="alert.tag">{{ alert.level }}</span>
        </div>
      </div>
    </div>

    <div v-if="showPlan" class="modal-mask" @click.self="showPlan = false">
      <div class="modal-container">
        <div class="modal-header">
          <h3>新增年度计划</h3>
          <button class="action-btn secondary" @click="showPlan = false">关闭</button>
        </div>
        <div class="form-row">
          <label>项目名称<input placeholder="输入项目名称" /></label>
          <label>年度<select><option>2024</option><option>2025</option></select></label>
        </div>
        <div class="form-row">
          <label>投资规模<input type="number" placeholder="50000" /></label>
          <label>责任单位<input placeholder="城市更新中心" /></label>
        </div>
        <button class="action-btn" style="margin-top: 12px">保存</button>
      </div>
    </div>

    <div v-if="showTrack" class="modal-mask" @click.self="showTrack = false">
      <div class="modal-container">
        <div class="modal-header">
          <h3>更新进度</h3>
          <button class="action-btn secondary" @click="showTrack = false">关闭</button>
        </div>
        <div class="form-row">
          <label>阶段<select><option>立项</option><option>实施</option><option>收尾</option></select></label>
          <label>当前进度<input type="number" placeholder="60" /></label>
        </div>
        <div class="progress-track">
          <div class="progress-bar" :style="{ width: '60%' }"></div>
        </div>
        <p class="muted">填写后自动同步至大屏</p>
      </div>
    </div>

    <div v-if="showAlert" class="modal-mask" @click.self="showAlert = false">
      <div class="modal-container">
        <div class="modal-header">
          <h3>记录问题</h3>
          <button class="action-btn secondary" @click="showAlert = false">关闭</button>
        </div>
        <label>问题描述<textarea rows="3" placeholder="说明进展受阻原因"></textarea></label>
        <label>责任人<input placeholder="责任人姓名" /></label>
        <button class="action-btn" style="margin-top: 12px">提交</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const showPlan = ref(false);
const showTrack = ref(false);
const showAlert = ref(false);

const plans = ref([
  { name: '科创智谷更新', year: 2024, invest: 85000, status: '立项', statusTag: 'info' },
  { name: '机场北物流转型', year: 2024, invest: 46000, status: '实施', statusTag: 'success' },
  { name: '老港工业搬迁', year: 2025, invest: 98000, status: '准备', statusTag: 'warning' },
  { name: '南湾社区完善', year: 2024, invest: 38000, status: '实施', statusTag: 'success' },
  { name: '江滩港口活化', year: 2025, invest: 72000, status: '立项', statusTag: 'info' },
]);

const phases = ref([
  { name: '征收及安置', note: '签约率 62%，安置房同步建设', progress: 62 },
  { name: '规划报批', note: '控规调整已上报，等待批复', progress: 74 },
  { name: '设计招标', note: '方案设计已定稿，施工图深化中', progress: 55 },
  { name: '基础设施', note: '市政管线迁改启动，预计 Q3 完成', progress: 41 },
]);

const alerts = ref([
  { date: '2024-05-18', title: '征收补偿谈判需协调', detail: '居民提出新增过渡安置需求', level: '预警', tag: 'warning' },
  { date: '2024-05-20', title: '管线迁改工期延误', detail: '雨季施工受限，需调整节点', level: '提醒', tag: 'info' },
  { date: '2024-05-22', title: '资金到位风险', detail: '专项债申报审核中，需关注批复', level: '预警', tag: 'warning' },
  { date: '2024-05-25', title: '社区沟通', detail: '增设邻里中心及社区食堂诉求', level: '提示', tag: 'info' },
]);
</script>

<style scoped>
.section-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.ledger {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 12px;
}

.ledger li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid var(--border);
  padding: 12px;
  border-radius: 10px;
}
</style>
