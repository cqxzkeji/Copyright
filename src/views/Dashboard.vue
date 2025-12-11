<template>
  <main class="page">
    <div class="grid stats">
      <div class="card">
        <p class="label">今日录制时长</p>
        <h2>18 小时</h2>
        <small>5 门课程正在录制</small>
      </div>
      <div class="card">
        <p class="label">数字人回答</p>
        <h2>126 次</h2>
        <small>平均满意度 97%</small>
      </div>
      <div class="card">
        <p class="label">活跃学生</p>
        <h2>842</h2>
        <small>较昨日 +12%</small>
      </div>
      <div class="card">
        <p class="label">告警</p>
        <h2>2</h2>
        <small>需要确认的录制失败</small>
      </div>
    </div>

    <div class="card large">
      <header class="card__header">
        <div>
          <h3>快捷操作</h3>
          <p>登陆后的主界面，可快速进入模块并在内容窗口加载</p>
        </div>
        <div class="actions">
          <button @click="openModal('course')">新建录制</button>
          <button @click="openModal('assistant')" class="ghost">数字人排班</button>
        </div>
      </header>
      <div class="grid shortcuts">
        <router-link class="shortcut" to="/courses">进入课程录制</router-link>
        <router-link class="shortcut" to="/ai">进入数字人助教</router-link>
        <router-link class="shortcut" to="/analytics">查看数据分析</router-link>
        <router-link class="shortcut" to="/overview">系统概览</router-link>
        <router-link class="shortcut" to="/settings">系统设置</router-link>
      </div>
    </div>

    <Modal v-if="showCourse" title="新建录制任务" @close="reset" @confirm="confirmCourse">
      <form class="form">
        <label>课程名称<input v-model="course.name" placeholder="例如：高等数学" /></label>
        <label>授课老师<input v-model="course.teacher" placeholder="张老师" /></label>
        <label>录制开始时间<input v-model="course.start" type="datetime-local" /></label>
      </form>
    </Modal>
    <Modal v-if="showAssistant" title="数字人排班" @close="reset" @confirm="confirmAssistant">
      <form class="form">
        <label>角色<select v-model="assistant.role"><option>讲师</option><option>助教</option><option>答疑机器人</option></select></label>
        <label>工作时段<input v-model="assistant.shift" type="text" placeholder="08:00-18:00" /></label>
      </form>
    </Modal>
  </main>
</template>

<script setup>
import { reactive, ref } from 'vue';
import Modal from '../components/Modal.vue';

const showCourse = ref(false);
const showAssistant = ref(false);
const course = reactive({ name: '', teacher: '', start: '' });
const assistant = reactive({ role: '讲师', shift: '08:00-18:00' });

const openModal = (type) => {
  if (type === 'course') showCourse.value = true;
  if (type === 'assistant') showAssistant.value = true;
};

const reset = () => {
  showCourse.value = false;
  showAssistant.value = false;
};

const confirmCourse = () => {
  alert(`录制任务已创建：${course.name || '未命名'}`);
  reset();
};

const confirmAssistant = () => {
  alert(`排班已生效：${assistant.role} (${assistant.shift})`);
  reset();
};
</script>

<style scoped>
.page {
  padding: 24px;
  display: grid;
  gap: 20px;
}

.grid {
  display: grid;
  gap: 14px;
}

.stats {
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}

.card {
  background: #ffffff;
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.08);
  border: 1px solid #e5e7eb;
}

.card.large {
  padding: 20px;
}

.label {
  color: #6b7280;
  margin: 0 0 4px;
  font-weight: 600;
}

h2 {
  margin: 0;
}

.card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 14px;
}

.card__header h3 {
  margin: 0;
}

.actions {
  display: flex;
  gap: 10px;
}

button {
  padding: 10px 14px;
  border-radius: 12px;
  border: 1px solid #2563eb;
  background: #2563eb;
  color: #fff;
  cursor: pointer;
  font-weight: 700;
}

button.ghost {
  background: #fff;
  color: #2563eb;
}

.shortcuts {
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
}

.shortcut {
  padding: 14px;
  border-radius: 12px;
  background: #f8fafc;
  border: 1px dashed #cbd5e1;
  text-align: center;
  font-weight: 700;
  color: #2563eb;
}

.form {
  display: grid;
  gap: 12px;
}

label {
  display: grid;
  gap: 6px;
  font-weight: 600;
}

input,
select {
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  background: #f8fafc;
}
</style>
