<template>
  <div class="grid">
    <div class="card">
      <h3>实时采集状态</h3>
      <div class="bars"><div v-for="c in chart" :key="c.name"><span>{{ c.name }}</span><div><i :style="{width:c.value+'%'}"></i></div><b>{{ c.value }}%</b></div></div>
      <button class="btn primary" @click="open('capture')">启动图像抓取</button>
      <button class="btn" @click="open('stream')">发起视频流传输</button>
      <button class="btn" @click="open('sensor')">采集环境传感器</button>
    </div>
    <div class="card table-wrap">
      <h3>巡检数据记录</h3>
      <table><thead><tr><th>ID</th><th>航线</th><th>图像数</th><th>视频</th><th>温度</th></tr></thead><tbody><tr v-for="r in rows" :key="r.id"><td>{{r.id}}</td><td>{{r.route}}</td><td>{{r.img}}</td><td>{{r.video}}</td><td>{{r.temp}}℃</td></tr></tbody></table>
    </div>
  </div>
  <BaseModal v-model="show" :title="modalTitle" confirm-text="确认执行" @confirm="confirm">
    <div v-if="type==='capture'"><label>抓拍频率(秒)<input v-model="form.rate" type="number" /></label></div>
    <div v-else-if="type==='stream'"><label>码率(Mbps)<input v-model="form.bitrate" type="number" /></label></div>
    <div v-else-if="type==='sensor'"><label>采集类型<select v-model="form.sensor"><option>温湿度</option><option>风速</option><option>电磁</option></select></label></div>
    <div v-if="progress>0">执行进度：{{ progress }}%<progress :value="progress" max="100"></progress></div>
    <p v-if="message">{{ message }}</p>
  </BaseModal>
</template>

<script setup>
import { ref, reactive } from 'vue'
import BaseModal from '../components/BaseModal.vue'
const chart = [{ name: '图像', value: 88 }, { name: '视频', value: 74 }, { name: '传感器', value: 93 }]
const rows = Array.from({ length: 20 }, (_, i) => ({ id: `COL-${i + 1}`, route: `线路-${(i % 5) + 1}`, img: 40 + i, video: i % 2 ? '已上传' : '待上传', temp: 19 + (i % 6) }))
const show = ref(false); const type = ref(''); const progress = ref(0); const message = ref('')
const form = reactive({ rate: 2, bitrate: 8, sensor: '温湿度' })
const modalTitle = ref('')
const open = (t) => { type.value = t; show.value = true; progress.value = 0; message.value = ''; modalTitle.value = t === 'capture' ? '图像抓取配置' : t === 'stream' ? '视频流配置' : '传感器采集配置' }
const confirm = () => { progress.value = 100; message.value = '任务已下发，无人机侧正在执行并回传状态。' }
</script>

<style scoped>
.bars>div{display:grid;grid-template-columns:70px 1fr 52px;gap:8px;align-items:center;margin:10px 0}.bars div div{height:12px;background:#ebf3ff;border-radius:99px}.bars i{display:block;height:100%;background:#60a5fa;border-radius:99px}
</style>
