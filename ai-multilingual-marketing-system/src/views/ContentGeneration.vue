<template>
  <section class="module">
    <header>
      <h2>智能多语种内容生成</h2>
      <p>基于语义理解的生成引擎可一次输出 32 种语言版本，支持语气、场景和人群的精准控制。</p>
    </header>
    <div class="grid">
      <div class="panel">
        <h3>生成参数</h3>
        <form class="form" @submit.prevent>
          <label>
            目标语言
            <select v-model="form.language">
              <option value="英语">英语</option>
              <option value="西班牙语">西班牙语</option>
              <option value="法语">法语</option>
              <option value="日语">日语</option>
            </select>
          </label>
          <label>
            语气
            <select v-model="form.tone">
              <option>专业</option>
              <option>活泼</option>
              <option>说服</option>
              <option>故事</option>
            </select>
          </label>
          <label>
            关键词
            <input v-model="form.keywords" placeholder="可输入多个关键词" />
          </label>
          <label>
            场景描述
            <textarea v-model="form.brief" rows="4" placeholder="请输入创意描述"></textarea>
          </label>
        </form>
        <div class="btn-group">
          <button @click="generate">生成内容</button>
          <button class="secondary" @click="showProgressBar">生成进度</button>
        </div>
      </div>
      <div class="panel preview">
        <h3>实时预览</h3>
        <article>
          <p v-if="preview">{{ preview }}</p>
          <p v-else class="placeholder">点击“生成内容”即可预览 AI 文案草稿。</p>
        </article>
        <div class="chart">
          <div v-for="(item, index) in chartData" :key="item.language" class="bar">
            <span>{{ item.language }}</span>
            <div class="bar-track">
              <div class="bar-fill" :style="{ width: item.score + '%', background: colors[index] }"></div>
            </div>
            <small>{{ item.score }}% 可读性</small>
          </div>
        </div>
      </div>
    </div>
    <ModalDialog v-model="showResult" title="生成完成">
      <p>{{ preview }}</p>
    </ModalDialog>
    <ModalDialog v-model="progressVisible" title="生成进度">
      <div class="progress">
        <div class="progress-fill" :style="{ width: progress + '%' }"></div>
      </div>
      <p>引擎正在生成多语言稿件，当前完成度 {{ progress }}%。</p>
    </ModalDialog>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const form = reactive({
  language: '英语',
  tone: '专业',
  keywords: '',
  brief: ''
});

const preview = ref('');
const showResult = ref(false);
const progressVisible = ref(false);
const progress = ref(30);
const colors = ['#38bdf8', '#22d3ee', '#a855f7', '#f97316'];

const chartData = reactive([
  { language: '英语', score: 92 },
  { language: '法语', score: 86 },
  { language: '西班牙语', score: 88 },
  { language: '日语', score: 80 }
]);

const generate = () => {
  preview.value = `${form.language}（${form.tone}）版：${form.brief || '请完善场景描述以获得更精准的生成结果。'}`;
  showResult.value = true;
};

const showProgressBar = () => {
  progressVisible.value = true;
  progress.value = 0;
  const timer = setInterval(() => {
    progress.value += 10;
    if (progress.value >= 100) {
      progress.value = 100;
      clearInterval(timer);
    }
  }, 200);
};
</script>

<style scoped>
.module header {
  margin-bottom: 24px;
}

.grid {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
}

.panel {
  flex: 1;
  min-width: 280px;
  background: var(--panel);
  border-radius: 24px;
  padding: 24px;
  border: 1px solid rgba(148, 163, 184, 0.2);
}

.form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 0.9rem;
}

input,
select,
textarea {
  border-radius: 16px;
  border: none;
  padding: 12px 16px;
  background: var(--panel-light);
  color: var(--text);
}

textarea {
  resize: none;
}

.btn-group {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

button {
  border: none;
  border-radius: 999px;
  padding: 12px 24px;
  background: var(--accent);
  color: #0f172a;
  cursor: pointer;
  font-weight: 700;
}

button.secondary {
  background: transparent;
  color: var(--muted);
  border: 1px solid rgba(148, 163, 184, 0.4);
}

.preview article {
  min-height: 120px;
  padding: 16px;
  background: rgba(15, 23, 42, 0.4);
  border-radius: 16px;
}

.placeholder {
  color: var(--muted);
}

.chart {
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.bar {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.bar-track {
  width: 100%;
  height: 8px;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.2);
}

.bar-fill {
  height: 100%;
  border-radius: 999px;
}

.progress {
  width: 100%;
  height: 12px;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.3);
  margin-bottom: 12px;
}

.progress-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(120deg, #38bdf8, #0ea5e9);
  transition: width 0.2s ease;
}
</style>
