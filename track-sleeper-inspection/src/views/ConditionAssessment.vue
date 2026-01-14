<template>
  <section class="module-grid">
    <div class="app-card overview">
      <div>
        <h2>状态评估与病害分级</h2>
        <p>按里程/区段输出健康度评分与病害等级，实现复核与人工校正闭环。</p>
        <div class="metrics">
          <div>
            <strong>92.4</strong>
            <span>平均健康度</span>
          </div>
          <div>
            <strong>16</strong>
            <span>重点区段</span>
          </div>
          <div>
            <strong>4</strong>
            <span>复核待办</span>
          </div>
        </div>
      </div>
      <img :src="chartImage" alt="健康度趋势" />
    </div>

    <div class="app-card">
      <div class="toolbar">
        <button class="primary-btn" type="button" @click="openScoreModal">评分模型</button>
        <button class="secondary-btn" type="button" @click="openLevelModal">病害阈值</button>
        <button class="ghost-btn" type="button" @click="openReviewModal">复核闭环</button>
        <button class="ghost-btn" type="button" @click="openProgressModal">生成评估</button>
      </div>
      <table class="app-table">
        <thead>
          <tr>
            <th>区段</th>
            <th>里程范围</th>
            <th>健康度</th>
            <th>病害等级</th>
            <th>复核状态</th>
            <th>负责人</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in assessRows" :key="row.id">
            <td>{{ row.section }}</td>
            <td>{{ row.mileage }}</td>
            <td>{{ row.score }}</td>
            <td><span :class="['badge', row.levelClass]">{{ row.level }}</span></td>
            <td>{{ row.review }}</td>
            <td>{{ row.owner }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <Modal
      v-if="showScoreModal"
      title="评分模型调整"
      :on-close="closeScoreModal"
      :on-confirm="closeScoreModal"
    >
      <div class="form-grid">
        <label class="form-field">
          权重策略
          <select v-model="scoreForm.weight">
            <option>裂纹优先</option>
            <option>掉块优先</option>
            <option>均衡策略</option>
          </select>
        </label>
        <label class="form-field">
          健康度基线
          <input v-model="scoreForm.baseline" />
        </label>
        <label class="form-field">
          评分频次
          <select v-model="scoreForm.frequency">
            <option>每日</option>
            <option>每周</option>
            <option>每月</option>
          </select>
        </label>
        <label class="form-field">
          复核触发
          <input v-model="scoreForm.trigger" />
        </label>
      </div>
    </Modal>

    <Modal
      v-if="showLevelModal"
      title="病害等级阈值"
      :on-close="closeLevelModal"
      :on-confirm="closeLevelModal"
    >
      <div class="form-grid">
        <label class="form-field">
          轻度阈值
          <input v-model="levelForm.light" />
        </label>
        <label class="form-field">
          中度阈值
          <input v-model="levelForm.medium" />
        </label>
        <label class="form-field">
          重度阈值
          <input v-model="levelForm.heavy" />
        </label>
        <label class="form-field" style="grid-column: 1 / -1">
          说明
          <textarea v-model="levelForm.note" rows="2"></textarea>
        </label>
      </div>
    </Modal>

    <Modal
      v-if="showReviewModal"
      title="复核闭环设置"
      :on-close="closeReviewModal"
      :on-confirm="closeReviewModal"
    >
      <div class="form-grid">
        <label class="form-field">
          复核人员
          <input v-model="reviewForm.reviewer" />
        </label>
        <label class="form-field">
          复核时限
          <select v-model="reviewForm.deadline">
            <option>24 小时</option>
            <option>48 小时</option>
            <option>72 小时</option>
          </select>
        </label>
        <label class="form-field" style="grid-column: 1 / -1">
          复核说明
          <textarea v-model="reviewForm.note" rows="2"></textarea>
        </label>
      </div>
    </Modal>

    <Modal
      v-if="showProgressModal"
      title="评估任务生成中"
      :on-close="closeProgressModal"
      :on-confirm="closeProgressModal"
    >
      <p>正在生成 {{ progressName }} 的健康度评分。</p>
      <div class="progress-bar" style="margin-top: 16px">
        <span :style="{ width: progress + '%' }"></span>
      </div>
      <p style="margin-top: 10px; color: #60729b">评估进度 {{ progress }}%</p>
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
      <rect width='300' height='180' rx='16' fill='#f2f7ff'/>
      <path d='M20 130 C60 70, 120 70, 160 100 C200 130, 240 90, 280 60' fill='none' stroke='#2f6bff' stroke-width='6'/>
      <path d='M20 150 C70 120, 120 120, 170 140 C220 160, 250 130, 280 110' fill='none' stroke='#8bd0ff' stroke-width='6'/>
    </svg>`
  );

const assessRows = Array.from({ length: 20 }, (_, index) => {
  const levels = [
    { label: "轻度", class: "success" },
    { label: "中度", class: "warning" },
    { label: "重度", class: "danger" },
  ];
  const level = levels[index % levels.length];
  return {
    id: index + 1,
    section: `区段 ${String.fromCharCode(65 + (index % 5))}`,
    mileage: `K${20 + index}+${(index * 7) % 1000}`,
    score: (88 - (index % 8) * 1.2).toFixed(1),
    level: level.label,
    levelClass: level.class,
    review: index % 3 === 0 ? "待复核" : "已确认",
    owner: ["刘工", "宋工", "齐工", "周工"][index % 4],
  };
});

const showScoreModal = ref(false);
const showLevelModal = ref(false);
const showReviewModal = ref(false);
const showProgressModal = ref(false);
const progress = ref(0);
const progressName = ref("区段 B");
let timer;

const scoreForm = ref({
  weight: "裂纹优先",
  baseline: "90",
  frequency: "每周",
  trigger: "健康度 < 85 自动复核",
});

const levelForm = ref({
  light: "< 5%",
  medium: "5% - 12%",
  heavy: "> 12%",
  note: "重度病害需 48 小时内复核确认。",
});

const reviewForm = ref({
  reviewer: "王审核",
  deadline: "48 小时",
  note: "需同步施工计划与维修窗口。",
});

const openScoreModal = () => {
  showScoreModal.value = true;
};

const closeScoreModal = () => {
  showScoreModal.value = false;
};

const openLevelModal = () => {
  showLevelModal.value = true;
};

const closeLevelModal = () => {
  showLevelModal.value = false;
};

const openReviewModal = () => {
  showReviewModal.value = true;
};

const closeReviewModal = () => {
  showReviewModal.value = false;
};

const openProgressModal = () => {
  progress.value = 20;
  progressName.value = "区段 B";
  showProgressModal.value = true;
  clearInterval(timer);
  timer = setInterval(() => {
    progress.value = Math.min(progress.value + 12, 100);
    if (progress.value >= 100) {
      clearInterval(timer);
    }
  }, 380);
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
