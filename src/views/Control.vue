<template>
  <div class="grid two">
    <div class="card" style="padding:16px;">
      <h3 style="margin-top:0">远程调节</h3>
      <div class="grid two">
        <label>目标温度(℃)<input type="number" v-model="ctrl.temp" /></label>
        <label>目标湿度(%)<input type="number" v-model="ctrl.humi" /></label>
        <label>通风强度(%)<input type="number" v-model="ctrl.fan" /></label>
        <label>翻堆频次(次/天)<input type="number" v-model="ctrl.turn" /></label>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        <button class="btn primary" @click="open('apply')">下发参数</button>
        <button class="btn" @click="open('auto')">自动控制</button>
        <button class="btn" @click="open('manual')">手动干预</button>
      </div>
    </div>

    <div class="card" style="padding:16px;">
      <h3 style="margin-top:0">执行进度</h3>
      <p>当前任务：{{ progress.task }}</p>
      <div class="progress-track"><div class="progress-bar" :style="{width: progress.value + '%'}"></div></div>
      <p style="margin-bottom:0">{{ progress.value }}%</p>
      <button class="btn" @click="open('progress')">查看进度详情</button>
    </div>

    <div class="card" style="padding:16px;grid-column:1/-1;overflow:auto;">
      <table class="data-table">
        <thead><tr><th>时间</th><th>操作类型</th><th>执行人</th><th>执行结果</th></tr></thead>
        <tbody><tr v-for="(item,idx) in logs" :key="idx"><td>{{ item.time }}</td><td>{{ item.type }}</td><td>{{ item.operator }}</td><td>{{ item.result }}</td></tr></tbody>
      </table>
    </div>

    <ModalDialog :visible="modal==='apply'" title="确认下发参数" confirm-text="确认下发" @close="modal=''" @confirm="tipIt('远程参数下发成功，设备已响应。')">
      <p>温度 {{ ctrl.temp }}℃，湿度 {{ ctrl.humi }}%，通风 {{ ctrl.fan }}%。</p>
    </ModalDialog>
    <ModalDialog :visible="modal==='auto'" title="自动控制策略" confirm-text="启用" @close="modal=''" @confirm="tipIt('自动控制策略已启用。')">
      <label>控制策略<select><option>稳态优先</option><option>节能优先</option><option>快速升温</option></select></label>
    </ModalDialog>
    <ModalDialog :visible="modal==='manual'" title="手动干预" confirm-text="执行" @close="modal=''" @confirm="tipIt('手动干预指令执行完成。')">
      <label>干预项目<select><option>强制通风</option><option>加湿喷淋</option><option>紧急降温</option></select></label>
      <label>持续时间(分钟)<input type="number" value="30" /></label>
    </ModalDialog>
    <ModalDialog :visible="modal==='progress'" title="任务进度详情" @close="modal=''">
      <p>任务步骤：</p>
      <ol><li>参数校验：已完成</li><li>命令分发：已完成</li><li>设备执行：进行中</li></ol>
      <div class="progress-track"><div class="progress-bar" :style="{width: progress.value + '%'}"></div></div>
    </ModalDialog>
    <ModalDialog :visible="tipVisible" title="执行反馈" @close="tipVisible=false"><p>{{ tip }}</p></ModalDialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ModalDialog from '../components/ModalDialog.vue'

const modal = ref('')
const tipVisible = ref(false)
const tip = ref('')
const ctrl = ref({ temp: 58, humi: 56, fan: 65, turn: 4 })
const progress = ref({ task: '远程温湿协同调节', value: 72 })
const logs = Array.from({ length: 20 }, (_, i) => ({
  time: `2026-03-1${i < 10 ? 1 : 2} ${String(8 + (i % 8)).padStart(2, '0')}:15`,
  type: i % 2 ? '自动控制' : '手动调节',
  operator: i % 2 ? '系统' : '值班员',
  result: i % 5 === 0 ? '已完成-需复核' : '已完成'
}))

const open = (name) => (modal.value = name)
const tipIt = (text) => {
  modal.value = ''
  tip.value = text
  tipVisible.value = true
}
</script>
