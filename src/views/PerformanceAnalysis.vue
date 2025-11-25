<template>
  <div class="module">
    <div class="header">
      <div>
        <h3>绩效评估与指标分析</h3>
        <p class="muted">多维指标计算与项目对比分析</p>
      </div>
      <div class="actions">
        <button class="primary-btn" @click="openCalc">重新计算指标</button>
        <button class="secondary-btn" @click="openCompare">生成对比报告</button>
      </div>
    </div>

    <div class="card-grid">
      <div class="card">
        <div class="card-head">
          <strong>指标列表</strong>
          <span class="badge" style="background:#e0f2fe">实时</span>
        </div>
        <table class="table">
          <thead>
            <tr>
              <th>项目</th>
              <th>综合得分</th>
              <th>投资回报</th>
              <th>社会效益</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in metrics" :key="item.project">
              <td>{{ item.project }}</td>
              <td><span class="badge" style="background:#dcfce7">{{ item.score }}</span></td>
              <td>{{ item.roi }}%</td>
              <td>{{ item.social }}</td>
              <td class="table-actions">
                <button class="primary-btn" @click="openCompare">对比</button>
                <button class="secondary-btn" @click="openCalc">重算</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="card">
        <div class="card-head">
          <strong>项目对比图</strong>
        </div>
        <div class="chart">
          <div v-for="item in metrics" :key="item.project" class="bar-row">
            <span>{{ item.project }}</span>
            <div class="bar-shell">
              <div class="bar-fill" :style="{ width: item.score + '%', background: '#3b82f6' }"></div>
            </div>
            <span class="muted">{{ item.score }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-head">
        <strong>多维指标雷达表</strong>
        <button class="secondary-btn" @click="openCalc">刷新维度</button>
      </div>
      <div class="grid-2">
        <div v-for="item in radar" :key="item.name" class="mini-card">
          <div class="doc-title">{{ item.name }}</div>
          <div class="tag-row" style="margin-top:6px">
            <span class="badge" style="background:#e0f2fe">土地: {{ item.land }}</span>
            <span class="badge" style="background:#fef3c7">产业: {{ item.industry }}</span>
            <span class="badge" style="background:#dcfce7">民生: {{ item.civil }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showModal" class="modal-mask" @click.self="showModal=false">
      <div class="modal-container">
        <div class="modal-header">
          <span>指标计算</span>
          <button class="secondary-btn" @click="showModal=false">关闭</button>
        </div>
        <p class="muted">系统正在重新计算投资回报、土地利用效率与民生贡献，完成后自动推送。</p>
        <div class="progress-bar" style="margin-top:10px">
          <div class="progress-fill" style="width:65%"></div>
        </div>
      </div>
    </div>

    <div v-if="showReport" class="modal-mask" @click.self="showReport=false">
      <div class="modal-container">
        <div class="modal-header">
          <span>对比报告</span>
          <button class="secondary-btn" @click="showReport=false">关闭</button>
        </div>
        <p class="muted">已生成项目对比报告，包含敏感性分析与收益区间。</p>
        <button class="primary-btn" style="margin-top:12px" @click="showReport=false">确认接收</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'

const metrics = reactive([
  { project: '滨江活力更新单元', score: 86, roi: 12.5, social: '就业 1.2 万' },
  { project: '轨交枢纽综合体', score: 92, roi: 15.2, social: '换乘提升 35%' },
  { project: '老城肌理修复', score: 77, roi: 10.1, social: '老旧改造 3200 户' },
  { project: '智慧生态科创谷', score: 90, roi: 14.6, social: '绿色建筑 75%' },
  { project: '滨水居住品质提升', score: 73, roi: 9.5, social: '水岸开放 2.3 公里' }
])

const radar = reactive([
  { name: '土地绩效', land: 95, industry: 68, civil: 72 },
  { name: '产业带动', land: 70, industry: 92, civil: 64 },
  { name: '公共服务', land: 66, industry: 58, civil: 90 },
  { name: '生态韧性', land: 80, industry: 62, civil: 85 },
  { name: '资金平衡', land: 78, industry: 74, civil: 71 }
])

const showModal = ref(false)
const showReport = ref(false)

const openCalc = () => {
  showModal.value = true
}

const openCompare = () => {
  showReport.value = true
}
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.actions {
  display: flex;
  gap: 10px;
}

.chart {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.bar-row {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  align-items: center;
  gap: 10px;
}

.bar-shell {
  background: #e5e7eb;
  border-radius: 999px;
  overflow: hidden;
  width: 100%;
  height: 12px;
}

.bar-fill {
  height: 100%;
}

.mini-card {
  padding: 12px;
  border: 1px dashed #dbeafe;
  border-radius: 12px;
  background: #f8fbff;
}
</style>
