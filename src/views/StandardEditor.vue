<template>
  <div class="grid" style="grid-template-columns: 1fr 1fr; align-items: start;">
    <div class="card">
      <div class="flex-between">
        <h3>技术标准编辑与调优</h3>
        <div class="chip-row">
          <button class="secondary" @click="showTemplate = true">应用模板</button>
          <button @click="showDraft = true">保存草稿</button>
          <button @click="publish">发布标准</button>
        </div>
      </div>
      <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 12px;">
        <label>标准名称 <input v-model="editor.title" placeholder="示例：20CrNi2Mo 车轴齿轮" /></label>
        <label>版本号 <input v-model="editor.version" placeholder="V1.2.0" /></label>
        <label>适用范围 <input v-model="editor.scope" placeholder="齿轮、轴类部件" /></label>
        <label>引用标准 <input v-model="editor.reference" placeholder="EN10277 / GB3077" /></label>
      </div>
      <label style="margin-top: 10px; display: block;">工艺说明 <textarea rows="4" v-model="editor.process" placeholder="描述热处理、锻造和检验重点"></textarea></label>
      <label style="margin-top: 10px; display: block;">质量门槛 <textarea rows="3" v-model="editor.threshold" placeholder="力学性能、洁净度、尺寸偏差等"></textarea></label>
      <div class="table-card" style="margin-top: 12px;">
        <div class="flex-between">
          <h4>规则明细</h4>
          <span class="tooltip">可编辑字段自动校验</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>序号</th><th>字段</th><th>要求</th><th>上限</th><th>下限</th><th>责任人</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="rule in rules" :key="rule.id">
              <td>{{ rule.id }}</td>
              <td>{{ rule.field }}</td>
              <td>{{ rule.target }}</td>
              <td>{{ rule.max }}</td>
              <td>{{ rule.min }}</td>
              <td>{{ rule.owner }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="card">
      <div class="flex-between">
        <h3>调优提示</h3>
        <button class="secondary" @click="showInsight = true">查看细节</button>
      </div>
      <p class="tooltip">AI 分析历史偏差，给出可落地的调优项。</p>
      <ul>
        <li>建议将渗碳温度上限从 940℃ 降至 930℃，可降低晶粒长大概率 6%</li>
        <li>针对回火脆性，增加一次 580℃ / 1h 快速回火</li>
        <li>检测阶段新增超声扫描 100% 覆盖率</li>
      </ul>
      <div class="table-card" style="margin-top: 14px;">
        <div class="flex-between">
          <h4>版本追踪</h4>
          <span class="badge">记录不少于10条</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>版本</th><th>变更点</th><th>提交人</th><th>状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in history" :key="item.version">
              <td>{{ item.version }}</td>
              <td>{{ item.change }}</td>
              <td>{{ item.author }}</td>
              <td>{{ item.status }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <ModalDialog v-model="showTemplate" title="选择模板" show-actions @confirm="showTemplate = false">
    <p class="tooltip">应用模板后会自动填充默认规则。</p>
    <select>
      <option>齿轮钢通用模板</option>
      <option>轴承钢深淬模板</option>
      <option>海工用钢耐蚀模板</option>
      <option>模具钢高韧模板</option>
    </select>
  </ModalDialog>

  <ModalDialog v-model="showDraft" title="保存草稿" show-actions @confirm="showDraft = false">
    <label>草稿名称 <input placeholder="例如：V1.2 车轴齿轮草稿" /></label>
    <label style="margin-top: 8px;">备注 <textarea rows="3" placeholder="输入调整思路"></textarea></label>
  </ModalDialog>

  <ModalDialog v-model="showPublish" title="发布中">
    <p class="tooltip">正在校验字段并推送给各车间...</p>
    <div class="progress" style="margin-top: 8px;"><div :style="{ width: publishProgress + '%' }"></div></div>
    <p>进度：{{ publishProgress }}%</p>
  </ModalDialog>

  <ModalDialog v-model="showInsight" title="详细调优建议">
    <ol>
      <li>锻造终锻温度建议控制 880℃，以减小残余应力</li>
      <li>正火后延长空冷时间 8 分钟，以均匀奥氏体晶粒</li>
      <li>检测项增加金相评级，避免夹杂物偏差</li>
    </ol>
  </ModalDialog>
</template>

<script setup>
import { onUnmounted, reactive, ref } from 'vue'
import ModalDialog from '../components/ModalDialog.vue'

const editor = reactive({
  title: '',
  version: 'V1.2.0',
  scope: '',
  reference: '',
  process: '',
  threshold: ''
})

const rules = [
  { id: 1, field: '抗拉强度', target: '≥980MPa', max: '1100', min: '980', owner: '陈工' },
  { id: 2, field: '屈服强度', target: '≥850MPa', max: '1000', min: '850', owner: '陈工' },
  { id: 3, field: '延伸率', target: '≥12%', max: '16%', min: '12%', owner: '黄威' },
  { id: 4, field: '冲击值', target: '≥55J(-40℃)', max: '70', min: '55', owner: '周勇' },
  { id: 5, field: '硬度', target: '30-36HRC', max: '36', min: '30', owner: '周勇' },
  { id: 6, field: '洁净度', target: 'A/B/C/D≤1.5', max: '1.5', min: '0', owner: '李静' },
  { id: 7, field: '晶粒度', target: '7-9级', max: '9', min: '7', owner: '李静' },
  { id: 8, field: '尺寸偏差', target: '±0.25mm', max: '+0.25', min: '-0.25', owner: '王璐' },
  { id: 9, field: '探伤等级', target: 'UT 3级', max: '3级', min: '3级', owner: '王璐' },
  { id: 10, field: '脱碳层', target: '≤0.15mm', max: '0.15', min: '0', owner: '林浩' }
]

const history = [
  { version: 'V1.2.0', change: '新增洁净度要求', author: '陈工', status: '待审核' },
  { version: 'V1.1.2', change: '回火温度优化', author: '王璐', status: '已发布' },
  { version: 'V1.1.1', change: '补充探伤等级', author: '周勇', status: '已发布' },
  { version: 'V1.1.0', change: '增加空冷时长', author: '周勇', status: '已发布' },
  { version: 'V1.0.9', change: '调整锻比要求', author: '陈工', status: '已发布' },
  { version: 'V1.0.8', change: '力学性能微调', author: '李静', status: '已发布' },
  { version: 'V1.0.7', change: '增补尺寸偏差', author: '李静', status: '已发布' },
  { version: 'V1.0.6', change: '优化渗碳工艺', author: '林浩', status: '已发布' },
  { version: 'V1.0.5', change: '增加硬度上限', author: '黄威', status: '已发布' },
  { version: 'V1.0.4', change: '补充范围说明', author: '王璐', status: '已发布' }
]

const showTemplate = ref(false)
const showDraft = ref(false)
const showPublish = ref(false)
const showInsight = ref(false)
const publishProgress = ref(20)
let publishTimer

const publish = () => {
  showPublish.value = true
  publishProgress.value = 20
  clearInterval(publishTimer)
  publishTimer = setInterval(() => {
    if (publishProgress.value >= 100) {
      showPublish.value = false
      clearInterval(publishTimer)
    } else {
      publishProgress.value += 16
    }
  }, 450)
}

onUnmounted(() => clearInterval(publishTimer))
</script>
