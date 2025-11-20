<template>
  <div class="module-wrapper">
    <header>
      <h3>数据分析与优化</h3>
      <p>监控广告投放表现，智能给出优化建议。</p>
    </header>

    <section class="chart">
      <div class="chart-line">
        <div v-for="point in points" :key="point.day" class="point" :style="{ height: point.value + '%' }">
          <span>{{ point.day }}</span>
        </div>
      </div>
      <div class="chart-legend">
        周曝光趋势（单位：万）
      </div>
    </section>

    <section class="insights">
      <article v-for="insight in insights" :key="insight.title">
        <h4>{{ insight.title }}</h4>
        <p>{{ insight.desc }}</p>
        <button @click="emit('open-modal', '优化建议', insight.action)">查看建议</button>
      </article>
    </section>

    <div class="actions">
      <button @click="emit('show-progress', '导出报告', '正在导出 PDF 报告…')">导出报告</button>
      <button @click="emit('open-modal', '指标对比', '已切换至多维对比视图。')">指标对比</button>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['open-modal', 'show-progress'])

const points = [
  { day: '周一', value: 40 },
  { day: '周二', value: 65 },
  { day: '周三', value: 58 },
  { day: '周四', value: 72 },
  { day: '周五', value: 90 },
  { day: '周六', value: 70 },
  { day: '周日', value: 60 }
]

const insights = [
  { title: 'ROI 上升 12%', desc: '大盘 ROI 提升来自智能创意 A/B，建议扩量 15%。', action: '建议增加预算 15%，保持优质人群组合。' },
  { title: '频次飙升告警', desc: '18-24 岁人群近两日曝光频次>5，需要降频。', action: '建议将人群频控设置为 3，并收窄地域。' }
]
</script>

<style scoped>
.module-wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.chart {
  background: #f9fafb;
  border-radius: 20px;
  padding: 16px;
}

.chart-line {
  display: flex;
  align-items: flex-end;
  gap: 10px;
  height: 150px;
}

.point {
  flex: 1;
  background: linear-gradient(120deg, #f472b6, #a855f7);
  border-radius: 12px 12px 4px 4px;
  position: relative;
}

.point span {
  position: absolute;
  bottom: -22px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
}

.chart-legend {
  margin-top: 16px;
  font-size: 14px;
  color: #6b7280;
}

.insights {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.insights article {
  flex: 1 1 240px;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

button {
  border: none;
  border-radius: 10px;
  padding: 8px 12px;
  background: #2563eb;
  color: #fff;
}

.actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.actions button:last-child {
  background: #f97316;
}
</style>
