<template>
  <div>
    <div class="section-header">
      <h2>实时转运监控</h2>
      <div class="button-group">
        <button class="btn" @click="openModal('refresh')">车辆定位刷新</button>
        <button class="btn outline" @click="openModal('track')">轨迹回放</button>
        <button class="btn secondary" @click="openModal('node')">节点状态采集</button>
        <button class="btn secondary" @click="openModal('alert')">异常行为上报</button>
      </div>
    </div>

    <div class="card-grid">
      <div class="card">
        <h3>在线车辆</h3>
        <p>16 辆 / 18 辆</p>
      </div>
      <div class="card">
        <h3>异常提醒</h3>
        <p>2 条偏航预警</p>
      </div>
      <div class="card">
        <h3>节点采集完整率</h3>
        <p>96.3%</p>
      </div>
      <div class="card">
        <h3>平均速度</h3>
        <p>42 km/h</p>
      </div>
    </div>

    <div class="chart-box">
      <div class="chart card">
        <strong>车辆定位热度</strong>
        <div class="chart-bars">
          <span v-for="(bar, index) in heatBars" :key="index" :style="{ height: `${bar}%` }" />
        </div>
      </div>
      <div class="chart card">
        <strong>节点采集覆盖</strong>
        <div class="chart-bars">
          <span v-for="(bar, index) in nodeBars" :key="index" :style="{ height: `${bar}%` }" />
        </div>
      </div>
    </div>

    <div class="card">
      <div class="section-header">
        <h2>车辆监控列表</h2>
        <div class="tag">共 {{ monitorRows.length }} 条</div>
      </div>
      <table class="data-table">
        <thead>
          <tr>
            <th>车辆</th>
            <th>当前坐标</th>
            <th>轨迹节点</th>
            <th>速度</th>
            <th>状态</th>
            <th>最后上报</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in monitorRows" :key="row.vehicle">
            <td>{{ row.vehicle }}</td>
            <td>{{ row.position }}</td>
            <td>{{ row.node }}</td>
            <td>{{ row.speed }}</td>
            <td>{{ row.status }}</td>
            <td>{{ row.updated }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <Modal :show="modalState === 'refresh'" title="定位刷新完成" @close="closeModal">
      <p>已重新拉取所有车辆的实时坐标，最近刷新时间：{{ currentTime }}</p>
      <div class="modal-actions">
        <button class="btn" @click="closeModal">确认</button>
      </div>
    </Modal>

    <Modal :show="modalState === 'track'" title="轨迹回放" @close="closeModal">
      <p>正在加载选中车辆的轨迹数据。</p>
      <div class="progress-bar">
        <span :style="{ width: `${progress}%` }" />
      </div>
      <p>轨迹回放准备 {{ progress }}%</p>
      <div class="modal-actions">
        <button class="btn" @click="closeModal">完成</button>
      </div>
    </Modal>

    <Modal :show="modalState === 'node'" title="节点状态采集" @close="closeModal">
      <form>
        <div>
          <label>车辆编号</label>
          <input placeholder="津A-08321" />
        </div>
        <div>
          <label>节点类型</label>
          <select>
            <option>装车</option>
            <option>途中检查</option>
            <option>到达卸载</option>
          </select>
        </div>
        <div>
          <label>状态描述</label>
          <textarea rows="3" placeholder="填写节点采集说明" />
        </div>
      </form>
      <div class="modal-actions">
        <button class="btn secondary" @click="closeModal">取消</button>
        <button class="btn" @click="saveModal">提交采集</button>
      </div>
    </Modal>

    <Modal :show="modalState === 'alert'" title="异常行为上报" @close="closeModal">
      <form>
        <div>
          <label>车辆编号</label>
          <input placeholder="津B-21009" />
        </div>
        <div>
          <label>异常类型</label>
          <select>
            <option>偏航</option>
            <option>超速</option>
            <option>超时停留</option>
          </select>
        </div>
        <div>
          <label>异常描述</label>
          <textarea rows="3" placeholder="描述异常情况" />
        </div>
      </form>
      <div class="modal-actions">
        <button class="btn secondary" @click="closeModal">取消</button>
        <button class="btn" @click="saveModal">提交上报</button>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Modal from '../components/Modal.vue';

const modalState = ref('');
const progress = ref(0);
const currentTime = new Date().toLocaleString();

const heatBars = [70, 45, 80, 35, 60, 50, 75];
const nodeBars = [55, 65, 40, 70, 60, 45, 80];

const monitorRows = [
  { vehicle: '津A-08321', position: '39.12,117.34', node: '在途-北辰', speed: '45 km/h', status: '正常', updated: '10:12' },
  { vehicle: '津B-21009', position: '39.18,117.12', node: '偏航预警', speed: '52 km/h', status: '偏航', updated: '10:10' },
  { vehicle: '津C-55261', position: '39.08,117.22', node: '在途-津南', speed: '41 km/h', status: '正常', updated: '10:09' },
  { vehicle: '津A-19025', position: '39.21,117.41', node: '在途-北运河', speed: '38 km/h', status: '正常', updated: '10:08' },
  { vehicle: '津B-33108', position: '39.09,117.29', node: '等待出库', speed: '0 km/h', status: '待出发', updated: '10:07' },
  { vehicle: '津C-66772', position: '39.14,117.19', node: '在途-西青', speed: '44 km/h', status: '正常', updated: '10:06' },
  { vehicle: '津A-55081', position: '39.05,117.26', node: '等待出库', speed: '0 km/h', status: '待出发', updated: '10:05' },
  { vehicle: '津B-10229', position: '39.19,117.18', node: '在途-武清', speed: '46 km/h', status: '正常', updated: '10:04' },
  { vehicle: '津C-99872', position: '39.11,117.33', node: '在途-东丽', speed: '49 km/h', status: '正常', updated: '10:03' },
  { vehicle: '津A-78211', position: '39.02,117.27', node: '等待出库', speed: '0 km/h', status: '待出发', updated: '10:02' },
  { vehicle: '津B-30555', position: '39.17,117.25', node: '在途-津南', speed: '42 km/h', status: '正常', updated: '10:01' },
  { vehicle: '津A-55822', position: '39.16,117.14', node: '在途-宝坻', speed: '40 km/h', status: '正常', updated: '10:00' },
  { vehicle: '津C-61123', position: '39.07,117.38', node: '在途-静海', speed: '43 km/h', status: '正常', updated: '09:59' },
  { vehicle: '津B-19031', position: '39.15,117.11', node: '等待出库', speed: '0 km/h', status: '待出发', updated: '09:58' },
  { vehicle: '津A-09220', position: '39.24,117.27', node: '在途-宝坻', speed: '44 km/h', status: '正常', updated: '09:57' },
  { vehicle: '津C-88211', position: '39.06,117.17', node: '在途-津南', speed: '46 km/h', status: '正常', updated: '09:56' },
  { vehicle: '津A-66718', position: '39.22,117.31', node: '在途-北辰', speed: '39 km/h', status: '正常', updated: '09:55' },
  { vehicle: '津B-77211', position: '39.10,117.20', node: '在途-东丽', speed: '43 km/h', status: '正常', updated: '09:54' },
  { vehicle: '津C-11209', position: '39.13,117.24', node: '在途-西青', speed: '42 km/h', status: '正常', updated: '09:53' },
  { vehicle: '津A-99331', position: '39.04,117.28', node: '超时停留', speed: '5 km/h', status: '超时', updated: '09:52' }
];

const openModal = (state) => {
  modalState.value = state;
  if (state === 'track') {
    progress.value = 0;
    const interval = setInterval(() => {
      progress.value = Math.min(progress.value + 14, 100);
      if (progress.value >= 100) {
        clearInterval(interval);
      }
    }, 120);
  }
};

const closeModal = () => {
  modalState.value = '';
};

const saveModal = () => {
  modalState.value = '';
};
</script>
