<template>
  <section>
    <h2>内容发布与分发</h2>
    <div class="card">
      <div class="toolbar">
        <button class="primary" @click="open('创建发布任务')">创建发布任务</button>
        <button class="ghost" @click="runDispatch">一键多平台分发</button>
        <button class="ghost" @click="show('已生成平台兼容性报告')">兼容性检测</button>
      </div>
      <div class="table-wrap"><table>
        <thead><tr><th>ID</th><th>内容</th><th>平台</th><th>发布时间</th><th>状态</th><th>操作</th></tr></thead>
        <tbody>
          <tr v-for="p in plans" :key="p.id">
            <td>{{ p.id }}</td><td>{{ p.content }}</td><td>{{ p.platform }}</td><td>{{ p.time }}</td><td>{{ p.status }}</td>
            <td><button class="ghost" @click="show(`预览 ${p.content}`)">预览</button><button class="ghost" @click="show(`编辑 ${p.content}`)">编辑</button></td>
          </tr>
        </tbody>
      </table></div>
    </div>
    <ModalDialog :visible="formVisible" :title="title" @close="formVisible=false" @confirm="submit">
      <div class="form-grid">
        <div class="full"><label>内容主题</label><input v-model="form.topic" /></div>
        <div><label>平台</label><select v-model="form.platform"><option>微博</option><option>抖音</option><option>小红书</option><option>CMS</option></select></div>
        <div><label>时间</label><input type="datetime-local" v-model="form.time" /></div>
      </div>
    </ModalDialog>
    <ModalDialog :visible="msgVisible" title="发布提示" @close="msgVisible=false" @confirm="msgVisible=false"><p>{{ msg }}</p></ModalDialog>
    <ProgressModal :visible="progressVisible" title="分发进度" description="多平台分发中..." :progress="progress" @close="progressVisible=false" />
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue'
import ModalDialog from '../components/ModalDialog.vue'
import ProgressModal from '../components/ProgressModal.vue'
const plans = Array.from({ length: 22 }, (_, i) => ({
  id: i + 1,
  content: `营销海报-${i + 1}`,
  platform: ['微博', '抖音', '小红书', 'CMS'][i % 4],
  time: `2026-03-${String((i % 28) + 1).padStart(2, '0')} 10:00`,
  status: ['待发布', '已发布', '审核中'][i % 3]
}))
const form = reactive({ topic: '', platform: '微博', time: '' })
const formVisible = ref(false)
const msgVisible = ref(false)
const progressVisible = ref(false)
const msg = ref('')
const title = ref('')
const progress = ref(0)
let timer
const open = (t) => { title.value = t; formVisible.value = true }
const submit = () => { formVisible.value = false; show(`发布任务已创建：${form.topic || '未命名主题'}`) }
const show = (t) => { msg.value = t; msgVisible.value = true }
const runDispatch = () => {
  progressVisible.value = true
  progress.value = 0
  clearInterval(timer)
  timer = setInterval(() => {
    progress.value += 5
    if (progress.value >= 100) clearInterval(timer)
  }, 120)
}
</script>
