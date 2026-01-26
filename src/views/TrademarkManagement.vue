<template>
  <div class="page">
    <section class="action-bar">
      <button class="button primary" @click="openModal('register')">商标注册</button>
      <button class="button" @click="openModal('query')">商标查询</button>
      <button class="button" @click="openModal('monitor')">有效性监控</button>
      <button class="button" @click="openModal('license')">授权与许可</button>
      <button class="button" @click="openModal('report')">生成报告</button>
      <button class="button ghost" @click="openModal('progress')">进度追踪</button>
    </section>

    <section class="grid">
      <div class="card">
        <h3>商标状态分布</h3>
        <div class="chart">
          <div
            v-for="item in statusChart"
            :key="item.label"
            class="bar"
          >
            <span>{{ item.label }}</span>
            <div class="bar-track">
              <div class="bar-fill" :style="{ width: item.value + '%' }"></div>
            </div>
            <strong>{{ item.value }}%</strong>
          </div>
        </div>
      </div>
      <div class="card">
        <h3>今日处理概览</h3>
        <ul class="summary-list">
          <li>新提交注册：{{ summary.newApply }} 项</li>
          <li>待续展提醒：{{ summary.renewal }} 项</li>
          <li>风险争议：{{ summary.risk }} 项</li>
          <li>许可合同待签：{{ summary.contract }} 项</li>
          <li>监控预警：{{ summary.alert }} 项</li>
        </ul>
      </div>
    </section>

    <section class="card">
      <div class="table-header">
        <h3>商标数据清单</h3>
        <span>共 {{ trademarkRecords.length }} 条数据</span>
      </div>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>编号</th>
              <th>商标名称</th>
              <th>类别</th>
              <th>申请人</th>
              <th>状态</th>
              <th>到期日</th>
              <th>风险等级</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="record in trademarkRecords" :key="record.id">
              <td>{{ record.id }}</td>
              <td>{{ record.name }}</td>
              <td>{{ record.type }}</td>
              <td>{{ record.owner }}</td>
              <td>{{ record.status }}</td>
              <td>{{ record.expire }}</td>
              <td>{{ record.risk }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <ModalDialog :show="modalOpen" :title="modalTitle" @close="closeModal">
      <template v-if="activeModal === 'register'">
        <p>请填写商标注册信息，系统将自动生成提交材料。</p>
        <div class="form-grid">
          <label>商标名称<input v-model="form.name" /></label>
          <label>分类<select v-model="form.type"><option>服装类</option><option>科技类</option><option>食品类</option></select></label>
          <label>申请人<input v-model="form.owner" /></label>
          <label>申请地区<select v-model="form.region"><option>中国</option><option>欧盟</option><option>美国</option></select></label>
        </div>
      </template>
      <template v-else-if="activeModal === 'query'">
        <p>输入商标关键词或注册号进行查询。</p>
        <div class="form-grid">
          <label>查询条件<input v-model="form.keyword" placeholder="商标名称/注册号" /></label>
          <label>状态<select v-model="form.status"><option>全部</option><option>已注册</option><option>待审</option></select></label>
        </div>
      </template>
      <template v-else-if="activeModal === 'monitor'">
        <p>设置监控范围与预警策略。</p>
        <div class="form-grid">
          <label>监控商标<input v-model="form.monitorName" /></label>
          <label>预警频率<select v-model="form.frequency"><option>每日</option><option>每周</option><option>每月</option></select></label>
          <label>通知方式<select v-model="form.notify"><option>邮件</option><option>短信</option><option>企业微信</option></select></label>
        </div>
      </template>
      <template v-else-if="activeModal === 'license'">
        <p>登记授权与许可信息，并生成合同编号。</p>
        <div class="form-grid">
          <label>被许可方<input v-model="form.licensee" /></label>
          <label>许可类型<select v-model="form.licenseType"><option>独占许可</option><option>排他许可</option><option>普通许可</option></select></label>
          <label>有效期<input v-model="form.licensePeriod" placeholder="2024-2027" /></label>
        </div>
      </template>
      <template v-else-if="activeModal === 'report'">
        <p>生成商标数据报告并导出。</p>
        <div class="form-grid">
          <label>报告周期<select v-model="form.reportRange"><option>近30天</option><option>本季度</option><option>本年度</option></select></label>
          <label>输出格式<select v-model="form.format"><option>PDF</option><option>Excel</option><option>在线浏览</option></select></label>
        </div>
      </template>
      <template v-else-if="activeModal === 'progress'">
        <p>正在同步商标监控任务进度。</p>
        <progress class="progress" :value="progress" max="100"></progress>
        <span>当前进度：{{ progress }}%</span>
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

const trademarkRecords = ref([
  { id: 'TM-001', name: '智信云标', type: '科技类', owner: '智信科技', status: '已注册', expire: '2028-06-30', risk: '低' },
  { id: 'TM-002', name: '慧知标', type: '教育类', owner: '智信学院', status: '待审', expire: '2027-02-10', risk: '中' },
  { id: 'TM-003', name: '星河链', type: '金融类', owner: '星河资本', status: '已注册', expire: '2029-09-18', risk: '低' },
  { id: 'TM-004', name: '云衡', type: '科技类', owner: '衡云科技', status: '异议处理中', expire: '2026-12-08', risk: '高' },
  { id: 'TM-005', name: '蓝帆', type: '医疗类', owner: '蓝帆医疗', status: '已注册', expire: '2028-11-22', risk: '低' },
  { id: 'TM-006', name: '澄光', type: '文创类', owner: '澄光文化', status: '续展中', expire: '2025-04-15', risk: '中' },
  { id: 'TM-007', name: '星愿', type: '服装类', owner: '星愿服饰', status: '已注册', expire: '2030-03-05', risk: '低' },
  { id: 'TM-008', name: '麦田', type: '食品类', owner: '麦田食品', status: '待审', expire: '2027-07-30', risk: '中' },
  { id: 'TM-009', name: '逸动', type: '运动类', owner: '逸动体育', status: '已注册', expire: '2029-01-11', risk: '低' },
  { id: 'TM-010', name: '山岚', type: '旅游类', owner: '山岚旅游', status: '驳回复审', expire: '2026-08-14', risk: '高' },
  { id: 'TM-011', name: '听澜', type: '音频类', owner: '听澜科技', status: '已注册', expire: '2029-12-01', risk: '低' },
  { id: 'TM-012', name: '轻阅', type: '媒体类', owner: '轻阅传媒', status: '已注册', expire: '2031-05-20', risk: '低' },
  { id: 'TM-013', name: '安联', type: '保险类', owner: '安联保险', status: '异议处理中', expire: '2027-10-06', risk: '高' },
  { id: 'TM-014', name: '梧桐', type: '家具类', owner: '梧桐家居', status: '续展中', expire: '2025-11-03', risk: '中' },
  { id: 'TM-015', name: '飞驰', type: '交通类', owner: '飞驰出行', status: '已注册', expire: '2028-09-12', risk: '低' },
  { id: 'TM-016', name: '果语', type: '食品类', owner: '果语食品', status: '待审', expire: '2027-03-19', risk: '中' },
  { id: 'TM-017', name: '映界', type: '娱乐类', owner: '映界科技', status: '已注册', expire: '2029-07-28', risk: '低' },
  { id: 'TM-018', name: '星澜', type: '化妆品', owner: '星澜美妆', status: '已注册', expire: '2030-02-21', risk: '低' },
  { id: 'TM-019', name: '悦途', type: '旅游类', owner: '悦途文旅', status: '待审', expire: '2027-06-02', risk: '中' },
  { id: 'TM-020', name: '极智', type: '科技类', owner: '极智机器人', status: '已注册', expire: '2029-04-13', risk: '低' },
  { id: 'TM-021', name: '清泉', type: '饮品类', owner: '清泉饮品', status: '续展中', expire: '2025-09-08', risk: '中' }
])

const statusChart = [
  { label: '已注册', value: 48 },
  { label: '待审', value: 22 },
  { label: '续展中', value: 15 },
  { label: '异议/复审', value: 15 }
]

const summary = {
  newApply: 18,
  renewal: 9,
  risk: 4,
  contract: 6,
  alert: 12
}

const activeModal = ref('')
const modalOpen = computed(() => Boolean(activeModal.value))
const progress = ref(62)

const form = reactive({
  name: '',
  type: '科技类',
  owner: '',
  region: '中国',
  keyword: '',
  status: '全部',
  monitorName: '',
  frequency: '每日',
  notify: '邮件',
  licensee: '',
  licenseType: '独占许可',
  licensePeriod: '',
  reportRange: '近30天',
  format: 'PDF'
})

const modalTitle = computed(() => {
  const titles = {
    register: '商标注册与提交',
    query: '商标注册查询',
    monitor: '商标有效性监控设置',
    license: '商标授权与许可登记',
    report: '商标数据报告生成',
    progress: '商标任务进度'
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
  if (activeModal.value === 'register' && form.name) {
    trademarkRecords.value.unshift({
      id: `TM-${String(trademarkRecords.value.length + 1).padStart(3, '0')}`,
      name: form.name,
      type: form.type,
      owner: form.owner || '未填写',
      status: '待审',
      expire: '2030-12-31',
      risk: '中'
    })
  }
  if (activeModal.value === 'progress') {
    progress.value = Math.min(progress.value + 12, 100)
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
  grid-template-columns: 80px 1fr 60px;
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
  background: linear-gradient(90deg, #60a5fa, #4f46e5);
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
