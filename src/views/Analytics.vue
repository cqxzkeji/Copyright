<template>
  <section class="module">
    <header class="module-header">
      <div>
        <h2>数据统计与分析</h2>
        <p>提供订单量、销售额、采摘效率等统计报表，辅助经营决策。</p>
      </div>
      <div class="actions">
        <button class="primary" @click="openModal('export')">导出报表</button>
        <button class="ghost" @click="openModal('refresh')">刷新指标</button>
        <button class="ghost" @click="openModal('notice')">数据提醒</button>
      </div>
    </header>

    <div class="dashboard">
      <div class="metric-card">
        <h3>本周订单量</h3>
        <strong>1,280 单</strong>
        <span>环比 +12%</span>
      </div>
      <div class="metric-card">
        <h3>本周销售额</h3>
        <strong>¥368,000</strong>
        <span>线上占比 62%</span>
      </div>
      <div class="metric-card">
        <h3>采摘效率</h3>
        <strong>94%</strong>
        <span>超采率 2%</span>
      </div>
      <div class="metric-card">
        <h3>库存周转天数</h3>
        <strong>3.8 天</strong>
        <span>预警品类 2</span>
      </div>
    </div>

    <div class="grid">
      <div class="chart-card">
        <h3>订单与销售趋势</h3>
        <div class="line-chart">
          <div v-for="point in lineData" :key="point.day" class="line-point">
            <div class="dot" :style="{ height: point.value + '%' }"></div>
            <span>{{ point.day }}</span>
          </div>
        </div>
      </div>
      <div class="chart-card">
        <h3>采摘效率分布</h3>
        <div class="pie">
          <div class="slice slice-a">高效 58%</div>
          <div class="slice slice-b">正常 32%</div>
          <div class="slice slice-c">待优化 10%</div>
        </div>
      </div>
    </div>

    <div class="table-card">
      <table>
        <thead>
          <tr>
            <th>统计编号</th>
            <th>日期</th>
            <th>订单量</th>
            <th>销售额(元)</th>
            <th>采摘效率</th>
            <th>库存周转(天)</th>
            <th>重点说明</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in analytics" :key="row.id">
            <td>{{ row.id }}</td>
            <td>{{ row.date }}</td>
            <td>{{ row.orders }}</td>
            <td>{{ row.sales }}</td>
            <td>{{ row.efficiency }}</td>
            <td>{{ row.turnover }}</td>
            <td>{{ row.note }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseModal v-model="modalVisible" :title="modalTitle">
      <div v-if="modalType === 'export'" class="form-grid">
        <label>
          报表周期
          <select v-model="form.range">
            <option value="近7天">近7天</option>
            <option value="近30天">近30天</option>
            <option value="本季度">本季度</option>
          </select>
        </label>
        <label>
          报表格式
          <select v-model="form.format">
            <option value="PDF">PDF</option>
            <option value="Excel">Excel</option>
            <option value="CSV">CSV</option>
          </select>
        </label>
      </div>
      <div v-else-if="modalType === 'refresh'">
        <p>刷新将重新拉取订单、库存与销售数据。</p>
        <div class="progress">
          <div class="progress-bar" :style="{ width: '64%' }"></div>
        </div>
        <span>数据同步中 64%</span>
      </div>
      <div v-else>
        <p>库存预警：番茄库存偏高，建议调整促销策略。</p>
      </div>
      <template #footer>
        <button class="ghost" @click="modalVisible = false">关闭</button>
        <button class="primary" @click="submitModal">确认</button>
      </template>
    </BaseModal>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const lineData = ref([
  { day: '周一', value: 35 },
  { day: '周二', value: 48 },
  { day: '周三', value: 55 },
  { day: '周四', value: 62 },
  { day: '周五', value: 68 },
  { day: '周六', value: 75 },
  { day: '周日', value: 70 }
]);

const analytics = ref([
  { id: 'AN-24001', date: '2024-05-14', orders: 168, sales: '48,200', efficiency: '93%', turnover: 4.1, note: '草莓需求提升' },
  { id: 'AN-24002', date: '2024-05-15', orders: 172, sales: '49,800', efficiency: '94%', turnover: 4.0, note: '番茄线上增长' },
  { id: 'AN-24003', date: '2024-05-16', orders: 178, sales: '51,300', efficiency: '95%', turnover: 3.9, note: '团购订单增加' },
  { id: 'AN-24004', date: '2024-05-17', orders: 182, sales: '52,600', efficiency: '94%', turnover: 3.8, note: '葡萄出货稳定' },
  { id: 'AN-24005', date: '2024-05-18', orders: 190, sales: '55,100', efficiency: '95%', turnover: 3.7, note: '周末订单上升' },
  { id: 'AN-24006', date: '2024-05-19', orders: 196, sales: '56,200', efficiency: '94%', turnover: 3.6, note: '冷链运输优化' },
  { id: 'AN-24007', date: '2024-05-20', orders: 194, sales: '54,800', efficiency: '93%', turnover: 3.8, note: '库存预警提示' },
  { id: 'AN-24008', date: '2024-05-21', orders: 180, sales: '53,400', efficiency: '92%', turnover: 4.0, note: '部分品类调整' },
  { id: 'AN-24009', date: '2024-05-22', orders: 176, sales: '52,900', efficiency: '94%', turnover: 3.9, note: '采摘效率提升' },
  { id: 'AN-24010', date: '2024-05-23', orders: 182, sales: '54,300', efficiency: '95%', turnover: 3.7, note: '团购复购增加' },
  { id: 'AN-24011', date: '2024-05-24', orders: 188, sales: '55,600', efficiency: '95%', turnover: 3.6, note: '新增客户增长' },
  { id: 'AN-24012', date: '2024-05-25', orders: 192, sales: '56,800', efficiency: '96%', turnover: 3.5, note: '采摘班次优化' },
  { id: 'AN-24013', date: '2024-05-26', orders: 200, sales: '58,200', efficiency: '95%', turnover: 3.6, note: '周末订单高峰' },
  { id: 'AN-24014', date: '2024-05-27', orders: 186, sales: '54,700', efficiency: '93%', turnover: 3.9, note: '葡萄供给稳定' },
  { id: 'AN-24015', date: '2024-05-28', orders: 178, sales: '52,400', efficiency: '92%', turnover: 4.1, note: '库存周转放缓' },
  { id: 'AN-24016', date: '2024-05-29', orders: 174, sales: '51,900', efficiency: '93%', turnover: 4.0, note: '补货节奏调整' },
  { id: 'AN-24017', date: '2024-05-30', orders: 182, sales: '53,100', efficiency: '94%', turnover: 3.8, note: '采摘计划优化' },
  { id: 'AN-24018', date: '2024-05-31', orders: 188, sales: '54,600', efficiency: '95%', turnover: 3.7, note: '价格策略生效' },
  { id: 'AN-24019', date: '2024-06-01', orders: 196, sales: '56,900', efficiency: '96%', turnover: 3.5, note: '促销拉动增长' },
  { id: 'AN-24020', date: '2024-06-02', orders: 202, sales: '58,600', efficiency: '95%', turnover: 3.6, note: '库存供需平衡' }
]);

const modalVisible = ref(false);
const modalTitle = ref('');
const modalType = ref('export');
const form = reactive({
  range: '近7天',
  format: 'PDF'
});

const openModal = (type) => {
  modalType.value = type;
  modalVisible.value = true;
  const titles = {
    export: '导出数据报表',
    refresh: '刷新统计指标',
    notice: '数据提醒'
  };
  modalTitle.value = titles[type];
};

const submitModal = () => {
  modalVisible.value = false;
};
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.module-header {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: space-between;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.dashboard {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 14px;
}

.metric-card {
  padding: 16px;
  border-radius: 14px;
  border: 1px solid var(--border);
  background: #f7fbf8;
  display: grid;
  gap: 6px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.chart-card {
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 16px;
  background: #ffffff;
}

.line-chart {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
  align-items: end;
  height: 160px;
  margin-top: 12px;
}

.line-point {
  display: grid;
  gap: 6px;
  justify-items: center;
  font-size: 12px;
  color: var(--muted);
}

.dot {
  width: 20px;
  background: var(--primary);
  border-radius: 8px 8px 0 0;
}

.pie {
  display: grid;
  gap: 10px;
  margin-top: 12px;
}

.slice {
  padding: 10px 12px;
  border-radius: 10px;
  color: #fff;
  font-size: 14px;
}

.slice-a {
  background: #4caf50;
}

.slice-b {
  background: #81c784;
}

.slice-c {
  background: #ffb74d;
}

.table-card {
  overflow: auto;
  border: 1px solid var(--border);
  border-radius: 14px;
}

.table-card table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.table-card th,
.table-card td {
  padding: 12px 10px;
  border-bottom: 1px solid var(--border);
  text-align: left;
}

.form-grid {
  display: grid;
  gap: 12px;
}

.form-grid input,
.form-grid select,
.form-grid textarea {
  width: 100%;
  padding: 8px 10px;
  border-radius: 10px;
  border: 1px solid var(--border);
}

.progress {
  height: 10px;
  background: #edf4ef;
  border-radius: 999px;
  overflow: hidden;
  margin-bottom: 6px;
}

.progress-bar {
  height: 100%;
  background: var(--primary);
}

.primary {
  background: var(--primary);
  border: none;
  color: white;
  padding: 8px 16px;
  border-radius: 999px;
  cursor: pointer;
}

.ghost {
  background: transparent;
  border: 1px solid var(--border);
  padding: 8px 16px;
  border-radius: 999px;
  cursor: pointer;
}
</style>
