<template>
  <div class="panel">
    <div class="grid">
      <el-card>
        <video controls class="player" :src="currentVideo" />
        <div class="actions">
          <el-button type="primary" @click="openTip('已切换全屏播放模式（示例提示）。')">全屏播放</el-button>
          <el-button @click="openTip('推荐算法已更新，正在为你匹配兴趣内容。')">刷新推荐</el-button>
          <el-button type="success" @click="progressVisible=true">缓冲进度</el-button>
        </div>
      </el-card>
      <el-card>
        <el-table :data="videos" height="360">
          <el-table-column prop="title" label="推荐视频" min-width="180" />
          <el-table-column prop="views" label="播放量" width="100" />
          <el-table-column label="操作" width="100">
            <template #default="scope">
              <el-button link type="primary" @click="play(scope.row)">播放</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>

    <el-dialog v-model="progressVisible" title="播放缓冲" width="380px" modal>
      <el-progress :percentage="66" />
    </el-dialog>
    <el-dialog v-model="tipVisible" title="提示信息" width="360px" modal>
      <p>{{ tipText }}</p>
      <template #footer><el-button type="primary" @click="tipVisible=false">确认</el-button></template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { videoList } from '../data/mock'

const videos = ref(videoList)
const currentVideo = ref('https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4')
const progressVisible = ref(false)
const tipVisible = ref(false)
const tipText = ref('')

const play = (row) => {
  currentVideo.value = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'
  ElMessage.success(`开始播放：${row.title}`)
}

const openTip = (text) => {
  tipText.value = text
  tipVisible.value = true
}
</script>

<style scoped>
.panel { background: #fff; border-radius: 14px; padding: 16px; }
.grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 14px; }
.player { width: 100%; border-radius: 8px; background: #000; max-height: 360px; }
.actions { margin-top: 12px; display: flex; gap: 8px; flex-wrap: wrap; }
@media (max-width: 960px) { .grid { grid-template-columns: 1fr; } }
</style>
