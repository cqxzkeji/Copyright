<template>
  <div class="module-layout">
    <section class="section-card">
      <header class="module-header">
        <div>
          <h3>虚拟导览脚本</h3>
          <p>针对不同人群自动匹配讲解路线</p>
        </div>
        <button @click="openGuide">启动AI导览</button>
      </header>
      <div class="tour-grid">
        <article v-for="lesson in lessons" :key="lesson.id" class="tour-card">
          <div class="tour-head">
            <h4>{{ lesson.title }}</h4>
            <span class="tag">{{ lesson.duration }} 分钟</span>
          </div>
          <p>{{ lesson.desc }}</p>
          <div class="progress-track">
            <div class="progress-fill" :style="{ width: lesson.progress + '%' }"></div>
          </div>
          <div class="tour-actions">
            <button @click="startLesson(lesson)">推送到头显</button>
            <button style="background:#0ea5e9;" @click="openQuiz(lesson)">知识问答</button>
          </div>
        </article>
      </div>
    </section>

    <section class="section-card">
      <header class="module-header">
        <h3>学习反馈</h3>
      </header>
      <div class="feedback-grid">
        <article v-for="item in feedback" :key="item.label" class="feedback-card">
          <strong>{{ item.value }}</strong>
          <span>{{ item.label }}</span>
        </article>
      </div>
    </section>

    <BaseModal :open="showGuide" title="AI 导览调度" @close="showGuide = false">
      <p>AI 导览将在 5 秒内出现在游客视野，为其讲解 {{ activeLesson?.title || '精选线路' }}。</p>
    </BaseModal>

    <BaseModal :open="showQuiz" :title="`${activeLesson?.title} 问答`" @close="showQuiz = false">
      <p>问题：{{ activeLesson?.quiz }}</p>
      <textarea v-model="quizAnswer" rows="3" placeholder="输入解答将同步给导览老师"></textarea>
      <button style="align-self:flex-end;margin-top:0.8rem;" @click="submitQuiz">提交</button>
    </BaseModal>

    <BaseModal :open="showToast" title="操作完成" @close="showToast = false">
      <p>{{ toastMessage }}</p>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const lessons = ref([
  { id: 1, title: '冰雪成因与地貌', desc: '解析冰川的形成，观察雪花结晶。', duration: 15, progress: 60, quiz: '冰川蓝色的原因是什么？' },
  { id: 2, title: '极地动植物', desc: '认识苔藓与雪鸮，学习生态平衡。', duration: 12, progress: 45, quiz: '雪鸮羽毛为何能保温？' },
  { id: 3, title: '极夜文化体验', desc: '了解极夜节日与篝火舞蹈。', duration: 18, progress: 30, quiz: '描述一项极夜庆典活动。' }
]);

const feedback = [
  { label: '平均沉浸时长', value: '32 分钟' },
  { label: '知识问答正确率', value: '87%' },
  { label: 'AI 导游满意度', value: '4.8 / 5' }
];

const showGuide = ref(false);
const showQuiz = ref(false);
const showToast = ref(false);
const toastMessage = ref('');
const activeLesson = ref(null);
const quizAnswer = ref('');

function openGuide() {
  showGuide.value = true;
}

function startLesson(lesson) {
  activeLesson.value = lesson;
  showGuide.value = true;
  lesson.progress = Math.min(100, lesson.progress + 20);
}

function openQuiz(lesson) {
  activeLesson.value = lesson;
  quizAnswer.value = '';
  showQuiz.value = true;
}

function submitQuiz() {
  showQuiz.value = false;
  toastMessage.value = `已收到解答“${quizAnswer.value || '待填写'}”，AI 导游会给出点评。`;
  showToast.value = true;
}
</script>

<style scoped>
.module-layout {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.tour-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.tour-card {
  flex: 1 1 240px;
  background: #f8fafc;
  border-radius: 18px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.tour-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tour-actions {
  display: flex;
  gap: 0.6rem;
}

.feedback-grid {
  display: flex;
  gap: 1rem;
}

.feedback-card {
  flex: 1;
  background: #f1f5f9;
  border-radius: 16px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}
</style>
