<template>
  <section class="module">
    <header class="module-header">
      <div>
        <h2>价格与销售管理</h2>
        <p>按品类、批次、季节配置价格策略，统计销售数据。</p>
      </div>
      <div class="actions">
        <button class="primary" @click="openModal('pricing')">新建价格策略</button>
        <button class="ghost" @click="openModal('sale')">录入销售</button>
        <button class="ghost" @click="openModal('settlement')">批次结算</button>
        <button class="ghost" @click="openModal('insight')">销售提示</button>
      </div>
    </header>

    <div class="grid">
      <div class="chart-card">
        <h3>品类周销售额</h3>
        <div class="bar-chart">
          <div v-for="item in chartData" :key="item.name" class="bar-item">
            <span>{{ item.name }}</span>
            <div class="bar">
              <div class="bar-fill" :style="{ width: item.value + '%' }"></div>
            </div>
            <strong>¥{{ item.amount }}</strong>
          </div>
        </div>
      </div>
      <div class="summary-card">
        <h3>销售概览</h3>
        <ul>
          <li>今日线上成交：¥52,600</li>
          <li>今日线下成交：¥31,400</li>
          <li>团购订单：18 笔</li>
          <li>本周客单价：¥368</li>
        </ul>
      </div>
    </div>

    <div class="table-card">
      <table>
        <thead>
          <tr>
            <th>记录编号</th>
            <th>品类</th>
            <th>批次</th>
            <th>销售渠道</th>
            <th>数量(kg)</th>
            <th>单价(元)</th>
            <th>金额(元)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="sale in sales" :key="sale.id">
            <td>{{ sale.id }}</td>
            <td>{{ sale.category }}</td>
            <td>{{ sale.batch }}</td>
            <td>{{ sale.channel }}</td>
            <td>{{ sale.amount }}</td>
            <td>{{ sale.price }}</td>
            <td>{{ sale.total }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseModal v-model="modalVisible" :title="modalTitle">
      <div v-if="modalType === 'pricing'" class="form-grid">
        <label>
          品类
          <input v-model="form.category" placeholder="如 草莓" />
        </label>
        <label>
          批次
          <input v-model="form.batch" placeholder="如 S2024-05" />
        </label>
        <label>
          价格策略
          <select v-model="form.strategy">
            <option value="春季推广">春季推广</option>
            <option value="高端供给">高端供给</option>
            <option value="团购优惠">团购优惠</option>
          </select>
        </label>
        <label>
          目标单价(元/kg)
          <input v-model="form.price" type="number" />
        </label>
      </div>
      <div v-else-if="modalType === 'sale'" class="form-grid">
        <label>
          销售渠道
          <select v-model="form.channel">
            <option value="线上">线上</option>
            <option value="线下">线下</option>
            <option value="团购">团购</option>
          </select>
        </label>
        <label>
          销售数量(kg)
          <input v-model="form.amount" type="number" />
        </label>
        <label>
          结算备注
          <textarea v-model="form.note" rows="3" placeholder="订单号、客户名称等" />
        </label>
      </div>
      <div v-else-if="modalType === 'settlement'">
        <p>批次结算将锁定当前价格策略并生成结算单。</p>
        <ul class="detail-list">
          <li>可结算批次：6 批</li>
          <li>待结算金额：¥128,400</li>
          <li>预计毛利率：26%</li>
        </ul>
      </div>
      <div v-else>
        <p>系统提示：草莓与番茄库存充足，建议今日加大线上促销。</p>
      </div>
      <template #footer>
        <button class="ghost" @click="modalVisible = false">取消</button>
        <button class="primary" @click="submitModal">确认</button>
      </template>
    </BaseModal>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const chartData = ref([
  { name: '草莓', value: 92, amount: '18,200' },
  { name: '番茄', value: 80, amount: '15,300' },
  { name: '葡萄', value: 68, amount: '12,800' },
  { name: '黄瓜', value: 55, amount: '10,200' },
  { name: '西兰花', value: 45, amount: '8,600' }
]);

const sales = ref([
  { id: 'SM-24001', category: '草莓', batch: 'S2024-05A', channel: '线上', amount: 320, price: 16, total: 5120 },
  { id: 'SM-24002', category: '番茄', batch: 'T2024-05B', channel: '线下', amount: 260, price: 8, total: 2080 },
  { id: 'SM-24003', category: '葡萄', batch: 'G2024-05C', channel: '团购', amount: 180, price: 22, total: 3960 },
  { id: 'SM-24004', category: '黄瓜', batch: 'C2024-05A', channel: '线上', amount: 240, price: 6, total: 1440 },
  { id: 'SM-24005', category: '西兰花', batch: 'B2024-05B', channel: '线下', amount: 210, price: 9, total: 1890 },
  { id: 'SM-24006', category: '草莓', batch: 'S2024-05B', channel: '团购', amount: 300, price: 15, total: 4500 },
  { id: 'SM-24007', category: '番茄', batch: 'T2024-05C', channel: '线上', amount: 270, price: 8, total: 2160 },
  { id: 'SM-24008', category: '葡萄', batch: 'G2024-05D', channel: '线上', amount: 190, price: 23, total: 4370 },
  { id: 'SM-24009', category: '黄瓜', batch: 'C2024-05B', channel: '线下', amount: 200, price: 6, total: 1200 },
  { id: 'SM-24010', category: '西兰花', batch: 'B2024-05C', channel: '线上', amount: 160, price: 9, total: 1440 },
  { id: 'SM-24011', category: '草莓', batch: 'S2024-05C', channel: '线上', amount: 280, price: 17, total: 4760 },
  { id: 'SM-24012', category: '番茄', batch: 'T2024-05D', channel: '团购', amount: 300, price: 7, total: 2100 },
  { id: 'SM-24013', category: '葡萄', batch: 'G2024-05E', channel: '线下', amount: 160, price: 24, total: 3840 },
  { id: 'SM-24014', category: '黄瓜', batch: 'C2024-05C', channel: '团购', amount: 220, price: 6, total: 1320 },
  { id: 'SM-24015', category: '西兰花', batch: 'B2024-05D', channel: '线上', amount: 170, price: 10, total: 1700 },
  { id: 'SM-24016', category: '草莓', batch: 'S2024-05D', channel: '线下', amount: 260, price: 16, total: 4160 },
  { id: 'SM-24017', category: '番茄', batch: 'T2024-05E', channel: '线上', amount: 240, price: 8, total: 1920 },
  { id: 'SM-24018', category: '葡萄', batch: 'G2024-05F', channel: '团购', amount: 150, price: 22, total: 3300 },
  { id: 'SM-24019', category: '黄瓜', batch: 'C2024-05D', channel: '线上', amount: 210, price: 6, total: 1260 },
  { id: 'SM-24020', category: '西兰花', batch: 'B2024-05E', channel: '线下', amount: 190, price: 9, total: 1710 }
]);

const modalVisible = ref(false);
const modalTitle = ref('');
const modalType = ref('pricing');
const form = reactive({
  category: '',
  batch: '',
  strategy: '春季推广',
  price: '',
  channel: '线上',
  amount: '',
  note: ''
});

const openModal = (type) => {
  modalType.value = type;
  modalVisible.value = true;
  const titles = {
    pricing: '新建价格策略',
    sale: '录入销售记录',
    settlement: '批次结算',
    insight: '销售提示'
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

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.chart-card,
.summary-card {
  background: #f7fbf8;
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 16px;
}

.bar-chart {
  display: grid;
  gap: 12px;
  margin-top: 12px;
}

.bar-item {
  display: grid;
  grid-template-columns: 60px 1fr 80px;
  gap: 10px;
  align-items: center;
  font-size: 13px;
}

.bar {
  height: 10px;
  background: #e9f1ec;
  border-radius: 999px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: var(--primary);
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

.detail-list {
  padding-left: 20px;
  display: grid;
  gap: 6px;
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
