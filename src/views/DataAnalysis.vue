<template>
  <div class="surface">
    <div class="topbar" style="margin-bottom:10px;">
      <div class="badge">数据统计分析</div>
      <div class="actions">
        <button @click="openExport = true">导出报表</button>
        <button class="secondary" @click="openRefresh = true">刷新统计</button>
      </div>
    </div>
    <div class="stat-grid" style="margin-bottom:12px;">
      <div class="stat-card" v-for="item in cards" :key="item.label">
        <div style="color:var(--muted);">{{ item.label }}</div>
        <h2 style="margin:6px 0;">{{ item.value }}</h2>
        <div class="chart-row">
          <div class="chart-bar" :style="{ width: item.percent + '%' }"></div>
          <span style="color:var(--muted);">{{ item.percent }}%</span>
        </div>
      </div>
    </div>
    <div class="card-grid" style="margin-bottom:12px;">
      <div class="stat-card">
        <h4 style="margin:0 0 8px;">周趋势</h4>
        <div class="timeline">
          <div class="timeline-item" v-for="trend in weekly" :key="trend.day">
            <div style="display:flex; justify-content:space-between;">
              <span>{{ trend.day }}</span>
              <span class="chip">{{ trend.count }}</span>
            </div>
            <div class="progress-bar" style="margin-top:6px;"><div class="progress-inner" :style="{ width: trend.percent + '%' }"></div></div>
          </div>
        </div>
      </div>
      <div class="stat-card">
        <h4 style="margin:0 0 8px;">联动核验成功率</h4>
        <div class="timeline">
          <div class="timeline-item" v-for="pair in pairs" :key="pair.name">
            <div style="display:flex; justify-content:space-between;">
              <span>{{ pair.name }}</span>
              <span>{{ pair.rate }}%</span>
            </div>
            <div class="progress-bar" style="margin-top:6px;"><div class="progress-inner" :style="{ width: pair.rate + '%' }"></div></div>
          </div>
        </div>
      </div>
    </div>
    <div class="table-card">
      <table>
        <thead>
          <tr>
            <th>序号</th>
            <th>模块</th>
            <th>指标</th>
            <th>本周</th>
            <th>上周</th>
            <th>趋势</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in tableRows" :key="row.id">
            <td>{{ row.id }}</td>
            <td>{{ row.module }}</td>
            <td>{{ row.metric }}</td>
            <td>{{ row.current }}</td>
            <td>{{ row.previous }}</td>
            <td><span class="badge">{{ row.trend }}</span></td>
            <td class="actions">
              <button class="ghost" @click="openDetail(row)">详情</button>
              <button class="secondary" @click="openExport = true">导出</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <ModalDialog v-model="openExport">
    <template #title>导出报表</template>
    <p>选择导出格式：</p>
    <div class="actions" style="margin-top:10px;">
      <button class="secondary" @click="exportProgress = 80">Excel</button>
      <button class="secondary" @click="exportProgress = 100">PDF</button>
    </div>
    <p style="color:var(--muted); margin-top:8px;">导出进度</p>
    <div class="progress-bar"><div class="progress-inner" :style="{ width: exportProgress + '%' }"></div></div>
  </ModalDialog>

  <ModalDialog v-model="openRefresh">
    <template #title>刷新统计</template>
    <p>正在重算指标，请稍候…</p>
    <div class="progress-bar"><div class="progress-inner" :style="{ width: refreshProgress + '%' }"></div></div>
    <div class="actions" style="margin-top:10px; justify-content:flex-end;">
      <button @click="refreshProgress = 100">快速刷新</button>
    </div>
  </ModalDialog>

  <ModalDialog v-model="detailOpen">
    <template #title>指标详情</template>
    <p>{{ detail.metric }} - {{ detail.module }}</p>
    <p style="color:var(--muted);">说明：数据来源于采集与校验日志。</p>
    <div class="actions" style="justify-content:flex-end;">
      <button @click="detailOpen=false">关闭</button>
    </div>
  </ModalDialog>
</template>

<script setup>
import { reactive, ref } from 'vue'
import ModalDialog from '../components/ModalDialog.vue'

const openExport = ref(false)
const openRefresh = ref(false)
const detailOpen = ref(false)
const exportProgress = ref(40)
const refreshProgress = ref(55)
const detail = reactive({ module: '', metric: '' })

const cards = [
  { label: '双码核验', value: '98.6%', percent: 98 },
  { label: '现场上传', value: '1,240', percent: 76 },
  { label: '追溯查询', value: '360', percent: 44 },
  { label: '告警处理', value: '28', percent: 35 },
]

const weekly = [
  { day: '周一', count: 168, percent: 70 },
  { day: '周二', count: 154, percent: 64 },
  { day: '周三', count: 180, percent: 75 },
  { day: '周四', count: 200, percent: 82 },
  { day: '周五', count: 210, percent: 88 },
  { day: '周六', count: 156, percent: 66 },
  { day: '周日', count: 132, percent: 55 },
]

const pairs = [
  { name: '二维码-钢筋', rate: 96 },
  { name: 'RFID-混凝土', rate: 92 },
  { name: '二维码-模板', rate: 88 },
  { name: 'RFID-附属件', rate: 80 },
]

const tableRows = Array.from({ length: 20 }).map((_, idx) => ({
  id: idx + 1,
  module: idx % 2 === 0 ? '标识管理' : '现场采集',
  metric: idx % 3 === 0 ? '入库量' : idx % 3 === 1 ? '核验率' : '告警数',
  current: Math.floor(Math.random() * 200 + 50),
  previous: Math.floor(Math.random() * 200 + 30),
  trend: idx % 2 === 0 ? '↑ 增长' : '↓ 收敛',
}))

const openDetail = (row) => {
  detail.module = row.module
  detail.metric = row.metric
  detailOpen.value = true
}
</script>
