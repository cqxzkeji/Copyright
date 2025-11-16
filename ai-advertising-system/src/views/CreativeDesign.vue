<template>
  <div class="module">
    <header>
      <div>
        <h3>广告创意设计与生成</h3>
        <p>AI生成多版本创意，并对不同渠道执行适配。</p>
      </div>
      <button class="primary" @click="handleGenerate" title="立即生成多模态创意">生成创意提案</button>
    </header>
    <section class="grid">
      <div class="panel form-panel">
        <h4>创意参数</h4>
        <label>推广主题<input v-model="form.theme" placeholder="如：618 超级品牌日" /></label>
        <label>目标人群<input v-model="form.target" placeholder="如：职场女性，关注护肤" /></label>
        <label>核心卖点<textarea v-model="form.highlights" rows="3" placeholder="输入产品亮点"></textarea></label>
        <label>CTA 按钮文案<input v-model="form.cta" placeholder="如：立即领取体验券" /></label>
        <div class="actions">
          <button class="ghost" @click="showPreview = true" title="查看布局预览">预览布局</button>
          <button class="primary" @click="handleGenerate" title="生成创意">生成创意</button>
        </div>
      </div>
      <div class="panel chart-panel">
        <h4>多渠道素材适配度</h4>
        <div class="bars">
          <div v-for="item in compatibility" :key="item.channel" class="bar-row">
            <span>{{ item.channel }}</span>
            <div class="bar-shell"><div class="bar" :style="{ width: item.score + '%' }"></div></div>
            <span>{{ item.score }}%</span>
          </div>
        </div>
      </div>
    </section>

    <ModalDialog v-model="showResult" title="AI 生成创意">
      <p>主题：{{ form.theme || '自动生成主题' }}</p>
      <p>推荐口号：{{ slogans[0] }}</p>
      <div class="progress-shell">
        <div class="progress" :style="{ width: progress + '%' }"></div>
      </div>
      <small>合成进度：{{ progress }}%</small>
    </ModalDialog>

    <ModalDialog v-model="showPreview" title="版式预览">
      <div class="preview-grid">
        <div class="tile" v-for="item in 4" :key="item">创意版位 {{ item }}</div>
      </div>
    </ModalDialog>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const form = reactive({ theme: '', target: '', highlights: '', cta: '' });
const showResult = ref(false);
const showPreview = ref(false);
const progress = ref(0);
const slogans = ['灵感即刻闪现，成交实时发生', '场景自适应，创意更懂人心'];
const compatibility = [
  { channel: '信息流', score: 92 },
  { channel: '短视频', score: 87 },
  { channel: '开屏广告', score: 78 },
  { channel: 'OTT 屏幕', score: 68 }
];

let timer;
const handleGenerate = () => {
  showResult.value = true;
  progress.value = 0;
  clearInterval(timer);
  timer = setInterval(() => {
    progress.value += 15;
    if (progress.value >= 100) {
      progress.value = 100;
      clearInterval(timer);
    }
  }, 250);
};
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.grid {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.panel {
  background: #fff;
  border-radius: 20px;
  padding: 20px;
  flex: 1;
  min-width: 280px;
  box-shadow: 0 20px 35px rgba(15, 23, 42, 0.08);
}

.form-panel label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 12px;
  font-weight: 600;
  color: #374151;
}

.form-panel input,
.form-panel textarea {
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  padding: 10px 12px;
  font-size: 0.95rem;
  background: #f9fafb;
}

.actions {
  display: flex;
  gap: 12px;
}

.chart-panel {
  flex: 0.8;
}

.bars {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.bar-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.bar-shell {
  flex: 1;
  height: 10px;
  border-radius: 999px;
  background: #f3f4f6;
}

.bar {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #34d399, #60a5fa);
}

.primary {
  border: none;
  padding: 10px 16px;
  border-radius: 12px;
  background: linear-gradient(135deg, #7c3aed, #3b82f6);
  color: #fff;
  cursor: pointer;
}

.ghost {
  border: 1px solid #d1d5db;
  background: transparent;
  border-radius: 12px;
  padding: 10px 16px;
  cursor: pointer;
}

.preview-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(100px, 1fr));
  gap: 12px;
}

.tile {
  background: #eef2ff;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  color: #4338ca;
}

.progress-shell {
  width: 100%;
  height: 10px;
  background: #e5e7eb;
  border-radius: 999px;
  overflow: hidden;
}

.progress {
  height: 100%;
  background: linear-gradient(120deg, #f97316, #fcd34d);
}
</style>
