<template>
  <div class="grid grid-2">
    <div class="card">
      <div class="flex-between" style="margin-bottom: 8px;">
        <div>
          <div class="muted small">工序数据</div>
          <h3 style="margin: 4px 0 0;">实时采集</h3>
        </div>
        <div class="toolbar">
          <button class="btn" @click="openModal('auto')">设备自动采集</button>
          <button class="btn secondary" @click="openModal('manual')">人工补录</button>
          <button class="btn ghost" @click="openModal('export')">导出数据</button>
        </div>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>批次</th>
            <th>工序</th>
            <th>温度(℃)</th>
            <th>压力(MPa)</th>
            <th>电流(A)</th>
            <th>采集方式</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in dataRows" :key="row.id">
            <td>{{ row.batch }}</td>
            <td>{{ row.step }}</td>
            <td>{{ row.temp }}</td>
            <td>{{ row.pressure }}</td>
            <td>{{ row.current }}</td>
            <td><span class="tag">{{ row.mode }}</span></td>
            <td>
              <span :class="['badge', row.status === '正常' ? 'success' : row.status === '偏高' ? 'warning' : 'danger']">
                {{ row.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="card">
      <div class="flex-between" style="margin-bottom: 8px;">
        <div>
          <div class="muted small">关键参数趋势</div>
          <h3 style="margin: 4px 0 0;">温压电流分布</h3>
        </div>
        <button class="btn" @click="openModal('trend')">刷新趋势</button>
      </div>
      <div class="grid" style="gap: 14px;">
        <div v-for="item in charts" :key="item.label" class="card" style="background:#f8fafc;">
          <div class="flex-between">
            <div>
              <div class="muted small">{{ item.label }}</div>
              <strong>{{ item.value }}</strong>
            </div>
            <span class="badge" :class="item.badge">{{ item.note }}</span>
          </div>
          <div style="margin-top: 10px;" class="chart-row" v-for="bar in item.series" :key="bar.name">
            <div>{{ bar.name }}</div>
            <div class="chart-bar" :style="{ width: bar.percent + '%' }"></div>
            <div style="text-align:right; font-weight:700;">{{ bar.percent }}%</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-if="activeModal" class="modal-backdrop">
    <div class="modal">
      <template v-if="activeModal === 'auto'">
        <h3>自动采集触发</h3>
        <p class="muted">确认同步最近 10 台设备的实时数据。</p>
        <div class="grid grid-2" style="margin: 14px 0;">
          <div>
            <div class="label">采集范围</div>
            <select class="select" v-model="form.range">
              <option>压铸-全产线</option>
              <option>烧结-2#线</option>
              <option>研磨-1#线</option>
            </select>
          </div>
          <div>
            <div class="label">采集周期</div>
            <select class="select" v-model="form.period">
              <option>10s</option>
              <option>30s</option>
              <option>60s</option>
            </select>
          </div>
        </div>
        <div class="progress-bar">
          <div class="progress-bar-inner" :style="{ width: progress + '%' }"></div>
        </div>
        <div style="text-align:right; margin-top: 14px;">
          <button class="btn" @click="confirm('auto')">开始采集</button>
        </div>
      </template>

      <template v-else-if="activeModal === 'manual'">
        <h3>人工补录</h3>
        <div class="grid grid-2" style="margin-top: 10px;">
          <div>
            <div class="label">批次号</div>
            <input class="input" v-model="form.batch" placeholder="如 MC2403-18" />
          </div>
          <div>
            <div class="label">工序</div>
            <select class="select" v-model="form.step">
              <option>压铸</option>
              <option>烧结</option>
              <option>退火</option>
              <option>研磨</option>
              <option>包装</option>
            </select>
          </div>
          <div>
            <div class="label">温度(℃)</div>
            <input class="input" v-model="form.temp" />
          </div>
          <div>
            <div class="label">压力(MPa)</div>
            <input class="input" v-model="form.pressure" />
          </div>
          <div>
            <div class="label">电流(A)</div>
            <input class="input" v-model="form.current" />
          </div>
          <div>
            <div class="label">录入备注</div>
            <input class="input" v-model="form.remark" placeholder="异常说明或补采原因" />
          </div>
        </div>
        <div style="text-align:right; margin-top: 12px;">
          <button class="btn secondary" @click="confirm('manual')">提交补录</button>
        </div>
      </template>

      <template v-else-if="activeModal === 'export'">
        <h3>数据导出</h3>
        <p class="muted">导出已筛选的采集记录，支持 CSV/Excel。</p>
        <div class="grid grid-2" style="margin: 12px 0;">
          <div>
            <div class="label">导出格式</div>
            <select class="select" v-model="form.format">
              <option>CSV</option>
              <option>XLSX</option>
            </select>
          </div>
          <div>
            <div class="label">覆盖字段</div>
            <select class="select" v-model="form.fields">
              <option>全部参数</option>
              <option>温度/压力/电流</option>
              <option>批次与状态</option>
            </select>
          </div>
        </div>
        <div class="progress-bar">
          <div class="progress-bar-inner" :style="{ width: progress + '%' }"></div>
        </div>
        <div style="text-align:right; margin-top: 12px;">
          <button class="btn" @click="confirm('export')">生成文件</button>
        </div>
      </template>

      <template v-else>
        <h3>趋势刷新</h3>
        <p class="muted">已触发趋势重算，将更新温度/压力/电流分布。</p>
        <div class="progress-bar">
          <div class="progress-bar-inner" :style="{ width: progress + '%' }"></div>
        </div>
        <div style="text-align:right; margin-top: 12px;">
          <button class="btn" @click="confirm('trend')">好的</button>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'

const activeModal = ref('')
const progress = ref(60)
const form = reactive({
  range: '压铸-全产线',
  period: '30s',
  batch: '',
  step: '压铸',
  temp: '',
  pressure: '',
  current: '',
  remark: '',
  format: 'CSV',
  fields: '全部参数'
})

const dataRows = Array.from({ length: 24 }).map((_, idx) => ({
  id: idx,
  batch: `MC2403-${(idx + 1).toString().padStart(2, '0')}`,
  step: ['压铸', '烧结', '研磨', '退火'][idx % 4],
  temp: 120 + idx,
  pressure: (1.8 + idx * 0.01).toFixed(2),
  current: (38 + idx * 0.2).toFixed(1),
  mode: idx % 3 === 0 ? '自动' : '人工补录',
  status: idx % 5 === 0 ? '偏高' : idx % 7 === 0 ? '异常' : '正常'
}))

const charts = [
  {
    label: '温度分布',
    value: '120-160℃',
    note: '稳定',
    badge: 'success',
    series: [
      { name: '压铸', percent: 62 },
      { name: '烧结', percent: 48 },
      { name: '研磨', percent: 55 }
    ]
  },
  {
    label: '压力分布',
    value: '1.8-2.6MPa',
    note: '可控',
    badge: 'warning',
    series: [
      { name: '压铸', percent: 72 },
      { name: '烧结', percent: 64 },
      { name: '退火', percent: 45 }
    ]
  },
  {
    label: '电流分布',
    value: '38-52A',
    note: '良好',
    badge: 'success',
    series: [
      { name: '压铸', percent: 70 },
      { name: '研磨', percent: 66 },
      { name: '测试', percent: 58 }
    ]
  }
]

const openModal = (type) => {
  activeModal.value = type
  progress.value = 45 + Math.round(Math.random() * 40)
}

const confirm = () => {
  progress.value = 100
  setTimeout(() => {
    activeModal.value = ''
  }, 300)
}
</script>
