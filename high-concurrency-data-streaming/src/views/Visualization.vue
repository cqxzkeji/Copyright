<template>
  <section class="page">
    <div class="card">
      <div class="card-header">
        <div>
          <h2>实时监控大屏</h2>
          <p>关键指标可视化与告警联动展示。</p>
        </div>
        <div class="actions">
          <button class="primary" @click="openBoard">新增看板</button>
          <button class="secondary" @click="openAlert">配置告警</button>
          <button class="ghost" @click="openTip">展示提示</button>
        </div>
      </div>
      <div class="visual-grid">
        <div class="visual-card">
          <h3>实时流量</h3>
          <div class="spark">
            <span v-for="(value, index) in trafficTrend" :key="index" :style="{ height: value + '%' }" />
          </div>
          <p>当前：7.1M/s</p>
        </div>
        <div class="visual-card">
          <h3>告警分布</h3>
          <div class="radar">
            <div class="radar-layer" v-for="layer in 4" :key="layer"></div>
            <div class="radar-point" v-for="point in radarPoints" :key="point.label" :style="point.style"></div>
          </div>
          <p>已触发 18 条告警</p>
        </div>
        <div class="visual-card">
          <h3>系统响应</h3>
          <div class="progress-list">
            <div class="progress-item" v-for="item in responseStats" :key="item.label">
              <span>{{ item.label }}</span>
              <div class="progress-bar"><span :style="{ width: item.value + '%' }"></span></div>
            </div>
          </div>
          <p>平均响应：420ms</p>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <div>
          <h2>实时告警列表</h2>
          <p>用户交互与告警通知记录。</p>
        </div>
      </div>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>告警编号</th>
              <th>级别</th>
              <th>来源</th>
              <th>触发时间</th>
              <th>处置状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="alert in alerts" :key="alert.id">
              <td>{{ alert.id }}</td>
              <td>{{ alert.level }}</td>
              <td>{{ alert.source }}</td>
              <td>{{ alert.time }}</td>
              <td><span :class="['badge', alert.statusClass]">{{ alert.status }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Modal v-model="showBoard" title="新增可视化看板" @confirm="saveBoard">
      <div class="form-grid">
        <label>
          看板名称
          <input v-model="boardForm.name" placeholder="实时流量监控" />
        </label>
        <label>
          可视化主题
          <select v-model="boardForm.theme">
            <option>亮色运营</option>
            <option>数据洞察</option>
            <option>告警追踪</option>
          </select>
        </label>
        <label>
          刷新频率
          <input v-model="boardForm.interval" placeholder="例如：5s" />
        </label>
      </div>
    </Modal>

    <Modal v-model="showAlert" title="告警配置进度" @confirm="closeAlert">
      <div>
        <div class="progress-label">正在下发告警规则</div>
        <div class="progress-bar"><span :style="{ width: alertProgress + '%' }" /></div>
        <p class="progress-note">规则同步至 12 个监控节点。</p>
      </div>
    </Modal>

    <Modal v-model="showTip" title="展示提示" @confirm="closeTip">
      <ul class="tip-list">
        <li>建议开启大屏轮播以覆盖更多指标。</li>
        <li>可视化图表支持拖拽布局与自定义主题。</li>
        <li>告警通知可联动短信与语音渠道。</li>
      </ul>
    </Modal>
  </section>
</template>

<script setup>
import { ref, reactive } from 'vue';
import Modal from '../components/Modal.vue';

const showBoard = ref(false);
const showAlert = ref(false);
const showTip = ref(false);

const boardForm = reactive({
  name: '',
  theme: '亮色运营',
  interval: ''
});

const trafficTrend = [32, 40, 45, 52, 60, 58, 64, 70, 68, 74, 80, 72];

const radarPoints = [
  { label: 'A', style: { top: '20%', left: '52%' } },
  { label: 'B', style: { top: '42%', left: '70%' } },
  { label: 'C', style: { top: '66%', left: '46%' } },
  { label: 'D', style: { top: '54%', left: '28%' } }
];

const responseStats = [
  { label: '接口响应', value: 82 },
  { label: '告警确认', value: 68 },
  { label: '工单闭环', value: 74 }
];

const alerts = Array.from({ length: 20 }, (_, index) => ({
  id: `AL-${3001 + index}`,
  level: index % 3 === 0 ? '高' : index % 3 === 1 ? '中' : '低',
  source: index % 2 === 0 ? '网络监测' : '传感器集群',
  time: `10:${String(index + 10).padStart(2, '0')}`,
  status: index % 4 === 0 ? '待确认' : '已处理',
  statusClass: index % 4 === 0 ? 'warning' : 'success'
}));

const alertProgress = ref(66);

const openBoard = () => {
  showBoard.value = true;
};

const openAlert = () => {
  showAlert.value = true;
};

const openTip = () => {
  showTip.value = true;
};

const saveBoard = () => {
  showBoard.value = false;
};

const closeAlert = () => {
  showAlert.value = false;
};

const closeTip = () => {
  showTip.value = false;
};
</script>

<style scoped>
.page {
  display: grid;
  gap: 24px;
}

.card {
  background: #fff;
  border-radius: 18px;
  padding: 24px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.06);
}

