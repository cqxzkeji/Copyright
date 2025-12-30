<template>
  <div class="grid grid-2">
    <div class="card">
      <div class="flex-between" style="margin-bottom: 10px;">
        <div>
          <div class="muted small">实时监控</div>
          <h3 style="margin: 4px 0 0;">产线工序状态</h3>
        </div>
        <div class="toolbar">
          <button class="btn" @click="openModal('start')">启动监控</button>
          <button class="btn secondary" @click="openModal('threshold')">设置阈值</button>
          <button class="btn warning" @click="openModal('alert')">异常预警</button>
        </div>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>工序</th>
            <th>设备</th>
            <th>产能(件/h)</th>
            <th>报警</th>
            <th>负载</th>
            <th>阈值</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in lines" :key="row.device">
            <td>{{ row.step }}</td>
            <td>{{ row.device }}</td>
            <td>{{ row.capacity }}</td>
            <td><span :class="['badge', row.alert === '正常' ? 'success' : row.alert === '关注' ? 'warning' : 'danger']">{{ row.alert }}</span></td>
            <td>
              <div class="progress-bar">
                <div class="progress-bar-inner" :style="{ width: row.load + '%', background: row.load > 85 ? '#f87171' : '#3b82f6' }"></div>
              </div>
              <div class="muted small">{{ row.load }}%</div>
            </td>
            <td>{{ row.threshold }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="card">
      <div class="flex-between" style="margin-bottom: 10px;">
        <div>
          <div class="muted small">预警记录</div>
          <h3 style="margin: 4px 0 0;">异常捕获</h3>
        </div>
        <button class="btn" @click="openModal('history')">查看处理</button>
      </div>
      <div class="grid" style="gap: 12px;">
        <div v-for="alert in alerts" :key="alert.time" class="card" style="background:#fef9c3;">
          <div class="flex-between">
            <div>
              <div class="muted small">{{ alert.time }}</div>
              <div><strong>{{ alert.title }}</strong> · {{ alert.desc }}</div>
            </div>
            <span class="badge danger">{{ alert.level }}</span>
          </div>
          <div class="progress-bar" style="margin-top: 8px;">
            <div class="progress-bar-inner" :style="{ width: alert.impact + '%', background: '#f59e0b' }"></div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-if="modal" class="modal-backdrop">
    <div class="modal">
      <template v-if="modal === 'start'">
        <h3>启动监控</h3>
        <p class="muted">是否同步采集各工序温度、压力、电流并启动实时预警？</p>
        <div class="progress-bar" style="margin: 12px 0;">
          <div class="progress-bar-inner" :style="{ width: progress + '%' }"></div>
        </div>
        <div style="text-align:right;">
          <button class="btn" @click="confirm">立即启动</button>
        </div>
      </template>
      <template v-else-if="modal === 'threshold'">
        <h3>阈值配置</h3>
        <div class="grid grid-2" style="margin-top: 10px;">
          <div>
            <div class="label">温度上限(℃)</div>
            <input class="input" v-model="form.tempMax" />
          </div>
          <div>
            <div class="label">压力上限(MPa)</div>
            <input class="input" v-model="form.pressureMax" />
          </div>
          <div>
            <div class="label">电流上限(A)</div>
            <input class="input" v-model="form.currentMax" />
          </div>
          <div>
            <div class="label">预警通道</div>
            <select class="select" v-model="form.channel">
              <option>短信</option>
              <option>邮件</option>
              <option>看板</option>
            </select>
          </div>
        </div>
        <div style="text-align:right; margin-top: 12px;">
          <button class="btn secondary" @click="confirm">保存阈值</button>
        </div>
      </template>
      <template v-else-if="modal === 'alert'">
        <h3>模拟异常预警</h3>
        <p class="muted">将对烧结 2# 温度异常进行测试预警。</p>
        <div class="progress-bar" style="margin: 12px 0;">
          <div class="progress-bar-inner" :style="{ width: progress + '%' , background: '#f87171' }"></div>
        </div>
        <div style="text-align:right;">
          <button class="btn warning" @click="confirm">推送预警</button>
        </div>
      </template>
      <template v-else>
        <h3>预警历史</h3>
        <p class="muted">最近 5 条预警均已完成闭环。</p>
        <ul>
          <li v-for="item in alerts" :key="item.time">{{ item.time }} - {{ item.title }} - {{ item.desc }}</li>
        </ul>
        <div style="text-align:right;">
          <button class="btn" @click="confirm">关闭</button>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'

const modal = ref('')
const progress = ref(70)
const form = reactive({ tempMax: 165, pressureMax: 2.8, currentMax: 55, channel: '短信' })

const lines = [
  { step: '压铸', device: '压铸-01', capacity: 420, alert: '正常', load: 68, threshold: '温度<160' },
  { step: '烧结', device: '烧结-02', capacity: 350, alert: '关注', load: 83, threshold: '温度<175' },
  { step: '退火', device: '退火-01', capacity: 380, alert: '正常', load: 72, threshold: '温度<140' },
  { step: '研磨', device: '研磨-03', capacity: 460, alert: '正常', load: 58, threshold: '负载<90%' },
  { step: '测试', device: '测试-01', capacity: 280, alert: '异常', load: 92, threshold: '电流<50A' },
  { step: '包装', device: '包装-01', capacity: 520, alert: '正常', load: 65, threshold: '良率>98%' }
]

const alerts = [
  { time: '08:12', title: '烧结温度偏高', desc: '2#区温度 178℃', level: 'Level 2', impact: 76 },
  { time: '09:05', title: '压铸电流波动', desc: 'A 相波动 ±8%', level: 'Level 1', impact: 58 },
  { time: '10:22', title: '研磨压力异常', desc: '压力短时下降 0.2MPa', level: 'Level 1', impact: 46 }
]

const openModal = (type) => {
  modal.value = type
  progress.value = 55 + Math.round(Math.random() * 40)
}

const confirm = () => {
  progress.value = 100
  setTimeout(() => (modal.value = ''), 300)
}
</script>
