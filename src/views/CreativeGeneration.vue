<template>
  <div class="module-wrapper">
    <header>
      <h3>创意生成与设计</h3>
      <p>使用 AI 模型批量生成主视觉、文案与视频脚本。</p>
    </header>

    <section class="prompt-panel">
      <textarea v-model="prompt" rows="3" placeholder="描述你的广告诉求，例如“夏季运动鞋，突出轻盈透气”"></textarea>
      <div class="prompt-actions">
        <select v-model="style">
          <option value="清爽科技">清爽科技</option>
          <option value="潮流年轻">潮流年轻</option>
          <option value="高级极简">高级极简</option>
        </select>
        <button @click="generateCreative">生成创意</button>
        <button class="outline" @click="emit('open-modal', '提示', '请根据提示填写文案并再次生成。')">提示说明</button>
      </div>
    </section>

    <section class="result-grid">
      <article v-for="item in creatives" :key="item.id" class="creative-card">
        <div class="thumb" :style="{ background: item.color }"></div>
        <div>
          <h4>{{ item.title }}</h4>
          <p>{{ item.desc }}</p>
        </div>
        <button @click="emit('open-modal', '创意预览', item.title + ' 已打开预览弹窗。')">预览</button>
      </article>
    </section>

    <div class="actions">
      <button @click="emit('show-progress', '渲染高清素材', 'AI 渲染服务正在导出 4K 素材…')">渲染高清素材</button>
      <button @click="emit('open-modal', '布局建议', '建议添加品牌口号以提升记忆点。')">获取布局建议</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['open-modal', 'show-progress'])
const prompt = ref('')
const style = ref('清爽科技')

const creatives = ref([
  { id: 1, title: '夏季能量', desc: '蓝橙撞色 + 动态字体，突出速度感。', color: 'linear-gradient(120deg,#2563eb,#34d399)' },
  { id: 2, title: '轻盈透气', desc: '半透明材质 + 清爽光效，强化科技感。', color: 'linear-gradient(120deg,#a855f7,#ec4899)' }
])

const generateCreative = () => {
  const label = `${style.value} · ${prompt.value || '快速方案'}`
  creatives.value = [
    { id: Date.now(), title: label, desc: 'AI 根据提示生成的新方案。', color: 'linear-gradient(120deg,#f97316,#facc15)' },
    ...creatives.value.slice(0, 2)
  ]
  emit('open-modal', '生成完成', '新创意已写入工作台。')
}
</script>

<style scoped>
.module-wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.prompt-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

textarea {
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 16px;
}

.prompt-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

select,
button {
  border-radius: 12px;
  border: none;
  padding: 10px 14px;
}

select {
  border: 1px solid #e5e7eb;
}

button {
  background: #10b981;
  color: #fff;
}

button.outline {
  background: #fff;
  border: 1px solid #d1d5db;
  color: #374151;
}

.result-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.creative-card {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
}

.thumb {
  width: 80px;
  height: 80px;
  border-radius: 18px;
}

.creative-card h4 {
  margin-bottom: 4px;
}

.creative-card button {
  margin-left: auto;
  background: #2563eb;
}

.actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.actions button:last-child {
  background: #9333ea;
}
</style>
