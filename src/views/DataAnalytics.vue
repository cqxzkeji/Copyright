<template>
  <div class="module">
    <div class="module-header">
      <div>
        <h3>数据分析与监管</h3>
        <p>聚合供应链指标，输出监管报表与预警。</p>
      </div>
      <div class="actions">
        <button @click="showForm = true">生成报告</button>
        <button @click="showProgress = true">分析进度</button>
        <button @click="showInfo = true">预警提示</button>
      </div>
    </div>

    <div class="media-grid">
      <div class="card">
        <h4>指标摘要</h4>
        <div class="placeholder-box">
          <p>本月供应链效率提升 8%，核心 KPI 已完成汇总。</p>
        </div>
      </div>
      <div class="card">
        <h4>监管概览</h4>
        <img src="/src/assets/field.svg" alt="监管概览" />
        <p>跨区域监管报告已同步。</p>
      </div>
    </div>

    <div class="table-card">
      <h4>监管指标台账</h4>
      <table>
        <thead>
          <tr>
            <th>指标</th>
            <th>当前值</th>
            <th>同比</th>
            <th>预警级别</th>
            <th>更新时间</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in metrics" :key="item.name">
            <td>{{ item.name }}</td>
            <td>{{ item.value }}</td>
            <td>{{ item.trend }}</td>
            <td>{{ item.level }}</td>
            <td>{{ item.time }}</td>
            <td><span class="status">{{ item.status }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseModal :open="showForm" title="生成监管报告" @close="showForm = false">
      <form class="form-grid">
        <label>
          报告周期
          <select>
            <option>本周</option>
            <option>本月</option>
            <option>季度</option>
          </select>
        </label>
        <label>
          覆盖区域
          <input type="text" placeholder="如：华东区域" />
        </label>
        <label>
          监管主题
          <input type="text" placeholder="如：冷链合规" />
        </label>
        <label>
          输出格式
          <select>
            <option>PDF</option>
            <option>Excel</option>
            <option>在线报告</option>
          </select>
        </label>
      </form>
    </BaseModal>

    <BaseModal :open="showProgress" title="分析任务进度" @close="showProgress = false">
      <div class="progress">
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
      </div>
      <p>数据模型训练完成 {{ progress }}%，预计 6 分钟。</p>
    </BaseModal>

    <BaseModal :open="showInfo" title="预警提示" @close="showInfo = false">
      <p>监测到冷链配送时长波动，已推送至监管工作台。</p>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const showForm = ref(false);
const showProgress = ref(false);
const showInfo = ref(false);
const progress = ref(58);

const metrics = [
  { name: '订单履约率', value: '98.2%', trend: '+1.2%', level: '低', time: '2024-06-12 09:30', status: '正常' },
  { name: '冷链合规率', value: '99.1%', trend: '+0.5%', level: '低', time: '2024-06-12 09:30', status: '正常' },
  { name: '库存周转天数', value: '4.6 天', trend: '-0.3', level: '中', time: '2024-06-12 09:30', status: '关注' },
  { name: '损耗率', value: '1.4%', trend: '-0.2%', level: '低', time: '2024-06-12 09:30', status: '正常' },
  { name: '配送准点率', value: '96.8%', trend: '+0.8%', level: '低', time: '2024-06-12 09:30', status: '正常' },
  { name: '抽检覆盖率', value: '92%', trend: '+1.1%', level: '中', time: '2024-06-12 09:30', status: '关注' },
  { name: '跨区调拨次数', value: '18 次', trend: '+2', level: '低', time: '2024-06-12 09:30', status: '正常' },
  { name: '低库存预警', value: '6 个', trend: '-1', level: '中', time: '2024-06-12 09:30', status: '关注' },
  { name: '异常温控事件', value: '2 起', trend: '-1', level: '高', time: '2024-06-12 09:30', status: '预警' },
  { name: '供应商评分', value: '4.7/5', trend: '+0.1', level: '低', time: '2024-06-12 09:30', status: '正常' },
  { name: '追溯响应时长', value: '1.8 秒', trend: '-0.2', level: '低', time: '2024-06-12 09:30', status: '正常' },
  { name: '数据同步延迟', value: '12 秒', trend: '+3', level: '中', time: '2024-06-12 09:30', status: '关注' }
];
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.module-header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.module-header h3 {
  margin: 0 0 4px;
}

.module-header p {
  margin: 0;
  color: #64748b;
}

.actions {
  display: flex;
  gap: 12px;
}

.actions button {
  border: none;
  background: #e0f2fe;
  color: #0284c7;
  padding: 8px 14px;
  border-radius: 10px;
  cursor: pointer;
}

.media-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}

.card {
  background: #f8fafc;
  border-radius: 16px;
  padding: 16px;
}

.card img {
  width: 100%;
  border-radius: 12px;
  margin: 10px 0;
}

.placeholder-box {
  background: #ffffff;
  border-radius: 12px;
  padding: 18px;
  min-height: 160px;
  display: flex;
  align-items: center;
  color: #475569;
}

.table-card {
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 16px;
  overflow-x: auto;
}

.table-card table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.table-card th,
.table-card td {
  padding: 10px 8px;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

.status {
  background: #fce7f3;
  color: #be185d;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
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
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.progress {
  background: #e2e8f0;
  border-radius: 999px;
  height: 10px;
  overflow: hidden;
  margin-bottom: 10px;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #0ea5e9, #6366f1);
}
</style>
