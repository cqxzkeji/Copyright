<template>
  <div class="page">
    <div class="grid three">
      <div class="card metric">
        <h3>当前温度</h3>
        <strong>{{ latest.temperature }}°C</strong>
        <span>舒适区间 18-26°C</span>
      </div>
      <div class="card metric">
        <h3>当前湿度</h3>
        <strong>{{ latest.humidity }}%</strong>
        <span>目标区间 60-80%</span>
      </div>
      <div class="card metric">
        <h3>光照强度</h3>
        <strong>{{ latest.light }} lx</strong>
        <span>遮阳策略自动优化</span>
      </div>
    </div>

    <div class="grid two">
      <div class="card">
        <div class="section-title">环境趋势图</div>
        <svg viewBox="0 0 320 140" class="chart">
          <polyline :points="tempPoints" fill="none" stroke="#2f80ed" stroke-width="3" />
          <polyline :points="humidityPoints" fill="none" stroke="#20c997" stroke-width="3" />
          <line x1="0" y1="120" x2="320" y2="120" stroke="#e5e7eb" />
        </svg>
        <div class="legend">
          <span class="badge"><span class="dot temp"></span>温度</span>
          <span class="badge"><span class="dot humidity"></span>湿度</span>
        </div>
        <div class="actions">
          <button class="btn" @click="openModal('filter')">数据筛选</button>
          <button class="btn secondary" @click="openModal('report')">生成对比报告</button>
          <button class="btn ghost" @click="openModal('progress')">同步进度</button>
        </div>
      </div>
      <div class="card">
        <div class="section-title">对比分析摘要</div>
        <ul class="summary-list">
          <li>日均温度 23.4°C，较昨日上升 0.8°C</li>
          <li>夜间湿度稳定在 72% 左右，波动< 4%</li>
          <li>光照峰值 38,000 lx，遮阳系统介入 2 次</li>
          <li>土壤水分保持 34-41%，灌溉频次 2 次</li>
        </ul>
        <div class="actions">
          <button class="btn" @click="openModal('compare')">查看分析结论</button>
          <button class="btn secondary" @click="openModal('tip')">图表提示</button>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="section-title">实时环境数据表</div>
      <table class="table">
        <thead>
          <tr>
            <th>时间</th>
            <th>温度(°C)</th>
            <th>湿度(%)</th>
            <th>光照(lx)</th>
            <th>土壤水分(%)</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in records" :key="row.time">
            <td>{{ row.time }}</td>
            <td>{{ row.temperature }}</td>
            <td>{{ row.humidity }}</td>
            <td>{{ row.light }}</td>
            <td>{{ row.soil }}</td>
            <td><span class="tag">{{ row.status }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="activeModal" class="modal-mask" @click.self="closeModal">
      <div class="modal">
        <header>
          <h3>{{ modalTitle }}</h3>
          <button class="btn ghost" @click="closeModal">关闭</button>
        </header>
        <div v-if="activeModal === 'filter'" class="modal-body">
          <p>选择需要查看的时间范围与环境指标。</p>
          <div class="grid two">
            <label>开始日期<input type="date" /></label>
            <label>结束日期<input type="date" /></label>
            <label>指标<select><option>温度</option><option>湿度</option><option>光照</option></select></label>
            <label>对比园区<select><option>东区示范基地</option><option>西区种植大棚</option></select></label>
          </div>
        </div>
        <div v-else-if="activeModal === 'report'" class="modal-body">
          <p>生成环境对比报告，包含图表、统计与建议。</p>
          <label>报告名称<input placeholder="请输入报告名称" /></label>
          <label>负责人<input placeholder="请输入负责人" /></label>
        </div>
        <div v-else-if="activeModal === 'progress'" class="modal-body">
          <p>正在同步远程传感器数据，请稍候。</p>
          <div class="progress"><span :style="{ width: progress + '%' }"></span></div>
          <p>{{ progress }}% 已完成</p>
        </div>
        <div v-else-if="activeModal === 'compare'" class="modal-body">
          <p>今日环境整体优于昨日，建议减少 10% 灌溉量并延长通风 15 分钟。</p>
        </div>
        <div v-else-if="activeModal === 'tip'" class="modal-body">
          <p>温度与湿度曲线同步上升，表明通风系统处于稳定状态。</p>
        </div>
        <div class="modal-actions">
          <button class="btn" @click="closeModal">确认</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";

const records = [
  { time: "08:00", temperature: 20.4, humidity: 68, light: 12000, soil: 38, status: "稳定" },
  { time: "08:30", temperature: 20.9, humidity: 69, light: 13500, soil: 39, status: "稳定" },
  { time: "09:00", temperature: 21.3, humidity: 70, light: 16800, soil: 39, status: "稳定" },
  { time: "09:30", temperature: 22.1, humidity: 71, light: 19200, soil: 40, status: "良好" },
  { time: "10:00", temperature: 22.6, humidity: 72, light: 21000, soil: 40, status: "良好" },
  { time: "10:30", temperature: 23.0, humidity: 72, light: 22800, soil: 41, status: "良好" },
  { time: "11:00", temperature: 23.4, humidity: 73, light: 26000, soil: 41, status: "良好" },
  { time: "11:30", temperature: 23.7, humidity: 74, light: 28500, soil: 40, status: "良好" },
  { time: "12:00", temperature: 24.1, humidity: 73, light: 31000, soil: 39, status: "良好" },
  { time: "12:30", temperature: 24.5, humidity: 72, light: 33000, soil: 38, status: "稳定" },
  { time: "13:00", temperature: 24.8, humidity: 71, light: 35000, soil: 37, status: "稳定" },
  { time: "13:30", temperature: 25.0, humidity: 70, light: 37000, soil: 37, status: "稳定" },
  { time: "14:00", temperature: 25.3, humidity: 69, light: 38500, soil: 36, status: "稳定" },
  { time: "14:30", temperature: 25.5, humidity: 68, light: 39800, soil: 36, status: "稳定" },
  { time: "15:00", temperature: 25.2, humidity: 69, light: 36000, soil: 36, status: "稳定" },
  { time: "15:30", temperature: 24.9, humidity: 70, light: 33000, soil: 35, status: "稳定" },
  { time: "16:00", temperature: 24.4, humidity: 71, light: 30000, soil: 35, status: "稳定" },
  { time: "16:30", temperature: 23.9, humidity: 72, light: 27000, soil: 35, status: "稳定" },
  { time: "17:00", temperature: 23.3, humidity: 73, light: 24000, soil: 34, status: "稳定" },
  { time: "17:30", temperature: 22.8, humidity: 74, light: 21000, soil: 34, status: "稳定" },
  { time: "18:00", temperature: 22.1, humidity: 74, light: 18000, soil: 34, status: "稳定" },
  { time: "18:30", temperature: 21.6, humidity: 73, light: 15000, soil: 34, status: "稳定" },
  { time: "19:00", temperature: 21.0, humidity: 72, light: 12000, soil: 34, status: "稳定" },
  { time: "19:30", temperature: 20.6, humidity: 71, light: 9000, soil: 34, status: "稳定" }
];

const latest = records[records.length - 1];

const tempPoints = computed(() => {
  return records
    .map((item, index) => {
      const x = (index / (records.length - 1)) * 320;
      const y = 120 - (item.temperature - 20) * 6;
      return `${x},${y}`;
    })
    .join(" ");
});

const humidityPoints = computed(() => {
  return records
    .map((item, index) => {
      const x = (index / (records.length - 1)) * 320;
      const y = 120 - (item.humidity - 65) * 3;
      return `${x},${y}`;
    })
    .join(" ");
});

const activeModal = ref("");
const progress = ref(68);

const modalTitle = computed(() => {
  const titleMap = {
    filter: "数据筛选",
    report: "生成对比报告",
    progress: "同步进度",
    compare: "分析结论",
    tip: "图表提示"
  };
  return titleMap[activeModal.value] || "提示";
});

const openModal = (name) => {
  activeModal.value = name;
};

const closeModal = () => {
  activeModal.value = "";
};
</script>

<style scoped>
.metric {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.metric strong {
  font-size: 28px;
}

.metric span {
  color: var(--muted);
}

.chart {
  width: 100%;
  height: 160px;
  margin-bottom: 12px;
}

.legend {
  display: flex;
  gap: 10px;
  margin-bottom: 12px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

.dot.temp {
  background: #2f80ed;
}

.dot.humidity {
  background: #20c997;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.summary-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: var(--muted);
  font-size: 14px;
}

.modal-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.modal-body label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 14px;
  color: var(--muted);
}
</style>
