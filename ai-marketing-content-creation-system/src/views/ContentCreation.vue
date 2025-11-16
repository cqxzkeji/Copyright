<template>
  <div class="module">
    <section class="panel intro">
      <div>
        <h3>多语种文案灵感池</h3>
        <p>输入品牌要点即可批量生成多平台推广语，自动完成 A/B 文案扩写与语气优化。</p>
      </div>
      <div class="actions">
        <button @click="generateIdeas" title="生成新的文案思路">生成灵感</button>
        <button @click="optimizeCopy" title="智能润色文案">智能优化</button>
        <button @click="showProgress">查看进度</button>
      </div>
    </section>

    <section class="panel grid">
      <div class="chart">
        <h4>文案素材热度趋势</h4>
        <div class="bars">
          <div v-for="item in heatmap" :key="item.channel">
            <span>{{ item.channel }}</span>
            <div class="bar-bg">
              <div class="bar-fill" :style="{ width: item.score + '%' }"></div>
            </div>
            <span class="score">{{ item.score }}%</span>
          </div>
        </div>
      </div>
      <div class="prompt-builder">
        <h4>语气与风格控制台</h4>
        <div class="chips">
          <button v-for="tone in tones" :key="tone" @click="setTone(tone)">{{ tone }}</button>
        </div>
        <textarea v-model="brief" rows="5" placeholder="输入品牌主张、产品卖点、目标人群..." />
        <button class="primary" @click="applyTone">应用到创作</button>
      </div>
    </section>

    <div v-if="progressVisible" class="inline-modal">
      <div class="inline-card">
        <h4>批量文案生成进度</h4>
        <div class="progress">
          <div class="progress-fill" :style="{ width: progress + '%' }"></div>
        </div>
        <p>已完成 {{ progress }}%，预计 {{ remaining }} 秒完成。</p>
        <button @click="progressVisible = false">收起</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';

const emit = defineEmits(['open-modal']);
const tones = ['热情', '理性', '专业', '俏皮', '科技感'];
const brief = ref('');
const toneState = ref('热情');
const progressVisible = ref(false);
const progress = ref(35);
const heatmap = reactive([
  { channel: '短视频脚本', score: 78 },
  { channel: '社交广告文案', score: 65 },
  { channel: '搜索投放', score: 58 },
  { channel: '电商详情页', score: 72 }
]);

const remaining = computed(() => Math.max(2, Math.round((100 - progress.value) / 5)));

const generateIdeas = () => {
  emit('open-modal', '文案灵感生成', 'AI 已根据品牌 Brief 生成 6 组创意提案，包含标题、口播词与 CTA。');
};

const optimizeCopy = () => {
  emit('open-modal', '智能优化完成', `语气已调整为${toneState.value}风格，并消除重复表达。`);
};

const setTone = (tone) => {
  toneState.value = tone;
};

const applyTone = () => {
  emit('open-modal', '风格应用成功', `已将“${toneState.value}”语气应用到全部短视频脚本。`);
};

const showProgress = () => {
  progressVisible.value = true;
  let percent = progress.value;
  const timer = setInterval(() => {
    percent += 5;
    if (percent >= 100) {
      percent = 100;
      clearInterval(timer);
      emit('open-modal', '批量生成完成', '12 条文案草稿已投递到创意协作区。');
    }
    progress.value = percent;
  }, 600);
};
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  height: 100%;
}

.panel {
  background: #f8fafc;
  border-radius: 20px;
  padding: 1.5rem;
  display: flex;
  gap: 1rem;
}

.intro {
  justify-content: space-between;
  align-items: center;
}

.actions {
  display: flex;
  gap: 0.75rem;
}

button {
  border: none;
  border-radius: 999px;
  padding: 0.6rem 1.4rem;
  background: #cbd5f5;
  color: #0f172a;
  cursor: pointer;
}

button.primary,
.actions button:nth-child(1) {
  background: #2563eb;
  color: white;
}

.grid {
  display: flex;
  flex-wrap: wrap;
}

.chart {
  flex: 1;
}

.bars > div {
  display: grid;
  grid-template-columns: 110px 1fr 50px;
  align-items: center;
  margin-top: 0.8rem;
  gap: 0.5rem;
}

.bar-bg {
  background: #e2e8f0;
  border-radius: 999px;
  height: 12px;
}

.bar-fill {
  background: linear-gradient(90deg, #2563eb, #38bdf8);
  height: 100%;
  border-radius: 999px;
}

.prompt-builder {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

textarea {
  width: 100%;
  border-radius: 16px;
  border: 1px solid #cbd5f5;
  padding: 1rem;
  font-size: 1rem;
  resize: none;
}

.inline-modal {
  position: relative;
}

.inline-card {
  position: absolute;
  right: 0;
  bottom: 0;
  background: white;
  padding: 1.5rem;
  border-radius: 18px;
  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.18);
}

.progress {
  width: 280px;
  height: 12px;
  border-radius: 999px;
  background: #e2e8f0;
  margin: 1rem 0;
}

.progress-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #22d3ee, #0ea5e9);
}

@media (max-width: 900px) {
  .panel {
    flex-direction: column;
  }

  .inline-card {
    position: static;
  }
}
</style>
