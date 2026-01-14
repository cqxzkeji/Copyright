<template>
  <section class="module-grid">
    <div class="app-card overview">
      <div>
        <h2>数据统计分析与报告</h2>
        <p>输出病害分布热力与趋势变化，生成巡检报告并完成数据归档与审计。</p>
        <div class="metrics">
          <div>
            <strong>7 份</strong>
            <span>本周报告</span>
          </div>
          <div>
            <strong>5.6%</strong>
            <span>病害下降</span>
          </div>
          <div>
            <strong>12</strong>
            <span>归档批次</span>
          </div>
        </div>
      </div>
      <img :src="chartImage" alt="统计趋势" />
    </div>

    <div class="app-card">
      <div class="toolbar">
        <button class="primary-btn" type="button" @click="openReportModal">导出报告</button>
        <button class="secondary-btn" type="button" @click="openArchiveModal">归档策略</button>
        <button class="ghost-btn" type="button" @click="openAuditModal">审计追溯</button>
        <button class="ghost-btn" type="button" @click="openProgressModal">生成统计</button>
      </div>
      <table class="app-table">
        <thead>
          <tr>
            <th>区段排名</th>
            <th>里程</th>
            <th>病害数量</th>
            <th>趋势</th>
            <th>报告状态</th>
            <th>负责人</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in reportRows" :key="row.id">
            <td>{{ row.rank }}</td>
            <td>{{ row.mileage }}</td>
            <td>{{ row.count }}</td>
            <td>{{ row.trend }}</td>
            <td><span :class="['badge', row.statusClass]">{{ row.status }}</span></td>
            <td>{{ row.owner }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <Modal
      v-if="showReportModal"
      title="导出巡检报告"
      :on-close="closeReportModal"
      :on-confirm="closeReportModal"
    >
      <div class="form-grid">
        <label class="form-field">
          报告格式
          <select v-model="reportForm.format">
            <option>PDF</option>
            <option>Word</option>
            <option>PDF + Word</option>
          </select>
        </label>
        <label class="form-field">
          统计周期
          <select v-model="reportForm.range">
            <option>本周</option>
            <option>本月</option>
            <option>季度</option>
          </select>
        </label>
        <label class="form-field" style="grid-column: 1 / -1">
          报告摘要
          <textarea v-model="reportForm.summary" rows="3"></textarea>
        </label>
      </div>
    </Modal>

    <Modal
      v-if="showArchiveModal"
      title="数据归档策略"
      :on-close="closeArchiveModal"
      :on-confirm="closeArchiveModal"
    >
      <div class="form-grid">
        <label class="form-field">
          归档周期
          <select v-model="archiveForm.cycle">
            <option>每周</option>
            <option>每月</option>
            <option>每季度</option>
          </select>
        </label>
        <label class="form-field">
          存储位置
          <input v-model="archiveForm.storage" />
        </label>
        <label class="form-field" style="grid-column: 1 / -1">
          审计标签
          <input v-model="archiveForm.tag" />
        </label>
      </div>
    </Modal>

    <Modal
      v-if="showAuditModal"
      title="审计追溯查询"
      :on-close="closeAuditModal"
      :on-confirm="closeAuditModal"
    >
      <div class="form-grid">
        <label class="form-field">
          审计编号
          <input v-model="auditForm.code" />
        </label>
        <label class="form-field">
          查询人
          <input v-model="auditForm.user" />
        </label>
        <label class="form-field">
          追溯范围
          <select v-model="auditForm.scope">
            <option>报告版本</option>
            <option>原始采集</option>
            <option>派单记录</option>
          </select>
        </label>
        <label class="form-field" style="grid-column: 1 / -1">
          备注
          <textarea v-model="auditForm.note" rows="2"></textarea>
        </label>
      </div>
    </Modal>

    <Modal
      v-if="showProgressModal"
      title="统计分析执行中"
      :on-close="closeProgressModal"
      :on-confirm="closeProgressModal"
    >
      <p>正在生成 {{ progressScope }} 的趋势与热力统计。</p>
      <div class="progress-bar" style="margin-top: 16px">
        <span :style="{ width: progress + '%' }"></span>
      </div>
      <p style="margin-top: 10px; color: #60729b">分析进度 {{ progress }}%</p>
    </Modal>
  </section>
</template>

<script setup>
import { onBeforeUnmount, ref } from "vue";
import Modal from "../components/Modal.vue";

const chartImage =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='300' height='180'>
      <rect width='300' height='180' rx='16' fill='#f1f7ff'/>
      <circle cx='80' cy='90' r='40' fill='#6ed4ff' opacity='0.7'/>
      <circle cx='150' cy='70' r='50' fill='#2f6bff' opacity='0.7'/>
      <circle cx='220' cy='110' r='35' fill='#8bd0ff' opacity='0.7'/>
    </svg>`
  );

const reportRows = Array.from({ length: 20 }, (_, index) => {
  const statusOptions = [
    { label: "已生成", class: "success" },
    { label: "待复核", class: "warning" },
    { label: "待导出", class: "danger" },
  ];
  const status = statusOptions[index % statusOptions.length];
  return {
    id: index + 1,
    rank: `TOP-${index + 1}`,
    mileage: `K${40 + index}+${(index * 6) % 1000}`,
    count: 18 + (index % 7) * 2,
    trend: index % 2 === 0 ? "下降" : "上升",
    status: status.label,
    statusClass: status.class,
    owner: ["曹工", "梁工", "杜工", "高工"][index % 4],
  };
});

const showReportModal = ref(false);
const showArchiveModal = ref(false);
const showAuditModal = ref(false);
const showProgressModal = ref(false);
const progress = ref(0);
const progressScope = ref("本周");
let timer;

const reportForm = ref({
  format: "PDF + Word",
  range: "本周",
  summary: "重点区段病害下降 5.6%，需持续关注区段 C。",
});

const archiveForm = ref({
  cycle: "每月",
  storage: "轨检云 / 核心库",
  tag: "2024-Q3-巡检",
});

const auditForm = ref({
  code: "AT-2024-0712",
  user: "冯审计",
  scope: "报告版本",
  note: "需要关联原始影像与处置记录。",
});

const openReportModal = () => {
  showReportModal.value = true;
};

const closeReportModal = () => {
  showReportModal.value = false;
};

const openArchiveModal = () => {
  showArchiveModal.value = true;
};

const closeArchiveModal = () => {
  showArchiveModal.value = false;
};

const openAuditModal = () => {
  showAuditModal.value = true;
};

const closeAuditModal = () => {
  showAuditModal.value = false;
};

const openProgressModal = () => {
  progress.value = 18;
  progressScope.value = "本周";
  showProgressModal.value = true;
  clearInterval(timer);
  timer = setInterval(() => {
    progress.value = Math.min(progress.value + 14, 100);
    if (progress.value >= 100) {
      clearInterval(timer);
    }
  }, 360);
};

const closeProgressModal = () => {
  showProgressModal.value = false;
  clearInterval(timer);
};

onBeforeUnmount(() => {
  clearInterval(timer);
});
</script>

<style scoped>
.module-grid {
  display: grid;
  gap: 20px;
}

.overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  align-items: center;
}

.overview h2 {
  margin: 0 0 8px;
}

.overview p {
  margin: 0 0 16px;
  color: #60729b;
}

.overview img {
  width: 100%;
  border-radius: 14px;
  background: #f1f6ff;
}

.metrics {
  display: flex;
  gap: 16px;
}

.metrics div {
  background: #f4f7ff;
  border-radius: 12px;
  padding: 10px 14px;
  min-width: 90px;
}

.metrics strong {
  font-size: 18px;
  display: block;
}

.metrics span {
  font-size: 12px;
  color: #6a7aa3;
}
</style>
