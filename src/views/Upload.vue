<template>
  <div class="panel">
    <div class="toolbar">
      <button @click="openForm">上传视频</button>
      <button @click="openProgress('正在批量发布内容...')">批量发布</button>
      <button @click="openInfo('已执行分类重建，索引已刷新。')">重建分类索引</button>
    </div>

    <div class="table-wrap">
      <table>
        <thead>
          <tr><th>ID</th><th>标题</th><th>标签</th><th>分类</th><th>时长</th><th>状态</th><th>操作</th></tr>
        </thead>
        <tbody>
          <tr v-for="item in videos" :key="item.id">
            <td>{{ item.id }}</td><td>{{ item.title }}</td><td>{{ item.tag }}</td><td>{{ item.category }}</td><td>{{ item.duration }}</td><td>{{ item.status }}</td>
            <td><button class="small" @click="openInfo(`已打开《${item.title}》编辑窗口。`)">编辑</button></td>
          </tr>
        </tbody>
      </table>
    </div>

    <ModalDialog :visible="modal.showForm" title="上传短视频" show-confirm @close="modal.showForm=false" @confirm="submitForm">
      <form class="form-grid">
        <label>视频标题<input v-model="form.title" placeholder="输入标题" /></label>
        <label>视频标签<input v-model="form.tag" placeholder="#音乐 #旅行" /></label>
        <label>分类
          <select v-model="form.category"><option>娱乐</option><option>科技</option><option>知识</option><option>生活</option></select>
        </label>
        <label>封面地址<input v-model="form.cover" placeholder="https://" /></label>
      </form>
    </ModalDialog>

    <ModalDialog :visible="modal.showProgress" title="任务进度" @close="modal.showProgress=false">
      <p>{{ modal.message }}</p>
      <div class="bar"><span :style="{width: `${progress}%`}" /></div>
      <p>{{ progress }}%</p>
    </ModalDialog>

    <ModalDialog :visible="modal.showInfo" title="提示" @close="modal.showInfo=false">
      <p>{{ modal.message }}</p>
    </ModalDialog>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import ModalDialog from '../components/ModalDialog.vue'

const videos = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  title: `城市生活记录 ${i + 1}`,
  tag: i % 2 === 0 ? '#生活 #Vlog' : '#知识 #科普',
  category: ['生活', '科技', '娱乐', '知识'][i % 4],
  duration: `00:${String((i * 7) % 59).padStart(2, '0')}`,
  status: i % 3 === 0 ? '待发布' : '已发布'
}))

const form = reactive({ title: '', tag: '', category: '娱乐', cover: '' })
const progress = ref(0)
const modal = reactive({ showForm: false, showProgress: false, showInfo: false, message: '' })

const openForm = () => (modal.showForm = true)
const openInfo = (message) => {
  modal.message = message
  modal.showInfo = true
}
const openProgress = (message) => {
  modal.message = message
  modal.showProgress = true
  progress.value = 0
  const timer = setInterval(() => {
    progress.value += 20
    if (progress.value >= 100) clearInterval(timer)
  }, 160)
}
const submitForm = () => {
  modal.showForm = false
  openInfo(`视频《${form.title || '未命名'}》提交成功，等待审核。`)
}
</script>

<style scoped>
.panel{display:grid;gap:14px}.toolbar{display:flex;gap:10px;flex-wrap:wrap}.toolbar button,.small{border:1px solid #c8d5f0;background:#fff;border-radius:10px;padding:8px 12px;cursor:pointer}.table-wrap{overflow:auto;background:#fff;border:1px solid #dbe6ff;border-radius:12px}table{width:100%;border-collapse:collapse;font-size:14px}th,td{padding:10px;border-bottom:1px solid #ebeff8;text-align:left}.form-grid{display:grid;gap:10px}label{display:grid;gap:6px}input,select{border:1px solid #c8d5f0;border-radius:8px;padding:8px}.bar{height:10px;background:#e5ecff;border-radius:999px;overflow:hidden}.bar span{display:block;height:100%;background:#2563eb}
</style>
