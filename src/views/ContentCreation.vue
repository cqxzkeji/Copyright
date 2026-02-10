<template>
  <section class="panel">
    <h3>内容创作与个性化定制</h3>
    <div class="toolbar">
      <button @click="open('new')">新建AI创作</button>
      <button @click="open('style')">风格模板配置</button>
      <button @click="open('publish')">生成预览稿</button>
      <button @click="progressModal">创作渲染进度</button>
    </div>

    <div class="cards">
      <article v-for="n in 4" :key="n" class="work-card">
        <h4>创作主题 {{ n }}</h4>
        <p>结合传统技艺与数字叙事，输出多形态文创内容。</p>
      </article>
    </div>

    <table>
      <thead><tr><th>ID</th><th>项目</th><th>类别</th><th>创作状态</th><th>得分</th></tr></thead>
      <tbody>
        <tr v-for="item in heritageItems" :key="item.id"><td>{{ item.id }}</td><td>{{ item.name }}</td><td>{{ item.category }}</td><td>{{ item.status }}</td><td>{{ item.score }}</td></tr>
      </tbody>
    </table>

    <ModalDialog v-model="show" :title="title" :show-confirm="true" @confirm="show = false">
      <form v-if="type !== 'progress'" class="modal-form">
        <label>主题<input placeholder="如：苗绣与现代时尚" /></label>
        <label>输出形式<input placeholder="视频 / 图文 / 海报" /></label>
        <label>风格偏好<textarea rows="3" placeholder="国潮、写实、插画等" /></label>
      </form>
      <div v-else>
        <p>渲染进度 {{ progress }}%</p>
        <div class="progress"><span :style="{ width: progress + '%' }"></span></div>
      </div>
    </ModalDialog>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import ModalDialog from '../components/ModalDialog.vue'
import { heritageItems } from './mockData'

const show = ref(false)
const type = ref('new')
const title = ref('')
const progress = ref(0)

const open = (value) => {
  type.value = value
  title.value = value === 'new' ? '新建AI创作' : value === 'style' ? '风格模板配置' : '生成预览稿'
  show.value = true
}

const progressModal = () => {
  type.value = 'progress'
  title.value = '创作渲染进度'
  show.value = true
  progress.value = 0
  const timer = setInterval(() => {
    progress.value += 25
    if (progress.value >= 100) clearInterval(timer)
  }, 180)
}
</script>

<style scoped>
@import './module.css';
.cards { display: grid; gap: 10px; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); margin-bottom: 12px; }
.work-card { background: #eff6ff; border-radius: 10px; padding: 12px; color: #1e3a8a; }
</style>
