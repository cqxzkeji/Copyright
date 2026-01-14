<template>
  <section class="interactive-learning">
    <div class="card intro">
      <div>
        <div class="badge">交互学习与体验教学</div>
        <h2>沉浸式操作 + 步骤引导教学</h2>
        <p>让用户参与非遗技艺体验，支持教学演示、流程拆解与互动学习。</p>
      </div>
      <div class="intro-actions">
        <button class="primary-btn" @click="openModal('start')">启动教学演示</button>
        <button class="ghost-btn" @click="openModal('verify')">动作校验</button>
        <button class="ghost-btn" @click="openModal('decompose')">工序拆解</button>
        <button class="ghost-btn" @click="openModal('report')">生成学习报告</button>
      </div>
    </div>

    <div class="card">
      <div class="section-title">情景互动课堂</div>
      <div class="lesson-grid">
        <div v-for="lesson in lessons" :key="lesson.title" class="lesson-card">
          <div class="lesson-title">{{ lesson.title }}</div>
          <p>{{ lesson.summary }}</p>
          <div class="lesson-meta">
            <span class="badge">{{ lesson.level }}</span>
            <span>{{ lesson.duration }}</span>
          </div>
          <button class="ghost-btn" @click="openLesson(lesson)">进入互动</button>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="section-title">学习进度概览</div>
      <div class="progress-grid">
        <div class="progress-card">
          <span>体验完成率</span>
          <strong>76%</strong>
        </div>
        <div class="progress-card">
          <span>互动任务数</span>
          <strong>18</strong>
        </div>
        <div class="progress-card">
          <span>实践评分</span>
          <strong>4.7 / 5</strong>
        </div>
      </div>
      <button class="primary-btn" @click="openModal('progress')">同步教学进度</button>
    </div>

    <BaseModal
      v-if="activeModal"
      :title="activeModalTitle"
      @close="closeModal"
      @confirm="closeModal"
    >
      <template v-if="activeModal === 'start'">
        <label>
          教学主题
          <input class="input" placeholder="如：扎染、皮影、陶艺" />
        </label>
        <label>
          学员人数
          <input class="input" placeholder="请输入 1-30" />
        </label>
        <p>系统将加载对应的互动教学场景。</p>
      </template>
      <template v-else-if="activeModal === 'verify'">
        <label>
          动作类型
          <select class="input">
            <option>手势轨迹</option>
            <option>工具握持</option>
            <option>力道控制</option>
          </select>
        </label>
        <label>
          容错阈值
          <input class="input" placeholder="建议范围 5%-15%" />
        </label>
        <p>动作校验将生成实时反馈提示。</p>
      </template>
      <template v-else-if="activeModal === 'decompose'">
        <label>
          拆解环节
          <input class="input" placeholder="如：上色、雕刻、打磨" />
        </label>
        <label>
          辅助提示
          <select class="input">
            <option>开启语音讲解</option>
            <option>开启文字提示</option>
            <option>关闭辅助</option>
          </select>
        </label>
        <p>每个步骤将以互动方式呈现。</p>
      </template>
      <template v-else-if="activeModal === 'report'">
        <label>
          报告周期
          <select class="input">
            <option>今日</option>
            <option>本周</option>
            <option>本月</option>
          </select>
        </label>
        <label>
          输出格式
          <select class="input">
            <option>PDF</option>
            <option>可视化仪表盘</option>
            <option>教师总结</option>
          </select>
        </label>
        <p>系统将生成学员互动学习报告。</p>
      </template>
      <template v-else-if="activeModal === 'lesson'">
        <p>已选择课程：{{ selectedLesson?.title }}</p>
        <label>
          教学模式
          <select class="input">
            <option>指导模式</option>
            <option>自由体验</option>
            <option>竞赛挑战</option>
          </select>
        </label>
        <label>
          辅助道具
          <input class="input" placeholder="如：虚拟工具、提示线" />
        </label>
      </template>
      <template v-else-if="activeModal === 'progress'">
        <p>正在同步互动教学过程数据。</p>
        <div class="progress-track">
          <div class="progress-value" :style="{ width: `${progress}%` }"></div>
        </div>
        <p>完成度：{{ progress }}%</p>
      </template>
    </BaseModal>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, ref } from "vue";
import BaseModal from "../components/BaseModal.vue";

const lessons = [
  { title: "扎染染色体验", summary: "体验布料扎结、染缸上色与成品展示。", level: "初级", duration: "25 分钟" },
  { title: "皮影戏制作", summary: "学习皮影雕刻与角色操控要点。", level: "中级", duration: "40 分钟" },
  { title: "木版年画拓印", summary: "从刻版到印制的全流程互动学习。", level: "初级", duration: "30 分钟" },
  { title: "陶瓷拉胚训练", summary: "实时感应手势与力度，指导成型。", level: "高级", duration: "45 分钟" }
];

const activeModal = ref("");
const progress = ref(40);
const selectedLesson = ref(null);
let timer;

const openModal = (type) => {
  activeModal.value = type;
  if (type === "progress") {
    progress.value = 40;
    timer = window.setInterval(() => {
      progress.value = Math.min(progress.value + 12, 100);
    }, 450);
  }
};

const openLesson = (lesson) => {
  selectedLesson.value = lesson;
  activeModal.value = "lesson";
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
    start: "教学演示启动",
    verify: "动作校验设置",
    decompose: "工序拆解",
    report: "学习报告生成",
    lesson: "互动课堂设置",
    progress: "教学进度同步"
  };
  return map[activeModal.value] || "互动教学";
});

onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer);
  }
});
</script>

<style scoped>
.interactive-learning {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.intro {
  display: grid;
  gap: 16px;
}

.intro-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.lesson-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.lesson-card {
  background: #f8fafc;
  padding: 16px;
  border-radius: 16px;
  display: grid;
  gap: 8px;
}

.lesson-title {
  font-weight: 600;
}

.lesson-meta {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #64748b;
  margin-bottom: 8px;
}

.progress-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
  margin-bottom: 16px;
}

.progress-card {
  background: #f1f5f9;
  padding: 14px;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  font-size: 14px;
}
</style>
