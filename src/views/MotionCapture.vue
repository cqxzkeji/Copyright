<template>
  <div class="card-grid">
    <section class="card">
      <h2>实时捕捉状态</h2>
      <p>当前已连接 {{ sensors.length }} 个非接触式传感器，捕捉帧率稳定。</p>
      <div class="chart" style="margin-top: 12px;">
        <div
          v-for="(value, index) in captureRates"
          :key="index"
          class="chart-bar"
          :style="{ height: `${value}%` }"
        ></div>
      </div>
      <div class="button-group" style="margin-top: 16px;">
        <button class="primary-button" type="button" @click="openModal('start')">开始捕捉</button>
        <button class="secondary-button" type="button" @click="openModal('calibrate')">校准传感器</button>
        <button class="secondary-button" type="button" @click="openModal('export')">导出数据</button>
        <button class="secondary-button" type="button" @click="openModal('tip')">捕捉提示</button>
      </div>
    </section>
    <section class="card">
      <h2>设备清单</h2>
      <p>系统自动监测各类捕捉设备状态，确保动作采集稳定。</p>
      <ul>
        <li v-for="sensor in sensors" :key="sensor.id">
          {{ sensor.name }} - <span class="badge">{{ sensor.status }}</span>
        </li>
      </ul>
    </section>
    <section class="card">
      <h2>捕捉分析摘要</h2>
      <p>已生成 {{ summary.frames }} 帧动作数据，姿态稳定度 {{ summary.stability }}%。</p>
      <div class="form-grid" style="margin-top: 12px;">
        <label>
          采样频率
          <input v-model="settings.frequency" />
        </label>
        <label>
          捕捉范围
          <input v-model="settings.range" />
        </label>
        <label>
          目标区域
          <input v-model="settings.zone" />
        </label>
      </div>
      <div class="button-group" style="margin-top: 14px;">
        <button class="primary-button" type="button" @click="openModal('save')">保存配置</button>
      </div>
    </section>
  </div>
  <BaseModal :open="modal.open" :title="modal.title" @close="closeModal" @confirm="confirmModal">
    <div v-if="modal.type === 'start'">
      <p>准备启动动作捕捉，请确认训练场景与参与人员信息。</p>
      <div class="form-grid">
        <label>
          训练场景
          <select v-model="form.scene">
            <option value="标准">标准姿态采集</option>
            <option value="康复">康复辅助训练</option>
            <option value="运动">运动表现评估</option>
          </select>
        </label>
        <label>
          参与人员
          <input v-model="form.participants" placeholder="请输入人数" />
        </label>
      </div>
      <div style="margin-top: 12px;">
        <div class="progress-track"><span style="width: 65%"></span></div>
        <small>设备准备进度 65%</small>
      </div>
    </div>
    <div v-else-if="modal.type === 'calibrate'">
      <p>请按照提示完成传感器校准，将自动保存校准参数。</p>
      <div class="form-grid">
        <label>
          校准模式
          <select v-model="form.calibration">
            <option value="快速">快速校准</option>
            <option value="标准">标准校准</option>
            <option value="高精">高精校准</option>
          </select>
        </label>
        <label>
          校准人员
          <input v-model="form.operator" placeholder="输入校准负责人" />
        </label>
      </div>
      <div style="margin-top: 12px;">
        <div class="progress-track"><span style="width: 40%"></span></div>
        <small>校准进度 40%</small>
      </div>
    </div>
    <div v-else-if="modal.type === 'export'">
      <p>选择导出格式与数据区间，系统将生成下载任务。</p>
      <div class="form-grid">
        <label>
          数据区间
          <input v-model="form.range" placeholder="例如：最近30分钟" />
        </label>
        <label>
          导出格式
          <select v-model="form.format">
            <option value="csv">CSV</option>
            <option value="json">JSON</option>
            <option value="xlsx">Excel</option>
          </select>
        </label>
      </div>
    </div>
    <div v-else-if="modal.type === 'save'">
      <p>确认保存当前捕捉配置，将同步到训练场景。</p>
      <div class="progress-track" style="margin-top: 12px;"><span style="width: 88%"></span></div>
      <small>同步进度 88%</small>
    </div>
    <div v-else>
      <p>保持光线均匀并确保动作完整，捕捉效果最佳。</p>
      <div class="progress-track" style="margin-top: 12px;"><span style="width: 100%"></span></div>
      <small>捕捉提示已更新</small>
    </div>
  </BaseModal>
</template>

<script setup>
import { reactive } from 'vue'
import BaseModal from '../components/BaseModal.vue'

const sensors = [
  { id: 1, name: '红外阵列 A1', status: '在线' },
  { id: 2, name: '深度摄像头 D2', status: '在线' },
  { id: 3, name: '压力感知垫 P3', status: '校准中' },
  { id: 4, name: '惯性模块 I4', status: '在线' },
  { id: 5, name: '环境光感应 L5', status: '正常' },
  { id: 6, name: '边缘计算节点 E6', status: '在线' }
]

const captureRates = [88, 92, 76, 90, 84, 95, 80]

const summary = {
  frames: 12480,
  stability: 93
}

const settings = reactive({
  frequency: '60 FPS',
  range: '5m 半径',
  zone: '多目标捕捉区'
})

const form = reactive({
  scene: '标准',
  participants: '12',
  calibration: '标准',
  operator: '王敏',
  range: '最近30分钟',
  format: 'csv'
})

const modal = reactive({
  open: false,
  title: '',
  type: 'start'
})

const openModal = (type) => {
  modal.open = true
  modal.type = type
  const titles = {
    start: '启动捕捉任务',
    calibrate: '传感器校准',
    export: '导出动作数据',
    save: '保存捕捉配置',
    tip: '捕捉提示'
  }
  modal.title = titles[type] || '提示'
}

const closeModal = () => {
  modal.open = false
}

const confirmModal = () => {
  modal.open = false
}
</script>
