<template>
  <div class="module">
    <div class="module-header">
      <div>
        <h3>流通调度中心</h3>
        <p>对接车辆、冷链与在途节点，动态匹配任务。</p>
      </div>
      <div class="actions">
        <button @click="showForm = true">发布调度</button>
        <button @click="showProgress = true">路线进度</button>
        <button @click="showInfo = true">指令提示</button>
      </div>
    </div>

    <div class="media-grid">
      <div class="card">
        <h4>运输网络图</h4>
        <svg viewBox="0 0 320 160" aria-label="运输网络图">
          <rect x="20" y="30" width="80" height="40" rx="12" fill="#bfdbfe" />
          <rect x="200" y="20" width="90" height="50" rx="12" fill="#bbf7d0" />
          <rect x="120" y="100" width="90" height="40" rx="12" fill="#fde68a" />
          <path d="M100 50 L200 45" stroke="#2563eb" stroke-width="3" />
          <path d="M80 70 L160 110" stroke="#2563eb" stroke-width="3" />
          <path d="M245 70 L180 110" stroke="#2563eb" stroke-width="3" />
        </svg>
        <p>当前共 18 条线路同步运行。</p>
      </div>
      <div class="card">
        <h4>调度指标</h4>
        <img src="/src/assets/field.svg" alt="调度指标" />
        <p>冷链车载温度合规率 99.1%。</p>
      </div>
    </div>

    <div class="table-card">
      <h4>在途任务清单</h4>
      <table>
        <thead>
          <tr>
            <th>任务号</th>
            <th>起点</th>
            <th>目的地</th>
            <th>车辆</th>
            <th>预计到达</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="task in tasks" :key="task.id">
            <td>{{ task.id }}</td>
            <td>{{ task.from }}</td>
            <td>{{ task.to }}</td>
            <td>{{ task.vehicle }}</td>
            <td>{{ task.eta }}</td>
            <td><span class="status">{{ task.status }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseModal :open="showForm" title="发布调度任务" @close="showForm = false">
      <form class="form-grid">
        <label>
          线路名称
          <input type="text" placeholder="如：华东-华南冷链" />
        </label>
        <label>
          车辆选择
          <select>
            <option>冷链车 A-12</option>
            <option>冷链车 B-07</option>
            <option>厢式车 C-03</option>
          </select>
        </label>
        <label>
          装载品类
          <input type="text" placeholder="如：鲜食玉米" />
        </label>
        <label>
          调度优先级
          <select>
            <option>高</option>
            <option>中</option>
            <option>低</option>
          </select>
        </label>
      </form>
    </BaseModal>

    <BaseModal :open="showProgress" title="路线进度监控" @close="showProgress = false">
      <div class="progress">
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
      </div>
      <p>当前线路已完成 {{ progress }}%，剩余 120 公里。</p>
    </BaseModal>

    <BaseModal :open="showInfo" title="调度提示" @close="showInfo = false">
      <p>建议调整 06 号车辆温控策略，系统检测到温度波动。</p>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const showForm = ref(false);
const showProgress = ref(false);
const showInfo = ref(false);
const progress = ref(64);

const tasks = [
  { id: 'TC-901', from: '上海', to: '广州', vehicle: '冷链车 A-12', eta: '2024-06-13 18:00', status: '运输中' },
  { id: 'TC-902', from: '苏州', to: '深圳', vehicle: '冷链车 B-07', eta: '2024-06-13 21:30', status: '装载中' },
  { id: 'TC-903', from: '南昌', to: '厦门', vehicle: '厢式车 C-03', eta: '2024-06-13 15:20', status: '运输中' },
  { id: 'TC-904', from: '武汉', to: '长沙', vehicle: '冷链车 A-05', eta: '2024-06-13 14:10', status: '待出发' },
  { id: 'TC-905', from: '合肥', to: '宁波', vehicle: '冷链车 D-11', eta: '2024-06-13 19:50', status: '运输中' },
  { id: 'TC-906', from: '杭州', to: '福州', vehicle: '冷链车 A-16', eta: '2024-06-13 22:00', status: '运输中' },
  { id: 'TC-907', from: '济南', to: '南京', vehicle: '厢式车 C-08', eta: '2024-06-13 16:40', status: '待出发' },
  { id: 'TC-908', from: '郑州', to: '合肥', vehicle: '冷链车 B-02', eta: '2024-06-13 17:10', status: '运输中' },
  { id: 'TC-909', from: '成都', to: '重庆', vehicle: '冷链车 A-19', eta: '2024-06-13 13:30', status: '装载中' },
  { id: 'TC-910', from: '长沙', to: '贵阳', vehicle: '厢式车 C-14', eta: '2024-06-13 20:15', status: '运输中' },
  { id: 'TC-911', from: '南宁', to: '广州', vehicle: '冷链车 B-06', eta: '2024-06-13 23:40', status: '运输中' },
  { id: 'TC-912', from: '昆明', to: '贵阳', vehicle: '冷链车 A-03', eta: '2024-06-13 19:20', status: '待出发' }
];
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.module-header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.module-header h3 {
  margin: 0 0 4px;
}

.module-header p {
  margin: 0;
  color: #64748b;
}

.actions {
  display: flex;
  gap: 12px;
}

.actions button {
  border: none;
  background: #ede9fe;
  color: #6d28d9;
  padding: 8px 14px;
  border-radius: 10px;
  cursor: pointer;
}

.media-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}

.card {
  background: #f8fafc;
  border-radius: 16px;
  padding: 16px;
}

.card img {
  width: 100%;
  border-radius: 12px;
  margin: 10px 0;
}

.card svg {
  width: 100%;
  height: 160px;
  background: #ffffff;
  border-radius: 12px;
  margin: 10px 0;
}

.table-card {
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 16px;
  overflow-x: auto;
}

.table-card table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.table-card th,
.table-card td {
  padding: 10px 8px;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

.status {
  background: #fee2e2;
  color: #b91c1c;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
}

.form-grid {
  display: grid;
  gap: 12px;
}

.form-grid label {
  display: grid;
  gap: 6px;
  font-size: 13px;
}

.form-grid input,
.form-grid select {
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.progress {
  background: #e2e8f0;
  border-radius: 999px;
  height: 10px;
  overflow: hidden;
  margin-bottom: 10px;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #8b5cf6, #ec4899);
}
</style>
