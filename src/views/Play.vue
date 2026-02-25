<template>
  <div class="panel">
    <div class="player-card">
      <div class="screen">播放窗口：{{ current.title }}</div>
      <div class="controls">
        <button @click="openInfo('在线播放已启动。')">播放</button>
        <button @click="openInfo('视频已暂停。')">暂停</button>
        <button @click="openInfo('已快进 10 秒。')">快进</button>
        <button @click="openInfo('已切换全屏模式。')">全屏</button>
      </div>
    </div>

    <div class="recommend">
      <div class="head">
        <strong>兴趣推荐</strong>
        <button @click="openProgress">刷新推荐</button>
      </div>
      <ul>
        <li v-for="item in recommended" :key="item.id">
          <span>{{ item.title }}</span>
          <button @click="select(item)">播放该视频</button>
        </li>
      </ul>
    </div>

    <ModalDialog :visible="modal.info" title="播放器提示" @close="modal.info=false"><p>{{ message }}</p></ModalDialog>
    <ModalDialog :visible="modal.progress" title="推荐算法计算中" @close="modal.progress=false">
      <div class="bar"><span :style="{width:`${progress}%`}"/></div><p>{{ progress }}%</p>
    </ModalDialog>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import ModalDialog from '../components/ModalDialog.vue'

const recommended = Array.from({ length: 20 }, (_, i) => ({ id: i + 1, title: `推荐短片 ${i + 1}` }))
const current = ref(recommended[0])
const message = ref('')
const progress = ref(0)
const modal = reactive({ info: false, progress: false })

const openInfo = (text) => {
  message.value = text
  modal.info = true
}
const select = (item) => {
  current.value = item
  openInfo(`已切换到《${item.title}》。`)
}
const openProgress = () => {
  modal.progress = true
  progress.value = 0
  const timer = setInterval(() => {
    progress.value += 25
    if (progress.value >= 100) clearInterval(timer)
  }, 150)
}
</script>

<style scoped>
.panel{display:grid;gap:14px}.player-card,.recommend{background:#fff;border:1px solid #dbe6ff;border-radius:12px;padding:14px}.screen{height:220px;border-radius:10px;background:linear-gradient(145deg,#dce8ff,#eff5ff);display:grid;place-items:center;color:#1e3a8a}.controls{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}button{border:1px solid #c8d5f0;background:#fff;border-radius:10px;padding:8px 12px;cursor:pointer}.head{display:flex;justify-content:space-between;align-items:center}ul{list-style:none;padding:0;margin:10px 0 0;display:grid;gap:8px}li{display:flex;justify-content:space-between;align-items:center;padding:8px;border:1px solid #ebeff8;border-radius:8px}.bar{height:10px;background:#e5ecff;border-radius:999px;overflow:hidden}.bar span{display:block;height:100%;background:#2563eb}
</style>
