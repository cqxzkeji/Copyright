<template>
  <div class="page">
    <section class="action-bar">
      <button class="button primary" @click="openModal('register')">版权登记</button>
      <button class="button" @click="openModal('transaction')">版权交易</button>
      <button class="button" @click="openModal('monitor')">侵权监控</button>
      <button class="button" @click="openModal('protection')">保护工具</button>
      <button class="button" @click="openModal('report')">统计报告</button>
      <button class="button ghost" @click="openModal('progress')">处理进度</button>
    </section>

    <section class="grid">
      <div class="card">
        <h3>版权登记类型占比</h3>
        <div class="chart">
          <div v-for="item in typeChart" :key="item.label" class="bar">
            <span>{{ item.label }}</span>
            <div class="bar-track">
              <div class="bar-fill" :style="{ width: item.value + '%' }"></div>
            </div>
            <strong>{{ item.value }}%</strong>
          </div>
        </div>
      </div>
      <div class="card">
        <h3>版权业务提醒</h3>
        <ul class="summary-list">
          <li>待登记作品：{{ summary.pending }} 件</li>
          <li>交易审批：{{ summary.trade }} 件</li>
          <li>侵权告警：{{ summary.alert }} 件</li>
          <li>授权合同：{{ summary.license }} 份</li>
          <li>保护工具执行：{{ summary.tools }} 项</li>
        </ul>
      </div>
    </section>

    <section class="card">
      <div class="table-header">
        <h3>版权资产清单</h3>
        <span>共 {{ records.length }} 条数据</span>
      </div>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>编号</th>
              <th>作品名称</th>
              <th>类别</th>
              <th>权利人</th>
              <th>状态</th>
              <th>授权方式</th>
              <th>保护等级</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="record in records" :key="record.id">
              <td>{{ record.id }}</td>
              <td>{{ record.title }}</td>
              <td>{{ record.type }}</td>
              <td>{{ record.owner }}</td>
              <td>{{ record.status }}</td>
              <td>{{ record.license }}</td>
              <td>{{ record.level }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <ModalDialog :show="modalOpen" :title="modalTitle" @close="closeModal">
      <template v-if="activeModal === 'register'">
        <p>提交作品登记资料，系统将自动生成登记号。</p>
        <div class="form-grid">
          <label>作品名称<input v-model="form.title" /></label>
          <label>作品类型<select v-model="form.type"><option>软件著作权</option><option>音乐作品</option><option>美术作品</option></select></label>
          <label>权利人<input v-model="form.owner" /></label>
          <label>登记地区<select v-model="form.region"><option>中国</option><option>国际</option></select></label>
        </div>
      </template>
      <template v-else-if="activeModal === 'transaction'">
        <p>登记版权交易或授权合同。</p>
        <div class="form-grid">
          <label>交易方<input v-model="form.partner" /></label>
          <label>交易金额<input v-model="form.amount" placeholder="¥" /></label>
          <label>授权方式<select v-model="form.license"><option>独家授权</option><option>非独家授权</option><option>转让</option></select></label>
        </div>
      </template>
      <template v-else-if="activeModal === 'monitor'">
        <p>设置侵权监控关键词并启用自动取证。</p>
        <div class="form-grid">
          <label>监控关键词<input v-model="form.keyword" /></label>
          <label>监控渠道<select v-model="form.channel"><option>电商平台</option><option>短视频</option><option>社交媒体</option></select></label>
          <label>取证频率<select v-model="form.frequency"><option>每日</option><option>每周</option><option>实时</option></select></label>
        </div>
      </template>
      <template v-else-if="activeModal === 'protection'">
        <p>选择版权保护工具并配置服务。</p>
        <div class="form-grid">
          <label>保护工具<select v-model="form.tool"><option>区块链存证</option><option>侵权预警</option><option>快速维权</option></select></label>
          <label>服务等级<select v-model="form.service"><option>标准</option><option>高级</option><option>企业</option></select></label>
        </div>
      </template>
      <template v-else-if="activeModal === 'report'">
        <p>生成版权统计分析报告。</p>
        <div class="form-grid">
          <label>统计周期<select v-model="form.range"><option>近7天</option><option>近30天</option><option>本季度</option></select></label>
          <label>报告格式<select v-model="form.format"><option>PDF</option><option>PPT</option><option>仪表盘</option></select></label>
        </div>
      </template>
      <template v-else-if="activeModal === 'progress'">
        <p>侵权处理任务正在更新中。</p>
        <progress class="progress" :value="progress" max="100"></progress>
        <span>处理完成度：{{ progress }}%</span>
      </template>
      <template #footer>
        <button class="button ghost" type="button" @click="closeModal">取消</button>
        <button class="button primary" type="button" @click="submitModal">确认</button>
      </template>
    </ModalDialog>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import ModalDialog from '../components/ModalDialog.vue'

const records = ref([
  { id: 'CR-001', title: '智信商标管理系统', type: '软件著作权', owner: '智信科技', status: '已登记', license: '独家授权', level: '高' },
  { id: 'CR-002', title: '星河品牌视觉', type: '美术作品', owner: '星河设计', status: '已登记', license: '非独家授权', level: '中' },
  { id: 'CR-003', title: '云端财务引擎', type: '软件著作权', owner: '云端科技', status: '登记中', license: '转让', level: '高' },
  { id: 'CR-004', title: '轻阅音频库', type: '录音制品', owner: '轻阅传媒', status: '已登记', license: '独家授权', level: '高' },
  { id: 'CR-005', title: '梧桐家居图库', type: '摄影作品', owner: '梧桐家居', status: '已登记', license: '非独家授权', level: '低' },
  { id: 'CR-006', title: '澄光品牌形象片', type: '影视作品', owner: '澄光文化', status: '登记中', license: '授权中', level: '中' },
  { id: 'CR-007', title: '星愿设计手册', type: '文字作品', owner: '星愿服饰', status: '已登记', license: '独家授权', level: '中' },
  { id: 'CR-008', title: '蓝帆护理指南', type: '文字作品', owner: '蓝帆医疗', status: '已登记', license: '非独家授权', level: '低' },
  { id: 'CR-009', title: '逸动健身课程', type: '教学课程', owner: '逸动体育', status: '已登记', license: '授权中', level: '高' },
  { id: 'CR-010', title: '山岚旅游路线', type: '地图作品', owner: '山岚旅游', status: '已登记', license: '非独家授权', level: '中' },
  { id: 'CR-011', title: '听澜音频算法', type: '软件著作权', owner: '听澜科技', status: '登记中', license: '独家授权', level: '高' },
  { id: 'CR-012', title: '轻阅阅读字体', type: '美术作品', owner: '轻阅传媒', status: '已登记', license: '非独家授权', level: '中' },
  { id: 'CR-013', title: '安联风险模型', type: '软件著作权', owner: '安联保险', status: '已登记', license: '独家授权', level: '高' },
  { id: 'CR-014', title: '果语包装插画', type: '美术作品', owner: '果语食品', status: '登记中', license: '授权中', level: '中' },
  { id: 'CR-015', title: '映界互动脚本', type: '文字作品', owner: '映界科技', status: '已登记', license: '非独家授权', level: '中' },
  { id: 'CR-016', title: '星澜产品样片', type: '影视作品', owner: '星澜美妆', status: '已登记', license: '独家授权', level: '高' },
  { id: 'CR-017', title: '悦途旅行攻略', type: '文字作品', owner: '悦途文旅', status: '登记中', license: '非独家授权', level: '低' },
  { id: 'CR-018', title: '极智机器人算法', type: '软件著作权', owner: '极智机器人', status: '已登记', license: '转让', level: '高' },
  { id: 'CR-019', title: '清泉品牌音乐', type: '音乐作品', owner: '清泉饮品', status: '已登记', license: '非独家授权', level: '中' },
  { id: 'CR-020', title: '麦田烘焙教学', type: '教学课程', owner: '麦田食品', status: '登记中', license: '授权中', level: '中' },
  { id: 'CR-021', title: '云衡视觉素材', type: '摄影作品', owner: '衡云科技', status: '已登记', license: '非独家授权', level: '低' }
])

const typeChart = [
  { label: '软件著作权', value: 40 },
  { label: '文字作品', value: 20 },
  { label: '美术作品', value: 18 },
  { label: '影视/音频', value: 22 }
]

const summary = {
  pending: 12,
  trade: 6,
  alert: 4,
  license: 9,
  tools: 5
}

const activeModal = ref('')
const modalOpen = computed(() => Boolean(activeModal.value))
const progress = ref(56)

const form = reactive({
  title: '',
  type: '软件著作权',
  owner: '',
  region: '中国',
  partner: '',
  amount: '',
  license: '独家授权',
  keyword: '',
  channel: '电商平台',
  frequency: '每日',
  tool: '区块链存证',
  service: '标准',
  range: '近30天',
  format: 'PDF'
})

const modalTitle = computed(() => {
  const titles = {
    register: '版权登记与查询',
    transaction: '版权交易与授权管理',
    monitor: '版权侵权监控',
    protection: '版权保护工具与服务',
    report: '版权统计与分析报告',
    progress: '侵权处理进度'
  }
  return titles[activeModal.value] || ''
})

const openModal = (type) => {
  activeModal.value = type
}

const closeModal = () => {
  activeModal.value = ''
}

const submitModal = () => {
  if (activeModal.value === 'register' && form.title) {
    records.value.unshift({
      id: `CR-${String(records.value.length + 1).padStart(3, '0')}`,
      title: form.title,
      type: form.type,
      owner: form.owner || '未填写',
      status: '登记中',
      license: '授权中',
      level: '中'
    })
  }
  if (activeModal.value === 'progress') {
    progress.value = Math.min(progress.value + 15, 100)
  }
  closeModal()
}
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.action-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.button {
  border: none;
  padding: 10px 16px;
  border-radius: 10px;
  background: #e2e8f0;
  color: #1f2937;
  cursor: pointer;
}

.button.primary {
  background: #4f46e5;
  color: #fff;
}

.button.ghost {
  background: #dbeafe;
  color: #1d4ed8;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.card {
  background: #ffffff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.06);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.chart {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.bar {
  display: grid;
  grid-template-columns: 90px 1fr 60px;
  align-items: center;
  gap: 12px;
  font-size: 13px;
}

.bar-track {
  background: #e2e8f0;
  border-radius: 999px;
  height: 10px;
}

.bar-fill {
  height: 10px;
  border-radius: 999px;
  background: linear-gradient(90deg, #34d399, #10b981);
}

.summary-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 14px;
  color: #334155;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.table-wrapper {
  overflow: auto;
}

th,
 td {
  padding: 12px 10px;
  text-align: left;
  font-size: 13px;
  border-bottom: 1px solid #e2e8f0;
}

th {
  background: #f8fafc;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.form-grid input,
.form-grid select {
  padding: 8px 10px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #f8fafc;
}

.progress {
  width: 100%;
  height: 18px;
}
</style>
