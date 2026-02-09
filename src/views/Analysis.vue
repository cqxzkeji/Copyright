<template>
  <div class="grid">
    <div class="card">
      <h3>智能分析控制台</h3>
      <button class="btn primary" @click="open('defect')">缺陷识别</button>
      <button class="btn" @click="open('anomaly')">异常检测</button>
      <button class="btn" @click="open('predict')">状态预测</button>
      <button class="btn" @click="open('train')">模型训练优化</button>
      <div class="trend"><span v-for="v in trend" :key="v" :style="{height:v+'px'}"></span></div>
    </div>
    <div class="card table-wrap">
      <h3>分析结果（近20条）</h3>
      <table><thead><tr><th>样本</th><th>识别结果</th><th>异常分数</th><th>预测状态</th><th>模型版本</th></tr></thead><tbody><tr v-for="r in rows" :key="r.id"><td>{{r.id}}</td><td>{{r.result}}</td><td>{{r.score}}</td><td>{{r.status}}</td><td>{{r.model}}</td></tr></tbody></table>
    </div>
  </div>
  <BaseModal v-model="show" :title="title" confirm-text="运行分析" @confirm="run">
    <label>模型版本<select v-model="model"><option>v2.1</option><option>v2.2</option><option>v3.0</option></select></label>
    <label>阈值<input v-model="threshold" type="number" /></label>
    <p>{{msg}}</p>
    <p>进度 {{progress}}%</p><progress :value="progress" max="100"></progress>
  </BaseModal>
</template>

<script setup>
import { ref } from 'vue'
import BaseModal from '../components/BaseModal.vue'
const trend = [22, 38, 40, 50, 44, 62, 55, 68, 72, 61]
const rows = Array.from({ length: 20 }, (_, i) => ({ id: `ANA-${i + 1}`, result: i % 4 ? '正常' : '绝缘子裂纹', score: (0.22 + i * 0.03).toFixed(2), status: i % 5 ? '稳定' : '预警', model: i % 2 ? 'v2.2' : 'v3.0' }))
const show = ref(false); const title = ref(''); const model = ref('v3.0'); const threshold = ref(0.65); const msg = ref('待执行'); const progress = ref(0)
const m = { defect: '图像缺陷检测', anomaly: '异常数据检测', predict: '状态预测', train: '模型训练优化' }
const open = (k) => { title.value = m[k]; show.value = true; msg.value = `已加载${m[k]}参数`; progress.value = 0 }
const run = () => { progress.value = 100; msg.value = `${title.value}完成，已输出结果并可复核` }
</script>

<style scoped>
.trend{display:flex;align-items:flex-end;gap:6px;height:80px;margin-top:12px}.trend span{display:inline-block;width:16px;background:#93c5fd;border-radius:6px 6px 0 0}
</style>
