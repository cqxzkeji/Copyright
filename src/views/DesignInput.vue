<template>
  <div class="grid" style="grid-template-columns: 1.1fr 0.9fr; align-items: start;">
    <div class="card">
      <div class="flex-between">
        <h3>销售技术标准输入</h3>
        <div class="chip-row">
          <span class="badge">实时验证</span>
          <span class="badge" style="background: rgba(255, 202, 44, 0.18); color: #9a6b00;">表格数据≥10条</span>
        </div>
      </div>
      <div class="grid" style="grid-template-columns: 1fr 1fr; margin-top: 12px;">
        <label>钢种 <input v-model="form.grade" placeholder="例如 20CrNi2Mo" /></label>
        <label>客户需求领域 <input v-model="form.industry" placeholder="例如 高速齿轮" /></label>
        <label>力学性能要求 <input v-model="form.performance" placeholder="≥980MPa / ≥12%" /></label>
        <label>供货形态 <input v-model="form.shape" placeholder="棒材/锻件/管材" /></label>
        <label>热处理路径 <input v-model="form.heat" placeholder="调质/正火/退火" /></label>
        <label>检测要求 <input v-model="form.inspection" placeholder="UT 3级 / 探伤全检" /></label>
      </div>
      <div class="chip-row" style="margin-top: 12px;">
        <button @click="showImport = true">导入需求</button>
        <button class="secondary" @click="showSuggest = true">快速生成建议</button>
        <button @click="startReverse">提交逆向推导</button>
      </div>
      <div class="table-card" style="margin-top: 14px;">
        <div class="flex-between">
          <h4>已采集的标准模板</h4>
          <span class="tooltip">共 {{ templates.length }} 条样本</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>编号</th>
              <th>钢种</th>
              <th>行业</th>
              <th>性能指标</th>
              <th>热处理</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in templates" :key="item.id">
              <td>{{ item.id }}</td>
              <td>{{ item.grade }}</td>
              <td>{{ item.industry }}</td>
              <td>{{ item.performance }}</td>
              <td>{{ item.heat }}</td>
              <td><span class="badge">{{ item.status }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="card">
      <div class="flex-between">
        <h3>数据曲线</h3>
        <button class="secondary" @click="showTip = true">说明</button>
      </div>
      <p class="tooltip">根据输入实时生成的工艺窗口与合格率预测。</p>
      <div class="chart" aria-label="简易工艺窗口图">
        <div
          v-for="bar in bars"
          :key="bar.label"
          class="bar"
          :style="{ height: bar.value + '%', background: bar.color }"
        >
          <span>{{ bar.label }}</span>
          <strong>{{ bar.value }}%</strong>
        </div>
      </div>
      <div class="stat" v-for="metric in metrics" :key="metric.label">
        <span>{{ metric.label }}</span>
        <div style="width: 60%;" class="progress"><div :style="{ width: metric.value + '%' }"></div></div>
        <strong>{{ metric.value }}%</strong>
      </div>
    </div>
  </div>

  <ModalDialog v-model="showImport" title="导入外部需求" show-actions @confirm="showImport = false">
    <p class="tooltip">上传客户需求文件，系统自动解析为标准字段。</p>
    <input type="file" />
    <label style="margin-top: 10px; display: block;">备注 <textarea rows="3" placeholder="填写关键限制条件"></textarea></label>
  </ModalDialog>

  <ModalDialog v-model="showSuggest" title="智能建议">
    <p>根据历史成交数据，建议匹配 <strong>{{ form.grade || '目标钢种' }}</strong> 采用调质+两次回火方案。</p>
    <ul>
      <li>可复用相似案例 6 条，预计缩短评审 32%</li>
      <li>推荐供应商焊材组合：ER55-G + 熔剂 SJ302</li>
      <li>风险提示：检测标准需确认是否按 EN10228-3</li>
    </ul>
  </ModalDialog>

  <ModalDialog v-model="showProgress" title="逆向推导中...">
    <p class="tooltip">正在调用配方生成与校核服务，请稍候。</p>
    <div class="progress" style="margin-top: 10px;"><div :style="{ width: progress + '%' }"></div></div>
    <p>进度：{{ progress }}%</p>
  </ModalDialog>

  <ModalDialog v-model="showTip" title="图表说明">
    <p class="tooltip">柱状图展示不同工艺窗口下的合格率预测，右侧为关键指标达成度。</p>
  </ModalDialog>
</template>

<script setup>
import { onUnmounted, reactive, ref } from 'vue'
import ModalDialog from '../components/ModalDialog.vue'

const form = reactive({ grade: '', industry: '', performance: '', shape: '', heat: '', inspection: '' })
const templates = [
  { id: 'STD-01', grade: '20CrNi2Mo', industry: '齿轮', performance: '≥980MPa/12%', heat: '调质', status: '可复用' },
  { id: 'STD-02', grade: '25CrMo4', industry: '石化', performance: '≥930MPa/11%', heat: '正火+回火', status: '更新中' },
  { id: 'STD-03', grade: '30CrNiMo8', industry: '军工', performance: '≥1080MPa/10%', heat: '调质', status: '可复用' },
  { id: 'STD-04', grade: 'GCr15', industry: '轴承', performance: '≥62HRC', heat: '淬火+回火', status: '评审中' },
  { id: 'STD-05', grade: '42CrMo', industry: '工程机械', performance: '≥980MPa/13%', heat: '调质', status: '可复用' },
  { id: 'STD-06', grade: '12Cr2Ni4A', industry: '航天', performance: '≥1080MPa/12%', heat: '渗碳淬火', status: '冻结' },
  { id: 'STD-07', grade: '40CrNiMoA', industry: '船舶', performance: '≥980MPa/11%', heat: '调质', status: '可复用' },
  { id: 'STD-08', grade: 'Q690D', industry: '海工', performance: '≥780MPa/14%', heat: 'TMCP', status: '可复用' },
  { id: 'STD-09', grade: '50CrMo4', industry: '模具', performance: '≥1100MPa/9%', heat: '调质', status: '评审中' },
  { id: 'STD-10', grade: '17-4PH', industry: '航空', performance: '≥1180MPa/10%', heat: '固溶+时效', status: '可复用' }
]

const bars = [
  { label: '冶炼', value: 82, color: '#1f8efa' },
  { label: '锻造', value: 74, color: '#34c6ff' },
  { label: '热处理', value: 91, color: '#4ad991' },
  { label: '检验', value: 67, color: '#ffc22d' }
]

const metrics = [
  { label: '组织均匀性', value: 86 },
  { label: '力学性能达成', value: 92 },
  { label: '尺寸一致性', value: 78 },
  { label: '交付可靠性', value: 83 }
]

const showImport = ref(false)
const showSuggest = ref(false)
const showProgress = ref(false)
const showTip = ref(false)
const progress = ref(12)
let timer

const startReverse = () => {
  showProgress.value = true
  progress.value = 12
  clearInterval(timer)
  timer = setInterval(() => {
    if (progress.value >= 100) {
      clearInterval(timer)
      showProgress.value = false
    } else {
      progress.value += 12
    }
  }, 400)
}

onUnmounted(() => clearInterval(timer))
</script>

<style scoped>
.chart {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
  margin: 12px 0 18px;
}

.bar {
  background: #eef4ff;
  border-radius: 12px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  height: 160px;
  gap: 8px;
}

.bar strong {
  font-size: 18px;
}
</style>
