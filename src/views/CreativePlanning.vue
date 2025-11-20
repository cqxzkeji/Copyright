<template>
  <div class="module">
    <header>
      <div>
        <h2>内容创意与策划</h2>
        <p>记录灵感，快速生成策划方案并提示操作。</p>
      </div>
      <button @click="openModal('提示', '所有策划模板均已同步云端，点击生成即可查看。')">功能提示</button>
    </header>

    <section class="idea-board">
      <div>
        <h3>灵感速记</h3>
        <textarea v-model="draft" rows="4" placeholder="输入新的创意或活动设想..."></textarea>
        <div class="actions">
          <button @click="saveIdea">保存灵感</button>
          <button class="ghost" @click="draft = ''">清空</button>
        </div>
      </div>
      <div>
        <h3>焦点主题</h3>
        <div class="tags">
          <label v-for="theme in themes" :key="theme">
            <input type="checkbox" :value="theme" v-model="selectedThemes" />
            {{ theme }}
          </label>
        </div>
        <button class="secondary" @click="generatePlan">生成策划方案</button>
      </div>
    </section>

    <section class="idea-list">
      <h3>灵感列表</h3>
      <ul>
        <li v-for="idea in ideas" :key="idea.id">
          <strong>{{ idea.title }}</strong>
          <p>{{ idea.desc }}</p>
        </li>
      </ul>
    </section>

    <div v-if="modal.visible" class="modal-mask">
      <div class="modal-box">
        <h3>{{ modal.title }}</h3>
        <p>{{ modal.message }}</p>
        <button @click="modal.visible = false">关闭</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const draft = ref('');
const ideas = ref([
  { id: 1, title: '城市记忆影像展', desc: '结合老照片与AR互动，让市民讲述自己的故事。' },
  { id: 2, title: '夜游博物馆剧本', desc: '用沉浸式剧本串联精品文物，打造夜间文化体验。' }
]);
const themes = ['传统节日', '城市地标', 'IP联名', '沉浸式体验'];
const selectedThemes = ref([]);
const modal = reactive({ visible: false, title: '', message: '' });

const saveIdea = () => {
  if (!draft.value.trim()) {
    openModal('提示', '请输入创意再保存。');
    return;
  }
  ideas.value.unshift({ id: Date.now(), title: draft.value.slice(0, 12), desc: draft.value });
  draft.value = '';
  openModal('成功', '灵感已归档，后续可用于策划方案。');
};

const generatePlan = () => {
  if (!selectedThemes.value.length) {
    openModal('提示', '请选择至少一个主题方向。');
    return;
  }
  const plan = selectedThemes.value.join(' + ');
  openModal('策划草案', `根据「${plan}」生成了故事线草稿，请在项目管理中细化里程碑。`);
};

const openModal = (title, message) => {
  modal.title = title;
  modal.message = message;
  modal.visible = true;
};
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 1rem;
}

header button {
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 0.8rem;
  background: #4f7bff;
  color: #fff;
  cursor: pointer;
}

.idea-board {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.idea-board > div {
  flex: 1 1 300px;
  background: #f7f8ff;
  padding: 1.2rem;
  border-radius: 1rem;
}

textarea {
  width: 100%;
  border-radius: 0.8rem;
  border: 1px solid #d1d7f1;
  padding: 0.9rem;
  resize: vertical;
  background: #fff;
}

.actions {
  display: flex;
  gap: 0.8rem;
  margin-top: 0.8rem;
}

button {
  border: none;
  border-radius: 0.8rem;
  padding: 0.65rem 1.2rem;
  cursor: pointer;
}

button.ghost {
  background: transparent;
  border: 1px dashed #a3a9c9;
}

button.secondary {
  margin-top: 1rem;
  background: #fff;
  border: 1px solid #4f7bff;
  color: #4f7bff;
}

.tags {
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.tags label {
  padding: 0.35rem 0.9rem;
  border-radius: 999px;
  background: #fff;
  border: 1px solid #d1d7f1;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.idea-list ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.idea-list li {
  padding: 1rem;
  border-radius: 0.9rem;
  background: #f0f3ff;
}

.modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(15, 21, 46, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-box {
  width: min(380px, 90%);
  background: #fff;
  border-radius: 1rem;
  padding: 1.4rem;
  text-align: center;
}

.modal-box button {
  margin-top: 1rem;
  background: #4f7bff;
  color: #fff;
}
</style>
