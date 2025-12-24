<template>
  <div class="surface">
    <div class="topbar" style="margin-bottom:12px;">
      <div class="badge">双码联动校验</div>
      <div class="actions">
        <button @click="openRealtime = true">实时校验</button>
        <button class="secondary" @click="openBatch = true">批量校验</button>
        <button class="secondary" @click="openGuide = true">流程指引</button>
      </div>
    </div>

    <div class="stat-grid" style="margin-bottom:12px;">
      <div class="stat-card" v-for="card in stats" :key="card.label">
        <div style="color:var(--muted);">{{ card.label }}</div>
        <h2 style="margin:6px 0;">{{ card.value }}</h2>
        <div class="progress-bar"><div class="progress-inner" :style="{ width: card.progress + '%' }"></div></div>
      </div>
    </div>

    <div class="card-grid" style="margin-bottom:12px;">
      <div class="stat-card" style="display:flex; flex-direction:column; gap:8px;">
        <div style="display:flex; align-items:center; gap:8px;">
          <span class="chip">班组抽检</span>
          <strong>{{ selectedTeam }}</strong>
        </div>
        <div class="chart-row">
          <div class="chart-bar"><div class="progress-inner" :style="{ width: '78%' }"></div></div>
          <span style="color:var(--muted);">78% 通过</span>
        </div>
        <div class="actions" style="justify-content:flex-end;">
          <button class="ghost" @click="cycleTeam">切换班组</button>
        </div>
      </div>
      <div class="stat-card" style="display:flex; flex-direction:column; gap:8px;">
        <div style="display:flex; align-items:center; gap:8px;">
          <span class="chip">通道设备</span>
          <strong>{{ deviceStatus }}</strong>
        </div>
        <div class="chart-row">
          <div class="chart-bar"><div class="progress-inner" :style="{ width: '64%' }"></div></div>
          <span style="color:var(--muted);">RFID/二维码覆盖 64%</span>
        </div>
        <div class="actions" style="justify-content:flex-end;">
          <button class="ghost" @click="toggleDevice">刷新状态</button>
        </div>
      </div>
      <div class="stat-card" style="display:flex; flex-direction:column; gap:8px;">
        <div style="display:flex; align-items:center; gap:8px;">
          <span class="chip">异常提醒</span>
          <strong>{{ abnormalCount }} 条</strong>
        </div>
        <p style="color:var(--muted); margin:0;">已通知驻场监理，需复核并留痕。</p>
        <div class="actions" style="justify-content:flex-end;">
          <button class="ghost" @click="openToast('自动提醒已推送')">推送记录</button>
        </div>
      </div>
    </div>

    <div class="table-card">
      <div class="topbar" style="margin-bottom:8px;">
        <h3 style="margin:0;">联动校验记录</h3>
        <div class="actions">
          <input v-model="keyword" placeholder="搜索二维码/RFID/段落" style="width:200px;" />
          <button class="secondary" @click="openExport = true">导出</button>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>二维码</th>
            <th>RFID</th>
            <th>材料名称</th>
            <th>作业段</th>
            <th>检测人</th>
            <th>结果</th>
            <th>时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in filteredList" :key="item.qr">
            <td>{{ item.qr }}</td>
            <td>{{ item.rfid }}</td>
            <td>{{ item.material }}</td>
            <td>{{ item.section }}</td>
            <td>{{ item.inspector }}</td>
            <td>
              <span class="badge" :style="{ background: item.result === '通过' ? 'var(--primary-light)' : '#ffe4e6', color: item.result === '通过' ? 'var(--primary)' : '#dc2626' }">
                {{ item.result }}
              </span>
            </td>
            <td>{{ item.time }}</td>
            <td class="actions">
              <button class="ghost" @click="openToast(`提示：${item.qr}`)">提示</button>
              <button class="secondary" @click="openReview(item)">复核</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <ModalDialog v-model="openRealtime">
    <template #title>实时校验</template>
    <div class="form-grid">
      <label>二维码<input v-model="form.qr" placeholder="扫码录入二维码" /></label>
      <label>RFID<input v-model="form.rfid" placeholder="刷卡录入RFID" /></label>
      <label>作业段<input v-model="form.section" placeholder="如：基坑东侧" /></label>
      <label>检测人<input v-model="form.inspector" placeholder="班组长/监理" /></label>
    </div>
    <p style="color:var(--muted); margin-top:10px;">校验结果：{{ realtimeResult }}</p>
    <div class="actions" style="justify-content:flex-end; margin-top:10px;">
      <button class="secondary" @click="runRealtime">开始校验</button>
    </div>
  </ModalDialog>

  <ModalDialog v-model="openBatch">
    <template #title>批量校验</template>
    <p style="color:var(--muted);">正在处理 {{ batchProgress }}%，共 {{ filteredList.length }} 条记录。</p>
    <div class="progress-bar"><div class="progress-inner" :style="{ width: batchProgress + '%' }"></div></div>
    <div class="actions" style="justify-content:flex-end; margin-top:12px;">
      <button class="secondary" @click="increaseBatch">推进10%</button>
    </div>
  </ModalDialog>

  <ModalDialog v-model="openGuide">
    <template #title>流程指引</template>
    <ol style="color:var(--muted); padding-left:18px;">
      <li>扫描二维码后，立刻刷RFID，系统进行双向匹配。</li>
      <li>结果为“通过”则自动入库，为“异常”需提交复核。</li>
      <li>复核通过后写入追溯链路，导出并归档。</li>
    </ol>
    <div class="actions" style="justify-content:flex-end;">
      <button @click="openGuide=false">完成</button>
    </div>
  </ModalDialog>

  <ModalDialog v-model="openExport">
    <template #title>导出校验记录</template>
    <p style="color:var(--muted);">生成带签章的PDF与Excel，可在系统管理中查看历史导出。</p>
    <div class="actions" style="justify-content:flex-end;">
      <button class="secondary" @click="openToast('导出任务创建成功')">确认</button>
    </div>
  </ModalDialog>

  <ModalDialog v-model="openReviewDialog">
    <template #title>异常复核</template>
    <div class="form-grid">
      <label>二维码<input v-model="reviewForm.qr" readonly /></label>
      <label>RFID<input v-model="reviewForm.rfid" readonly /></label>
      <label>复核结果
        <select v-model="reviewForm.result">
          <option>通过</option>
          <option>不通过</option>
        </select>
      </label>
      <label>复核意见<textarea rows="2" v-model="reviewForm.note" placeholder="描述异常原因或整改措施"></textarea></label>
    </div>
    <div class="actions" style="justify-content:flex-end; margin-top:12px;">
      <button class="secondary" @click="submitReview">提交</button>
    </div>
  </ModalDialog>

  <ModalDialog v-model="toast">
    <template #title>提示</template>
    <p>{{ toastMsg }}</p>
    <div class="actions" style="justify-content:flex-end;">
      <button @click="toast=false">关闭</button>
    </div>
  </ModalDialog>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import ModalDialog from '../components/ModalDialog.vue'

