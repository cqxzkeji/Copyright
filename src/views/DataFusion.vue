<template>
  <section class="panel">
    <h3>多模态数据融合与处理</h3>
    <div class="toolbar">
      <button @click="open('rule')">配置融合规则</button>
      <button @click="open('clean')">数据清洗任务</button>
      <button @click="runProgress">运行融合引擎</button>
      <button @click="open('tip')">按钮提示</button>
    </div>

    <div class="chart">
      <div v-for="item in chartData" :key="item.name" class="bar-row">
        <span>{{ item.name }}</span>
        <div class="bar"><span :style="{ width: item.value + '%' }"></span></div>
        <b>{{ item.value }}</b>
      </div>
    </div>

    <table>
      <thead><tr><th>ID</th><th>项目</th><th>区域</th><th>融合得分</th></tr></thead>
      <tbody>
        <tr v-for="item in heritageItems" :key="item.id"><td>{{ item.id }}</td><td>{{ item.name }}</td><td>{{ item.region }}</td><td>{{ item.score }}</td></tr>
      </tbody>
    </table>

    <ModalDialog v-model="visible" :title="title" :show-confirm="showConfirm" @confirm="visible = false">
      <form v-if="type !== 'tip' && type !== 'progress'" class="modal-form">
        <label>方案名称<input /></label>
        <label>融合维度<input /></label>
        <label>说明<textarea rows="3" /></label>
      </form>
      <div v-else-if="type === 'progress'">
        <p>融合引擎执行中...</p>
        <div class="progress"><span :style="{ width: progress + '%' }"></span></div>
      </div>
      <p v-else>融合后可实现文本、图像、音频统一标签映射，支持后续创作和推荐。</p>
    </ModalDialog>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import ModalDialog from '../components/ModalDialog.vue'
import { chartData, heritageItems } from './mockData'

const visible = ref(false)
const title = ref('')
const type = ref('tip')
const showConfirm = ref(false)
const progress = ref(0)

const open = (value) => {
  type.value = value
  title.value = value === 'rule' ? '配置融合规则' : value === 'clean' ? '发起清洗任务' : '按钮提示'
  showConfirm.value = value !== 'tip'
  visible.value = true
}

const runProgress = () => {
  type.value = 'progress'
  title.value = '运行融合引擎'
  showConfirm.value = false
  visible.value = true
  progress.value = 0
  const timer = setInterval(() => {
    progress.value += 20
    if (progress.value >= 100) clearInterval(timer)
  }, 200)
}
</script>

<style scoped>
@import './module.css';
</style>
