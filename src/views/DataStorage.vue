<template>
  <div class="grid">
    <div class="card">
      <h3>存储操作</h3>
      <button class="btn primary" @click="open('archive')">分布式归档</button>
      <button class="btn" @click="open('backup')">执行数据备份</button>
      <button class="btn" @click="open('cloud')">云端同步</button>
      <button class="btn" @click="open('index')">重建索引与搜索库</button>
      <p>状态：{{ msg }}</p>
    </div>
    <div class="card table-wrap">
      <h3>数据资产列表</h3>
      <table><thead><tr><th>文件ID</th><th>类型</th><th>大小</th><th>存储节点</th><th>索引状态</th></tr></thead><tbody><tr v-for="r in rows" :key="r.id"><td>{{r.id}}</td><td>{{r.type}}</td><td>{{r.size}}</td><td>{{r.node}}</td><td>{{r.idx}}</td></tr></tbody></table>
    </div>
  </div>
  <BaseModal v-model="show" :title="title" confirm-text="执行" @confirm="run">
    <label>目标路径<input v-model="path" /></label>
    <p>执行进度：{{progress}}%</p><progress :value="progress" max="100"></progress>
    <p>{{msg}}</p>
  </BaseModal>
</template>

<script setup>
import { ref } from 'vue'
import BaseModal from '../components/BaseModal.vue'
const rows = Array.from({ length: 20 }, (_, i) => ({ id: `STO-${i + 1}`, type: ['图像', '视频', '传感器'][i % 3], size: `${(1.2 + i / 10).toFixed(1)} GB`, node: `Node-${(i % 4) + 1}`, idx: i % 2 ? '已建立' : '构建中' }))
const show = ref(false); const title = ref(''); const path = ref('/drone/data/current'); const progress = ref(0); const msg = ref('待命')
const map = { archive: '分布式归档', backup: '数据备份', cloud: '云端管理同步', index: '索引重建' }
const open = (k) => { title.value = map[k]; show.value = true; progress.value = 0; msg.value = `准备执行${map[k]}` }
const run = () => { progress.value = 100; msg.value = `${title.value}完成，平台可继续检索访问` }
</script>
