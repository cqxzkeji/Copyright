<template>
  <section class="grid2">
    <div class="card">
      <div class="actions">
        <button class="btn" @click="showResourceForm = true">推荐学习资源</button>
        <button class="btn secondary" @click="showCareer = true">职业发展建议</button>
        <button class="btn secondary" @click="showHintText('已推送到学生个人中心。')">发送建议</button>
      </div>
      <table class="table">
        <thead><tr><th>学生</th><th>推荐教材</th><th>在线课程</th><th>就业方向</th></tr></thead>
        <tbody><tr v-for="r in rows" :key="r.student"><td>{{ r.student }}</td><td>{{ r.book }}</td><td>{{ r.course }}</td><td>{{ r.job }}</td></tr></tbody>
      </table>
    </div>
    <div class="card">
      <svg viewBox="0 0 360 210" style="width:100%;height:220px">
        <circle cx="110" cy="105" r="70" fill="#dce9ff" />
        <circle cx="110" cy="105" r="45" fill="#8fb5ff" />
        <rect x="190" y="50" width="120" height="18" fill="#4d80ff"/>
        <rect x="190" y="85" width="90" height="18" fill="#6e9cff"/>
        <rect x="190" y="120" width="70" height="18" fill="#9cc0ff"/>
      </svg>
      <p>资源类型分布图：课程类、教材类、项目实训类推荐占比。</p>
    </div>

    <BaseModal v-model="showResourceForm" title="资源推荐表单">
      <div class="form-row"><label>推荐教材</label><input class="input" v-model="form.book"/></div>
      <div class="form-row"><label>在线课程</label><input class="input" v-model="form.course"/></div>
      <div class="form-row"><label>推荐理由</label><textarea class="input" v-model="form.reason"/></div>
      <template #footer><button class="btn secondary" @click="showResourceForm=false">取消</button><button class="btn" @click="submit">提交推荐</button></template>
    </BaseModal>

    <BaseModal v-model="showCareer" title="职业方向建议">
      <p>推荐岗位：数据分析师、AI 产品经理、教育数据顾问。</p>
      <p>建议能力：统计建模、可视化表达、跨学科沟通。</p>
    </BaseModal>

    <BaseModal v-model="showHint" title="系统通知"><p>{{ hint }}</p></BaseModal>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue'
import BaseModal from '../components/BaseModal.vue'

const rows = ref(Array.from({ length: 20 }).map((_, i) => ({
  student: `学生${i + 1}`,
  book: ['机器学习实战', '教育数据分析', 'Python数据科学'][i % 3],
  course: ['Coursera ML', 'MOOC 数据挖掘', 'Udemy 数据可视化'][i % 3],
  job: ['算法工程师', '数据分析师', '产品经理'][i % 3]
})))

const showResourceForm = ref(false)
const showCareer = ref(false)
const showHint = ref(false)
const hint = ref('')
const form = reactive({ book: '', course: '', reason: '' })

const submit = () => {
  hint.value = `推荐成功：${form.book || '通用教材'} / ${form.course || '通用课程'}`
  showResourceForm.value = false
  showHint.value = true
}
const showHintText = (msg) => { hint.value = msg; showHint.value = true }
</script>

<style scoped>
.actions{ display:flex; flex-wrap:wrap; gap:10px; margin-bottom:10px; }
.form-row{ margin-bottom:10px; }
</style>
