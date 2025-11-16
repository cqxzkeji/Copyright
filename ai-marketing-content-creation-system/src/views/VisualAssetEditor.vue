<template>
  <div class="module">
    <section class="panel">
      <div>
        <h3>视觉素材生成与编辑</h3>
        <p>组合品牌调性、场景与模特指令，快速产出跨渠道可用的视觉素材。</p>
      </div>
      <div class="action-row">
        <button @click="openBrief">上传参考</button>
        <button @click="renderScene">生成海报</button>
        <button @click="togglePreview">预览流程</button>
      </div>
    </section>

    <section class="panel gallery">
      <div class="mock-card" v-for="scene in scenes" :key="scene.title">
        <div class="mock-image" :style="{ backgroundImage: `linear-gradient(135deg, ${scene.gradient})` }">
          <span>{{ scene.tag }}</span>
        </div>
        <div class="meta">
          <h4>{{ scene.title }}</h4>
          <p>{{ scene.desc }}</p>
          <button class="secondary" @click="emit('open-modal', '编辑器提示', `${scene.title} 的光影参数已同步至 Photoshop 插件。`)">
            推送到编辑器
          </button>
        </div>
      </div>
    </section>

    <div v-if="previewVisible" class="inline-modal">
      <div class="inline-card">
        <h4>生成任务进度</h4>
        <div class="step" v-for="(step, index) in steps" :key="step.label">
          <div class="step-title">
            <span>{{ index + 1 }}</span>
            <strong>{{ step.label }}</strong>
          </div>
          <div class="progress">
            <div class="progress-fill" :style="{ width: step.progress + '%' }"></div>
          </div>
        </div>
        <button @click="previewVisible = false">关闭</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const emit = defineEmits(['open-modal']);

const scenes = reactive([
  { title: 'AR 试妆场景', desc: '双色柔雾口红+AR 试妆体验', tag: 'AR', gradient: '#f472b6, #c084fc' },
  { title: '新品发布海报', desc: '多语言标题 + 扁平图形风', tag: '新品', gradient: '#60a5fa, #34d399' },
  { title: '节日促销 KV', desc: '视觉分镜自动布局 + CTA', tag: '节日', gradient: '#f97316, #facc15' }
]);

const previewVisible = ref(false);
const steps = reactive([
  { label: '解析参考图', progress: 90 },
  { label: '融合品牌色', progress: 70 },
  { label: '构图与排版', progress: 55 }
]);

const openBrief = () => emit('open-modal', '素材上传', '已解析 3 张品牌 KV，提取 6 种安全色。');
const renderScene = () => emit('open-modal', '海报渲染开始', '已启用高清模型，预计 18 秒完成。');
const togglePreview = () => (previewVisible.value = !previewVisible.value);
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.panel {
  background: #f8fafc;
  border-radius: 20px;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.action-row {
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

button.secondary {
  background: #0ea5e9;
  color: white;
}

.gallery {
  flex-direction: column;
  align-items: stretch;
}

.mock-card {
  display: flex;
  gap: 1.5rem;
  padding: 1.5rem;
  background: white;
  border-radius: 18px;
  align-items: center;
  box-shadow: inset 0 0 0 1px #e2e8f0;
}

.mock-image {
  width: 160px;
  height: 120px;
  border-radius: 24px;
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  padding: 1rem;
  color: white;
  font-weight: bold;
}

.meta {
  flex: 1;
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
  box-shadow: 0 20px 45px rgba(15, 23, 42, 0.2);
}

.step {
  margin-bottom: 1rem;
}

.step-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.step-title span {
  width: 28px;
  height: 28px;
  display: inline-flex;
  border-radius: 50%;
  background: #2563eb;
  color: white;
  align-items: center;
  justify-content: center;
}

.progress {
  width: 320px;
  height: 10px;
  border-radius: 999px;
  background: #e2e8f0;
}

.progress-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #6366f1, #a855f7);
}

@media (max-width: 900px) {
  .panel,
  .mock-card {
    flex-direction: column;
    align-items: stretch;
  }

  .progress {
    width: 100%;
  }
}
</style>
