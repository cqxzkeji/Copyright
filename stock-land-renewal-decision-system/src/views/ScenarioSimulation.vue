<template>
  <div class="grid" style="grid-template-columns: 1.4fr 1fr; align-items: start">
    <div class="card">
      <div class="section-head">
        <div>
          <p class="eyebrow">方案路径</p>
          <h3>更新路径与方式模拟</h3>
        </div>
        <button class="action-btn" @click="showPath = true">选择路径</button>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>地块</th>
            <th>更新方式</th>
            <th>实施周期</th>
            <th>风险评估</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in paths" :key="item.name">
            <td>{{ item.name }}</td>
            <td>{{ item.mode }}</td>
            <td>{{ item.period }}</td>
            <td>
              <div class="chart-bar" :style="{ width: item.risk + '%' }"></div>
              <small>风险 {{ item.risk }}%</small>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="card">
      <div class="section-head">
        <div>
          <p class="eyebrow">指标容量</p>
          <h3>规划指标与容量</h3>
        </div>
        <button class="action-btn secondary" @click="showQuota = true">调整指标</button>
      </div>
      <ul class="ledger">
        <li v-for="quota in quotas" :key="quota.name">
          <div>
            <strong>{{ quota.name }}</strong>
            <p class="muted">规划指标 {{ quota.index }}</p>
            <div class="progress-track">
              <div class="progress-bar" :style="{ width: quota.use + '%' }"></div>
            </div>
          </div>
          <span class="badge info">使用率 {{ quota.use }}%</span>
        </li>
      </ul>
    </div>

    <div class="card" style="grid-column: 1 / span 2">
      <div class="section-head">
        <div>
          <p class="eyebrow">成本收益</p>
          <h3>财政平衡测算</h3>
        </div>
        <button class="action-btn" @click="showFinance = true">查看测算</button>
      </div>
      <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(220px, 1fr))">
        <div v-for="fin in finances" :key="fin.name" class="card" style="border: 1px dashed var(--border)">
          <p class="muted">{{ fin.name }}</p>
          <h2 style="margin: 4px 0">¥{{ fin.value }} 万</h2>
          <div class="chart-bar" :style="{ width: fin.rate + '%' }"></div>
          <small>{{ fin.label }}</small>
        </div>
      </div>
    </div>

    <div v-if="showPath" class="modal-mask" @click.self="showPath = false">
      <div class="modal-container">
        <div class="modal-header">
          <h3>选择更新路径</h3>
          <button class="action-btn secondary" @click="showPath = false">关闭</button>
        </div>
        <div class="form-row">
          <label>更新方式<select><option>拆除重建</option><option>功能转型</option><option>微更新</option></select></label>
          <label>合作模式<select><option>政府主导</option><option>联合开发</option><option>主体自改</option></select></label>
        </div>
        <button class="action-btn" style="margin-top: 12px">生成模拟</button>
      </div>
    </div>

    <div v-if="showQuota" class="modal-mask" @click.self="showQuota = false">
      <div class="modal-container">
        <div class="modal-header">
          <h3>调整规划指标</h3>
          <button class="action-btn secondary" @click="showQuota = false">关闭</button>
        </div>
        <div class="form-row">
          <label>容积率<input type="number" placeholder="2.2" /></label>
          <label>建筑密度<input type="number" placeholder="32%" /></label>
        </div>
        <div class="form-row">
          <label>绿地率<input type="number" placeholder="35%" /></label>
          <label>公共配套<textarea rows="2" placeholder="学校、社区卫生、街角公园"></textarea></label>
        </div>
        <div class="progress-track">
          <div class="progress-bar" :style="{ width: '72%' }"></div>
        </div>
        <p class="muted">指标匹配度 72%，已满足规划条件</p>
      </div>
    </div>

    <div v-if="showFinance" class="modal-mask" @click.self="showFinance = false">
      <div class="modal-container">
        <div class="modal-header">
          <h3>成本收益测算</h3>
          <button class="action-btn secondary" @click="showFinance = false">关闭</button>
        </div>
        <table class="table">
          <thead>
            <tr>
              <th>科目</th>
              <th>金额(万)</th>
              <th>备注</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in financeTable" :key="row.name">
              <td>{{ row.name }}</td>
              <td>{{ row.value }}</td>
              <td>{{ row.note }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const showPath = ref(false);
const showQuota = ref(false);
const showFinance = ref(false);

const paths = ref([
  { name: '科创智谷', mode: '拆除重建', period: '2025-2028', risk: 28 },
  { name: '机场北物流', mode: '功能转型', period: '2024-2026', risk: 36 },
  { name: '老港工业园', mode: '产城融合', period: '2025-2029', risk: 42 },
  { name: '南湾居住片', mode: '微更新', period: '2024-2025', risk: 18 },
  { name: '江滩港口区', mode: '产业搬迁', period: '2026-2029', risk: 51 },
]);

const quotas = ref([
  { name: '公共服务提升包', index: '学校 18 班、社区卫生 1 处', use: 65 },
  { name: '产业用地配比', index: '工业转型 35%，物流 20%', use: 54 },
  { name: '居住配套', index: '保障房 18 万㎡，租赁房 6 万㎡', use: 72 },
  { name: '生态与开放空间', index: '绿地率 35%，河岸开放 1.2km', use: 61 },
]);

const finances = ref([
  { name: '土地收益', value: 148000, rate: 78, label: '出让收入、配套回收' },
  { name: '开发成本', value: 98000, rate: 62, label: '征收、建安、迁改' },
  { name: '公共配套投入', value: 32000, rate: 46, label: '学校、医疗、绿化' },
  { name: '财政平衡', value: 18000, rate: 38, label: '净收益，含专项债' },
]);

const financeTable = ref([
  { name: '征收补偿', value: 32000, note: '含房屋、设备及停产补偿' },
  { name: '基础设施', value: 21000, note: '市政道路、管线迁改' },
  { name: '公共配套', value: 15000, note: '学校、社区卫生、绿地' },
  { name: '资金平衡', value: 18000, note: '专项债及土地出让统筹' },
  { name: '不可预见', value: 6000, note: '预留 5% 风险费用' },
]);
</script>

<style scoped>
.section-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.ledger {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 12px;
}

.ledger li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid var(--border);
  padding: 12px;
  border-radius: 10px;
}
</style>
