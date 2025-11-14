<template>
  <section class="panel">
    <header>
      <div>
        <h3>交互学习与体验</h3>
        <p>推送互动课程、语音问答与任务打卡</p>
      </div>
      <button @click="assignMission">派发新任务</button>
    </header>
    <div class="courses">
      <article v-for="course in courses" :key="course.id">
        <div>
          <h4>{{ course.title }}</h4>
          <p>{{ course.desc }}</p>
        </div>
        <div class="meta">
          <span>完成率 {{ course.progress }}%</span>
          <button class="secondary" @click="openCourse(course)">体验</button>
        </div>
      </article>
    </div>
    <ModalDialog v-model="courseModal" :title="activeCourse?.title ?? '互动内容'">
      <p>{{ activeCourse?.desc }}</p>
      <p>建议体验时长：{{ activeCourse?.duration }} 分钟</p>
      <template #footer>
        <button class="primary" @click="courseModal = false">进入</button>
      </template>
    </ModalDialog>
    <ModalDialog v-model="missionModal" title="新任务派发">
      <p>{{ missionMessage }}</p>
    </ModalDialog>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const courses = ref([
  { id: 1, title: '古法造纸互动课', desc: '通过手势操作体验抄纸与晾晒。', progress: 72, duration: 10 },
  { id: 2, title: '皮影戏编排', desc: '实时拖拽角色进行剧情创作。', progress: 55, duration: 15 },
  { id: 3, title: '龙舟竞渡体感训练', desc: '配合体感桨杆完成划频训练。', progress: 88, duration: 12 }
]);

const courseModal = ref(false);
const missionModal = ref(false);
const missionMessage = ref('');
const activeCourse = ref(null);

const openCourse = (course) => {
  activeCourse.value = course;
  courseModal.value = true;
};

const assignMission = () => {
  missionMessage.value = '已向全体体验者推送“苗绣色彩记忆”任务，请在今日完成打卡。';
  missionModal.value = true;
};
</script>

<style scoped>
.panel {
  background: white;
  border-radius: 18px;
  padding: 1.5rem;
  box-shadow: 0 15px 35px rgba(15, 23, 42, 0.08);
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.courses article {
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

button {
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 12px;
  background: #10b981;
  color: white;
}

button.secondary {
  background: #e2e8f0;
  color: #0f172a;
}
</style>
