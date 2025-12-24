<template>
  <div class="surface">
    <div class="topbar" style="margin-bottom:10px;">
      <div class="badge">现场数据采集</div>
      <div class="actions">
        <button @click="openScan = true">开始扫码</button>
        <button class="secondary" @click="openManual = true">人工录入</button>
        <button class="secondary" @click="openUpload = true">批量上传</button>
      </div>
    </div>
    <div class="stat-grid" style="margin-bottom:12px;">
      <div class="stat-card" v-for="stat in highlights" :key="stat.label">
        <div style="color:var(--muted);">{{ stat.label }}</div>
        <h2 style="margin:6px 0;">{{ stat.value }}</h2>
        <div class="chart-row">
          <div class="chart-bar" :style="{ width: stat.percent + '%' }"></div>
          <span style="color:var(--muted);">{{ stat.percent }}%</span>
        </div>
      </div>
    </div>
    <div class="card-grid" style="margin-bottom:12px;">
      <div class="stat-card">
        <h4 style="margin:0 0 6px;">扫码分布</h4>
        <div class="timeline">
          <div class="timeline-item" v-for="area in scanAreas" :key="area.name">
            <div style="display:flex; justify-content:space-between;">
              <span>{{ area.name }}</span>
              <span class="chip">{{ area.count }}次</span>
            </div>
            <div class="progress-bar" style="margin-top:6px;"><div class="progress-inner" :style="{ width: area.percent + '%' }"></div></div>
          </div>
        </div>
      </div>
      <div class="stat-card">
        <h4 style="margin:0 0 6px;">班组完成率</h4>
        <div class="timeline">
          <div class="timeline-item" v-for="team in teams" :key="team.name">
            <div style="display:flex; justify-content:space-between;">
              <span>{{ team.name }}</span>
              <span>{{ team.rate }}%</span>
            </div>
            <div class="progress-bar" style="margin-top:6px;"><div class="progress-inner" :style="{ width: team.rate + '%' }"></div></div>
          </div>
        </div>
      </div>
    </div>
    <div class="table-card">
      <table>
        <thead>
          <tr>
            <th>时间</th>
            <th>作业面</th>
            <th>二维码</th>
            <th>RFID</th>
            <th>采集人</th>
            <th>质量</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.time + row.qr">
            <td>{{ row.time }}</td>
            <td>{{ row.area }}</td>
            <td>{{ row.qr }}</td>
            <td>{{ row.rfid }}</td>
            <td>{{ row.user }}</td>
            <td><span class="badge">{{ row.quality }}</span></td>
            <td class="actions">
              <button class="ghost" @click="openToast(row.qr)">提醒</button>
              <button class="secondary" @click="openManual = true">补录</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <ModalDialog v-model="openScan">
    <template #title>扫码采集</template>
    <p>正在激活扫码枪…</p>
    <div class="progress-bar"><div class="progress-inner" :style="{ width: scanProgress + '%' }"></div></div>
    <div class="actions" style="justify-content:flex-end; margin-top:10px;">
      <button @click="scanProgress = 100">完成</button>
    </div>
  </ModalDialog>

  <ModalDialog v-model="openManual">
    <template #title>人工录入</template>
    <div class="form-grid">
      <label>二维码<input v-model="manual.qr" placeholder="QR编号" /></label>
      <label>RFID<input v-model="manual.rfid" placeholder="RFID编号" /></label>
      <label>作业面<select v-model="manual.area"><option v-for="area in scanAreas" :key="area.name">{{ area.name }}</option></select></label>
      <label>采集人<input v-model="manual.user" placeholder="责任人" /></label>
    </div>
    <div class="actions" style="justify-content:flex-end; margin-top:12px;">
      <button class="secondary" @click="saveManual">保存</button>
    </div>
  </ModalDialog>

  <ModalDialog v-model="openUpload">
    <template #title>批量上传</template>
    <p>共3个文件待上传。</p>
    <div class="progress-bar"><div class="progress-inner" :style="{ width: uploadProgress + '%' }"></div></div>
    <div class="actions" style="justify-content:flex-end; margin-top:10px;">
      <button @click="uploadProgress = 100">快速完成</button>
    </div>
  </ModalDialog>

  <ModalDialog v-model="toast">
    <template #title>提示</template>
    <p>已记录 {{ toastCode }} 的现场提醒。</p>
    <div class="actions" style="justify-content:flex-end;">
      <button @click="toast=false">关闭</button>
    </div>
  </ModalDialog>
</template>

<script setup>
import { reactive, ref } from 'vue'
import ModalDialog from '../components/ModalDialog.vue'

const openScan = ref(false)
const openManual = ref(false)
const openUpload = ref(false)
const toast = ref(false)
const toastCode = ref('')
const scanProgress = ref(50)
const uploadProgress = ref(20)

const manual = reactive({ qr: '', rfid: '', area: '', user: '' })

const highlights = [
  { label: '今日扫码', value: '156', percent: 72 },
  { label: 'RFID抓取', value: '142', percent: 66 },
  { label: '异常纠偏', value: '6', percent: 24 },
  { label: '班组覆盖', value: '9', percent: 80 },
]

const scanAreas = [
  { name: '桩基区', count: 32, percent: 80 },
  { name: '承台区', count: 21, percent: 64 },
  { name: '钢筋加工', count: 18, percent: 54 },
  { name: '临建仓', count: 12, percent: 38 },
]

const teams = [
  { name: '一班', rate: 92 },
  { name: '二班', rate: 78 },
  { name: '三班', rate: 65 },
  { name: '夜班', rate: 58 },
]

const rows = Array.from({ length: 20 }).map((_, idx) => ({
  time: `05-${(idx + 1).toString().padStart(2, '0')} 0${idx % 9}:1${idx % 6}`,
  area: scanAreas[idx % scanAreas.length].name,
  qr: `QR-COLL-${(idx + 41).toString().padStart(3, '0')}`,
  rfid: `RFID-${9000 + idx}`,
  user: ['陈工', '李班', '赵检', '孙技'][idx % 4],
  quality: idx % 3 === 0 ? '合格' : '复核',
}))

const saveManual = () => {
  openManual.value = false
  toastCode.value = manual.qr || '新记录'
  toast.value = true
}

const openToast = (code) => {
  toastCode.value = code
  toast.value = true
}
</script>
