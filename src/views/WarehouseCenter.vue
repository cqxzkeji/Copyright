<template>
  <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));">
    <div class="card">
      <header class="section-header">
        <div>
          <h2>仓库与分拨中心</h2>
          <p class="hint">地理围栏、服务半径、吞吐能力</p>
        </div>
        <div class="actions">
          <button class="btn" @click="openModal('addWarehouse')">新增仓库</button>
          <button class="btn secondary" @click="openModal('geoFence')">配置围栏</button>
        </div>
      </header>
      <table>
        <thead>
          <tr>
            <th>名称</th>
            <th>城市</th>
            <th>服务半径</th>
            <th>吞吐</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="wh in warehouses" :key="wh.name">
            <td>{{ wh.name }}</td>
            <td>{{ wh.city }}</td>
            <td>{{ wh.radius }}km</td>
            <td>{{ wh.capacity }}单/日</td>
            <td><span class="badge">{{ wh.status }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="card">
      <header class="section-header">
        <div>
          <h2>客户与站点</h2>
          <p class="hint">时间窗、服务时长、道路约束</p>
        </div>
        <div class="actions">
          <button class="btn" @click="openModal('newClient')">新增客户</button>
          <button class="btn secondary" @click="openModal('routeRule')">道路规则</button>
        </div>
      </header>
      <table>
        <thead>
          <tr>
            <th>客户</th>
            <th>区域</th>
            <th>时间窗</th>
            <th>服务时长</th>
            <th>优先级</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="client in clients" :key="client.name">
            <td>{{ client.name }}</td>
            <td>{{ client.area }}</td>
            <td>{{ client.window }}</td>
            <td>{{ client.duration }}min</td>
            <td>{{ client.priority }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="card">
      <header class="section-header">
        <div>
          <h2>车型与司机</h2>
          <p class="hint">载重、容积、班次、费用规则</p>
        </div>
        <div class="actions">
          <button class="btn" @click="openModal('addVehicle')">新增车型</button>
          <button class="btn secondary" @click="openModal('shiftPlan')">班次计划</button>
        </div>
      </header>
      <div class="chart">
        <div v-for="vehicle in vehicles" :key="vehicle.type" class="bar" :style="{ height: vehicle.load + 'px' }">
          <span>{{ vehicle.type }}</span>
          <small>{{ vehicle.load }}kg</small>
        </div>
      </div>
      <div class="meta">装载效率曲线（kg 映射高度，亮色列表示新能源）</div>
    </div>
  </div>

  <div v-if="activeModal" class="modal-mask" @click.self="closeModal">
    <div class="modal">
      <div class="modal-header">
        <h3>{{ modalTitle }}</h3>
        <button class="btn secondary" @click="closeModal">关闭</button>
      </div>
      <form class="grid" style="grid-template-columns: 1fr 1fr; gap: 12px;" @submit.prevent="submit">
        <label>名称<input required placeholder="输入名称" /></label>
        <label>区域/城市<input required placeholder="输入区域" /></label>
        <label>容量/限制<input required placeholder="数字" /></label>
        <label>备注<textarea rows="2" placeholder="可填写时窗、费用规则等" /></label>
        <div class="modal-actions" style="grid-column: 1 / -1;">
          <button type="button" class="btn secondary" @click="openProgress">保存并校验</button>
          <button class="btn success" type="submit">快速保存</button>
        </div>
      </form>
      <div v-if="showProgress" class="card" style="margin-top: 12px;">
        <div class="flex-row">
          <strong>正在校验基础资料...</strong>
          <span class="tag">预计 3s 完成</span>
        </div>
        <div class="progress-bar" style="margin-top: 8px;">
          <div class="fill" :style="{ width: progress + '%' }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';

const warehouses = reactive([
  { name: '华北一号仓', city: '北京', radius: 40, capacity: 18000, status: '在线' },
  { name: '华北二号仓', city: '天津', radius: 35, capacity: 12000, status: '在线' },
  { name: '华东一号仓', city: '上海', radius: 45, capacity: 24000, status: '在线' },
  { name: '华东二号仓', city: '杭州', radius: 30, capacity: 15000, status: '维护' },
  { name: '华南一号仓', city: '广州', radius: 50, capacity: 26000, status: '在线' },
  { name: '华南二号仓', city: '深圳', radius: 42, capacity: 22000, status: '在线' },
  { name: '西南一号仓', city: '成都', radius: 38, capacity: 16000, status: '在线' },
  { name: '西南二号仓', city: '重庆', radius: 28, capacity: 12000, status: '在线' },
  { name: '华中一号仓', city: '武汉', radius: 33, capacity: 18000, status: '在线' },
  { name: '东北一号仓', city: '沈阳', radius: 36, capacity: 11000, status: '在线' },
  { name: '西北一号仓', city: '西安', radius: 32, capacity: 14000, status: '在线' },
  { name: '海南中心', city: '海口', radius: 30, capacity: 8000, status: '在线' },
  { name: '合肥前置仓', city: '合肥', radius: 26, capacity: 9000, status: '在线' },
  { name: '长沙中心仓', city: '长沙', radius: 34, capacity: 13000, status: '在线' },
  { name: '郑州分拨', city: '郑州', radius: 31, capacity: 15000, status: '在线' },
  { name: '青岛港区仓', city: '青岛', radius: 29, capacity: 12000, status: '在线' },
  { name: '南京都市圈仓', city: '南京', radius: 30, capacity: 16000, status: '在线' },
  { name: '苏州智造仓', city: '苏州', radius: 27, capacity: 14000, status: '在线' },
  { name: '宁波港口仓', city: '宁波', radius: 28, capacity: 12500, status: '在线' },
  { name: '厦门保税仓', city: '厦门', radius: 26, capacity: 11000, status: '在线' }
]);

const clients = reactive([
  { name: '朝阳门店', area: '北京-朝阳', window: '09:00-11:00', duration: 15, priority: '高' },
  { name: '望京集配', area: '北京-望京', window: '10:00-12:00', duration: 20, priority: '中' },
  { name: '五角场门店', area: '上海-杨浦', window: '14:00-16:00', duration: 18, priority: '中' },
  { name: '滨江工厂', area: '杭州-滨江', window: '08:00-10:00', duration: 25, priority: '高' },
  { name: '前海仓配', area: '深圳-前海', window: '13:00-15:00', duration: 17, priority: '高' },
  { name: '南山园区', area: '深圳-南山', window: '15:00-18:00', duration: 22, priority: '中' },
  { name: '浦东医药', area: '上海-浦东', window: '09:00-12:00', duration: 30, priority: '高' },
  { name: '虹桥冷链', area: '上海-闵行', window: '07:00-09:00', duration: 28, priority: '高' },
  { name: '武昌商超', area: '武汉-武昌', window: '09:00-11:00', duration: 20, priority: '中' },
  { name: '光谷园区', area: '武汉-光谷', window: '11:00-13:00', duration: 16, priority: '中' },
  { name: '江北新区', area: '重庆-江北', window: '13:00-15:00', duration: 21, priority: '中' },
  { name: '高新门店', area: '成都-高新', window: '08:30-11:30', duration: 14, priority: '中' },
  { name: '合肥高科', area: '合肥-高新', window: '10:00-12:00', duration: 18, priority: '中' },
  { name: '长沙冷链', area: '长沙-雨花', window: '07:30-09:30', duration: 26, priority: '高' },
  { name: '郑州医药', area: '郑州-郑东', window: '09:00-11:00', duration: 19, priority: '高' },
  { name: '青岛工厂', area: '青岛-黄岛', window: '13:00-15:00', duration: 22, priority: '中' },
  { name: '南京门店', area: '南京-江宁', window: '11:00-13:00', duration: 17, priority: '中' },
  { name: '苏州园区', area: '苏州-工业园', window: '09:30-11:30', duration: 20, priority: '高' },
  { name: '宁波港区', area: '宁波-北仑', window: '15:00-17:00', duration: 21, priority: '中' },
  { name: '厦门客户', area: '厦门-海沧', window: '08:00-10:00', duration: 19, priority: '中' }
]);

const vehicles = reactive([
  { type: '4.2米厢车', load: 120 },
  { type: '6.8米冷链', load: 150 },
  { type: '7.6米栏板', load: 135 },
  { type: '9.6米新能源', load: 180 },
  { type: '13米半挂', load: 210 },
  { type: '面包车', load: 80 }
]);

const activeModal = ref('');
const showProgress = ref(false);
const progress = ref(45);

const openModal = (name) => {
  activeModal.value = name;
  showProgress.value = false;
  progress.value = 45;
};

const closeModal = () => {
  activeModal.value = '';
};

const openProgress = () => {
  showProgress.value = true;
  let val = 45;
  const timer = setInterval(() => {
    val += 15;
    progress.value = Math.min(val, 100);
    if (val >= 100) clearInterval(timer);
  }, 400);
};

const submit = () => {
  alert('已保存到基础资料库');
  closeModal();
};

const modalTitle = computed(() => {
  switch (activeModal.value) {
    case 'addWarehouse':
      return '新增仓库/分拨中心';
    case 'geoFence':
      return '配置地理围栏与服务半径';
    case 'newClient':
      return '新增客户与站点时间窗';
    case 'routeRule':
      return '道路/区域规则与禁行提示';
    case 'addVehicle':
      return '新增车型与载重容积';
    case 'shiftPlan':
      return '司机班次与费用规则';
    default:
      return '基础资料操作';
  }
});
</script>

<style scoped>
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.actions {
  display: flex;
  gap: 8px;
}

.chart {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  height: 200px;
  padding: 12px 0;
}

.bar {
  flex: 1;
  border-radius: 10px;
  background: linear-gradient(180deg, #93c5fd, #e0f2fe);
  display: grid;
  place-items: center;
  gap: 6px;
  color: #0f172a;
  font-weight: 700;
}

.meta {
  color: #475569;
  font-size: 14px;
}

.flex-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
