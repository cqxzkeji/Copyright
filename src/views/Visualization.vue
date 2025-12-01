<template>
  <div>
    <div class="card header-card">
      <div>
        <h2>可视化与决策支持</h2>
        <p>将融合输出渲染为实时面板，并提供路侧策略建议。</p>
      </div>
      <div class="btn-group">
        <button class="primary-btn" @click="openDashboard">加载看板</button>
        <button class="primary-btn" @click="openDecision">生成策略</button>
        <button class="primary-btn" @click="openExport">导出快照</button>
      </div>
    </div>

    <div class="card">
      <h3>决策摘要</h3>
      <table>
        <thead>
          <tr>
            <th>时间</th>
            <th>路口</th>
            <th>风险等级</th>
            <th>建议动作</th>
            <th>执行窗口</th>
            <th>责任人</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in decisions" :key="row.time + row.location">
            <td>{{ row.time }}</td>
            <td>{{ row.location }}</td>
            <td>{{ row.level }}</td>
            <td>{{ row.action }}</td>
            <td>{{ row.window }}</td>
            <td>{{ row.owner }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="card">
      <h3>通行效率</h3>
      <div class="chart-row">
        <div v-for="flow in flows" :key="flow.label" class="chart-bar" :style="{ height: flow.value + 'px' }" :title="flow.label + ' ' + flow.value + '辆/分'"></div>
      </div>
    </div>

    <div v-if="dashboardModal" class="modal-backdrop" @click.self="dashboardModal = false">
      <div class="modal-content">
        <h3>实时看板加载</h3>
        <p>正在加载区域热力图与交通态势。</p>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: dashboardProgress + '%' }"></div>
        </div>
      </div>
    </div>

    <div v-if="decisionModal" class="modal-backdrop" @click.self="decisionModal = false">
      <div class="modal-content">
        <h3>生成策略</h3>
        <div class="form-grid">
          <label>策略类型</label>
          <select v-model="decisionForm.type">
            <option>信号灯优化</option>
            <option>车道重分配</option>
            <option>限速提示</option>
          </select>
          <label>覆盖范围</label>
          <input v-model="decisionForm.scope" placeholder="如 东西向" />
          <label>执行时长(分钟)</label>
          <input v-model.number="decisionForm.duration" type="number" />
          <label>优先级</label>
          <select v-model="decisionForm.priority">
            <option>高</option>
            <option>中</option>
            <option>低</option>
          </select>
        </div>
        <div class="btn-row">
          <button class="primary-btn" @click="generateDecision">生成</button>
          <button class="secondary" @click="decisionModal = false">取消</button>
        </div>
      </div>
    </div>

    <div v-if="exportModal" class="modal-backdrop" @click.self="exportModal = false">
      <div class="modal-content">
        <h3>导出快照</h3>
        <p>选择导出方式以供研判。</p>
        <div class="btn-row">
          <button class="primary-btn" @click="confirmExport('PNG')">PNG</button>
          <button class="primary-btn" @click="confirmExport('SVG')">SVG</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const decisions = ref([
  { time: '10:01', location: 'A口', level: '中', action: '相位延长5秒', window: '10:02-10:07', owner: '李工' },
  { time: '10:02', location: 'B口', level: '高', action: '开启黄闪', window: '10:03-10:08', owner: '李工' },
  { time: '10:03', location: 'C口', level: '中', action: '非机动车分流', window: '10:04-10:09', owner: '王工' },
  { time: '10:04', location: 'D口', level: '低', action: '保持当前策略', window: '10:05-10:10', owner: '张工' },
  { time: '10:05', location: 'E口', level: '中', action: '行人绿灯+5秒', window: '10:06-10:11', owner: '张工' },
  { time: '10:06', location: 'F口', level: '高', action: '车道动态切换', window: '10:07-10:12', owner: '王工' },
  { time: '10:07', location: 'G口', level: '中', action: '限速40km/h', window: '10:08-10:13', owner: '李工' },
  { time: '10:08', location: 'H口', level: '低', action: '保持当前策略', window: '10:09-10:14', owner: '王工' },
  { time: '10:09', location: 'I口', level: '中', action: '相位延长3秒', window: '10:10-10:15', owner: '张工' },
  { time: '10:10', location: 'J口', level: '高', action: '行人红灯提示', window: '10:11-10:16', owner: '李工' },
  { time: '10:11', location: 'K口', level: '中', action: '车道重分配', window: '10:12-10:17', owner: '王工' },
  { time: '10:12', location: 'L口', level: '低', action: '保持当前策略', window: '10:13-10:18', owner: '张工' }
]);

const flows = ref([
  { label: '北向', value: 140 },
  { label: '南向', value: 120 },
  { label: '东向', value: 160 },
  { label: '西向', value: 130 },
  { label: '转向', value: 110 }
]);

const dashboardModal = ref(false);
const decisionModal = ref(false);
const exportModal = ref(false);
const dashboardProgress = ref(0);
const decisionForm = reactive({ type: '信号灯优化', scope: '东西向', duration: 15, priority: '高' });
let dashboardTimer;

const openDashboard = () => {
  dashboardModal.value = true;
  dashboardProgress.value = 0;
  dashboardTimer = setInterval(() => {
    if (dashboardProgress.value >= 100) {
      clearInterval(dashboardTimer);
    } else {
      dashboardProgress.value += 20;
    }
  }, 220);
};

const openDecision = () => {
  decisionModal.value = true;
};

const openExport = () => {
  exportModal.value = true;
};

const generateDecision = () => {
  decisions.value.unshift({
    time: '10:13',
    location: decisionForm.scope,
    level: decisionForm.priority,
    action: decisionForm.type,
    window: '10:14-10:19',
    owner: '自动建议'
  });
  decisionModal.value = false;
};

const confirmExport = (type) => {
  exportModal.value = false;
  alert(`${type} 导出成功`);
};
</script>

<style scoped>
.header-card {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.btn-group {
  display: flex;
  gap: 10px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin: 12px 0;
}

.btn-row {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.secondary {
  background: #e5e7eb;
  border: none;
  padding: 10px 16px;
  border-radius: 10px;
  font-weight: 600;
}
</style>
