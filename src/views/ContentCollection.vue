<template>
  <section class="panel">
    <h3>内容采集与管理</h3>
    <div class="toolbar">
      <button @click="open('upload')">新增采集任务</button>
      <button @click="open('import')">批量导入素材</button>
      <button @click="startProgress">执行质量检测</button>
      <button @click="open('tip')">操作说明</button>
    </div>

    <div class="cards">
      <div class="card" v-for="image in images" :key="image">
        <img :src="image" alt="非遗素材图" />
      </div>
    </div>

    <table>
      <thead>
        <tr><th>ID</th><th>项目</th><th>类别</th><th>地区</th><th>状态</th></tr>
      </thead>
      <tbody>
        <tr v-for="item in heritageItems" :key="item.id">
          <td>{{ item.id }}</td><td>{{ item.name }}</td><td>{{ item.category }}</td><td>{{ item.region }}</td><td>{{ item.status }}</td>
        </tr>
      </tbody>
    </table>

    <ModalDialog v-model="modalVisible" :title="modalTitle" :show-confirm="needsConfirm" @confirm="confirmAction">
      <form v-if="modalType === 'upload' || modalType === 'import'" class="modal-form">
        <label>任务名称<input v-model="form.taskName" /></label>
        <label>负责人<input v-model="form.owner" /></label>
        <label>说明<textarea v-model="form.desc" rows="3"/></label>
      </form>
      <div v-else-if="modalType === 'progress'">
        <p>质量检测进行中...</p>
        <div class="progress"><span :style="{ width: progress + '%' }"></span></div>
        <p>{{ progress }}%</p>
      </div>
      <div v-else>
        <p>支持视频/音频/图片一键采集，采集后自动入库并标注元数据。</p>
      </div>
    </ModalDialog>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue'
import ModalDialog from '../components/ModalDialog.vue'
import { heritageItems } from './mockData'

const images = [
  'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=600&q=60',
  'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=600&q=60',
  'https://images.unsplash.com/photo-1477506350614-6fa9f5f7f8da?auto=format&fit=crop&w=600&q=60'
]

const modalVisible = ref(false)
const modalType = ref('tip')
const modalTitle = ref('提示')
const needsConfirm = ref(false)
const progress = ref(0)
let timer = null

const form = reactive({ taskName: '', owner: '', desc: '' })

const open = (type) => {
  modalType.value = type
  modalTitle.value = type === 'upload' ? '新增采集任务' : type === 'import' ? '批量导入素材' : '操作说明'
  needsConfirm.value = type !== 'tip'
  modalVisible.value = true
}

const startProgress = () => {
  modalType.value = 'progress'
  modalTitle.value = '质量检测进度'
  needsConfirm.value = false
  progress.value = 0
  modalVisible.value = true
  clearInterval(timer)
  timer = setInterval(() => {
    progress.value += 10
    if (progress.value >= 100) {
      clearInterval(timer)
    }
  }, 180)
}

const confirmAction = () => {
  modalVisible.value = false
}
</script>

<style scoped>
@import './module.css';
.cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 10px; margin-bottom: 14px; }
.card img { width: 100%; height: 120px; object-fit: cover; border-radius: 10px; }
</style>
