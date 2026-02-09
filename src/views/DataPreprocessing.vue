<template>
  <div class="grid">
    <div class="card">
      <h3>预处理任务面板</h3>
      <button class="btn primary" @click="open('noise')">数据去噪</button>
      <button class="btn" @click="open('missing')">缺失值处理</button>
      <button class="btn" @click="open('label')">数据标注</button>
      <button class="btn" @click="open('enhance')">图像/视频增强</button>
      <p style="margin-top:10px">当前提示：{{ tip }}</p>
    </div>
    <div class="card table-wrap">
      <h3>预处理批次清单</h3>
      <table><thead><tr><th>批次</th><th>噪声率</th><th>缺失值</th><th>标注状态</th><th>增强评分</th></tr></thead><tbody><tr v-for="r in rows" :key="r.batch"><td>{{r.batch}}</td><td>{{r.noise}}%</td><td>{{r.miss}}%</td><td>{{r.label}}</td><td>{{r.score}}</td></tr></tbody></table>
    </div>
  </div>
  <BaseModal v-model="show" :title="title" confirm-text="开始处理" @confirm="run">
    <label>任务参数<input v-model="param" placeholder="请输入阈值或策略" /></label>
    <p>进度：{{progress}}%</p><progress :value="progress" max="100"></progress>
    <p>{{ tip }}</p>
  </BaseModal>
</template>

<script setup>
import { ref } from 'vue'
import BaseModal from '../components/BaseModal.vue'
const rows = Array.from({ length: 20 }, (_, i) => ({ batch: `PRE-${100 + i}`, noise: 3 + (i % 5), miss: i % 4, label: i % 3 ? '已完成' : '待复核', score: 80 + (i % 16) }))
const show = ref(false); const title = ref(''); const param = ref('默认参数'); const progress = ref(0); const tip = ref('等待任务执行')
const names = { noise: '数据去噪', missing: '缺失值处理', label: '数据标注', enhance: '图像/视频质量增强' }
const open = (key) => { title.value = names[key]; show.value = true; progress.value = 0; tip.value = `请配置${names[key]}参数` }
const run = () => { progress.value = 100; tip.value = `${title.value}已完成并同步到样本库` }
</script>
