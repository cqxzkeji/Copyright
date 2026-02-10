<template>
  <section>
    <h2>图像处理与优化</h2>
    <div class="grid-2">
      <div class="card">
        <h3>参数调整</h3>
        <div class="form-grid">
          <div><label>亮度</label><input type="range" min="0" max="200" v-model="params.brightness" /></div>
          <div><label>对比度</label><input type="range" min="0" max="200" v-model="params.contrast" /></div>
          <div><label>清晰度</label><input type="range" min="0" max="200" v-model="params.sharpness" /></div>
          <div><label>分辨率</label><select v-model="params.resolution"><option>1080p</option><option>2K</option><option>4K</option></select></div>
        </div>
        <div class="toolbar" style="margin-top:12px">
          <button class="primary" @click="run('应用参数处理中...')">应用参数</button>
          <button class="ghost" @click="run('AI自动优化处理中...')">AI自动优化</button>
          <button class="ghost" @click="show('参数已重置')">重置参数</button>
        </div>
      </div>
      <div class="card">
        <h3>处理记录（20条）</h3>
        <div class="table-wrap"><table>
          <thead><tr><th>#</th><th>文件</th><th>操作</th><th>耗时</th><th>结果</th></tr></thead>
          <tbody>
            <tr v-for="x in logs" :key="x.id"><td>{{ x.id }}</td><td>{{ x.file }}</td><td>{{ x.op }}</td><td>{{ x.time }}</td><td>{{ x.result }}</td></tr>
          </tbody>
        </table></div>
      </div>
    </div>

    <ProgressModal :visible="progressVisible" title="处理进度" :description="desc" :progress="progress" @close="progressVisible=false" />
    <ModalDialog :visible="msgVisible" title="处理提示" @close="msgVisible=false" @confirm="msgVisible=false"><p>{{ msg }}</p></ModalDialog>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue'
import ModalDialog from '../components/ModalDialog.vue'
import ProgressModal from '../components/ProgressModal.vue'
const params = reactive({ brightness: 120, contrast: 110, sharpness: 100, resolution: '1080p' })
const logs = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  file: `edit_${i + 1}.jpg`,
  op: ['裁剪', '亮度调整', '对比度调整', 'AI优化'][i % 4],
  time: `${(Math.random() * 4 + 0.5).toFixed(1)}s`,
  result: ['成功', '成功', '成功', '排队'][i % 4]
}))
const progressVisible = ref(false)
const msgVisible = ref(false)
const progress = ref(0)
const desc = ref('')
const msg = ref('')
let timer
const run = (text) => {
  desc.value = text
  progress.value = 0
  progressVisible.value = true
  clearInterval(timer)
  timer = setInterval(() => {
    progress.value += 8
    if (progress.value >= 100) clearInterval(timer)
  }, 100)
}
const show = (text) => { msg.value = text; msgVisible.value = true }
</script>
