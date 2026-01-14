<template>
  <section class="module">
    <div class="module-header">
      <div>
        <h2>设备接入与参数配置</h2>
        <p>集中管理设备接入、轴系、工艺与配方参数。</p>
      </div>
      <div class="actions">
        <button class="primary" @click="openModal('add')">新增设备</button>
        <button class="ghost" @click="openModal('sync')">同步设备清单</button>
        <button class="ghost" @click="openModal('axis')">校验轴系映射</button>
      </div>
    </div>

    <div class="grid">
      <div class="card">
        <h3>接入状态总览</h3>
        <div class="chart">
          <div v-for="item in chart" :key="item.name" class="bar">
            <span>{{ item.name }}</span>
            <div class="bar-track">
              <div class="bar-fill" :style="{ width: item.value + '%' }"></div>
            </div>
            <strong>{{ item.value }}%</strong>
          </div>
        </div>
      </div>
      <div class="card">
        <h3>工艺参数模板</h3>
        <div class="param-list">
          <div v-for="param in params" :key="param.name" class="param-item">
            <span>{{ param.name }}</span>
            <strong>{{ param.value }}</strong>
          </div>
        </div>
        <button class="primary" @click="openModal('apply')">下发参数模板</button>
      </div>
    </div>

    <div class="card table-card">
      <div class="table-header">
        <h3>设备接入清单</h3>
        <button class="ghost" @click="openModal('edit')">批量修改阈值</button>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>设备编号</th>
              <th>工作站</th>
              <th>在线状态</th>
              <th>主轴温度</th>
              <th>刀头类型</th>
              <th>维护窗口</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in tableRows" :key="row.id">
              <td>{{ row.id }}</td>
              <td>{{ row.station }}</td>
              <td>
                <span :class="['status-dot', row.status === '在线' ? 'ok' : 'warn']"></span>
                {{ row.status }}
              </td>
              <td>{{ row.temp }}℃</td>
              <td>{{ row.head }}</td>
              <td>{{ row.window }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Modal :show="modal.show" :title="modal.title" :onClose="closeModal">
      <div v-if="modal.type === 'add'" class="form-grid">
        <label>
          设备编号
          <input v-model="form.deviceId" type="text" />
        </label>
        <label>
          工位名称
          <input v-model="form.station" type="text" />
        </label>
        <label>
          接入协议
          <select v-model="form.protocol">
            <option>EtherCAT</option>
            <option>OPC UA</option>
            <option>Modbus TCP</option>
          </select>
        </label>
        <label>
          轴系数量
          <input v-model.number="form.axes" type="number" min="3" />
        </label>
      </div>
      <div v-else-if="modal.type === 'sync'" class="info-block">
        <p>系统将拉取设备最新注册信息并与当前清单比对。</p>
        <div class="progress">
          <div class="progress-bar" :style="{ width: progress + '%' }"></div>
        </div>
        <small>预计耗时 18 秒</small>
      </div>
      <div v-else-if="modal.type === 'axis'" class="info-block">
        <p>轴系映射校验已发现 2 处需要确认的偏差。</p>
        <ul>
          <li>切割台 B3：Y 轴编码器偏移 0.12mm。</li>
          <li>导轨 C1：同步回零窗口需延长 0.5s。</li>
        </ul>
      </div>
      <div v-else-if="modal.type === 'apply'" class="info-block">
        <p>确认将“高精度复合材料”模板下发至 8 台在线设备。</p>
        <div class="progress">
          <div class="progress-bar" :style="{ width: progress + '%' }"></div>
        </div>
        <small>已完成 {{ progress }}%</small>
      </div>
      <div v-else class="form-grid">
        <label>
          温度上限
          <input v-model="form.tempLimit" type="number" />
        </label>
        <label>
          振动阈值
          <input v-model="form.vibration" type="number" />
        </label>
        <label>
          冷却模式
          <select v-model="form.cooling">
            <option>自动调节</option>
            <option>强制冷却</option>
            <option>节能模式</option>
          </select>
        </label>
      </div>
      <template #footer>
        <button class="ghost" type="button" @click="closeModal">关闭</button>
        <button class="primary" type="button" @click="confirmModal">确认提交</button>
      </template>
    </Modal>
  </section>
</template>

<script setup>
import { ref, onBeforeUnmount } from 'vue';
import Modal from '../components/Modal.vue';

const tableRows = Array.from({ length: 20 }, (_, index) => ({
  id: `DC-${(index + 1).toString().padStart(3, '0')}`,
  station: `切割台 ${String.fromCharCode(65 + (index % 6))}${index % 4 + 1}`,
  status: index % 5 === 0 ? '维护' : '在线',
  temp: (58 + index % 7).toFixed(1),
  head: index % 2 === 0 ? '激光复合' : '水刀微喷',
  window: `周${(index % 5) + 1} 08:00-10:00`
}));

const chart = [
  { name: '通讯稳定率', value: 98 },
  { name: '轴系同步率', value: 94 },
  { name: '配方一致率', value: 91 }
];

const params = [
  { name: '主轴转速', value: '3200 rpm' },
  { name: '进给速度', value: '1.6 m/min' },
  { name: '冷却压力', value: '0.8 MPa' },
  { name: '磨损补偿', value: '0.15 mm' }
];

const modal = ref({
  show: false,
  type: 'add',
  title: ''
});

const form = ref({
  deviceId: 'DC-021',
  station: '切割台 D2',
  protocol: 'EtherCAT',
  axes: 6,
  tempLimit: 72,
  vibration: 3.5,
  cooling: '自动调节'
});

const progress = ref(25);
const timer = ref(null);

const openModal = (type) => {
  modal.value.type = type;
  modal.value.show = true;
  modal.value.title =
    type === 'add'
      ? '新增设备接入'
      : type === 'sync'
      ? '同步设备清单'
      : type === 'axis'
      ? '轴系映射校验'
      : type === 'apply'
      ? '下发工艺模板'
      : '批量修改阈值';
  if (type === 'sync' || type === 'apply') {
    progress.value = 20;
    if (timer.value) clearInterval(timer.value);
    timer.value = setInterval(() => {
      progress.value = Math.min(progress.value + 10, 100);
    }, 300);
  }
};

const closeModal = () => {
  modal.value.show = false;
  if (timer.value) clearInterval(timer.value);
};

const confirmModal = () => {
  closeModal();
};

onBeforeUnmount(() => {
  if (timer.value) clearInterval(timer.value);
});
</script>

<style scoped>
.module {
  display: grid;
  gap: 24px;
}

.module-header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 16px;
}

