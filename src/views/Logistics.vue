<template>
  <section class="module">
    <div class="section-header">
      <div>
        <h3>物流与仓储协同监控</h3>
        <p class="muted">监测发运、在途与入仓时效，保障冷链品质。</p>
      </div>
      <div class="section-actions">
        <button class="btn" @click="showDispatch = true">调度车辆</button>
        <button class="btn secondary" @click="showTrack = true">刷新在途温控</button>
        <button class="btn outline" @click="showAlert = true">异常提醒</button>
      </div>
    </div>

    <div class="grid two">
      <div class="table-card">
        <div class="table-head">
          <h4>在途与入仓</h4>
          <small class="muted">实时跟踪 10 个车次</small>
        </div>
        <table>
          <thead>
            <tr>
              <th>车次/运单</th>
              <th>品类</th>
              <th>里程</th>
              <th>仓库</th>
              <th>温度</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="leg in legs" :key="leg.id">
              <td>{{ leg.id }}</td>
              <td>{{ leg.product }}</td>
              <td>{{ leg.distance }}</td>
              <td>{{ leg.warehouse }}</td>
              <td>{{ leg.temp }}</td>
              <td :class="leg.statusColor">{{ leg.status }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="table-card">
        <div class="table-head">
          <h4>仓容与周转</h4>
          <small class="muted">仓位占比与出入库节奏</small>
        </div>
        <Doughnut :data="doughnutData" :options="doughnutOptions" />
        <div class="turnover">
          <div class="item" v-for="item in turnovers" :key="item.label">
            <p class="muted">{{ item.label }}</p>
            <div class="bar-wrap">
              <div class="bar" :style="{ width: item.value + '%' }"></div>
            </div>
            <strong>{{ item.value }}%</strong>
          </div>
        </div>
      </div>
    </div>
  </section>

  <div v-if="showDispatch" class="modal-overlay" @click.self="showDispatch = false">
    <div class="modal">
      <h3>调度车辆</h3>
      <form @submit.prevent="submitDispatch">
        <label>起点仓<input v-model="dispatch.origin" required /></label>
        <label>目的仓<input v-model="dispatch.target" required /></label>
        <label>车牌号<input v-model="dispatch.plate" required /></label>
        <label>载重(吨)<input v-model.number="dispatch.capacity" type="number" min="1" required /></label>
        <div class="actions">
          <button class="btn outline" type="button" @click="showDispatch = false">取消</button>
          <button class="btn" type="submit">下发调度</button>
        </div>
      </form>
    </div>
  </div>

  <div v-if="showTrack" class="modal-overlay" @click.self="showTrack = false">
    <div class="modal">
      <h3>在途温控刷新</h3>
      <p>采集车载冷链设备最新数据，预计 3 秒完成。</p>
      <div class="progress"><div class="bar" style="width: 52%"></div></div>
      <div class="actions">
        <button class="btn" @click="showTrack = false">继续监控</button>
      </div>
    </div>
  </div>

  <div v-if="showAlert" class="modal-overlay" @click.self="showAlert = false">
    <div class="modal">
      <h3>温控异常提醒</h3>
      <p>已通知车牌 {{ dispatch.plate || '湘A2398' }} 调高蒸发器功率，避免温差过大。</p>
      <div class="actions">
        <button class="btn" @click="showAlert = false">确认</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Doughnut } from 'vue-chartjs';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const legs = ref([
  { id: 'XD-2301', product: '柑橘', distance: '210km', warehouse: '华东一号仓', temp: '4℃', status: '在途', statusColor: 'status-purple' },
  { id: 'XD-2302', product: '生菜', distance: '80km', warehouse: '华东冷链仓', temp: '6℃', status: '待入仓', statusColor: 'status-orange' },
  { id: 'XD-2303', product: '鲜奶', distance: '35km', warehouse: '华北冷库', temp: '3℃', status: '到仓卸货', statusColor: 'status-green' },
  { id: 'XD-2304', product: '苹果', distance: '560km', warehouse: '西南分拨', temp: '5℃', status: '在途', statusColor: 'status-purple' },
  { id: 'XD-2305', product: '辣椒', distance: '120km', warehouse: '西南分拨', temp: '7℃', status: '在途', statusColor: 'status-purple' },
  { id: 'XD-2306', product: '玉米', distance: '30km', warehouse: '东北集货仓', temp: '9℃', status: '待入仓', statusColor: 'status-orange' },
  { id: 'XD-2307', product: '龙虾', distance: '18km', warehouse: '华中生鲜仓', temp: '2℃', status: '到仓卸货', statusColor: 'status-green' },
  { id: 'XD-2308', product: '鲜切花', distance: '460km', warehouse: '华东花卉仓', temp: '8℃', status: '在途', statusColor: 'status-purple' },
  { id: 'XD-2309', product: '牛肉', distance: '90km', warehouse: '西北冷链仓', temp: '-1℃', status: '在途', statusColor: 'status-purple' },
  { id: 'XD-2310', product: '香菇', distance: '55km', warehouse: '华北分拨', temp: '10℃', status: '待入仓', statusColor: 'status-orange' },
]);

const doughnutData = ref({
  labels: ['冷链库位', '常温库位', '预备库位'],
  datasets: [
    {
      data: [55, 30, 15],
      backgroundColor: ['#3a86ff', '#ffbe0b', '#a78bfa'],
      borderWidth: 0,
    },
  ],
});

const doughnutOptions = ref({
  plugins: { legend: { position: 'bottom' } },
  responsive: true,
});

const turnovers = ref([
  { label: '冷链出库周转', value: 76 },
  { label: '常温出库周转', value: 64 },
  { label: '入仓预约达成', value: 88 },
]);

const showDispatch = ref(false);
const showTrack = ref(false);
const showAlert = ref(false);
const dispatch = ref({ origin: '', target: '', plate: '', capacity: 10 });

const submitDispatch = () => {
  showDispatch.value = false;
  alert(`已调度车辆 ${dispatch.value.plate}，载重 ${dispatch.value.capacity} 吨`);
};
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.muted {
  color: var(--muted);
}

.table-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 8px;
}

.turnover {
  margin-top: 16px;
  display: grid;
  gap: 10px;
}

.bar-wrap {
  background: #f3f4f6;
  border-radius: 999px;
  height: 10px;
  overflow: hidden;
}

.bar {
  height: 100%;
  background: linear-gradient(135deg, #3a86ff, #8338ec);
}
</style>
