<template>
  <div class="module-shell">
    <header>
      <div>
        <h3>推荐内容生成</h3>
        <p>通过多模态生成引擎快速生产个性化素材，响应多渠道触达。</p>
      </div>
      <div class="actions">
        <button @click="showTemplate = true">创建模板</button>
        <button class="primary" @click="showGeneration = true">生成内容</button>
      </div>
    </header>
    <section class="content-grid">
      <article v-for="card in cards" :key="card.title" class="content-card">
        <div class="badge">{{ card.channel }}</div>
        <h4>{{ card.title }}</h4>
        <p>{{ card.summary }}</p>
        <div class="tags">
          <span v-for="tag in card.tags" :key="tag">{{ tag }}</span>
        </div>
        <button @click="previewCard(card)">预览素材</button>
      </article>
    </section>
    <section class="pipeline">
      <h4>生成管线状态</h4>
      <div class="steps">
        <div v-for="step in steps" :key="step.label" class="step">
          <span :class="{ done: step.done }" />
          <div>
            <p>{{ step.label }}</p>
            <small>{{ step.desc }}</small>
          </div>
        </div>
      </div>
      <button class="ghost" @click="showPipeline = true">查看运行日志</button>
    </section>
  </div>
  <BaseModal v-model:open="showTemplate" title="模板创建">
    <p>选择参考样式后，可直接拖入文案、图片素材并保存为团队模板。</p>
  </BaseModal>
  <BaseModal v-model:open="showGeneration" title="内容生成">
    <p>内容生成任务已提交，预计 40 秒完成。完成后会推送至实时推荐模块。</p>
  </BaseModal>
  <BaseModal v-model:open="showPreview" :title="preview?.title || '素材预览'">
    <p>{{ preview?.summary }}</p>
    <div class="tags">
      <span v-for="tag in preview?.tags || []" :key="tag">{{ tag }}</span>
    </div>
  </BaseModal>
  <BaseModal v-model:open="showPipeline" title="运行日志">
    <ul>
      <li>00:01 - 解析提示词成功。</li>
      <li>00:03 - 触发图文多模态生成。</li>
      <li>00:18 - 审核规则通过，推送缓存。</li>
    </ul>
  </BaseModal>
</template>

<script setup>
import { ref } from 'vue'
import BaseModal from '../components/BaseModal.vue'

const cards = [
  {
    channel: 'App Banner',
    title: '凌晨运动补给计划',
    summary: '根据夜跑用户喜好生成的补给清单与新品推荐文案。',
    tags: ['运动', '补给', '个性化']
  },
  {
    channel: 'Push',
    title: '一分钟了解热榜',
    summary: '自动梳理实时热点，生成 60 秒语音稿与封面。',
    tags: ['热点', '语音', '短内容']
  },
  {
    channel: 'Email',
    title: '成长型用户周报',
    summary: '对高活跃用户输出周度成长计划与个性化建议。',
    tags: ['高活跃', '周报', '激励']
  }
]

const steps = [
  { label: '提示词解析', desc: '提取场景 & tone', done: true },
  { label: '素材生成', desc: '调用多模态模型', done: true },
  { label: '审核与过滤', desc: '合规 + 品牌', done: false },
  { label: '分发就绪', desc: '同步到渠道', done: false }
]

const showTemplate = ref(false)
const showGeneration = ref(false)
const showPreview = ref(false)
const showPipeline = ref(false)
const preview = ref(null)

const previewCard = (card) => {
  preview.value = card
  showPreview.value = true
}
</script>

<style scoped>
.module-shell {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.actions {
  display: flex;
  gap: 0.8rem;
}

button {
  border: none;
  border-radius: 999px;
  padding: 0.5rem 1.1rem;
  background: #e2e8f0;
}

button.primary {
  background: linear-gradient(135deg, #38bdf8, #2563eb);
  color: #fff;
}

.content-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.content-card {
  flex: 1;
  min-width: 220px;
  background: #f9fafb;
  border-radius: 20px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.badge {
  align-self: flex-start;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  background: #1d4ed8;
  color: #fff;
  font-size: 0.75rem;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.tags span {
  padding: 0.2rem 0.6rem;
  background: #e0e7ff;
  border-radius: 999px;
  font-size: 0.8rem;
}

.pipeline {
  background: #f9fafb;
  border-radius: 20px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.steps {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.step {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.step span {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid #94a3b8;
}

.step span.done {
  background: #22c55e;
  border-color: #22c55e;
}

button.ghost {
  align-self: flex-start;
  border: 1px dashed #2563eb;
  background: transparent;
  color: #2563eb;
}
</style>
