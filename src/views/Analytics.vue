<template>
  <section class="panel">
    <h3>内容发布与跨平台传播</h3>
    <div class="toolbar">
      <button @click="open('publish')">发布到多平台</button>
      <button @click="open('schedule')">设置传播计划</button>
      <button @click="showProgress">同步进度</button>
      <button @click="open('tip')">按钮提示</button>
    </div>

    <div class="chart">
      <div v-for="platform in platforms" :key="platform.name" class="bar-row">
        <span>{{ platform.name }}</span>
        <div class="bar"><span :style="{ width: platform.value + '%' }"></span></div>
        <b>{{ platform.value }}%</b>
      </div>
    </div>

    <table>
      <thead><tr><th>ID</th><th>内容</th><th>平台</th><th>曝光量</th><th>反馈评分</th></tr></thead>
      <tbody>
        <tr v-for="item in list" :key="item.id"><td>{{ item.id }}</td><td>{{ item.name }}</td><td>{{ item.platform }}</td><td>{{ item.views }}</td><td>{{ item.rate }}</td></tr>
      </tbody>
    </table>

    <ModalDialog v-model="show" :title="title" :show-confirm="modalType !== 'tip'" @confirm="show = false">
      <form v-if="modalType !== 'tip' && modalType !== 'progress'" class="modal-form">
        <label>发布主题<input /></label>
        <label>选择平台<input placeholder="公众号/抖音/小红书/APP" /></label>
        <label>计划描述<textarea rows="3" /></label>
      </form>
      <div v-else-if="modalType === 'progress'">
        <p>跨平台同步中 {{ progress }}%</p>
        <div class="progress"><span :style="{ width: progress + '%' }"></span></div>
      </div>
      <p v-else>支持多平台一键分发，并自动统计传播数据与受众反馈。</p>
    </ModalDialog>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import ModalDialog from '../components/ModalDialog.vue'

const platforms = [
  { name: '网站', value: 88 },
  { name: '公众号', value: 79 },
  { name: '短视频', value: 92 },
  { name: 'APP', value: 73 }
]

const list = Array.from({ length: 22 }, (_, i) => ({
  id: i + 1,
  name: `非遗传播内容-${i + 1}`,
  platform: ['网站', '公众号', '短视频', 'APP'][i % 4],
  views: 1200 + i * 87,
  rate: (80 + (i % 19)) + '分'
}))

const show = ref(false)
const title = ref('')
const modalType = ref('tip')
const progress = ref(0)

const open = (type) => {
  modalType.value = type
  title.value = type === 'publish' ? '发布到多平台' : type === 'schedule' ? '设置传播计划' : '按钮提示'
  show.value = true
}

const showProgress = () => {
  modalType.value = 'progress'
  title.value = '同步进度'
  progress.value = 0
  show.value = true
  const timer = setInterval(() => {
    progress.value += 20
    if (progress.value >= 100) clearInterval(timer)
  }, 160)
}
</script>

<style scoped>
@import './module.css';
</style>
