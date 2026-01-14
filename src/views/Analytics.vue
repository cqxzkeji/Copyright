<template>
  <section class="analytics">
    <div class="card header">
      <div>
        <div class="badge">数据统计与行为分析</div>
        <h2>多维度评估非遗传播效果</h2>
        <p>统计用户访问频次、浏览路径与交互行为，为内容优化提供支撑。</p>
      </div>
      <div class="header-actions">
        <button class="primary-btn" @click="openModal('summary')">生成统计摘要</button>
        <button class="ghost-btn" @click="openModal('export')">导出报表</button>
        <button class="ghost-btn" @click="openModal('heatmap')">浏览热力轨迹</button>
        <button class="ghost-btn" @click="openModal('notify')">指标提醒</button>
      </div>
    </div>

    <div class="stats-grid">
      <div class="card stat">
        <span>今日访问量</span>
        <strong>3,284</strong>
        <p>较昨日 +12%</p>
      </div>
      <div class="card stat">
        <span>平均停留时长</span>
        <strong>14.6 分钟</strong>
        <p>沉浸体验提升</p>
      </div>
      <div class="card stat">
        <span>交互完成率</span>
        <strong>68%</strong>
        <p>建议优化引导</p>
      </div>
      <div class="card stat">
        <span>热门场景</span>
        <strong>景德镇窑火</strong>
        <p>互动次数最高</p>
      </div>
    </div>

    <div class="card">
      <div class="section-title">用户行为路径分析</div>
      <div class="chart-placeholder">
        <div class="bar" v-for="bar in bars" :key="bar.label">
          <span>{{ bar.label }}</span>
          <div class="bar-track">
            <div class="bar-value" :style="{ width: bar.value }"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="section-title">访客明细数据（24 条）</div>
      <table class="table">
        <thead>
          <tr>
            <th>序号</th>
            <th>访问日期</th>
            <th>场景</th>
            <th>停留时长</th>
            <th>互动次数</th>
            <th>完成度</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in tableRows" :key="row.id">
            <td>{{ row.id }}</td>
            <td>{{ row.date }}</td>
            <td>{{ row.scene }}</td>
            <td>{{ row.duration }}</td>
            <td>{{ row.actions }}</td>
            <td>{{ row.rate }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="card">
      <div class="section-title">数据同步</div>
      <p>最新数据已进入分析队列，正在计算热度指数。</p>
      <button class="primary-btn" @click="openModal('progress')">查看同步进度</button>
    </div>

    <BaseModal
      v-if="activeModal"
      :title="activeModalTitle"
      @close="closeModal"
      @confirm="closeModal"
    >
      <template v-if="activeModal === 'summary'">
        <label>
          时间范围
          <select class="input">
            <option>最近 7 天</option>
            <option>最近 30 天</option>
            <option>本季度</option>
          </select>
        </label>
        <label>
          指标选择
          <input class="input" placeholder="如：留存、互动、转化" />
        </label>
        <p>系统将生成统计摘要并展示关键趋势。</p>
      </template>
      <template v-else-if="activeModal === 'export'">
        <label>
          报表格式
          <select class="input">
            <option>Excel</option>
            <option>PDF</option>
            <option>仪表盘链接</option>
          </select>
        </label>
        <label>
          接收邮箱
          <input class="input" placeholder="请输入邮箱" />
        </label>
        <p>报表导出后会自动发送至指定邮箱。</p>
      </template>
      <template v-else-if="activeModal === 'heatmap'">
        <label>
          视图类型
          <select class="input">
            <option>空间热力图</option>
            <option>路径轨迹</option>
            <option>交互热点</option>
          </select>
        </label>
        <label>
          场景范围
          <input class="input" placeholder="如：苗族银饰工坊" />
        </label>
        <p>热力轨迹将覆盖最近 48 小时的数据。</p>
      </template>
      <template v-else-if="activeModal === 'notify'">
        <label>
          提醒阈值
          <input class="input" placeholder="如：访问量低于 1000" />
        </label>
        <label>
          通知方式
          <select class="input">
            <option>系统站内信</option>
            <option>邮件提醒</option>
            <option>短信提醒</option>
          </select>
        </label>
        <p>系统将根据指标变化自动触发提醒。</p>
      </template>
      <template v-else-if="activeModal === 'progress'">
        <p>正在分析访问数据与用户行为路径。</p>
        <div class="progress-track">
          <div class="progress-value" :style="{ width: `${progress}%` }"></div>
        </div>
        <p>当前进度：{{ progress }}%</p>
      </template>
    </BaseModal>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, ref } from "vue";
import BaseModal from "../components/BaseModal.vue";

const bars = [
  { label: "进入大厅", value: "86%" },
  { label: "场景漫游", value: "72%" },
  { label: "互动学习", value: "54%" },
  { label: "作品分享", value: "32%" }
];

const tableRows = Array.from({ length: 24 }, (_, index) => {
  const scenes = ["徽州古村落", "苗族银饰工坊", "景德镇窑火", "藏族唐卡馆"];
  const durations = ["8 分钟", "12 分钟", "16 分钟", "22 分钟"];
  return {
    id: index + 1,
    date: `2024-09-${String((index % 28) + 1).padStart(2, "0")}`,
    scene: scenes[index % scenes.length],
    duration: durations[index % durations.length],
    actions: 6 + (index % 5),
    rate: `${70 + (index % 20)}%`
  };
});

const activeModal = ref("");
const progress = ref(35);
let timer;

const openModal = (type) => {
  activeModal.value = type;
  if (type === "progress") {
    progress.value = 35;
    timer = window.setInterval(() => {
      progress.value = Math.min(progress.value + 9, 100);
    }, 400);
  }
};

const closeModal = () => {
  activeModal.value = "";
  if (timer) {
    clearInterval(timer);
    timer = undefined;
  }
};

const activeModalTitle = computed(() => {
  const map = {
    summary: "统计摘要生成",
    export: "导出报表",
    heatmap: "浏览热力轨迹",
    notify: "指标提醒",
    progress: "数据同步进度"
  };
  return map[activeModal.value] || "数据分析";
});

onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer);
  }
});
</script>

<style scoped>
.analytics {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.header {
  display: grid;
  gap: 16px;
}

.header-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
}

.stat {
  display: grid;
  gap: 6px;
}

.stat span {
  color: #64748b;
  font-size: 13px;
}

.stat strong {
  font-size: 20px;
}

.chart-placeholder {
  display: grid;
  gap: 12px;
}

.bar {
  display: grid;
  gap: 8px;
  font-size: 14px;
  color: #475569;
}

.bar-track {
  background: #e2e8f0;
  border-radius: 999px;
  height: 10px;
  overflow: hidden;
}

.bar-value {
  height: 100%;
  background: linear-gradient(90deg, #38bdf8, #3b82f6);
}
</style>