const openRealtime = ref(false)
const openBatch = ref(false)
const openGuide = ref(false)
const openExport = ref(false)
const openReviewDialog = ref(false)
const toast = ref(false)
const toastMsg = ref('')

const form = reactive({ qr: '', rfid: '', section: '', inspector: '' })
const realtimeResult = ref('等待校验')
const batchProgress = ref(35)
const keyword = ref('')

const stats = [
  { label: '今日校验', value: '132', progress: 68 },
  { label: '通过率', value: '96.3%', progress: 96 },
  { label: '异常待复核', value: '7', progress: 32 },
  { label: '追溯链路', value: '1480 条', progress: 74 },
]

const teams = ['混凝土班A', '钢筋班B', '钢模班C']
const selectedTeam = ref(teams[0])
const deviceStatus = ref('通道设备在线')
const abnormalCount = ref(7)

const reviewForm = reactive({ qr: '', rfid: '', result: '通过', note: '' })

const list = Array.from({ length: 22 }).map((_, idx) => ({
  qr: `QR-LK-${(idx + 101).toString().padStart(3, '0')}`,
  rfid: `RF-${9000 + idx}`,
  material: idx % 2 === 0 ? '钢筋笼' : '混凝土试件',
  section: `基坑${String.fromCharCode(65 + (idx % 4))}段`,
  inspector: idx % 3 === 0 ? '班组长 李工' : '监理 王工',
  result: idx % 5 === 0 ? '异常' : '通过',
  time: `2024-06-0${(idx % 9) + 1} 1${(idx % 6)}:2${idx % 6}`,
}))

const filteredList = computed(() => {
  if (!keyword.value) return list
  return list.filter((item) =>
    [item.qr, item.rfid, item.section].some((v) => v.toLowerCase().includes(keyword.value.toLowerCase()))
  )
})

const runRealtime = () => {
  if (form.qr && form.rfid) {
    realtimeResult.value = '通过 — 已写入追溯链路'
  } else {
    realtimeResult.value = '缺少扫描数据，请补录'
  }
}

const increaseBatch = () => {
  batchProgress.value = Math.min(100, batchProgress.value + 10)
}

const openToast = (msg) => {
  toastMsg.value = msg
  toast.value = true
}

const cycleTeam = () => {
  const nextIndex = (teams.indexOf(selectedTeam.value) + 1) % teams.length
  selectedTeam.value = teams[nextIndex]
}

const toggleDevice = () => {
  deviceStatus.value = deviceStatus.value.includes('在线') ? '通道设备巡检中' : '通道设备在线'
}

const openReview = (item) => {
  reviewForm.qr = item.qr
  reviewForm.rfid = item.rfid
  reviewForm.result = item.result === '异常' ? '不通过' : '通过'
  reviewForm.note = ''
  openReviewDialog.value = true
}

const submitReview = () => {
  openReviewDialog.value = false
  abnormalCount.value = Math.max(0, abnormalCount.value - 1)
  openToast('复核已提交并同步追溯链路')
}
</script>
