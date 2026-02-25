<template>
  <div class="panel">
    <div class="toolbar">
      <el-button type="primary" @click="likeTip">点赞策略</el-button>
      <el-button @click="shareTip">分享设置</el-button>
      <el-button type="warning" @click="filterVisible = true">评论过滤</el-button>
    </div>
    <el-table :data="comments" stripe>
      <el-table-column prop="id" label="ID" width="70" />
      <el-table-column prop="videoTitle" label="视频" min-width="160" />
      <el-table-column prop="user" label="用户" width="110" />
      <el-table-column prop="content" label="评论内容" min-width="260" />
      <el-table-column prop="status" label="状态" width="100" />
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <el-button link type="primary" @click="approve(scope.row)">通过</el-button>
          <el-button link type="danger" @click="reject(scope.row)">拦截</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="filterVisible" title="评论过滤规则" width="460px" modal>
      <el-form :model="filterForm" label-width="110px">
        <el-form-item label="敏感词">
          <el-input v-model="filterForm.words" placeholder="请输入敏感词，用逗号分隔" />
        </el-form-item>
        <el-form-item label="自动拦截阈值">
          <el-slider v-model="filterForm.threshold" :max="100" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="filterVisible=false">取消</el-button>
        <el-button type="primary" @click="saveFilter">保存规则</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="tipVisible" title="提示信息" width="360px" modal>
      <p>{{ tipText }}</p>
      <template #footer><el-button type="primary" @click="tipVisible=false">确认</el-button></template>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { commentsList } from '../data/mock'

const comments = ref(commentsList.map(item => ({ ...item })))
const filterVisible = ref(false)
const tipVisible = ref(false)
const tipText = ref('')
const filterForm = reactive({ words: '广告,引战', threshold: 70 })

const approve = (row) => {
  row.status = '正常'
  ElMessage.success(`已通过评论 #${row.id}`)
}
const reject = (row) => {
  row.status = '已拦截'
  ElMessage.warning(`已拦截评论 #${row.id}`)
}
const saveFilter = () => {
  filterVisible.value = false
  ElMessage.success('评论过滤规则已更新')
}
const likeTip = () => { tipText.value = '点赞互动已开启激励模式'; tipVisible.value = true }
const shareTip = () => { tipText.value = '分享链接有效期为 24 小时'; tipVisible.value = true }
</script>

<style scoped>
.panel { background: #fff; border-radius: 14px; padding: 16px; }
.toolbar { display: flex; gap: 10px; margin-bottom: 12px; flex-wrap: wrap; }
</style>
