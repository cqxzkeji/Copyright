<template>
  <div class="page">
    <section class="section-card header-card">
      <div>
        <h2>数据可视化</h2>
        <p>交互式图表展示课堂质量趋势与关键指标。</p>
      </div>
      <div class="actions">
        <button class="secondary-btn" @click="openModal('tip')">查看提示</button>
        <button class="primary-btn" @click="openModal('form')">配置图表</button>
      </div>
    </section>

    <section class="section-card">
      <div class="section-header">
        <h2>课堂质量趋势</h2>
        <span class="badge">20 个趋势点</span>
      </div>
      <div class="trend">
        <svg viewBox="0 0 400 180" preserveAspectRatio="none">
          <polyline
            :points="linePoints"
            fill="none"
            stroke="#4c6fff"
            stroke-width="3"
            stroke-linecap="round"
          />
        </svg>
        <div class="trend-labels">
          <span v-for="item in chartData" :key="item.label">{{ item.label }}</span>
        </div>
      </div>
    </section>

    <section class="section-card">
      <div class="section-header">
        <h2>指标明细表</h2>
        <div class="actions">
          <button class="secondary-btn" @click="openModal('progress')">导出进度</button>
          <button class="primary-btn" @click="openModal('form')">生成视图</button>
        </div>
      </div>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>日期</th>
              <th>教学评分</th>
              <th>互动指数</th>
              <th>专注度</th>
              <th>课堂节奏</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in tableData" :key="item.id">
              <td>{{ item.date }}</td>
              <td>{{ item.score }}</td>
              <td>{{ item.interaction }}</td>
              <td>{{ item.focus }}</td>
              <td><span class="tag">{{ item.pace }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <div v-if="activeModal === 'tip'" class="modal-mask" role="dialog" aria-modal="true">
      <div class="modal">
        <h3>可视化提示</h3>
        <p>趋势图支持按周/按月筛选，可比较不同班级的教学质量差异。</p>
        <div class="modal-actions">
          <button class="secondary-btn" @click="closeModal">关闭</button>
        </div>
      </div>
    </div>

    <div v-if="activeModal === 'form'" class="modal-mask" role="dialog" aria-modal="true">
      <div class="modal">
        <h3>配置图表视图</h3>
        <p>选择需要展示的指标和时间范围。</p>
        <div class="modal-form">
          <label>
            时间范围
            <select>
              <option>最近 7 天</option>
              <option>最近 30 天</option>
              <option>本学期</option>
            </select>
          </label>
          <label>
            指标
            <select>
              <option>教学评分 + 互动指数</option>
              <option>专注度 + 节奏</option>
              <option>综合指标</option>
            </select>
          </label>
          <label>
            图表说明
            <textarea rows="3" placeholder="请输入图表说明"></textarea>
          </label>
        </div>
        <div class="modal-actions">
          <button class="secondary-btn" @click="closeModal">取消</button>
          <button class="primary-btn" @click="closeModal">保存视图</button>
        </div>
      </div>
    </div>

    <div v-if="activeModal === 'progress'" class="modal-mask" role="dialog" aria-modal="true">
      <div class="modal">
        <h3>导出进度</h3>
        <p>正在生成课堂质量趋势报表。</p>
        <div class="progress-track">
          <div class="progress-fill" :style="{ width: '88%' }"></div>
        </div>
        <div class="modal-actions">
          <button class="secondary-btn" @click="closeModal">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';

const activeModal = ref('');
const chartData = Array.from({ length: 20 }, (_, index) => ({
  label: `${index + 1}`,
  value: 60 + ((index * 5) % 30)
}));

const linePoints = computed(() => {
  const step = 400 / (chartData.length - 1);
  return chartData
    .map((point, index) => {
      const x = index * step;
      const y = 170 - (point.value / 100) * 150;
      return `${x},${y}`;
    })
    .join(' ');
});

const tableData = Array.from({ length: 20 }, (_, index) => ({
  id: index + 1,
  date: `05/${index + 1}`,
  score: 82 + ((index * 2) % 12),
  interaction: 70 + ((index * 3) % 20),
  focus: 68 + ((index * 2) % 22),
  pace: index % 2 === 0 ? '稳定' : '偏快'
}));

const openModal = (name) => {
  activeModal.value = name;
};

const closeModal = () => {
  activeModal.value = '';
};
</script>

<style scoped>
.header-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.trend {
  background: #f7f9ff;
  border-radius: 16px;
  padding: 16px;
}

.trend svg {
  width: 100%;
  height: 180px;
}

.trend-labels {
  display: grid;
  grid-template-columns: repeat(10, minmax(0, 1fr));
  font-size: 10px;
  color: #94a3b8;
  margin-top: 8px;
}

@media (max-width: 800px) {
  .header-card {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
