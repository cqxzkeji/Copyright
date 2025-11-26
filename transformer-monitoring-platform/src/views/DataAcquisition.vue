<template>
  <div class="module">
    <div class="grid cols-3">
      <div class="card metric" v-for="metric in metrics" :key="metric.label">
        <div class="metric-top">
          <span class="chip">{{ metric.label }}</span>
          <span :class="['badge', metric.badgeClass]">{{ metric.trend }}</span>
        </div>
        <h2>{{ metric.value }}</h2>
        <p class="muted">{{ metric.desc }}</p>
      </div>
    </div>

    <div class="card chart-card">
      <div class="chart-header">
        <h3>关键传感器趋势</h3>
        <div class="chart-actions">
          <button class="btn" @click="showProgress('实时采集')">开始采集</button>
          <button class="btn secondary" @click="showForm('校准任务')">传感器校准</button>
          <button class="btn ghost" @click="showAlert('已下发导出任务，稍后在运维中心查看进度。')">导出数据</button>
        </div>
      </div>
      <div class="chart">
        <svg viewBox="0 0 320 140">
          <polyline
            fill="none"
            stroke="#1e88e5"
            stroke-width="3"
            :points="linePoints"
            stroke-linecap="round"
          />
          <g v-for="(p, idx) in points" :key="idx">
            <circle :cx="p.x" :cy="p.y" r="4" fill="#1e88e5" />
            <text :x="p.x" :y="p.y - 8" font-size="10" fill="#334155">{{ p.value }}℃</text>
          </g>
        </svg>
      </div>
    </div>

    <div class="card">
      <div class="table-header">
        <div>
          <h3>采集通道实时状态</h3>
          <p class="muted">共 {{ channels.length }} 个监测点，每行均可执行配置</p>
        </div>
        <button class="btn" @click="showForm('新增监测点')">新增监测点</button>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>通道</th>
            <th>测点</th>
            <th>最近采集</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="channel in channels" :key="channel.name">
            <td>{{ channel.name }}</td>
            <td>{{ channel.point }}</td>
            <td>{{ channel.last }}</td>
            <td>
              <span class="badge" :class="channel.badge">{{ channel.status }}</span>
            </td>
            <td class="actions">
              <button class="btn secondary" @click="showForm(`阈值调整 - ${channel.name}`)">阈值</button>
              <button class="btn ghost" @click="showAlert(`${channel.name} 已发送测试采集命令`)">测试采集</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="modal.visible" class="modal-backdrop">
      <div class="modal-panel">
        <h3>{{ modal.title }}</h3>
        <form v-if="modal.type === 'form'" @submit.prevent="submitForm">
          <div class="form-row">
            <label>采集速率 (Hz)</label>
            <input v-model="form.rate" type="number" min="1" required />
          </div>
          <div class="form-row">
            <label>灵敏度</label>
            <select v-model="form.sense">
              <option>高</option>
              <option>中</option>
              <option>低</option>
            </select>
          </div>
          <div class="form-row">
            <label>备注</label>
            <textarea v-model="form.remark" rows="2" placeholder="输入调整原因"></textarea>
          </div>
          <div class="modal-actions">
            <button class="btn" type="submit">提交</button>
            <button class="btn ghost" type="button" @click="closeModal">取消</button>
          </div>
        </form>
        <div v-else-if="modal.type === 'progress'">
          <p class="muted">{{ modal.message }}</p>
          <div class="progress-bar">
            <div class="fill" :style="{ width: modal.progress + '%' }"></div>
          </div>
          <p class="muted">{{ modal.progress }}% 已完成</p>
          <div class="modal-actions">
            <button class="btn ghost" @click="closeModal">关闭</button>
          </div>
        </div>
        <div v-else>
          <p class="muted">{{ modal.message }}</p>
          <div class="modal-actions">
            <button class="btn" @click="closeModal">知道了</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';

const metrics = [
  { label: '实时在线率', value: '99.2%', desc: '全部采集通道在线率', trend: '提升 +0.2%', badgeClass: 'success' },
  { label: '告警通道', value: '3/48', desc: '温升与振动预警', trend: '实时监控', badgeClass: 'warning' },
  { label: '数据吞吐', value: '18.4 MB/s', desc: '最近 5 分钟平均', trend: '平稳', badgeClass: 'success' },
];

const channels = reactive([
  { name: 'A01', point: '绕组温度', last: '14:22:06', status: '正常', badge: 'success' },
  { name: 'A02', point: '油面温度', last: '14:21:59', status: '正常', badge: 'success' },
  { name: 'B07', point: '振动位移', last: '14:21:40', status: '轻微波动', badge: 'warning' },
  { name: 'B11', point: '铁芯偏移', last: '14:21:31', status: '观察', badge: 'warning' },
  { name: 'C03', point: '局放脉冲', last: '14:21:18', status: '注意', badge: 'danger' },
]);

const points = [
  { x: 20, y: 110, value: 54 },
  { x: 70, y: 96, value: 56 },
  { x: 120, y: 84, value: 58 },
  { x: 170, y: 72, value: 61 },
  { x: 220, y: 78, value: 60 },
  { x: 270, y: 64, value: 63 },
  { x: 310, y: 58, value: 65 },
];

const linePoints = computed(() => points.map((p) => `${p.x},${p.y}`).join(' '));

const modal = reactive({ visible: false, title: '', message: '', type: 'alert', progress: 0 });
const form = reactive({ rate: 10, sense: '高', remark: '' });
const progressTimer = ref(null);

const showForm = (title) => {
  modal.visible = true;
  modal.title = title;
  modal.type = 'form';
};

const showProgress = (title) => {
  modal.visible = true;
  modal.title = title;
  modal.type = 'progress';
  modal.message = '正在与边缘采集器握手并刷新通道配置…';
  modal.progress = 20;
  clearInterval(progressTimer.value);
  progressTimer.value = setInterval(() => {
    if (modal.progress >= 100) {
      clearInterval(progressTimer.value);
    } else {
      modal.progress += 15;
    }
  }, 600);
};

const showAlert = (message) => {
  modal.visible = true;
  modal.title = '提示';
  modal.type = 'alert';
  modal.message = message;
};

const submitForm = () => {
  modal.type = 'alert';
  modal.title = '已提交';
  modal.message = '参数已下发至采集端，正在等待确认。';
};

const closeModal = () => {
  modal.visible = false;
  clearInterval(progressTimer.value);
};
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.metric h2 {
  margin: 6px 0;
}

.metric-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.chart-card {
  overflow: hidden;
}

.chart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.chart {
  margin-top: 12px;
  border-radius: 10px;
  background: linear-gradient(180deg, rgba(30, 136, 229, 0.08), transparent);
  padding: 8px;
}

.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.actions {
  display: flex;
  gap: 8px;
}

.modal-actions {
  margin-top: 12px;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}
</style>
