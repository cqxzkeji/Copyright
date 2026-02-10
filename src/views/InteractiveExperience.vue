<template>
  <section class="panel">
    <h3>智能推荐与互动体验</h3>
    <div class="toolbar">
      <button @click="open('recommend')">更新推荐策略</button>
      <button @click="open('vr')">启动VR展馆</button>
      <button @click="open('ar')">配置AR互动</button>
      <button @click="open('message')">提示信息</button>
    </div>

    <div class="chart">
      <div v-for="item in chartData" :key="item.name" class="bar-row">
        <span>{{ item.name }}热度</span>
        <div class="bar"><span :style="{ width: item.value + '%' }"></span></div>
        <b>{{ item.value }}</b>
      </div>
    </div>

    <table>
      <thead><tr><th>ID</th><th>项目</th><th>推荐区域</th><th>互动状态</th></tr></thead>
      <tbody>
        <tr v-for="item in heritageItems" :key="item.id"><td>{{ item.id }}</td><td>{{ item.name }}</td><td>{{ item.region }}</td><td>{{ item.status }}</td></tr>
      </tbody>
    </table>

    <ModalDialog v-model="visible" :title="title" :show-confirm="true" @confirm="visible = false">
      <form v-if="type !== 'message'" class="modal-form">
        <label>方案名称<input /></label>
        <label>目标用户<input /></label>
        <label>交互说明<textarea rows="3" /></label>
      </form>
      <p v-else>推荐系统已根据用户收藏与浏览历史进行个性化推荐更新。</p>
    </ModalDialog>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import ModalDialog from '../components/ModalDialog.vue'
import { chartData, heritageItems } from './mockData'

const visible = ref(false)
const type = ref('recommend')
const title = ref('')

const open = (value) => {
  type.value = value
  title.value = value === 'recommend' ? '更新推荐策略' : value === 'vr' ? '启动VR展馆' : value === 'ar' ? '配置AR互动' : '提示信息'
  visible.value = true
}
</script>

<style scoped>
@import './module.css';
</style>
