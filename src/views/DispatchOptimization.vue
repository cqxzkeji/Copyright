<template>
  <div class="grid" style="grid-template-columns: 2fr 1fr;">
    <div class="card">
      <header class="section-header">
        <div>
          <h2>车辆调度与路径优化</h2>
          <p class="hint">多仓多车联合分配，兼顾装载、禁行与司机工时</p>
        </div>
        <div class="actions">
          <button class="btn" @click="openModal('optimize')">运行优化</button>
          <button class="btn secondary" @click="openModal('insert')">动态插单</button>
        </div>
      </header>
      <table>
        <thead>
          <tr>
            <th>线路</th>
            <th>仓库</th>
            <th>车型</th>
            <th>装载</th>
            <th>里程</th>
            <th>准点</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="route in routes" :key="route.name">
            <td>{{ route.name }}</td>
            <td>{{ route.wh }}</td>
            <td>{{ route.vehicle }}</td>
            <td>{{ route.load }}%</td>
            <td>{{ route.distance }}km</td>
            <td>{{ route.otp }}%</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="card">
      <header class="section-header">
        <div>
          <h2>约束与成本</h2>
          <p class="hint">禁行/限高/回仓、司机工时与费用</p>
        </div>
        <div class="actions">
          <button class="btn" @click="openModal('constraints')">约束配置</button>
          <button class="btn secondary" @click="openModal('cost')">费用测算</button>
        </div>
      </header>
      <div class="cost-chart">
        <div v-for="item in costs" :key="item.label" class="pill">
          <div class="bar" :style="{ width: item.value + '%' }"></div>
          <div class="text">
            <strong>{{ item.label }}</strong>
            <small>{{ item.value }}%</small>
          </div>
        </div>
      </div>
      <div class="meta">费用结构包含里程、过路费、司机工时、装卸与冷链费用。</div>
    </div>
  </div>

  <div v-if="activeModal" class="modal-mask" @click.self="closeModal">
    <div class="modal">
      <div class="modal-header">
        <h3>{{ modalTitle }}</h3>
        <button class="btn secondary" @click="closeModal">关闭</button>
      </div>
      <form class="grid" style="grid-template-columns: 1fr 1fr; gap: 12px;" @submit.prevent="confirm">
        <label>装载约束<input placeholder="重量/体积/件数" /></label>
        <label>禁行/限高<input placeholder="限高 4.5m, 限重 20t" /></label>
        <label>司机工时<input placeholder="例如 10 小时" /></label>
        <label>返回策略<select><option>回仓</option><option>就近返程取货</option></select></label>
        <label style="grid-column: 1 / -1;">动态插单<textarea rows="2" placeholder="输入紧急订单与预约信息" /></label>
        <div class="modal-actions" style="grid-column: 1 / -1;">
          <button type="button" class="btn secondary" @click="openProgress">计算进度</button>
          <button class="btn success" type="submit">提交</button>
        </div>
      </form>
      <div v-if="showProgress" class="card" style="margin-top: 12px;">
        <strong>VRP 优化计算中...</strong>
        <div class="progress-bar" style="margin-top: 8px;">
          <div class="fill" :style="{ width: progress + '%' }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';

const routes = reactive([
  { name: '沪A01', wh: '上海仓', vehicle: '7.6米栏板', load: 86, distance: 132, otp: 94 },
  { name: '沪A02', wh: '上海仓', vehicle: '4.2米厢车', load: 78, distance: 98, otp: 96 },
  { name: '沪A03', wh: '上海仓', vehicle: '9.6米新能源', load: 92, distance: 165, otp: 93 },
  { name: '京B01', wh: '北京仓', vehicle: '6.8米冷链', load: 88, distance: 120, otp: 95 },
  { name: '京B02', wh: '北京仓', vehicle: '4.2米厢车', load: 73, distance: 90, otp: 97 },
  { name: '京B03', wh: '北京仓', vehicle: '9.6米新能源', load: 90, distance: 140, otp: 92 },
  { name: '穗C01', wh: '广州仓', vehicle: '13米半挂', load: 94, distance: 210, otp: 91 },
  { name: '穗C02', wh: '广州仓', vehicle: '6.8米冷链', load: 80, distance: 155, otp: 89 },
  { name: '深D01', wh: '深圳仓', vehicle: '7.6米栏板', load: 85, distance: 130, otp: 94 },
  { name: '深D02', wh: '深圳仓', vehicle: '4.2米厢车', load: 77, distance: 95, otp: 96 },
  { name: '渝E01', wh: '重庆仓', vehicle: '9.6米新能源', load: 88, distance: 170, otp: 90 },
  { name: '渝E02', wh: '重庆仓', vehicle: '6.8米冷链', load: 76, distance: 142, otp: 92 },
  { name: '蓉F01', wh: '成都仓', vehicle: '7.6米栏板', load: 82, distance: 125, otp: 95 },
  { name: '蓉F02', wh: '成都仓', vehicle: '4.2米厢车', load: 79, distance: 102, otp: 93 },
  { name: '汉G01', wh: '武汉仓', vehicle: '6.8米冷链', load: 81, distance: 118, otp: 94 },
  { name: '汉G02', wh: '武汉仓', vehicle: '4.2米厢车', load: 74, distance: 88, otp: 96 },
  { name: '杭H01', wh: '杭州仓', vehicle: '9.6米新能源', load: 89, distance: 150, otp: 93 },
  { name: '杭H02', wh: '杭州仓', vehicle: '4.2米厢车', load: 76, distance: 92, otp: 95 },
  { name: '津J01', wh: '天津仓', vehicle: '6.8米冷链', load: 83, distance: 108, otp: 92 },
  { name: '津J02', wh: '天津仓', vehicle: '7.6米栏板', load: 88, distance: 130, otp: 93 }
]);

const costs = reactive([
  { label: '里程', value: 42 },
  { label: '过路费', value: 15 },
  { label: '司机工时', value: 22 },
  { label: '装卸', value: 9 },
  { label: '冷链/新能源', value: 12 }
]);

const activeModal = ref('');
const showProgress = ref(false);
const progress = ref(30);

const openModal = (name) => {
  activeModal.value = name;
  showProgress.value = false;
  progress.value = 30;
};

const closeModal = () => {
  activeModal.value = '';
};

const openProgress = () => {
  showProgress.value = true;
  let val = 30;
  const timer = setInterval(() => {
    val += 17;
    progress.value = Math.min(val, 100);
    if (val >= 100) clearInterval(timer);
  }, 320);
};

const confirm = () => {
  alert('已提交调度优化请求，新的线路计划将生成');
  closeModal();
};

const modalTitle = computed(() => {
  switch (activeModal.value) {
    case 'optimize':
      return '运行 VRP 优化';
    case 'insert':
      return '动态插单与返程取货';
    case 'constraints':
      return '禁行/限高/司机工时约束';
    case 'cost':
      return '费用规则与测算';
    default:
      return '调度操作';
  }
});
</script>

<style scoped>
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.actions {
  display: flex;
  gap: 8px;
}

.cost-chart {
  display: grid;
  gap: 12px;
}

.pill {
  background: #f8fafc;
  border-radius: 12px;
  padding: 10px;
  border: 1px solid #e2e8f0;
}

.pill .bar {
  height: 12px;
  border-radius: 10px;
  background: linear-gradient(90deg, #3b82f6, #22c55e);
}

.pill .text {
  display: flex;
  justify-content: space-between;
  margin-top: 6px;
}

.meta {
  color: #475569;
  font-size: 14px;
}
</style>
