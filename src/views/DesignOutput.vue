<template>
  <div class="grid" style="grid-template-columns: 1fr 0.9fr; align-items: start;">
    <div class="card">
      <div class="flex-between">
        <h3>逆向推导结果输出</h3>
        <div class="chip-row">
          <button class="secondary" @click="showCompare = true">比对历史结果</button>
          <button @click="showNotify = true">通知团队</button>
          <button @click="showExport = true">导出报告</button>
        </div>
      </div>
      <p class="tooltip">每条推导记录均可追踪原始需求、算法版本、验证状态。</p>
      <div class="table-card">
        <div class="flex-between">
          <h4>最新推导批次</h4>
          <span class="badge">共 {{ outputs.length }} 条</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>批次</th>
              <th>钢种</th>
              <th>设计路径</th>
              <th>合格率预测</th>
              <th>验证进度</th>
              <th>负责人</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in outputs" :key="row.batch">
              <td>{{ row.batch }}</td>
              <td>{{ row.grade }}</td>
              <td>{{ row.route }}</td>
              <td>{{ row.quality }}%</td>
              <td>
                <div class="progress"><div :style="{ width: row.progress + '%' }"></div></div>
              </td>
              <td>{{ row.owner }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="card">
      <div class="flex-between">
        <h3>质量窗口分布</h3>
        <button class="secondary" @click="showGuide = true">查看方法</button>
      </div>
      <p class="tooltip">展示逆向推导后的关键性能指标覆盖程度。</p>
      <div class="chart" style="grid-template-columns: repeat(5, 1fr);">
        <div v-for="point in radar" :key="point.label" class="bar" style="height: 140px;">
          <span>{{ point.label }}</span>
          <div class="progress" style="width: 100%; height: 12px;"><div :style="{ width: point.value + '%' }"></div></div>
          <strong>{{ point.value }}%</strong>
        </div>
      </div>
    </div>
  </div>

  <ModalDialog v-model="showExport" title="导出报告" show-actions @confirm="showExportProgress = true">
    <p>选择导出格式：</p>
    <select>
      <option>PDF（带水印）</option>
      <option>Excel（含明细）</option>
      <option>JSON（接口联调）</option>
    </select>
  </ModalDialog>

  <ModalDialog v-model="showExportProgress" title="正在生成报告">
    <p class="tooltip">自动合并设计依据、验证记录与审核意见。</p>
    <div class="progress" style="margin-top: 10px;"><div :style="{ width: exportProgress + '%' }"></div></div>
    <p>进度：{{ exportProgress }}%</p>
  </ModalDialog>

  <ModalDialog v-model="showCompare" title="历史结果比对">
    <p class="tooltip">选择任意两批次对比指标差异。</p>
    <table>
      <thead>
        <tr>
          <th>批次</th><th>钢种</th><th>差异点</th><th>结论</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in compareList" :key="item.batch">
          <td>{{ item.batch }}</td>
          <td>{{ item.grade }}</td>
          <td>{{ item.diff }}</td>
          <td>{{ item.summary }}</td>
        </tr>
      </tbody>
    </table>
  </ModalDialog>

  <ModalDialog v-model="showNotify" title="通知团队" show-actions @confirm="showNotify = false">
    <label>接收人 <input placeholder="输入邮箱或用户名" /></label>
    <label style="margin-top: 8px;">消息 <textarea rows="3" placeholder="描述需要关注的变更点"></textarea></label>
  </ModalDialog>

  <ModalDialog v-model="showGuide" title="覆盖度计算说明">
    <p class="tooltip">覆盖度来源于合金设计、热处理窗口、检测可靠性三方的乘积。</p>
    <ul>
      <li>针对高韧性指标，放大了低温冲击权重</li>
      <li>合格率<80% 将自动抛出校核任务</li>
    </ul>
  </ModalDialog>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import ModalDialog from '../components/ModalDialog.vue'

const outputs = [
  { batch: 'R-240601', grade: '20CrNi2Mo', route: '真空冶炼-模锻-调质', quality: 92, progress: 76, owner: '陈工' },
  { batch: 'R-240602', grade: '34CrNiMo6', route: 'EAF+LF-锻造-调质', quality: 87, progress: 62, owner: '王璐' },
  { batch: 'R-240603', grade: '17-4PH', route: '真空冶炼-固溶-时效', quality: 90, progress: 54, owner: '张雷' },
  { batch: 'R-240604', grade: 'GCr15', route: '真空冶炼-连轧-淬火回火', quality: 85, progress: 48, owner: '黄威' },
  { batch: 'R-240605', grade: '42CrMo', route: 'EAF+LF-锻造-调质', quality: 88, progress: 70, owner: '李静' },
  { batch: 'R-240606', grade: '50CrMo4', route: 'ESR-锻造-调质', quality: 93, progress: 82, owner: '林浩' },
  { batch: 'R-240607', grade: '30CrNiMo8', route: 'EAF+LF-锻造-调质', quality: 86, progress: 60, owner: '常远' },
  { batch: 'R-240608', grade: 'Q690D', route: '转炉-TMCP', quality: 81, progress: 44, owner: '陈鑫' },
  { batch: 'R-240609', grade: '12Cr2Ni4A', route: '真空冶炼-锻造-渗碳', quality: 89, progress: 52, owner: '郝星' },
  { batch: 'R-240610', grade: '40CrNiMoA', route: 'EAF+LF-锻造-调质', quality: 90, progress: 68, owner: '周勇' }
]

const radar = [
  { label: '强度', value: 92 },
  { label: '韧性', value: 85 },
  { label: '淬透性', value: 80 },
  { label: '洁净度', value: 88 },
  { label: '尺寸稳定', value: 83 }
]

const compareList = [
  { batch: 'R-240590', grade: '20CrNi2Mo', diff: '强韧性+6%', summary: '新版回火温度优化' },
  { batch: 'R-240580', grade: '17-4PH', diff: '抗拉-4%', summary: '固溶保温不足' },
  { batch: 'R-240570', grade: '50CrMo4', diff: '淬透性+3%', summary: '合金配比优化' },
  { batch: 'R-240560', grade: 'GCr15', diff: '洁净度+2%', summary: '精炼时间延长' },
  { batch: 'R-240550', grade: '30CrNiMo8', diff: '强度+5%', summary: '锻比提升' },
  { batch: 'R-240540', grade: 'Q690D', diff: '韧性+7%', summary: '冷却速度优化' },
  { batch: 'R-240530', grade: '42CrMo', diff: '硬度-1HRC', summary: '回火次数减少' },
  { batch: 'R-240520', grade: '40CrNiMoA', diff: '稳定性+4%', summary: '控轧工艺更新' },
  { batch: 'R-240510', grade: '12Cr2Ni4A', diff: '组织均匀+3%', summary: '两段渗碳' },
  { batch: 'R-240500', grade: '35CrMo', diff: '疲劳寿命+5%', summary: '冷校矫直' }
]

const showExport = ref(false)
const showExportProgress = ref(false)
const showCompare = ref(false)
const showNotify = ref(false)
const showGuide = ref(false)
const exportProgress = ref(10)
let progressTimer

onMounted(() => {
  progressTimer = setInterval(() => {
    if (showExportProgress.value) {
      exportProgress.value = Math.min(100, exportProgress.value + 15)
      if (exportProgress.value === 100) {
        showExportProgress.value = false
      }
    }
  }, 600)
})

onUnmounted(() => clearInterval(progressTimer))
</script>
