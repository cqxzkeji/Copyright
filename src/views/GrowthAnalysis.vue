<template>
  <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));">
    <div class="card">
      <div class="badge">趋势分析</div>
      <h3>长势指数 86.4</h3>
      <p>苗期-开花阶段对比增长 12%。</p>
    </div>
    <div class="card">
      <div class="badge">产量预测</div>
      <h3>预计产量 12.4 吨</h3>
      <p>采收窗口 6 月 2 日至 6 月 8 日。</p>
    </div>
    <div class="card">
      <div class="badge">品质风险</div>
      <h3>糖度风险 2 项</h3>
      <p>病害概率 6%，建议强化通风。</p>
    </div>
  </div>

  <div class="card" style="margin-top: 16px;">
    <div class="section-header">
      <div>
        <h3>生长阶段对比</h3>
        <span>苗期 / 开花 / 结果阶段</span>
      </div>
      <div class="actions">
        <button class="btn" @click="openModal('阶段对比设置', 'stage')">阶段对比</button>
        <button class="btn secondary" @click="openModal('产量预测参数', 'yield')">产量预测</button>
        <button class="btn ghost" @click="openModal('品质风险评估', 'quality')">品质风险</button>
        <button class="btn ghost" @click="openModal('变量贡献提示', 'info')">按钮提示信息</button>
      </div>
    </div>
    <div class="chart-layout">
      <div class="chart-panel">
        <h4>阶段趋势曲线</h4>
        <svg viewBox="0 0 360 180" aria-hidden="true">
          <polyline fill="none" stroke="#22c55e" stroke-width="4" points="10,150 70,120 130,110 190,90 250,70 310,55 350,40" />
          <polyline fill="none" stroke="#38bdf8" stroke-width="4" points="10,160 70,130 130,120 190,100 250,90 310,70 350,60" />
        </svg>
        <div class="chart-legend">
          <span class="badge">长势指数</span>
          <span>对比范围：近 30 天</span>
        </div>
      </div>
      <div class="chart-panel">
        <h4>变量贡献</h4>
        <div class="bar-list">
          <div v-for="item in drivers" :key="item.name" class="bar-item">
            <span>{{ item.name }}</span>
            <div class="bar">
              <div class="bar-fill" :style="{ width: item.value + '%' }"></div>
            </div>
            <strong>{{ item.value }}%</strong>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="card" style="margin-top: 16px;">
    <div class="section-header">
      <div>
        <h3>生长预测明细</h3>
        <span>环境—生长响应关系</span>
      </div>
    </div>
    <div class="table-scroll">
      <table class="table">
        <thead>
          <tr>
            <th>地块</th>
            <th>作物</th>
            <th>阶段</th>
            <th>积温</th>
            <th>长势指数</th>
            <th>产量预测</th>
            <th>品质风险</th>
            <th>驱动因素</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.id">
            <td>{{ row.plot }}</td>
            <td>{{ row.crop }}</td>
            <td>{{ row.stage }}</td>
            <td>{{ row.temp }}</td>
            <td>{{ row.growth }}</td>
            <td>{{ row.yield }}</td>
            <td>{{ row.risk }}</td>
            <td>{{ row.driver }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <BaseModal v-if="modal.open" :title="modal.title" @close="modal.open = false">
    <div v-if="modal.type === 'stage'" class="grid" style="gap: 12px;">
      <div>
        <label class="label">对比阶段</label>
        <input class="input" placeholder="苗期 / 开花 / 结果" />
      </div>
      <div>
        <label class="label">指标维度</label>
        <input class="input" placeholder="积温 / 长势指数 / 叶面积" />
      </div>
      <button class="btn">开始对比</button>
    </div>
    <div v-else-if="modal.type === 'yield'" class="grid" style="gap: 12px;">
      <div>
        <label class="label">预测模型</label>
        <input class="input" placeholder="LSTM / 随机森林" />
      </div>
      <div>
        <label class="label">采收窗口</label>
        <input class="input" placeholder="2024-06-02 至 2024-06-08" />
      </div>
      <button class="btn">生成预测</button>
    </div>
    <div v-else-if="modal.type === 'quality'" class="grid" style="gap: 12px;">
      <p>当前糖度风险偏高，建议启动强化补光与控温策略。</p>
      <button class="btn">生成治理建议</button>
    </div>
    <div v-else>
      <p>变量贡献分析基于环境与生长响应关系，可用于优化种植策略。</p>
    </div>
  </BaseModal>
</template>

<script setup>
import { reactive } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const drivers = [
  { name: '温度', value: 34 },
  { name: '光照', value: 26 },
  { name: '湿度', value: 18 },
  { name: '灌溉', value: 14 },
  { name: '营养盐', value: 8 }
];

const rows = Array.from({ length: 20 }, (_, index) => ({
  id: index + 1,
  plot: `地块-${(index % 10) + 1}`,
  crop: ['番茄', '草莓', '黄瓜', '生菜'][index % 4],
  stage: ['苗期', '开花', '结果'][index % 3],
  temp: `${640 + index * 3}℃`,
  growth: `${84 + (index % 10)}%`,
  yield: `${1.2 + index * 0.05}吨`,
  risk: index % 3 === 0 ? '低' : '中',
  driver: drivers[index % drivers.length].name
}));

const modal = reactive({
  open: false,
  title: '',
  type: ''
});

const openModal = (title, type) => {
  modal.open = true;
  modal.title = title;
  modal.type = type;
};
</script>

<style scoped>
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.section-header span {
  color: #64748b;
  font-size: 13px;
}

.actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.chart-layout {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.chart-panel {
  background: #f8fafc;
  border-radius: 16px;
  padding: 14px;
}

.chart-panel svg {
  width: 100%;
  height: 160px;
}

.chart-legend {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #64748b;
}

.bar-list {
  display: grid;
  gap: 10px;
  margin-top: 10px;
}

.bar-item {
  display: grid;
  grid-template-columns: 60px 1fr 40px;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

.bar {
  background: #e2e8f0;
  border-radius: 999px;
  height: 10px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #38bdf8, #22c55e);
}
</style>
