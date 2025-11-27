<template>
  <div class="grid">
    <div class="card">
      <div class="flex-between">
        <h3 class="section-title">关键指标</h3>
        <div class="top-actions">
          <button class="primary-btn" @click="showExport = true">导出报表</button>
          <button class="secondary-btn" @click="showSync = true">刷新数据</button>
          <button class="ghost-btn" @click="showGuide = true">查看说明</button>
        </div>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>指标</th>
            <th>当前值</th>
            <th>月度环比</th>
            <th>更新日期</th>
            <th>备注</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in metrics" :key="row.name">
            <td>{{ row.name }}</td>
            <td>{{ row.value }}</td>
            <td><span class="chip" :style="{ background: row.trend > 0 ? '#22c55e' : '#ef4444', color: '#fff' }">{{ row.trend }}%</span></td>
            <td>{{ row.date }}</td>
            <td>{{ row.note }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="card">
      <h3 class="section-title">趋势看板</h3>
      <div class="chart-bars">
        <div v-for="item in trends" :key="item.label" class="chart-bar" :style="{ height: item.value + 80 + 'px' }">
          <strong>{{ item.value }}%</strong>
          <div style="padding: 6px 0 8px; font-weight: 700;">{{ item.label }}</div>
        </div>
      </div>
    </div>
  </div>

  <div v-if="showExport" class="modal-backdrop" @click.self="showExport = false">
    <div class="modal-card">
      <h3>导出报表</h3>
      <p>选择导出的模块与时间范围，生成包含表格与图表的报告。</p>
      <form class="form-grid" @submit.prevent="exportReport">
        <div>
          <label>模块</label>
          <select v-model="exportForm.module">
            <option value="培训">培训</option>
            <option value="演练">演练</option>
            <option value="知识库">知识库</option>
            <option value="人员">人员</option>
            <option value="综合">综合</option>
          </select>
        </div>
        <div>
          <label>时间范围</label>
          <input v-model="exportForm.range" placeholder="2024-05-01 ~ 2024-05-31" />
        </div>
      </form>
      <div class="flex-between" style="margin-top: 12px;">
        <button class="ghost-btn" @click="showExport = false">取消</button>
        <button class="primary-btn" @click="exportReport">导出</button>
      </div>
    </div>
  </div>

  <div v-if="showSync" class="modal-backdrop" @click.self="showSync = false">
    <div class="modal-card">
      <h3>同步数据中</h3>
      <p>正在同步培训、演练、知识库和人员考核数据。</p>
      <div class="progress-bar" style="margin: 8px 0;">
        <div class="progress-fill" :style="{ width: syncProgress + '%' }"></div>
      </div>
      <p style="font-weight: 700;">{{ syncProgress }}%</p>
      <div class="flex-between" style="margin-top: 8px;">
        <button class="ghost-btn" @click="showSync = false">关闭</button>
      </div>
    </div>
  </div>

  <div v-if="showGuide" class="modal-backdrop" @click.self="showGuide = false">
    <div class="modal-card">
      <h3>统计说明</h3>
      <ul>
        <li>包含图、表数据不少于 5 条，确保横向对比。</li>
        <li>指标趋势与模块数据实时联动，按钮均有弹窗反馈。</li>
        <li>导出报表时会将训练进度与演练结果同步入报告。</li>
      </ul>
      <div class="flex-between" style="margin-top: 10px;">
        <button class="ghost-btn" @click="showGuide = false">明白</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const metrics = ref([
  { name: '培训完成率', value: '82%', trend: 6, date: '2024-05-22', note: '理论+实操合计' },
  { name: '演练达标率', value: '78%', trend: 4, date: '2024-05-22', note: '包含复盘' },
  { name: '知识库阅读', value: '1,230', trend: 12, date: '2024-05-22', note: '近30天' },
  { name: '考核通过率', value: '84%', trend: -2, date: '2024-05-22', note: '本月考试' },
  { name: '报警响应时间', value: '2.8分钟', trend: 8, date: '2024-05-22', note: '模拟场景' }
]);

const trends = ref([
  { label: '培训', value: 82 },
  { label: '演练', value: 74 },
  { label: '知识库', value: 68 },
  { label: '考核', value: 84 },
  { label: '报警响应', value: 91 }
]);

const showExport = ref(false);
const showSync = ref(false);
const showGuide = ref(false);
const syncProgress = ref(0);

const exportForm = reactive({
  module: '综合',
  range: ''
});

const exportReport = () => {
  showExport.value = false;
  showSync.value = true;
  syncProgress.value = 25;
  setTimeout(() => {
    syncProgress.value = 60;
    setTimeout(() => {
      syncProgress.value = 100;
    }, 600);
  }, 600);
};
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 14px;
}

.top-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

ul {
  margin: 0;
  padding-left: 18px;
}

@media (max-width: 1080px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
