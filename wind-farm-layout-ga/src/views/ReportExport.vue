<template>
  <div class="card">
    <div class="flex-between" style="margin-bottom:12px;">
      <div>
        <h3 style="margin:0">可视化展示与报告导出</h3>
        <p style="margin:4px 0 0 0; color:#4b5563;">地图机位布局、尾流热力、指标看板、导出 PDF/Excel/JSON、生成报告与优化日志</p>
      </div>
      <div style="display:flex; gap:8px; flex-wrap: wrap;">
        <button class="button-secondary" @click="openModal('导出PDF', pdfForm)">导出PDF</button>
        <button class="button-secondary" @click="openModal('导出Excel', excelForm)">导出Excel</button>
        <button class="button-secondary" @click="openModal('导出JSON', jsonForm)">导出JSON</button>
        <button class="button-primary" @click="openModal('生成项目报告', reportForm)">生成报告</button>
      </div>
    </div>
    <div style="display:grid; grid-template-columns: 1.2fr 1fr; gap: 12px;">
      <div class="chart-box">
        <div class="flex-between"><strong>地图机位布局示意</strong><span class="badge">一键导出</span></div>
        <div style="display:grid; grid-template-columns: repeat(6,1fr); gap:10px; margin-top:10px;">
          <div v-for="point in layout" :key="point.id" style="height:60px; border-radius:12px; display:grid; place-items:center; color:#fff; font-weight:700;" :style="{background: point.zone==='平原' ? '#3b82f6' : point.zone==='丘陵' ? '#22c55e' : '#f59e0b'}">{{ point.id }}</div>
        </div>
      </div>
      <div class="chart-box">
        <div class="flex-between"><strong>指标看板</strong><span class="badge">实时</span></div>
        <ul style="margin:6px 0 0 0; padding-left:16px; color:#374151;">
          <li>AEP：{{ metrics.aep }} GWh</li>
          <li>等效满发小时：{{ metrics.fullLoad }} h</li>
          <li>尾流损失：{{ metrics.wakeLoss }}%</li>
          <li>成本估算：{{ metrics.cost }} 亿元</li>
        </ul>
      </div>
    </div>
    <div style="margin-top:14px;">
      <div class="flex-between" style="margin-bottom:8px;">
        <strong>优化日志（最新 6 条）</strong>
        <span class="badge">可追溯</span>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>时间</th>
            <th>操作</th>
            <th>详情</th>
            <th>执行人</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="log in logs" :key="log.time">
            <td>{{ log.time }}</td>
            <td>{{ log.action }}</td>
            <td>{{ log.detail }}</td>
            <td>{{ log.user }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <ModalDialog v-if="modal.visible" :title="modal.title" @close="closeModal">
    <component :is="modal.component" />
  </ModalDialog>
</template>

<script setup>
import { reactive } from 'vue'
import ModalDialog from '../components/ModalDialog.vue'

const layout = reactive(
  Array.from({ length: 12 }).map((_, i) => ({
    id: `P-${(i + 1).toString().padStart(3, '0')}`,
    zone: ['平原', '山前', '丘陵'][i % 3]
  }))
)

const metrics = reactive({ aep: 132.6, fullLoad: 3200, wakeLoss: 6.5, cost: 13.2 })
const logs = reactive([
  { time: '2024-06-10 10:21', action: '生成候选点', detail: '基于4D间距生成 22 个机位', user: '规划-刘' },
  { time: '2024-06-10 11:15', action: '约束校验', detail: '剔除 4 个噪声超限机位', user: '生态-周' },
  { time: '2024-06-10 14:02', action: 'GA优化', detail: '并行 3 个随机种子，120 代', user: '算法-王' },
  { time: '2024-06-10 15:44', action: '方案对比', detail: '方案B 相比A AEP +3.1%', user: '规划-刘' },
  { time: '2024-06-10 16:20', action: '敏感性分析', detail: '风向频率扰动 ±10%', user: '算法-王' },
  { time: '2024-06-10 17:05', action: '导出报告', detail: 'PDF+Excel+JSON，一键归档', user: '数据-宋' }
])

const modal = reactive({ visible: false, title: '', component: null })
const openModal = (title, comp) => {
  modal.visible = true
  modal.title = title
  modal.component = comp
}
const closeModal = () => {
  modal.visible = false
}

const pdfForm = {
  template: `
    <div style='display:grid; gap:10px;'>
      <label>包含章节：<input value='场址数据/约束/优化结果/尾流图' /></label>
      <label>水印：<input value='风机布局优化-内部' /></label>
      <div class='progress-track'><div class='progress-bar' style='width:72%'></div></div>
      <p style='margin:0;color:#2563eb;'>正在生成 PDF 报告...</p>
    </div>`
}

const excelForm = {
  template: `
    <div style='display:grid; gap:10px;'>
      <label>导出工作表：<input value='机位列表/约束校验/优化过程' /></label>
      <label>数值精度：<input value='3 位小数' /></label>
      <div class='progress-track'><div class='progress-bar' style='width:54%'></div></div>
      <p style='margin:0;color:#16a34a;'>Excel 生成中，预计 5 秒</p>
    </div>`
}

const jsonForm = {
  template: `
    <div style='display:grid; gap:10px;'>
      <label>导出内容：<input value='机位坐标/参数/适应度曲线' /></label>
      <label>压缩：<input value='启用 gzip' /></label>
      <div class='progress-track'><div class='progress-bar' style='width:43%'></div></div>
      <p style='margin:0;color:#f97316;'>JSON 同步到接口库</p>
    </div>`
}

const reportForm = {
  template: `
    <div style='display:grid; gap:10px;'>
      <label>报告模板：<input value='风机布局优化-标准版' /></label>
      <label>包含优化日志：<input value='是，附带指标看板截图' /></label>
      <div class='progress-track'><div class='progress-bar' style='width:86%'></div></div>
      <p style='margin:0;color:#0ea5e9;'>已生成报告草稿并写入归档</p>
    </div>`
}
</script>
