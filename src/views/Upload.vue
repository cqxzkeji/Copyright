<template>
  <div class="panel">
    <div class="toolbar">
      <el-button type="primary" @click="openUpload">上传视频</el-button>
      <el-button @click="openTip('可通过分类与标签快速管理视频资源。')">按钮提示</el-button>
      <el-button type="success" @click="progressVisible = true">上传进度</el-button>
    </div>

    <el-table :data="videos" stripe>
      <el-table-column prop="id" label="ID" width="70" />
      <el-table-column label="封面" width="120">
        <template #default="scope"><el-image :src="scope.row.cover" fit="cover" style="width: 90px; height: 50px; border-radius: 6px" /></template>
      </el-table-column>
      <el-table-column prop="title" label="标题" min-width="180" />
      <el-table-column prop="category" label="分类" width="100" />
      <el-table-column prop="status" label="状态" width="100" />
      <el-table-column label="操作" width="220">
        <template #default="scope">
          <el-button link type="primary" @click="edit(scope.row)">编辑</el-button>
          <el-button link @click="openTip(`视频 ${scope.row.id} 的标签管理已打开。`)">标签</el-button>
          <el-button link type="danger" @click="remove(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="uploadVisible" title="上传/编辑视频" width="520px" modal>
      <el-form :model="form" label-width="80px">
        <el-form-item label="标题"><el-input v-model="form.title" /></el-form-item>
        <el-form-item label="分类"><el-select v-model="form.category"><el-option v-for="item in categories" :key="item" :label="item" :value="item" /></el-select></el-form-item>
        <el-form-item label="标签"><el-input v-model="form.tags" placeholder="用逗号分隔" /></el-form-item>
        <el-form-item label="封面"><el-input v-model="form.cover" placeholder="封面图片 URL" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="uploadVisible = false">取消</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="progressVisible" title="上传进度" width="420px" modal>
      <el-progress :percentage="78" status="success" />
      <el-progress :percentage="52" />
    </el-dialog>

    <el-dialog v-model="tipVisible" title="提示信息" width="360px" modal>
      <p>{{ tipText }}</p>
      <template #footer><el-button type="primary" @click="tipVisible = false">我知道了</el-button></template>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { videoList, categories } from '../data/mock'

const videos = ref(videoList.map(item => ({ ...item })))
const uploadVisible = ref(false)
const progressVisible = ref(false)
const tipVisible = ref(false)
const tipText = ref('')
const form = reactive({ id: null, title: '', category: categories[0], tags: '', cover: '' })

const openUpload = () => {
  Object.assign(form, { id: null, title: '', category: categories[0], tags: '', cover: '' })
  uploadVisible.value = true
}

const edit = (row) => {
  Object.assign(form, { id: row.id, title: row.title, category: row.category, tags: row.tags.join(','), cover: row.cover })
  uploadVisible.value = true
}

const save = () => {
  if (!form.title) return ElMessage.warning('请填写标题')
  if (form.id) {
    const target = videos.value.find(v => v.id === form.id)
    Object.assign(target, { title: form.title, category: form.category, tags: form.tags.split(','), cover: form.cover })
    ElMessage.success('视频信息已更新')
  } else {
    videos.value.unshift({ id: Date.now(), title: form.title, category: form.category, tags: form.tags.split(','), cover: form.cover || 'https://picsum.photos/seed/new/320/180', status: '待审核' })
    ElMessage.success('视频上传成功')
  }
  uploadVisible.value = false
}

const remove = (id) => {
  videos.value = videos.value.filter(v => v.id !== id)
  ElMessage.success('已删除视频')
}

const openTip = (text) => {
  tipText.value = text
  tipVisible.value = true
}
</script>

<style scoped>
.panel { background: #fff; border-radius: 14px; padding: 16px; }
.toolbar { display: flex; gap: 10px; margin-bottom: 12px; flex-wrap: wrap; }
</style>
