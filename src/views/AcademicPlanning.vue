<template>
  <section class="grid2">
    <div class="card">
      <div class="actions">
        <button class="btn" @click="showGenerate = true">生成个性规划</button>
        <button class="btn secondary" @click="showSchedule = true">学习时间安排</button>
        <button class="btn secondary" @click="openHint('路径已同步到学生档案。')">同步规划</button>
      </div>
      <table class="table">
        <thead><tr><th>学生</th><th>方向</th><th>阶段1</th><th>阶段2</th><th>阶段3</th></tr></thead>
        <tbody><tr v-for="p in plans" :key="p.student"><td>{{ p.student }}</td><td>{{ p.track }}</td><td>{{ p.s1 }}</td><td>{{ p.s2 }}</td><td>{{ p.s3 }}</td></tr></tbody>
      </table>
    </div>
    <div class="card">
      <svg viewBox="0 0 360 220" style="width:100%;height:220px">
        <rect v-for="(v,i) in bars" :key="i" :x="i*42+18" :y="190-v" width="24" :height="v" fill="#7aa8ff"/>
      </svg>
      <p>规划匹配度柱状图：展示当前学生规划与兴趣的匹配评分。</p>
    </div>

    <BaseModal v-model="showGenerate" title="个性化学业规划表单">
      <div class="form-row"><label>目标方向</label><input class="input" v-model="form.track"/></div>
      <div class="form-row"><label>优先课程</label><input class="input" v-model="form.course"/></div>
      <div class="form-row"><label>周学习时长</label><input class="input" v-model="form.hours" type="number"/></div>
      <template #footer><button class="btn secondary" @click="showGenerate=false">取消</button><button class="btn" @click="savePlan">保存规划</button></template>
    </BaseModal>

    <BaseModal v-model="showSchedule" title="学习时间安排">
      <p>建议安排：工作日每天 {{ dailyHours }} 小时，周末做综合项目复盘。</p>
      <p>课程优先级：{{ form.course || '算法设计、机器学习、实践项目' }}。</p>
    </BaseModal>

    <BaseModal v-model="showHint" title="系统提示"><p>{{ hint }}</p></BaseModal>
  </section>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import BaseModal from '../components/BaseModal.vue'

const plans = ref(Array.from({ length: 22 }).map((_, i) => ({
  student: `学生${i + 1}`,
  track: ['AI工程','数据分析','教育科技','金融量化'][i % 4],
  s1: '基础课程',
  s2: '方向课程',
  s3: '毕业项目'
})))
const bars = [80, 120, 105, 140, 110, 95, 130, 100]

const showGenerate = ref(false)
const showSchedule = ref(false)
const showHint = ref(false)
const hint = ref('')
const form = reactive({ track: '', course: '', hours: 12 })
const dailyHours = computed(() => Math.floor(Number(form.hours || 12) / 5))

const savePlan = () => {
  hint.value = `已生成【${form.track || '综合方向'}】规划，优先课程：${form.course || '算法与数据分析'}`
  showGenerate.value = false
  showHint.value = true
}
const openHint = (msg) => { hint.value = msg; showHint.value = true }
</script>

<style scoped>
.actions{ display:flex; flex-wrap:wrap; gap:10px; margin-bottom:10px; }
.form-row{ margin-bottom:10px; }
</style>