.module-header p {
  color: var(--muted);
}

.actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.primary,
.ghost {
  padding: 10px 16px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-weight: 600;
}

.primary {
  background: var(--primary);
  color: white;
}

.ghost {
  background: white;
  border: 1px solid var(--border);
  color: var(--text);
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.card {
  background: var(--card);
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
  display: grid;
  gap: 16px;
}

.chart {
  display: grid;
  gap: 14px;
}

.bar {
  display: grid;
  gap: 6px;
  font-size: 13px;
}

.bar-track {
  background: #eef1f7;
  border-radius: 999px;
  height: 10px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #2f6bff, #12b981);
}

.param-list {
  display: grid;
  gap: 10px;
}

.param-item {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  padding: 8px 12px;
  border-radius: 10px;
  background: #f7f9ff;
}

.table-card {
  gap: 12px;
}

.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.table-wrap {
  overflow: auto;
}

th,
td {
  text-align: left;
  padding: 10px 12px;
  font-size: 13px;
  border-bottom: 1px solid var(--border);
}

.status-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 6px;
}

.status-dot.ok {
  background: var(--accent);
}

.status-dot.warn {
  background: var(--warning);
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
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 8px 10px;
}

.info-block {
  display: grid;
  gap: 12px;
}

.progress {
  background: #e7eefc;
  border-radius: 999px;
  overflow: hidden;
  height: 10px;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #2f6bff, #12b981);
  transition: width 0.3s ease;
}
</style>
