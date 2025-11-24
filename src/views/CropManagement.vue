<template>
  <div class="crop">
    <section class="varieties">
      <article v-for="crop in crops" :key="crop.name" class="variety">
        <div>
          <h4>{{ crop.name }}</h4>
          <p>长势指数 {{ crop.score }}</p>
        </div>
        <button class="ghost" @click="showAdvice(crop)">管理建议</button>
      </article>
    </section>

    <section class="operations">
      <h3>作业安排</h3>
      <div class="tasks">
        <article v-for="task in tasks" :key="task.title" class="task">
          <div>
            <h4>{{ task.title }}</h4>
            <p>{{ task.desc }}</p>
          </div>
          <button @click="showModal(task.title, task.action)">执行</button>
        </article>
      </div>
    </section>

    <ModalDialog v-if="visible" :title="modalTitle" @close="visible = false">
      <p>{{ modalContent }}</p>
    </ModalDialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const crops = [
  { name: '番茄', score: 88, advice: '进入坐果期，需补充钾肥 6kg/亩。' },
  { name: '黄瓜', score: 76, advice: '叶面有轻微白粉病，安排喷洒生物农药。' },
  { name: '蓝莓', score: 91, advice: '果粒均匀，可按订单计划采摘。' }
];

const tasks = [
  { title: '病虫害巡检', desc: '结合 AI 模型识别结果', action: '已创建无人机航线并同步作业队。' },
  { title: '智能施肥', desc: '3 号地块定量滴施', action: '肥液配比：N 18 · P 8 · K 24，执行 10 分钟。' },
  { title: '采收调度', desc: '蓝莓冷链订单 12 吨', action: '采收计划已同步给冷链物流。' }
];

const visible = ref(false);
const modalTitle = ref('');
const modalContent = ref('');

const showAdvice = (crop) => {
  visible.value = true;
  modalTitle.value = crop.name + ' 管理建议';
  modalContent.value = crop.advice;
};

const showModal = (title, content) => {
  visible.value = true;
  modalTitle.value = title;
  modalContent.value = content;
};
</script>

<style scoped>
.crop {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.varieties {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}

.variety {
  background: #f8fafc;
  padding: 1.2rem;
  border-radius: 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.operations {
  background: #fff7ed;
  border-radius: 20px;
  padding: 1.5rem;
}

.tasks {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}

.task {
  background: #fff;
  border-radius: 14px;
  padding: 1rem 1.2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

button {
  border: none;
  border-radius: 999px;
  padding: 0.45rem 1.2rem;
  cursor: pointer;
  font-weight: 600;
  background: #22c55e;
  color: #fff;
}

button.ghost {
  background: rgba(37, 99, 235, 0.12);
  color: #2563eb;
}
</style>
