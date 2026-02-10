<template>
  <section class="grid2">
    <div class="card">
      <div class="actions">
        <button class="btn" @click="openForm">新增采集任务</button>
        <button class="btn secondary" @click="startProcess('采集')">启动采集</button>
        <button class="btn secondary" @click="startProcess('清洗')">数据清洗</button>
      </div>
      <table class="table">
        <thead><tr><th>学号</th><th>姓名</th><th>绩点</th><th>兴趣方向</th><th>偏好学科</th></tr></thead>
        <tbody>
          <tr v-for="row in rows" :key="row.id">
            <td>{{ row.id }}</td><td>{{ row.name }}</td><td>{{ row.gpa }}</td><td>{{ row.interest }}</td><td>{{ row.subject }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="card">
      <svg viewBox="0 0 320 200" style="width:100%;height:220px">
        <polyline fill="none" stroke="#4d80ff" stroke-width="3" :points="chartPoints" />
        <line x1="0" y1="180" x2="320" y2="180" stroke="#c9d9ff"/>
      </svg>
      <p>采集质量趋势图：近期清洗后有效数据率持续提升。</p>
    </div>

    <BaseModal v-model="showForm" title="采集任务表单">
      <div class="form-row"><label>任务名称</label><input class="input" v-model="task.name"/></div>
      <div class="form-row"><label>数据源</label><input class="input" v-model="task.source"/></div>
      <div class="form-row"><label>备注</label><textarea class="input" v-model="task.note"/></div>
      <template #footer><button class="btn secondary" @click="showForm=false">取消</button><button class="btn" @click="submitTask">提交</button></template>
    </BaseModal>

    <BaseModal v-model="showProgress" :title="progressTitle + '进度'">
      <div class="bar"><div class="fill" :style="{width: progress + '%'}"></div></div>
      <p>{{ progress }}%</p>
    </BaseModal>

    <BaseModal v-model="showHint" title="操作结果"><p>{{ hint }}</p></BaseModal>
  </section>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import BaseModal from '../components/BaseModal.vue'

const names = ['王晨','李航','张悦','陈琳','赵凯','周妍','吴博','郑琪','孙浩','马宁','何璐','高峰','林晨','罗佳','胡静','郭成','宋怡','徐哲','邓媛','谢涛','韩雪','梁斌','冯楠','曹磊']
const interests = ['人工智能','金融科技','机器人','教育技术']
const subjects = ['数学建模','数据结构','概率统计','软件工程']
const rows = ref(names.map((name, i) => ({ id: `2024${100+i}`, name, gpa: (2.8 + (i%8)*0.14).toFixed(2), interest: interests[i%4], subject: subjects[i%4] })))

const showForm = ref(false)
const showProgress = ref(false)
const showHint = ref(false)
const progressTitle = ref('采集')
const progress = ref(0)
const hint = ref('')
const task = reactive({ name: '', source: '', note: '' })

const chartPoints = computed(() => rows.value.slice(0, 12).map((r, i) => `${i*28},${180-r.gpa*35}`).join(' '))

const openForm = () => showForm.value = true
const submitTask = () => {
  hint.value = `任务【${task.name || '未命名任务'}】已创建，数据源：${task.source || '校园数据中心'}`
  showForm.value = false
  showHint.value = true
}

const startProcess = (type) => {
  progressTitle.value = type
  progress.value = 0
  showProgress.value = true
  const timer = setInterval(() => {
    progress.value += 10
    if (progress.value >= 100) {
      clearInterval(timer)
      showProgress.value = false
      hint.value = `${type}完成：共处理${rows.value.length}条学生数据。`
      showHint.value = true
    }
  }, 120)
}
</script>

<style scoped>
.actions{ display:flex; flex-wrap:wrap; gap:10px; margin-bottom:10px; }
.form-row{ margin-bottom:10px; }
.bar{ height:12px; background:#e5eeff; border-radius:99px; overflow:hidden; }
.fill{ height:100%; background:linear-gradient(90deg,#66a1ff,#4d80ff); transition:.12s; }
</style>
