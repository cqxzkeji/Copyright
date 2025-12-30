<template>
  <div class="grid" style="grid-template-columns: 2fr 1fr;">
    <div class="card">
      <header class="section-header">
        <div>
          <h2>订单与需求池</h2>
          <p class="hint">支持导入、拆分合并、时效约束标记</p>
        </div>
        <div class="actions">
          <button class="btn" @click="openModal('import')">订单导入</button>
          <button class="btn secondary" @click="openModal('split')">拆分/合并</button>
        </div>
      </header>
      <table>
        <thead>
          <tr>
            <th>订单号</th>
            <th>仓库</th>
            <th>客户</th>
            <th>时效</th>
            <th>温控</th>
            <th>件数</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.no">
            <td>{{ order.no }}</td>
            <td>{{ order.wh }}</td>
            <td>{{ order.client }}</td>
            <td>{{ order.window }}</td>
            <td>{{ order.temp }}</td>
            <td>{{ order.qty }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="card">
      <header class="section-header">
        <div>
          <h2>需求预测与波动</h2>
          <p class="hint">波峰/波谷提示与预约时间窗</p>
        </div>
        <div class="actions">
          <button class="btn" @click="openModal('forecast')">生成预测</button>
          <button class="btn secondary" @click="openModal('priority')">标记优先级</button>
        </div>
      </header>
      <div class="forecast">
        <div v-for="slot in forecast" :key="slot.hour" class="slot">
          <div class="bar" :style="{ height: slot.volume + 'px' }"></div>
          <span>{{ slot.hour }}时</span>
          <small>{{ slot.volume }}单</small>
        </div>
      </div>
      <div class="meta">蓝色为常温，绿色为冷链；高于 180 单提示波峰。</div>
    </div>
  </div>

  <div v-if="activeModal" class="modal-mask" @click.self="closeModal">
    <div class="modal">
      <div class="modal-header">
        <h3>{{ modalTitle }}</h3>
        <button class="btn secondary" @click="closeModal">关闭</button>
      </div>
      <form class="grid" style="grid-template-columns: 1fr 1fr; gap: 12px;" @submit.prevent="confirm">
        <label>导入文件/批次<input placeholder="选择 CSV/接口" required /></label>
        <label>预约时间窗<input placeholder="如 10:00-12:00" /></label>
        <label>温控/危险品<select><option>常温</option><option>冷链</option><option>危险品</option></select></label>
        <label>优先级<select><option>高</option><option>中</option><option>低</option></select></label>
        <label style="grid-column: 1 / -1;">备注<textarea rows="2" placeholder="拆分/合并规则、件数约束" /></label>
        <div class="modal-actions" style="grid-column: 1 / -1;">
          <button type="button" class="btn secondary" @click="openProgress">校验</button>
          <button class="btn success" type="submit">执行</button>
        </div>
      </form>
      <div v-if="showProgress" class="card" style="margin-top: 12px;">
        <strong>正在校验时效与预约冲突...</strong>
        <div class="progress-bar" style="margin-top: 8px;">
          <div class="fill" :style="{ width: progress + '%' }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';

const orders = reactive([
  { no: 'SO1001', wh: '上海仓', client: '五角场门店', window: '09:00-11:00', temp: '常温', qty: 12 },
  { no: 'SO1002', wh: '上海仓', client: '浦东医药', window: '10:00-12:00', temp: '冷链', qty: 8 },
  { no: 'SO1003', wh: '上海仓', client: '虹桥冷链', window: '07:00-08:00', temp: '冷链', qty: 16 },
  { no: 'SO1004', wh: '北京仓', client: '朝阳门店', window: '14:00-16:00', temp: '常温', qty: 10 },
  { no: 'SO1005', wh: '北京仓', client: '望京集配', window: '08:00-10:00', temp: '常温', qty: 22 },
  { no: 'SO1006', wh: '天津仓', client: '河北渠道', window: '12:00-14:00', temp: '常温', qty: 14 },
  { no: 'SO1007', wh: '杭州仓', client: '滨江工厂', window: '09:00-10:00', temp: '危险品', qty: 6 },
  { no: 'SO1008', wh: '杭州仓', client: '余杭商超', window: '11:00-13:00', temp: '常温', qty: 18 },
  { no: 'SO1009', wh: '广州仓', client: '天河连锁', window: '10:00-12:00', temp: '常温', qty: 20 },
  { no: 'SO1010', wh: '广州仓', client: '黄埔冷库', window: '13:00-15:00', temp: '冷链', qty: 9 },
  { no: 'SO1011', wh: '深圳仓', client: '前海仓配', window: '15:00-17:00', temp: '常温', qty: 11 },
  { no: 'SO1012', wh: '深圳仓', client: '南山园区', window: '09:00-11:00', temp: '常温', qty: 24 },
  { no: 'SO1013', wh: '武汉仓', client: '光谷园区', window: '08:00-10:00', temp: '常温', qty: 17 },
  { no: 'SO1014', wh: '武汉仓', client: '武昌商超', window: '10:00-12:00', temp: '冷链', qty: 7 },
  { no: 'SO1015', wh: '成都仓', client: '高新门店', window: '13:00-15:00', temp: '常温', qty: 15 },
  { no: 'SO1016', wh: '成都仓', client: '华阳园区', window: '11:00-13:00', temp: '常温', qty: 19 },
  { no: 'SO1017', wh: '重庆仓', client: '江北新区', window: '14:00-16:00', temp: '常温', qty: 12 },
  { no: 'SO1018', wh: '重庆仓', client: '两江园区', window: '09:00-10:00', temp: '常温', qty: 21 },
  { no: 'SO1019', wh: '西安仓', client: '航天园区', window: '10:00-12:00', temp: '常温', qty: 13 },
  { no: 'SO1020', wh: '海口仓', client: '海南中心', window: '15:00-17:00', temp: '冷链', qty: 5 },
  { no: 'SO1021', wh: '上海仓', client: '临港研发', window: '12:00-14:00', temp: '危险品', qty: 4 }
]);

const forecast = reactive([
  { hour: 7, volume: 120 },
  { hour: 8, volume: 160 },
  { hour: 9, volume: 210 },
  { hour: 10, volume: 190 },
  { hour: 11, volume: 175 },
  { hour: 12, volume: 150 },
  { hour: 13, volume: 130 },
  { hour: 14, volume: 190 },
  { hour: 15, volume: 170 },
  { hour: 16, volume: 140 },
  { hour: 17, volume: 110 }
]);

const activeModal = ref('');
const showProgress = ref(false);
const progress = ref(35);

const openModal = (name) => {
  activeModal.value = name;
  showProgress.value = false;
  progress.value = 35;
};

const closeModal = () => {
  activeModal.value = '';
};

const openProgress = () => {
  showProgress.value = true;
  let val = 35;
  const timer = setInterval(() => {
    val += 13;
    progress.value = Math.min(val, 100);
    if (val >= 100) clearInterval(timer);
  }, 350);
};

const confirm = () => {
  alert('已完成导入/拆分操作，并刷新需求池');
  closeModal();
};

const modalTitle = computed(() => {
  switch (activeModal.value) {
    case 'import':
      return '导入或对接订单';
    case 'split':
      return '订单拆分与合并规则';
    case 'forecast':
      return '需求预测与波峰波谷提示';
    case 'priority':
      return '冷链/危险品优先级配置';
    default:
      return '订单操作';
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

.forecast {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(70px, 1fr));
  gap: 10px;
  align-items: end;
  height: 240px;
}

.slot {
  text-align: center;
}

.slot .bar {
  margin: 0 auto 6px;
  width: 100%;
  border-radius: 10px;
  background: linear-gradient(180deg, #22c55e, #bbf7d0);
}

.meta {
  color: #475569;
  font-size: 14px;
}
</style>
