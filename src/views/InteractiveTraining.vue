<template>
  <div class="module-grid">
    <div class="flat-card" style="grid-column: span 2">
      <header class="section-header">
        <div>
          <h3>VR 演练任务</h3>
          <p>沉浸式交互指导操作流程</p>
        </div>
        <button class="primary-btn" @click="startScenario">启动演练</button>
      </header>
      <div class="scenario-list">
        <article v-for="scenario in scenarios" :key="scenario.id">
          <div>
            <h4>{{ scenario.title }}</h4>
            <p>{{ scenario.desc }}</p>
          </div>
          <div class="badge">
            <span>{{ scenario.duration }} min</span>
            <span>{{ scenario.level }}</span>
          </div>
        </article>
      </div>
    </div>

    <div class="flat-card">
      <header class="section-header">
        <div>
          <h3>学习进度</h3>
          <p>培训积分自动同步后台</p>
        </div>
        <button class="secondary-btn" @click="boostProgress">刷新</button>
      </header>
      <div class="progress-container">
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
      </div>
      <p class="progress-label">{{ progress }}% 完成</p>
    </div>

    <div class="flat-card">
      <header class="section-header">
        <div>
          <h3>知识问答</h3>
          <p>答对即可领取 VR 徽章</p>
        </div>
      </header>
      <form class="quiz" @submit.prevent="submitQuiz">
        <label>
          危废入库前需要完成哪些检查？
          <textarea v-model="answer" placeholder="输入你的答案"></textarea>
        </label>
        <button class="primary-btn" type="submit">提交答案</button>
      </form>
    </div>
  </div>
  <BaseModal v-if="modal.visible" :title="modal.title" @close="modal.visible = false">
    <p>{{ modal.message }}</p>
    <div v-if="modal.progress !== null" class="progress-container" style="margin-top: 16px">
      <div class="progress-bar" :style="{ width: modal.progress + '%' }"></div>
    </div>
  </BaseModal>
</template>

<script setup>
import { reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const scenarios = [
  { id: 1, title: '酸碱泄漏应急', desc: '模拟酸碱泄漏，指导封堵、报警、联动流程', duration: 12, level: '高级' },
  { id: 2, title: '危废装车复核', desc: '检查危废编码、标签、重量，与调度联动', duration: 8, level: '标准' },
  { id: 3, title: '双人交接演练', desc: '双人扫码确认出入库并生成交接记录', duration: 10, level: '高级' }
];

const progress = ref(52);
const answer = ref('');
const modal = reactive({ visible: false, title: '', message: '', progress: null });

const startScenario = () => {
  modal.visible = true;
  modal.title = '演练启动';
  modal.message = 'VR 场景加载完成，正在推送交互指南…';
  modal.progress = 35;
};

const boostProgress = () => {
  progress.value = Math.min(100, progress.value + 6);
};

const submitQuiz = () => {
  modal.visible = true;
  modal.title = '回答已提交';
  modal.message = answer.value ? '答案已同步至培训档案，AI 审阅中。' : '请先输入答案再提交。';
  modal.progress = null;
  if (answer.value) {
    answer.value = '';
  }
};
</script>

<style scoped>
.module-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
}

.scenario-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.scenario-list article {
  display: flex;
  justify-content: space-between;
  background: #f8fafc;
  padding: 16px;
  border-radius: 16px;
}

.quiz {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

textarea {
  min-height: 100px;
  border: none;
  background: #f8fafc;
  border-radius: 16px;
  padding: 12px;
  font-family: inherit;
}
</style>
