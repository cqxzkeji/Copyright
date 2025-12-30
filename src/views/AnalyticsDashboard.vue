<template>
  <div class="grid" style="grid-template-columns: 2fr 1fr;">
    <div class="card">
      <header class="section-header">
        <div>
          <h2>成本与绩效</h2>
          <p class="hint">成本构成、装载率、准点率、空驶率</p>
        </div>
        <div class="actions">
          <button class="btn" @click="openModal('export')">导出报表</button>
          <button class="btn secondary" @click="openModal('threshold')">指标预警</button>
        </div>
      </header>
      <table>
        <thead>
          <tr>
            <th>仓库</th>
            <th>成本/单</th>
            <th>装载率</th>
            <th>准点率</th>
            <th>空驶率</th>
            <th>吞吐</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in stats" :key="row.wh">
            <td>{{ row.wh }}</td>
            <td>¥{{ row.cost }}</td>
            <td>{{ row.load }}%</td>
            <td>{{ row.otp }}%</td>
            <td>{{ row.empty }}%</td>
            <td>{{ row.throughput }}单</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="card">
      <header class="section-header">
        <div>
          <h2>司机/线路绩效对比</h2>
          <p class="hint">按司机与线路对比准点率与波次效率</p>
        </div>
        <div class="actions">
          <button class="btn" @click="openModal('compare')">对比设置</button>
          <button class="btn secondary" @click="openModal('refresh')">刷新数据</button>
        </div>
      </header>
      <div class="chart-grid">
        <div v-for="item in driverPerformance" :key="item.name" class="driver-card">
          <div class="bar" :style="{ height: item.otp + 'px' }"></div>
          <div class="info">
            <strong>{{ item.name }}</strong>
            <small>准点率 {{ item.otp }}%</small>
            <small>波次 {{ item.waves }}</small>
          </div>
        </div>
      </div>
      <div class="meta">绿柱为线路准点率，灰色为波次数，点击对比可选择基准。</div>
    </div>
  </div>

  <div v-if="activeModal" class="modal-mask" @click.self="closeModal">
    <div class="modal">
      <div class="modal-header">
        <h3>{{ modalTitle }}</h3>
        <button class="btn secondary" @click="closeModal">关闭</button>
      </div>
      <form class="grid" style="grid-template-columns: 1fr 1fr; gap: 12px;" @submit.prevent="confirm">
        <label>阈值预警<input placeholder="如准点率 < 95%" /></label>
        <label>导出格式<select><option>Excel</option><option>CSV</option><option>PDF</option></select></label>
        <label>基准线路<input placeholder="选择线路/司机" /></label>
        <label>对比周期<select><option>本周</option><option>本月</option><option>季度</option></select></label>
        <label style="grid-column: 1 / -1;">看板展示<textarea rows="2" placeholder="备注大屏看板需要的指标" /></label>
        <div class="modal-actions" style="grid-column: 1 / -1;">
          <button type="button" class="btn secondary" @click="openProgress">生成报表</button>
          <button class="btn success" type="submit">保存配置</button>
        </div>
      </form>
      <div v-if="showProgress" class="card" style="margin-top: 12px;">
        <strong>正在生成报表与预警阈值...</strong>
        <div class="progress-bar" style="margin-top: 8px;">
          <div class="fill" :style="{ width: progress + '%' }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';

const stats = reactive([
  { wh: '上海仓', cost: 23.5, load: 89, otp: 96, empty: 8, throughput: 24000 },
  { wh: '北京仓', cost: 25.2, load: 85, otp: 95, empty: 9, throughput: 18000 },
  { wh: '广州仓', cost: 21.8, load: 90, otp: 94, empty: 7, throughput: 26000 },
  { wh: '深圳仓', cost: 22.6, load: 91, otp: 95, empty: 6, throughput: 22000 },
  { wh: '杭州仓', cost: 20.5, load: 93, otp: 96, empty: 5, throughput: 15000 },
  { wh: '天津仓', cost: 24.0, load: 86, otp: 94, empty: 10, throughput: 12000 },
  { wh: '成都仓', cost: 23.1, load: 88, otp: 95, empty: 9, throughput: 16000 },
  { wh: '重庆仓', cost: 24.3, load: 84, otp: 93, empty: 11, throughput: 12000 },
  { wh: '武汉仓', cost: 22.9, load: 87, otp: 94, empty: 9, throughput: 18000 },
  { wh: '西安仓', cost: 25.5, load: 82, otp: 92, empty: 12, throughput: 14000 },
  { wh: '沈阳仓', cost: 24.8, load: 83, otp: 93, empty: 11, throughput: 11000 },
  { wh: '海口仓', cost: 27.0, load: 79, otp: 91, empty: 13, throughput: 8000 },
  { wh: '合肥仓', cost: 23.0, load: 88, otp: 94, empty: 8, throughput: 13000 },
  { wh: '长沙仓', cost: 22.4, load: 90, otp: 95, empty: 7, throughput: 15000 },
  { wh: '郑州仓', cost: 24.6, load: 85, otp: 93, empty: 9, throughput: 17000 },
  { wh: '青岛仓', cost: 23.8, load: 87, otp: 94, empty: 8, throughput: 12500 },
  { wh: '南京仓', cost: 22.7, load: 89, otp: 95, empty: 7, throughput: 14500 },
  { wh: '苏州仓', cost: 21.9, load: 92, otp: 96, empty: 6, throughput: 15500 },
  { wh: '宁波仓', cost: 22.5, load: 91, otp: 95, empty: 6, throughput: 13500 },
  { wh: '厦门仓', cost: 23.3, load: 90, otp: 94, empty: 8, throughput: 14200 }
]);

const driverPerformance = reactive([
  { name: '线路A', otp: 96, waves: 5 },
  { name: '线路B', otp: 94, waves: 6 },
  { name: '线路C', otp: 92, waves: 4 },
  { name: '线路D', otp: 95, waves: 7 },
  { name: '线路E', otp: 90, waves: 5 },
  { name: '线路F', otp: 91, waves: 6 },
  { name: '线路G', otp: 93, waves: 4 },
  { name: '线路H', otp: 92, waves: 5 }
]);

const activeModal = ref('');
const showProgress = ref(false);
const progress = ref(40);

const openModal = (name) => {
  activeModal.value = name;
  showProgress.value = false;
  progress.value = 40;
};

const closeModal = () => {
  activeModal.value = '';
};

const openProgress = () => {
  showProgress.value = true;
  let val = 40;
  const timer = setInterval(() => {
    val += 20;
    progress.value = Math.min(val, 100);
    if (val >= 100) clearInterval(timer);
  }, 350);
};

const confirm = () => {
  alert('报表已生成，阈值预警已保存');
  closeModal();
};

const modalTitle = computed(() => {
  switch (activeModal.value) {
    case 'export':
      return '导出报表与看板';
    case 'threshold':
      return '指标阈值预警设置';
    case 'compare':
      return '司机/线路绩效对比';
    case 'refresh':
      return '刷新数据并更新大屏';
    default:
      return '数据分析与报表';
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

.chart-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
  align-items: end;
}

.driver-card {
  background: #f8fafc;
  border-radius: 12px;
  padding: 12px;
  border: 1px solid #e2e8f0;
}

.driver-card .bar {
  height: 10px;
  border-radius: 999px;
  background: linear-gradient(90deg, #22c55e, #bbf7d0);
  margin-bottom: 8px;
}

.info {
  display: grid;
  gap: 4px;
}

.meta {
  color: #475569;
  font-size: 14px;
}
</style>
