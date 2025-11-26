<template>
  <div class="grid" style="grid-template-columns: 1.5fr 1fr; align-items: start">
    <div class="card">
      <div class="section-head">
        <div>
          <p class="eyebrow">用地效率</p>
          <h3>土地利用效率评估</h3>
        </div>
        <button class="action-btn" @click="showEfficiency = true">刷新测算</button>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>地块</th>
            <th>容积率</th>
            <th>产出强度(万元/ha)</th>
            <th>开发程度</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in efficiencyTable" :key="row.name">
            <td>{{ row.name }}</td>
            <td>{{ row.plotRatio }}</td>
            <td>{{ row.output }}</td>
            <td>
              <div class="progress-track">
                <div class="progress-bar" :style="{ width: row.development + '%' }"></div>
              </div>
              <small>{{ row.development }}%</small>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="card">
      <div class="section-head">
        <div>
          <p class="eyebrow">产业绩效</p>
          <h3>经济与产业评估</h3>
        </div>
        <button class="action-btn secondary" @click="showIndustry = true">更新参数</button>
      </div>
      <ul class="ledger">
        <li v-for="item in industries" :key="item.name">
          <div>
            <strong>{{ item.name }}</strong>
            <p class="muted">主导产业：{{ item.focus }}</p>
            <div class="chart-bar" :style="{ width: item.revenue + '%' }"></div>
            <small>税收贡献 {{ item.tax }} 万元</small>
          </div>
          <span class="badge" :class="item.tag">{{ item.level }}</span>
        </li>
      </ul>
    </div>

    <div class="card" style="grid-column: 1 / span 2">
      <div class="section-head">
        <div>
          <p class="eyebrow">综合评分</p>
          <h3>更新潜力综合排序</h3>
        </div>
        <button class="action-btn" @click="showScore = true">评分规则</button>
      </div>
      <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(220px, 1fr))">
        <div v-for="score in potentialScores" :key="score.name" class="card" style="border: 1px dashed var(--border)">
          <div class="section-head" style="align-items: baseline">
            <strong>{{ score.name }}</strong>
            <span class="badge info">{{ score.tag }}</span>
          </div>
          <div class="gauge">
            <div class="needle" :style="{ width: score.value + '%' }"></div>
          </div>
          <p class="muted">潜力评分 {{ score.value }}/100</p>
        </div>
      </div>
    </div>

    <div v-if="showEfficiency" class="modal-mask" @click.self="showEfficiency = false">
      <div class="modal-container">
        <div class="modal-header">
          <h3>效率测算详情</h3>
          <button class="action-btn secondary" @click="showEfficiency = false">关闭</button>
        </div>
        <p>系统自动拉取最新基础数据与能耗指标，预计 8 秒完成。</p>
        <div class="progress-track">
          <div class="progress-bar" :style="{ width: '48%' }"></div>
        </div>
      </div>
    </div>

    <div v-if="showIndustry" class="modal-mask" @click.self="showIndustry = false">
      <div class="modal-container">
        <div class="modal-header">
          <h3>产业参数调整</h3>
          <button class="action-btn secondary" @click="showIndustry = false">关闭</button>
        </div>
        <div class="form-row">
          <label>主导产业<input placeholder="高端制造 / 总部经济" /></label>
          <label>亩均税收目标<input type="number" placeholder="180" /></label>
        </div>
        <label>叠加政策<textarea rows="3" placeholder="填入技改、搬迁或减排政策"></textarea></label>
        <button class="action-btn" style="margin-top: 12px">保存并重算</button>
      </div>
    </div>

    <div v-if="showScore" class="modal-mask" @click.self="showScore = false">
      <div class="modal-container">
        <div class="modal-header">
          <h3>评分规则</h3>
          <button class="action-btn secondary" @click="showScore = false">关闭</button>
        </div>
        <ul>
          <li>土地效率（权重 40%）：容积率、产出强度、开发程度</li>
          <li>产业表现（权重 30%）：税收、就业、能耗强度</li>
          <li>区位与规划（权重 30%）：交通、公共服务、政策匹配度</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const showEfficiency = ref(false);
const showIndustry = ref(false);
const showScore = ref(false);

const efficiencyTable = ref([
  { name: '科创智谷', plotRatio: 1.2, output: 260, development: 35 },
  { name: '机场北物流', plotRatio: 0.9, output: 180, development: 42 },
  { name: '老港工业园', plotRatio: 1.5, output: 320, development: 58 },
  { name: '南湾居住片', plotRatio: 2.3, output: 210, development: 75 },
  { name: '江滩港口区', plotRatio: 0.8, output: 140, development: 30 },
]);

const industries = ref([
  { name: '科创智谷', focus: '新一代信息技术', revenue: 68, tax: 4200, tag: 'success', level: '优' },
  { name: '机场北物流', focus: '航空物流', revenue: 52, tax: 2300, tag: 'info', level: '良' },
  { name: '老港工业园', focus: '装备制造', revenue: 46, tax: 1900, tag: 'warning', level: '待提升' },
  { name: '南湾居住片', focus: '社区配套', revenue: 35, tax: 1200, tag: 'info', level: '稳健' },
  { name: '江滩港口区', focus: '港口服务', revenue: 41, tax: 1600, tag: 'warning', level: '待提升' },
]);

const potentialScores = ref([
  { name: '科创智谷', tag: '科创更新', value: 86 },
  { name: '机场北物流', tag: '物流提升', value: 72 },
  { name: '老港工业园', tag: '工业搬迁', value: 64 },
  { name: '南湾居住片', tag: '社区完善', value: 78 },
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

.gauge {
  height: 12px;
  background: #f2f6ff;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid var(--border);
}

.needle {
  height: 100%;
  background: linear-gradient(90deg, #2e8bff, #7bc5ff);
}
</style>
