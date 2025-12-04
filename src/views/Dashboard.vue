<template>
  <div class="grid-2">
    <div class="card">
      <h2>实时指标</h2>
      <p class="muted">监控关键流量与收入趋势</p>
      <div class="grid-3">
        <div v-for="metric in metrics" :key="metric.label" class="mini-card">
          <strong>{{ metric.label }}</strong>
          <div class="value">{{ metric.value }}</div>
          <div class="muted">{{ metric.trend }}</div>
        </div>
      </div>
    </div>
    <div class="card">
      <h2>站点健康图</h2>
      <div v-for="row in charts" :key="row.name" class="chart-row">
        <span>{{ row.name }}</span>
        <div class="chart-bar" :style="{ width: row.percent + '%'}"></div>
        <strong>{{ row.percent }}%</strong>
      </div>
    </div>
  </div>

  <div class="card">
    <h2>多渠道告警表</h2>
    <p class="muted">基于埋点的最新异常捕获（10条以上）</p>
    <table class="table">
      <thead>
        <tr>
          <th>事件</th>
          <th>渠道</th>
          <th>时间</th>
          <th>级别</th>
          <th>状态</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="alert in alerts" :key="alert.event">
          <td>{{ alert.event }}</td>
          <td>{{ alert.channel }}</td>
          <td>{{ alert.time }}</td>
          <td>{{ alert.level }}</td>
          <td><span class="tag">{{ alert.status }}</span></td>
        </tr>
      </tbody>
    </table>
    <div class="btn-row">
      <button class="btn" @click="openForm = true">添加警报规则</button>
      <button class="btn secondary" @click="showInfo = true">刷新监控提示</button>
      <button class="btn danger" @click="startSync">启动实时同步</button>
    </div>
  </div>

  <ModalDialog title="新增规则" v-model="openForm">
    <form class="login-form" @submit.prevent="submitRule">
      <label>规则名称</label>
      <input v-model="rule.name" required />
      <label>触发阈值</label>
      <input v-model="rule.threshold" placeholder="如：曝光低于 5%" />
      <label>通知方式</label>
      <select v-model="rule.channel">
        <option>邮件</option>
        <option>短信</option>
        <option>企业微信</option>
      </select>
      <div class="modal-footer">
        <button type="button" class="btn secondary" @click="openForm = false">取消</button>
        <button type="submit" class="btn">保存规则</button>
      </div>
    </form>
  </ModalDialog>

  <ModalDialog title="监控提示" v-model="showInfo">
    <p>刷新后会重新采集埋点并触发实时计算，预计耗时 10 秒。</p>
    <div class="modal-footer">
      <button class="btn" @click="showInfo = false">知道了</button>
    </div>
  </ModalDialog>

  <ModalDialog title="实时同步" v-model="progressModal">
    <p>正在更新数据流并重放最近 2 小时事件。</p>
    <div class="progress-bar">
      <div class="progress" :style="{ width: progress + '%' }"></div>
    </div>
    <div class="modal-footer">
      <button class="btn" :disabled="progress < 100" @click="progressModal = false">完成</button>
    </div>
  </ModalDialog>
</template>

<script setup>
import { ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const metrics = [
  { label: 'UV', value: '89,210', trend: '较昨日 +4.2%' },
  { label: '转化订单', value: '3,945', trend: '较昨日 +2.9%' },
  { label: '广告消耗', value: '￥128,400', trend: '较昨日 -1.8%' }
];

const charts = [
  { name: '站点可用性', percent: 99.3 },
  { name: 'API 成功率', percent: 98.7 },
  { name: '延迟 200ms 内', percent: 94.2 },
  { name: '落地页渲染正常', percent: 96.5 }
];

const alerts = [
  { event: '落地页加载慢', channel: '抖音', time: '10:01', level: '高', status: '处理中' },
  { event: '表单提交下降', channel: '快手', time: '10:02', level: '高', status: '已分析' },
  { event: '曝光异常下降', channel: '信息流', time: '10:05', level: '中', status: '处理中' },
  { event: '点击激增', channel: '微信广告', time: '10:08', level: '低', status: '观察中' },
  { event: '下单抖动', channel: '知乎', time: '10:10', level: '中', status: '处理中' },
  { event: '事件缺失', channel: 'B站', time: '10:12', level: '高', status: '处理中' },
  { event: '转化率降低', channel: '小红书', time: '10:15', level: '高', status: '已分析' },
  { event: 'ROI 低', channel: '朋友圈', time: '10:16', level: '中', status: '观察中' },
  { event: '跳出率升高', channel: '百度信息流', time: '10:18', level: '中', status: '处理中' },
  { event: 'API 错误', channel: '线索 API', time: '10:21', level: '高', status: '处理中' },
  { event: '渠道延迟', channel: '联盟', time: '10:25', level: '低', status: '观察中' }
];

const openForm = ref(false);
const showInfo = ref(false);
const progressModal = ref(false);
const progress = ref(0);
const rule = ref({ name: '', threshold: '', channel: '邮件' });
let timer;

const submitRule = () => {
  openForm.value = false;
};

const startSync = () => {
  progress.value = 0;
  progressModal.value = true;
  clearInterval(timer);
  timer = setInterval(() => {
    if (progress.value >= 100) {
      clearInterval(timer);
      return;
    }
    progress.value += 12;
  }, 400);
};
</script>

<style scoped>
.mini-card { background: #f8faff; border: 1px solid #e5e7eb; padding: 12px; border-radius: 12px; }
.mini-card .value { font-size: 20px; color: #111827; margin: 6px 0; }
</style>
