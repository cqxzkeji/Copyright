<template>
  <div class="surface">
    <div class="topbar" style="margin-bottom:8px;">
      <div class="badge">双码标识管理</div>
      <div class="actions">
        <button @click="openNew = true">新增标识</button>
        <button class="secondary" @click="openBatch = true">批量打印</button>
        <button class="secondary" @click="openCheck = true">联动校验</button>
      </div>
    </div>
    <div class="stat-grid" style="margin-bottom:12px;">
      <div class="stat-card" v-for="card in stats" :key="card.label">
        <div style="color:var(--muted);">{{ card.label }}</div>
        <h2 style="margin:6px 0;">{{ card.value }}</h2>
        <div class="progress-bar"><div class="progress-inner" :style="{ width: card.progress + '%' }"></div></div>
      </div>
    </div>
    <div class="table-card">
      <table>
        <thead>
          <tr>
            <th>二维码</th>
            <th>RFID</th>
            <th>材料名称</th>
            <th>批次</th>
            <th>状态</th>
            <th>施工段</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in codes" :key="item.qr">
            <td>{{ item.qr }}</td>
            <td>{{ item.rfid }}</td>
            <td>{{ item.material }}</td>
            <td>{{ item.batch }}</td>
            <td><span class="badge">{{ item.status }}</span></td>
            <td>{{ item.section }}</td>
            <td class="actions">
              <button class="ghost" @click="showToast(item.qr)">提示</button>
              <button class="secondary" @click="openBind(item)">绑定</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <ModalDialog v-model="openNew">
    <template #title>新增双码标识</template>
    <div class="form-grid">
      <label>材料名称<input v-model="form.material" placeholder="如：钢筋笼" /></label>
      <label>批次号<input v-model="form.batch" placeholder="2024-QC-01" /></label>
      <label>二维码<input v-model="form.qr" placeholder="QR202405001" /></label>
      <label>RFID编码<input v-model="form.rfid" placeholder="RFID-8899" /></label>
    </div>
    <div class="actions" style="justify-content:flex-end; margin-top:12px;">
      <button class="secondary" @click="saveNew">保存</button>
    </div>
  </ModalDialog>

  <ModalDialog v-model="openBatch">
    <template #title>批量打印进度</template>
    <p style="color:var(--muted);">已生成 {{ batchProgress }}% ，请勿关闭窗口。</p>
    <div class="progress-bar"><div class="progress-inner" :style="{ width: batchProgress + '%' }"></div></div>
    <div class="actions" style="justify-content:flex-end; margin-top:12px;">
      <button @click="batchProgress = 100">加速完成</button>
    </div>
  </ModalDialog>

  <ModalDialog v-model="openCheck">
    <template #title>双码联动校验</template>
    <div class="form-grid">
      <label>扫描二维码<input v-model="check.qr" placeholder="扫码录入" /></label>
      <label>扫描RFID<input v-model="check.rfid" placeholder="刷卡录入" /></label>
    </div>
    <p style="color:var(--muted); margin-top:10px;">校验结果：{{ checkResult }}</p>
    <div class="actions" style="justify-content:flex-end; margin-top:10px;">
      <button class="secondary" @click="doCheck">开始校验</button>
    </div>
  </ModalDialog>

  <ModalDialog v-model="toast">
    <template #title>提示</template>
    <p>已触发 {{ currentCode }} 的提示，系统留痕。</p>
    <div class="actions" style="justify-content:flex-end;">
      <button @click="toast=false">关闭</button>
    </div>
  </ModalDialog>
</template>

<script setup>
import { reactive, ref } from 'vue'
import ModalDialog from '../components/ModalDialog.vue'

const openNew = ref(false)
const openBatch = ref(false)
const openCheck = ref(false)
const toast = ref(false)
const currentCode = ref('')
const batchProgress = ref(35)

const form = reactive({ material: '', batch: '', qr: '', rfid: '' })
const check = reactive({ qr: '', rfid: '' })
const checkResult = ref('待比对')

const stats = [
  { label: '已入库', value: '864', progress: 82 },
  { label: '待打印', value: '56', progress: 48 },
  { label: '异常标签', value: '3', progress: 12 },
  { label: '今日发放', value: '124', progress: 66 },
]

const codes = Array.from({ length: 20 }).map((_, idx) => ({
  qr: `QR202405${(idx + 1).toString().padStart(3, '0')}`,
  rfid: `RFID-${8000 + idx}`,
  material: idx % 2 === 0 ? '钢筋笼' : '混凝土试件',
  batch: `BT-${(idx % 4) + 1}`,
  status: idx % 3 === 0 ? '已发放' : '待领取',
  section: `区段-${String.fromCharCode(65 + (idx % 5))}`,
}))

const saveNew = () => {
  openNew.value = false
  batchProgress.value = Math.min(100, batchProgress.value + 10)
}

const doCheck = () => {
  if (check.qr && check.rfid) {
    checkResult.value = '一致，允许出库'
  } else {
    checkResult.value = '信息缺失，请补充'
  }
}

const showToast = (code) => {
  currentCode.value = code
  toast.value = true
}

const openBind = (item) => {
  openCheck.value = true
  check.qr = item.qr
  check.rfid = item.rfid
}
</script>