.card-header {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
}

.card-header h2 {
  font-size: 18px;
  margin-bottom: 6px;
}

.card-header p {
  font-size: 13px;
  color: #64748b;
}

.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.primary,
.secondary,
.ghost {
  border: none;
  padding: 8px 16px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 13px;
}

.primary {
  background: #2563eb;
  color: #fff;
}

.secondary {
  background: #e2e8f0;
}

.ghost {
  background: #f8fafc;
  border: 1px dashed #cbd5f5;
}

.visual-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin-top: 20px;
}

.visual-card {
  background: #f8fafc;
  border-radius: 16px;
  padding: 16px;
  border: 1px solid #e2e8f0;
  display: grid;
  gap: 12px;
}

.visual-card h3 {
  font-size: 15px;
}

.spark {
  display: flex;
  align-items: flex-end;
  gap: 6px;
  height: 120px;
}

.spark span {
  flex: 1;
  background: linear-gradient(180deg, #38bdf8, #2563eb);
  border-radius: 6px 6px 4px 4px;
}

.radar {
  position: relative;
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(37, 99, 235, 0.12), transparent 60%);
  margin: 0 auto;
}

.radar-layer {
  position: absolute;
  inset: 12px;
  border: 1px dashed #93c5fd;
  border-radius: 50%;
}

.radar-layer:nth-child(2) {
  inset: 28px;
}

.radar-layer:nth-child(3) {
  inset: 44px;
}

.radar-layer:nth-child(4) {
  inset: 60px;
}

.radar-point {
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #2563eb;
}

.progress-list {
  display: grid;
  gap: 10px;
}

.progress-item {
  display: grid;
  gap: 6px;
  font-size: 13px;
}

.progress-bar {
  height: 8px;
  background: #e2e8f0;
  border-radius: 999px;
  overflow: hidden;
}

.progress-bar span {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, #a855f7, #6366f1);
}

.table-wrapper {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

th,
td {
  padding: 12px;
  border-bottom: 1px solid #e2e8f0;
  text-align: left;
}

thead {
  background: #f1f5f9;
}

.badge {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
}

.success {
  background: #dcfce7;
  color: #15803d;
}

.warning {
  background: #fef9c3;
  color: #a16207;
}

.form-grid {
  display: grid;
  gap: 12px;
}

.form-grid label {
  display: grid;
  gap: 6px;
  font-size: 13px;
  color: #475569;
}

.form-grid input,
.form-grid select {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 8px 10px;
}

.progress-label {
  font-weight: 600;
  margin-bottom: 8px;
}

.progress-note {
  margin-top: 10px;
  font-size: 13px;
  color: #64748b;
}

.tip-list {
  display: grid;
  gap: 8px;
  padding-left: 16px;
  color: #475569;
}
</style>
