<template>
  <section>
    <h2>图像生成与编辑</h2>
    <div class="grid-3">
      <div class="card" v-for="(item, i) in stats" :key="i">
        <div>{{ item.label }}</div>
        <div class="stat">{{ item.value }}</div>
        <span class="tag">{{ item.tag }}</span>
      </div>
    </div>
    <div class="card" style="margin-top:16px">
      <div class="toolbar">
        <button class="primary" @click="openForm('创建生成任务')">新建任务</button>
        <button class="ghost" @click="runProgress('风格迁移处理中...')">风格迁移</button>
        <button class="ghost" @click="runProgress('图像修复处理中...')">图像修复</button>
        <button class="ghost" @click="runProgress('图像增强处理中...')">图像增强</button>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>#</th><th>任务名</th><th>模型</th><th>风格</th><th>状态</th><th>操作</th></tr></thead>
          <tbody>
            <tr v-for="row in rows" :key="row.id">
              <td>{{ row.id }}</td><td>{{ row.name }}</td><td>{{ row.model }}</td><td>{{ row.style }}</td><td>{{ row.status }}</td>
              <td><button class="ghost" @click="showTip(`已查看任务 ${row.name}`)">查看</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <ModalDialog :visible="showForm" :title="modalTitle" @close="showForm=false" @confirm="submitForm">
      <div class="form-grid">
        <div><label>任务名称</label><input v-model="form.name" /></div>
        <div><label>模型</label><select v-model="form.model"><option>GAN</option><option>VAE</option><option>Diffusion</option></select></div>
        <div><label>风格模板</label><select v-model="form.style"><option>写实</option><option>动漫</option><option>水彩</option></select></div>
        <div><label>分辨率</label><select v-model="form.size"><option>1024x1024</option><option>768x768</option></select></div>
      </div>
    </ModalDialog>
    <ModalDialog :visible="showMessage" title="操作提示" @close="showMessage=false" @confirm="showMessage=false">
      <p>{{ message }}</p>
    </ModalDialog>
    <ProgressModal :visible="showProgress" title="任务进度" :description="progressDesc" :progress="progress" @close="showProgress=false"/>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue'
import ModalDialog from '../components/ModalDialog.vue'
import ProgressModal from '../components/ProgressModal.vue'

const stats = [
  { label: '今日生成图像', value: 286, tag: '↑12%' },
  { label: '修复任务数', value: 84, tag: '稳定' },
  { label: '平均耗时', value: '18s', tag: '优化中' }
]
const rows = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  name: `创作任务-${i + 1}`,
  model: ['GAN', 'VAE', 'Diffusion'][i % 3],
  style: ['写实', '动漫', '赛博', '国风'][i % 4],
  status: ['已完成', '处理中', '排队中'][i % 3]
}))
const showForm = ref(false)
const showMessage = ref(false)
const showProgress = ref(false)
const modalTitle = ref('')
const message = ref('')
const progressDesc = ref('')
const progress = ref(0)
let timer
const form = reactive({ name: '', model: 'GAN', style: '写实', size: '1024x1024' })

const openForm = (title) => { modalTitle.value = title; showForm.value = true }
const showTip = (text) => { message.value = text; showMessage.value = true }
const submitForm = () => {
  showForm.value = false
  showTip(`任务 ${form.name || '未命名'} 已创建`)
}
const runProgress = (desc) => {
  progressDesc.value = desc
  progress.value = 0
  showProgress.value = true
  clearInterval(timer)
  timer = setInterval(() => {
    progress.value += 10
    if (progress.value >= 100) clearInterval(timer)
  }, 120)
}
</script>
