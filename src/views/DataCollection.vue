<template>
  <section class="grid" style="gap: 18px">
    <div class="flex-between">
      <div>
        <p class="badge">采集管道</p>
        <h3 style="margin: 4px 0">数据采集与处理</h3>
      </div>
      <div style="display: flex; gap: 8px">
        <button class="secondary-btn" @click="openUpload">上传样本</button>
        <button class="primary-btn" @click="openPipeline">启动采集</button>
        <button class="secondary-btn" @click="openSchedule">配置调度</button>
      </div>
    </div>

    <div class="card">
      <div class="flex-between" style="margin-bottom: 10px">
        <h4 style="margin: 0">采集量趋势</h4>
        <span class="tag">近10批次</span>
      </div>
      <div class="chart-bars">
        <div v-for="item in ingestChart" :key="item.label" class="chart-bar">
          <div class="flex-between">
            <span>{{ item.label }}</span>
            <strong>{{ item.value }} GB</strong>
          </div>
          <div class="bar" :style="{ width: item.value * 4 + 'px' }"></div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="flex-between" style="margin-bottom: 10px">
        <h4 style="margin: 0">采集任务表</h4>
        <span class="badge">在线</span>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>任务</th>
            <th>数据源</th>
            <th>格式</th>
            <th>频率</th>
            <th>最新批次</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in pipelines" :key="row.id">
            <td>{{ row.name }}</td>
            <td>{{ row.source }}</td>
            <td>{{ row.format }}</td>
            <td>{{ row.freq }}</td>
            <td>{{ row.batch }}</td>
            <td>{{ row.status }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <ModalDialog
      v-if="showUpload"
      title="上传样本数据"
      badge="导入"
      description="快速上传新的样本以验证处理链路"
      @close="showUpload = false"
    >
      <div class="form-row">
        <div>
          <label class="label">样本名称</label>
          <input v-model="uploadForm.name" placeholder="2024Q2-user.csv" />
        </div>
        <div>
          <label class="label">数据描述</label>
          <textarea rows="3" v-model="uploadForm.desc" placeholder="包含埋点字段、用户画像等"></textarea>
        </div>
      </div>
      <div style="display: flex; justify-content: flex-end; gap: 8px; margin-top: 12px">
        <button class="secondary-btn" @click="showUpload = false">取消</button>
        <button class="primary-btn" @click="confirmUpload">提交上传</button>
      </div>
    </ModalDialog>

    <ModalDialog
      v-if="showPipeline"
      title="启动采集任务"
      badge="任务"
      description="启动后将实时写入清洗队列"
      @close="stopPipeline"
    >
      <div class="progress-bar" style="margin: 12px 0">
        <span :style="{ width: pipeProgress + '%' }"></span>
      </div>
      <p style="margin: 0">{{ pipeProgress < 100 ? '采集中…' : '采集完成' }}</p>
      <div style="display: flex; justify-content: flex-end; margin-top: 14px">
        <button class="primary-btn" @click="stopPipeline">关闭</button>
      </div>
    </ModalDialog>

    <ModalDialog
      v-if="showSchedule"
      title="调度配置"
      badge="计划"
      description="设定执行频率与时间窗"
      @close="showSchedule = false"
    >
      <div class="form-row two-col">
        <div>
          <label class="label">频率</label>
          <select v-model="schedule.freq">
            <option>每小时</option>
            <option>每日</option>
            <option>每周</option>
          </select>
        </div>
        <div>
          <label class="label">时间窗口</label>
          <input v-model="schedule.window" placeholder="00:00-06:00" />
        </div>
        <div>
          <label class="label">最大并发</label>
          <input type="number" v-model.number="schedule.concurrent" min="1" max="20" />
        </div>
        <div>
          <label class="label">失败重试</label>
          <select v-model="schedule.retry">
            <option>立即</option>
            <option>5分钟</option>
            <option>15分钟</option>
          </select>
        </div>
      </div>
      <div style="display: flex; justify-content: flex-end; gap: 8px; margin-top: 12px">
        <button class="secondary-btn" @click="showSchedule = false">取消</button>
        <button class="primary-btn" @click="saveSchedule">保存</button>
      </div>
    </ModalDialog>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue'
import ModalDialog from '../components/ModalDialog.vue'

const ingestChart = [
  { label: '批次 01', value: 8.2 },
  { label: '批次 02', value: 7.4 },
  { label: '批次 03', value: 6.8 },
  { label: '批次 04', value: 9.2 },
  { label: '批次 05', value: 10.1 },
  { label: '批次 06', value: 8.7 },
  { label: '批次 07', value: 9.9 },
  { label: '批次 08', value: 7.1 },
  { label: '批次 09', value: 6.5 },
  { label: '批次 10', value: 8.9 }
]

const pipelines = [
  { id: 1, name: '埋点实时流', source: 'Kafka', format: 'JSON', freq: '实时', batch: '2024-06-01 10:00', status: '运行' },
  { id: 2, name: '用户画像拉取', source: 'Hive', format: 'Parquet', freq: '每日', batch: '2024-06-01 08:00', status: '完成' },
  { id: 3, name: '搜索日志', source: 'S3', format: 'CSV', freq: '每小时', batch: '2024-06-01 10:00', status: '运行' },
  { id: 4, name: '曝光记录', source: 'ClickHouse', format: 'TSV', freq: '每小时', batch: '2024-06-01 09:00', status: '运行' },
  { id: 5, name: '视频行为', source: 'OSS', format: 'JSON', freq: '每小时', batch: '2024-06-01 09:00', status: '排队' },
  { id: 6, name: '支付清算', source: 'MySQL', format: 'CDC', freq: '实时', batch: '2024-06-01 10:00', status: '运行' },
  { id: 7, name: '客服质检', source: 'S3', format: 'CSV', freq: '每日', batch: '2024-06-01 07:00', status: '完成' },
  { id: 8, name: '广告曝光', source: 'Kafka', format: 'JSON', freq: '实时', batch: '2024-06-01 10:00', status: '运行' },
  { id: 9, name: '邮件反馈', source: 'IMAP', format: 'EML', freq: '每日', batch: '2024-06-01 06:00', status: '完成' },
  { id: 10, name: '埋点校验', source: 'Fluentd', format: 'JSON', freq: '实时', batch: '2024-06-01 10:00', status: '运行' }
]

const showUpload = ref(false)
const showPipeline = ref(false)
const showSchedule = ref(false)
const uploadForm = reactive({ name: '', desc: '' })
const schedule = reactive({ freq: '每小时', window: '00:00-06:00', concurrent: 4, retry: '5分钟' })
const pipeProgress = ref(20)
let timer

const openUpload = () => (showUpload.value = true)
const confirmUpload = () => {
  showUpload.value = false
}

const openPipeline = () => {
  showPipeline.value = true
  pipeProgress.value = 20
  timer = setInterval(() => {
    pipeProgress.value = Math.min(100, pipeProgress.value + 20)
    if (pipeProgress.value === 100) clearInterval(timer)
  }, 500)
}

const stopPipeline = () => {
  showPipeline.value = false
  clearInterval(timer)
}

const openSchedule = () => (showSchedule.value = true)
const saveSchedule = () => {
  showSchedule.value = false
}
</script>
