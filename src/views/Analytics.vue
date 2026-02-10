<template>
  <section>
    <h2>数据分析与反馈</h2>
    <div class="grid-2">
      <div class="card">
        <h3>资源热度图（20条）</h3>
        <div v-for="item in heat" :key="item.name" class="heat-item">
          <span>{{ item.name }}</span>
          <div class="bar"><div class="fill" :style="{ width: `${item.value}%` }"></div></div>
          <strong>{{ item.value }}</strong>
        </div>
      </div>
      <div class="card">
        <h3>行为统计</h3>
        <div class="toolbar">
          <button class="primary" @click="show('已导出分析报告')">导出报告</button>
          <button class="ghost" @click="show('已生成优化建议')">生成建议</button>
          <button class="ghost" @click="open">设置追踪规则</button>
        </div>
        <div class="table-wrap"><table>
          <thead><tr><th>#</th><th>日期</th><th>访问</th><th>下载</th><th>转化率</th></tr></thead>
          <tbody><tr v-for="x in rows" :key="x.id"><td>{{ x.id }}</td><td>{{ x.date }}</td><td>{{ x.visit }}</td><td>{{ x.download }}</td><td>{{ x.rate }}</td></tr></tbody>
        </table></div>
      </div>
    </div>
    <ModalDialog :visible="msgVisible" title="分析提示" @close="msgVisible=false" @confirm="msgVisible=false"><p>{{ msg }}</p></ModalDialog>
    <ModalDialog :visible="formVisible" title="设置追踪规则" @close="formVisible=false" @confirm="submit">
      <div class="form-grid">
        <div class="full"><label>规则名称</label><input v-model="rule.name" /></div>
        <div><label>采样周期</label><select v-model="rule.period"><option>每天</option><option>每周</option><option>每月</option></select></div>
        <div><label>指标维度</label><select v-model="rule.metric"><option>曝光</option><option>点击</option><option>下载</option></select></div>
      </div>
    </ModalDialog>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue'
import ModalDialog from '../components/ModalDialog.vue'
const heat = Array.from({ length: 20 }, (_, i) => ({ name: `资源-${i + 1}`, value: 30 + ((i * 7) % 68) }))
const rows = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  date: `2026-01-${String(i + 1).padStart(2, '0')}`,
  visit: 1000 + i * 120,
  download: 110 + i * 11,
  rate: `${(8 + i * 0.6).toFixed(1)}%`
}))
const msgVisible = ref(false)
const formVisible = ref(false)
const msg = ref('')
const rule = reactive({ name: '', period: '每天', metric: '曝光' })
const show = (text) => { msg.value = text; msgVisible.value = true }
const open = () => { formVisible.value = true }
const submit = () => { formVisible.value = false; show(`追踪规则已保存：${rule.name || '未命名规则'}`) }
</script>

<style scoped>
.heat-item { display: grid; grid-template-columns: 90px 1fr 36px; gap: 8px; align-items: center; margin-bottom: 8px; }
.bar { background: #e9eef9; border-radius: 999px; height: 10px; overflow: hidden; }
.fill { background: linear-gradient(90deg, #60a5fa, #2563eb); height: 100%; }
</style>
