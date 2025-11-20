<template>
  <div class="module">
    <header>
      <div>
        <h2>创意展示与反馈</h2>
        <p>对外展示创意内容，并收集观众反馈。</p>
      </div>
      <div class="header-actions">
        <button @click="publishShowcase">发布创意</button>
        <button class="ghost" @click="openModal('反馈提醒', '已推送调查问卷至观众群。')">收集反馈</button>
      </div>
    </header>

    <section class="showcase">
      <article v-for="item in showcases" :key="item.id">
        <img :src="item.cover" :alt="item.title" />
        <div>
          <h3>{{ item.title }}</h3>
          <p>{{ item.desc }}</p>
          <button class="link" @click="openModal(item.title, '预览地址：' + item.link)">预览链接</button>
        </div>
      </article>
    </section>

    <section class="feedback-form">
      <h3>现场反馈记录</h3>
      <form @submit.prevent="saveFeedback">
        <textarea v-model="feedback" rows="4" placeholder="记录观众建议、互动亮点..."></textarea>
        <div class="actions">
          <button type="submit">保存反馈</button>
          <button type="button" class="ghost" @click="feedback = ''">清空</button>
        </div>
      </form>
    </section>

    <div v-if="modal.visible" class="modal-mask">
      <div class="modal-box">
        <h3>{{ modal.title }}</h3>
        <p>{{ modal.message }}</p>
        <button @click="modal.visible = false">好的</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const showcases = [
  {
    id: 1,
    title: '数字敦煌光影秀',
    desc: '通过光影技术复刻壁画纹理，提供沉浸式观演体验。',
    cover:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=400&q=60',
    link: 'https://example.com/dunhuang'
  },
  {
    id: 2,
    title: '城市记忆互动墙',
    desc: '市民可上传旧照片，现场生成互动拼图。',
    cover:
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=400&q=60',
    link: 'https://example.com/memorywall'
  }
];

const feedback = ref('');
const modal = reactive({ visible: false, title: '', message: '' });

const publishShowcase = () => {
  openModal('发布成功', '创意内容已同步至展示大屏。');
};

const saveFeedback = () => {
  if (!feedback.value.trim()) {
    openModal('提示', '请输入反馈内容再保存。');
    return;
  }
  openModal('反馈已存档', '记录内容将推送给策划与执行团队。');
  feedback.value = '';
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
  flex-wrap: wrap;
  gap: 1rem;
}

.header-actions {
  display: flex;
  gap: 0.8rem;
}

button {
  border: none;
  border-radius: 0.8rem;
  padding: 0.6rem 1.2rem;
  cursor: pointer;
  background: #4f7bff;
  color: #fff;
}

button.ghost {
  background: transparent;
  border: 1px solid #4f7bff;
  color: #4f7bff;
}

.showcase {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.showcase article {
  flex: 1 1 280px;
  border-radius: 1rem;
  background: #f5f7ff;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.showcase img {
  width: 100%;
  height: 160px;
  object-fit: cover;
}

.showcase div {
  padding: 1rem;
}

button.link {
  margin-top: 0.6rem;
  padding: 0.4rem 0.9rem;
  background: #fff;
  border: 1px solid #4f7bff;
  color: #4f7bff;
}

.feedback-form {
  background: #fff;
  border-radius: 1rem;
  padding: 1.2rem;
  border: 1px solid #e3e6f6;
}

textarea {
  width: 100%;
  border-radius: 0.8rem;
  border: 1px solid #ccd3f3;
  padding: 0.8rem;
  background: #fdfdff;
}

.actions {
  display: flex;
  gap: 0.8rem;
  margin-top: 0.8rem;
}

.modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(14, 18, 36, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-box {
  width: min(360px, 90%);
  background: #fff;
  padding: 1.2rem;
  border-radius: 1rem;
  text-align: center;
}
</style>
