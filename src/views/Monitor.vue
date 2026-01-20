<template>
  <section class="page">
    <header class="page-header">
      <div>
        <h2>运行监控与告警</h2>
        <p>监控系统与任务状态，异常自动告警并记录日志。</p>
      </div>
      <div class="actions">
        <button class="primary" @click="showAlert = true">新增告警规则</button>
        <button class="secondary" @click="startScan">立即巡检</button>
        <button class="ghost" @click="showTip = true">告警提示</button>
        <button class="ghost" @click="showDetail = true">查看日志</button>
      </div>
    </header>

    <div class="grid">
      <div class="card">
        <h3>系统健康趋势</h3>
        <div class="chart">
          <div v-for="bar in bars" :key="bar.label" class="bar">
            <div class="bar-fill" :style="{ height: `${bar.value}%` }"></div>
            <span>{{ bar.label }}</span>
          </div>
        </div>
      </div>
      <div class="card">
        <h3>实时监控摘要</h3>
        <ul class="status-list">
          <li v-for="item in summary" :key="item.name">
            <span>{{ item.name }}</span>
            <em>{{ item.value }}</em>
          </li>
        </ul>
      </div>
    </div>

    <div class="card">
      <div class="table-header">
        <h3>告警事件列表</h3>
        <button class="secondary" @click="startReport">生成巡检报告</button>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>编号</th>
              <th>告警内容</th>
              <th>级别</th>
              <th>触发时间</th>
              <th>负责人</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="alert in alerts" :key="alert.id">
              <td>{{ alert.id }}</td>
              <td>{{ alert.message }}</td>
              <td>{{ alert.level }}</td>
              <td>{{ alert.time }}</td>
              <td>{{ alert.owner }}</td>
              <td>{{ alert.status }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>

  <Modal v-model="showAlert" title="新增告警规则">
    <form class="modal-form">
      <label>
        告警名称
        <input v-model="form.name" type="text" placeholder="如：延迟超过 5 秒" />
      </label>
      <label>
        告警级别
        <select v-model="form.level">
          <option>高</option>
          <option>中</option>
          <option>低</option>
        </select>
      </label>
      <label>
        通知方式
        <input v-model="form.channel" type="text" placeholder="短信 / 邮件 / 企业微信" />
      </label>
    </form>
    <template #footer>
      <button class="ghost" type="button" @click="showAlert = false">取消</button>
      <button class="primary" type="button" @click="submitAlert">确认添加</button>
    </template>
  </Modal>

  <Modal v-model="showProgress" title="巡检执行中">
    <p>正在检查 128 个节点与 56 个计算任务。</p>
    <div class="progress-space">
      <ProgressBar :progress="progress" />
    </div>
  </Modal>

  <Modal v-model="showTip" title="告警提示">
    <ul class="tip-list">
      <li>关键链路建议设置高优先级告警。</li>
      <li>告警记录支持关联处理人。</li>
      <li>可配置自动升级机制，避免漏报。</li>
    </ul>
  </Modal>

  <Modal v-model="showDetail" title="日志概览">
    <p>最近 24 小时共生成 12,884 条运行日志。</p>
    <p>已自动归档至日志中心，可按任务或节点检索。</p>
    <template #footer>
      <button class="primary" type="button" @click="showDetail = false">确认</button>
    </template>
  </Modal>

  <Modal v-model="showReport" title="巡检报告生成中">
    <p>正在汇总运行状态并生成报告。</p>
    <div class="progress-space">
      <ProgressBar :progress="reportProgress" />
    </div>
  </Modal>
</template>

<script setup>
import { ref, reactive, onBeforeUnmount } from 'vue';
import Modal from '../components/Modal.vue';
import ProgressBar from '../components/ProgressBar.vue';

const bars = [
  { label: '09:00', value: 78 },
  { label: '10:00', value: 82 },
  { label: '11:00', value: 75 },
  { label: '12:00', value: 88 },
  { label: '13:00', value: 80 },
  { label: '14:00', value: 92 },
  { label: '15:00', value: 85 }
];

const summary = [
  { name: '在线节点', value: '128/130' },
  { name: '运行任务', value: '56' },
  { name: '告警处理', value: '98%' },
  { name: '平均恢复', value: '2.4 分钟' }
];

const alerts = Array.from({ length: 20 }, (_, index) => ({
  id: index + 1,
  message: `任务 ${index + 1} 延迟超过阈值`,
  level: ['高', '中', '低'][index % 3],
  time: `10:${String((index * 3) % 60).padStart(2, '0')}`,
  owner: ['李明', '周凯', '黄琳', '顾晨'][index % 4],
  status: index % 4 === 0 ? '处理中' : '已确认'
}));

const showAlert = ref(false);
const showProgress = ref(false);
const showTip = ref(false);
const showDetail = ref(false);
const showReport = ref(false);

const progress = ref(0);
const reportProgress = ref(0);
let timer;
let reportTimer;

const form = reactive({
  name: '',
  level: '高',
  channel: ''
});

const submitAlert = () => {
  showAlert.value = false;
  startScan();
};

const startScan = () => {
  showProgress.value = true;
  progress.value = 0;
  clearInterval(timer);
  timer = setInterval(() => {
    progress.value += 13;
    if (progress.value >= 100) {
      clearInterval(timer);
      showProgress.value = false;
    }
  }, 200);
};

const startReport = () => {
  showReport.value = true;
  reportProgress.value = 0;
  clearInterval(reportTimer);
  reportTimer = setInterval(() => {
    reportProgress.value += 21;
    if (reportProgress.value >= 100) {
      clearInterval(reportTimer);
      showReport.value = false;
    }
  }, 220);
};

onBeforeUnmount(() => {
  clearInterval(timer);
  clearInterval(reportTimer);
});
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.page-header h2 {
  margin: 0;
  font-size: 22px;
}

.page-header p {
  margin: 6px 0 0;
  color: #64748b;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.primary,
.secondary,
.ghost {
  border-radius: 12px;
  padding: 8px 16px;
  cursor: pointer;
  border: none;
  font-weight: 600;
}

.primary {
  background: #2563eb;
  color: #ffffff;
}

.secondary {
  background: #e0f2fe;
  color: #0369a1;
}

.ghost {
  background: #ffffff;
  border: 1px solid #cbd5f5;
  color: #1d4ed8;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.card {
  background: #ffffff;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
}

.chart {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
  margin-top: 20px;
  align-items: end;
  height: 140px;
}

.bar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  color: #64748b;
}

.bar-fill {
  width: 100%;
  border-radius: 8px;
  background: linear-gradient(180deg, #fb7185, #f97316);
}

.status-list {
  list-style: none;
  padding: 0;
  margin: 16px 0 0;
  display: grid;
  gap: 12px;
}

.status-list li {
  display: flex;
  justify-content: space-between;
  background: #f8fafc;
  padding: 10px 12px;
  border-radius: 12px;
}

.status-list em {
  font-style: normal;
  color: #b91c1c;
  font-weight: 600;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.table-wrap {
  overflow-x: auto;
  margin-top: 12px;
}

.table-wrap table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.table-wrap th,
.table-wrap td {
  text-align: left;
  padding: 10px 8px;
  border-bottom: 1px solid #e2e8f0;
}

.modal-form {
  display: grid;
  gap: 12px;
}

.modal-form label {
  display: grid;
  gap: 6px;
  font-weight: 600;
}

.modal-form input,
.modal-form select {
  padding: 8px 10px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
}

.progress-space {
  margin-top: 16px;
}

.tip-list {
  margin: 0;
  padding-left: 18px;
  display: grid;
  gap: 8px;
  color: #475569;
}
</style>
