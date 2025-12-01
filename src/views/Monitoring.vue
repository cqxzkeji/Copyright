<template>
  <div>
    <div class="card-grid">
      <div class="card">
        <h3>系统负载</h3>
        <p class="kpi">62%</p>
        <div class="progress-bar">
          <div class="progress-bar__fill" style="width:62%;"></div>
        </div>
        <p class="kpi-label">CPU/内存综合指标</p>
      </div>
      <div class="card">
        <h3>数据总览</h3>
        <p class="kpi">43.2 TB</p>
        <p class="kpi-label">近7天存储量</p>
        <span class="badge green">可用空间充足</span>
      </div>
      <div class="card">
        <h3>告警</h3>
        <p class="kpi">2 条</p>
        <p class="kpi-label">待处理链路波动</p>
        <span class="badge orange">处理中</span>
      </div>
    </div>

    <div class="card" style="margin-top:20px;">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <h3 style="margin:0;">监控指标与告警</h3>
        <div>
          <button class="button" @click="showAlertModal = true">处理告警</button>
          <button class="button secondary" @click="showTrendModal = true">查看趋势</button>
          <button class="button ghost" @click="showAuditModal = true">审计记录</button>
        </div>
      </div>
      <table class="table" aria-label="监控表">
        <thead>
          <tr>
            <th>指标</th>
            <th>当前值</th>
            <th>阈值</th>
            <th>趋势</th>
            <th>状态</th>
            <th>更新时间</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="metric in metrics" :key="metric.name">
            <td>{{ metric.name }}</td>
            <td>{{ metric.value }}</td>
            <td>{{ metric.threshold }}</td>
            <td>
              <div class="progress-bar" style="height:8px;">
                <div class="progress-bar__fill" :style="{ width: metric.trend }"></div>
              </div>
            </td>
            <td><span class="badge" :class="metric.state === '告警' ? 'orange' : 'green'">{{ metric.state }}</span></td>
            <td>{{ metric.time }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showAlertModal" class="modal-mask">
      <div class="modal">
        <header>
          <h3>告警处理</h3>
          <button class="button ghost" @click="showAlertModal = false">关闭</button>
        </header>
        <input v-model="alertForm.title" placeholder="告警名称" />
        <textarea v-model="alertForm.action" rows="3" placeholder="处理方案"></textarea>
        <footer>
          <button class="button ghost" @click="showAlertModal = false">取消</button>
          <button class="button" @click="ackAlert">确认</button>
        </footer>
      </div>
    </div>

    <div v-if="showTrendModal" class="modal-mask">
      <div class="modal">
        <header>
          <h3>趋势图</h3>
          <button class="button ghost" @click="showTrendModal = false">关闭</button>
        </header>
        <p>近24小时 CPU、内存与网络利用率走势。</p>
        <div style="display:flex;gap:8px;align-items:flex-end;height:140px;">
          <div v-for="bar in trendBars" :key="bar" style="flex:1;height:100%;display:flex;align-items:flex-end;">
            <div :style="{ height: bar + '%', width: '100%', borderRadius: '10px', background: 'linear-gradient(180deg,#1677ff,#a5d8ff)' }"></div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showAuditModal" class="modal-mask">
      <div class="modal">
        <header>
          <h3>审计记录</h3>
          <button class="button ghost" @click="showAuditModal = false">关闭</button>
        </header>
        <p>最近操作：发布监控策略、更新告警阈值、导出报告。</p>
        <div class="progress-bar">
          <div class="progress-bar__fill" style="width:58%;"></div>
        </div>
        <p class="kpi-label">审计完成度 58%</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MonitoringView',
  data() {
    return {
      showAlertModal: false,
      showTrendModal: false,
      showAuditModal: false,
      alertForm: {
        title: '链路抖动',
        action: ''
      },
      trendBars: [38, 62, 55, 80, 68, 72, 64, 58],
      metrics: [
        { name: 'CPU 利用率', value: '62%', threshold: '85%', trend: '62%', state: '正常', time: '12:30:01' },
        { name: '内存使用率', value: '58%', threshold: '88%', trend: '58%', state: '正常', time: '12:30:01' },
        { name: '网络时延', value: '38ms', threshold: '80ms', trend: '48%', state: '正常', time: '12:30:01' },
        { name: '丢包率', value: '0.8%', threshold: '2%', trend: '40%', state: '正常', time: '12:30:01' },
        { name: '磁盘IO', value: '71%', threshold: '90%', trend: '71%', state: '正常', time: '12:30:01' },
        { name: '存储占用', value: '43.2TB', threshold: '65TB', trend: '66%', state: '正常', time: '12:30:01' },
        { name: 'V2X 发送成功率', value: '99.1%', threshold: '97%', trend: '80%', state: '正常', time: '12:30:01' },
        { name: '异常请求', value: '2次', threshold: '5次', trend: '22%', state: '正常', time: '12:30:01' },
        { name: '路侧节点离线', value: '1个', threshold: '3个', trend: '30%', state: '告警', time: '12:30:01' },
        { name: '仿真任务排队', value: '4个', threshold: '10个', trend: '44%', state: '正常', time: '12:30:01' }
      ]
    };
  },
  methods: {
    ackAlert() {
      alert(`告警已确认：${this.alertForm.title}`);
      this.showAlertModal = false;
    }
  }
};
</script>
