<template>
  <div class="grid" style="gap: 14px;">
    <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px;">
      <div class="card" v-for="stat in kpis" :key="stat.label">
        <div class="flex-between">
          <div>
            <div class="muted small">{{ stat.label }}</div>
            <div style="font-size: 22px; font-weight: 800;">{{ stat.value }}</div>
          </div>
          <div class="badge" :class="stat.trend > 0 ? 'success' : 'warning'">
            {{ stat.trend > 0 ? '+' : '' }}{{ stat.trend }}%
          </div>
        </div>
        <div class="muted small" style="margin-top: 6px;">{{ stat.desc }}</div>
      </div>
    </div>

    <div class="grid" style="grid-template-columns: 2fr 1fr; gap: 14px; align-items: stretch;">
      <div class="card">
        <div class="flex-between" style="margin-bottom: 10px;">
          <div>
            <div class="muted small">能耗/效率走势</div>
            <div style="font-weight: 800;">近12天趋势</div>
          </div>
          <div class="flex" style="gap: 8px;">
            <button class="btn ghost" @click="openRefresh">刷新数据</button>
            <button class="btn" @click="openOptimize">优化建议</button>
          </div>
        </div>
        <svg viewBox="0 0 600 260" class="chart">
          <g v-for="(d, idx) in energyPoints" :key="idx">
            <circle :cx="d.x" :cy="d.y" r="4" fill="#3b82f6" />
          </g>
          <polyline
            :points="polylinePoints(energyPoints)"
            fill="none"
            stroke="#3b82f6"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <polyline
            :points="polylinePoints(efficiencyPoints)"
            fill="none"
            stroke="#22c55e"
            stroke-width="3"
            stroke-dasharray="6 4"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <g v-for="(d, idx) in efficiencyPoints" :key="`eff-${idx}`">
            <circle :cx="d.x" :cy="d.y" r="4" fill="#22c55e" />
          </g>
          <text v-for="(label, idx) in trendLabels" :key="label" :x="50 + idx * 45" y="245" class="muted" font-size="10">
            {{ label }}
          </text>
        </svg>
      </div>
      <div class="card">
        <div class="flex-between" style="margin-bottom: 8px;">
          <div>
            <div class="muted small">快速操作</div>
            <div style="font-weight: 800;">统计与优化</div>
          </div>
        </div>
        <div class="grid" style="gap: 10px;">
          <button class="btn" @click="openRecalc">重新计算良品率</button>
          <button class="btn ghost" @click="openEnergy">能耗分解统计</button>
          <button class="btn ghost" @click="openExport">导出报表</button>
          <button class="btn" @click="openSimulate">优化模拟</button>
        </div>
        <div class="card" style="margin-top: 12px; background: #f8fafc;">
          <div class="muted small">优化摘要</div>
          <div style="font-weight: 700; margin-top: 6px;">重点关注烧结温区与研磨速度</div>
          <p class="muted small" style="margin-top: 6px;">当前组合预计节能 4.6%，良品率提升 1.2%，可提交优化方案并生成试验批次。</p>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="flex-between" style="margin-bottom: 10px;">
        <div>
          <div class="muted small">批次统计</div>
          <div style="font-weight: 800;">24条批次质量与能耗指标</div>
        </div>
        <div class="flex" style="gap: 8px;">
          <button class="btn ghost" @click="openFilter">过滤条件</button>
          <button class="btn" @click="openExport">导出CSV</button>
        </div>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>批次</th>
            <th>良品率</th>
            <th>能耗(kWh/批)</th>
            <th>节拍(s/件)</th>
            <th>工艺优化</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="batch in batchRows" :key="batch.id">
            <td>{{ batch.id }}</td>
            <td>{{ batch.yield }}%</td>
            <td>{{ batch.energy }}</td>
            <td>{{ batch.cycle }}</td>
            <td>
              <span class="badge" :class="batch.tag === '稳定' ? 'success' : batch.tag === '关注' ? 'warning' : 'danger'">
                {{ batch.tag }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="modal.type" class="modal-backdrop">
      <div class="modal">
        <h3>{{ modal.title }}</h3>
        <p class="muted" style="margin: 8px 0 14px;">{{ modal.desc }}</p>

        <div v-if="modal.type === 'form'" class="grid grid-2">
          <div>
            <div class="label">分析维度</div>
            <select v-model="form.dimension" class="select">
              <option value="设备">设备</option>
              <option value="班次">班次</option>
              <option value="工艺窗口">工艺窗口</option>
            </select>
          </div>
          <div>
            <div class="label">统计周期</div>
            <select v-model="form.period" class="select">
              <option value="近7天">近7天</option>
              <option value="近30天">近30天</option>
              <option value="季度">季度</option>
            </select>
          </div>
          <div>
            <div class="label">优化目标</div>
            <input v-model="form.target" class="input" placeholder="例如：良品率≥98%，能耗≤12" />
          </div>
          <div>
            <div class="label">备注</div>
            <input v-model="form.remark" class="input" placeholder="试验批次、约束条件等" />
          </div>
        </div>

        <div v-else class="progress-bar" style="margin: 12px 0 16px;">
          <div class="progress-bar-inner" :style="{ width: modal.progress + '%' }"></div>
        </div>

        <div style="text-align: right; margin-top: 12px;">
          <button class="btn ghost" @click="closeModal" style="margin-right: 10px;">取消</button>
          <button class="btn" @click="confirmModal">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'

const kpis = [
  { label: '周均良品率', value: '97.8%', trend: 1.2, desc: '对比上周提升 1.2%' },
  { label: '单位能耗', value: '11.6 kWh/批', trend: -0.8, desc: '能耗下降 0.8%' },
  { label: '设备开动率', value: '92.4%', trend: 0.6, desc: '班次稼动率持续提升' },
  { label: '异常批次', value: '2 批', trend: -33, desc: '异常批次持续下降' }
]

const trendLabels = ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10', 'D11', 'D12']
const energyValues = [14, 13.5, 13.2, 12.8, 12.6, 12.3, 12.4, 12.1, 12.2, 11.9, 12.0, 11.8]
const efficiencyValues = [88, 89, 88.5, 90, 90.6, 91, 91.3, 92, 91.8, 92.1, 92.6, 93]

const pointify = (arr, maxY) => arr.map((v, idx) => ({ x: 50 + idx * 45, y: 220 - (v / maxY) * 180 }))
const energyPoints = pointify(energyValues, Math.max(...energyValues) + 2)
const efficiencyPoints = pointify(efficiencyValues, 100)

const batchRows = Array.from({ length: 24 }).map((_, idx) => ({
  id: `B${String(idx + 101).padStart(3, '0')}`,
  yield: (96.5 + (idx % 4) * 0.6).toFixed(1),
  energy: (11.5 + (idx % 5) * 0.3).toFixed(2),
  cycle: (48 + (idx % 6) * 1.5).toFixed(1),
  tag: ['稳定', '关注', '待复盘'][(idx + 1) % 3]
}))

const modal = reactive({ type: '', title: '', desc: '', progress: 40 })
const form = reactive({ dimension: '设备', period: '近7天', target: '良品率≥98%', remark: '' })

const polylinePoints = (pts) => pts.map((p) => `${p.x},${p.y}`).join(' ')

const openRecalc = () => {
  modal.type = 'progress'
  modal.title = '重新计算良品率'
  modal.desc = '正在按班次和设备维度重新计算良品率...'
  modal.progress = 55
}

const openEnergy = () => {
  modal.type = 'progress'
  modal.title = '能耗分解'
  modal.desc = '分解烧结、研磨与包装环节能耗占比...'
  modal.progress = 45
}

const openExport = () => {
  modal.type = 'progress'
  modal.title = '导出报表'
  modal.desc = '正在生成CSV报表，并准备下载链接...'
  modal.progress = 70
}

const openSimulate = () => {
  modal.type = 'form'
  modal.title = '优化模拟配置'
  modal.desc = '配置优化目标与维度，生成工艺优化试验批次。'
}

const openRefresh = () => {
  modal.type = 'progress'
  modal.title = '刷新趋势数据'
  modal.desc = '拉取最新的能耗与效率趋势数据...'
  modal.progress = 65
}

const openOptimize = () => {
  modal.type = 'form'
  modal.title = '生成优化建议'
  modal.desc = '根据近12天趋势生成优化方案。'
}

const openFilter = () => {
  modal.type = 'form'
  modal.title = '过滤条件'
  modal.desc = '设置批次过滤条件，筛选低良率或高能耗批次。'
}

const closeModal = () => {
  modal.type = ''
}

const confirmModal = () => {
  if (modal.type === 'form') {
    modal.type = 'progress'
    modal.title = '执行中'
    modal.desc = '正在提交配置并生成结果...'
    modal.progress = 80
    return
  }
  modal.type = ''
}
</script>

<style scoped>
.chart {
  width: 100%;
  height: 260px;
  background: linear-gradient(180deg, #f8fafc, #fff);
  border-radius: 12px;
  border: 1px solid var(--border);
  padding: 10px;
}
</style>
