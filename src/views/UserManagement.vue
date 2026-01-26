<template>
  <div class="page">
    <section class="action-bar">
      <button class="button primary" @click="openModal('role')">角色与权限管理</button>
      <button class="button" @click="openModal('behavior')">用户行为追踪</button>
      <button class="button" @click="openModal('access')">访问控制设置</button>
      <button class="button" @click="openModal('multi')">多级权限分配</button>
      <button class="button" @click="openModal('audit')">审计日志管理</button>
      <button class="button ghost" @click="openModal('progress')">执行进度</button>
    </section>

    <section class="grid">
      <div class="card">
        <h3>角色数量分布</h3>
        <div class="chart">
          <div v-for="item in roleChart" :key="item.label" class="bar">
            <span>{{ item.label }}</span>
            <div class="bar-track">
              <div class="bar-fill" :style="{ width: item.value + '%' }"></div>
            </div>
            <strong>{{ item.value }}%</strong>
          </div>
        </div>
      </div>
      <div class="card">
        <h3>安全运营概览</h3>
        <ul class="summary-list">
          <li>活跃用户：{{ summary.active }} 人</li>
          <li>异常访问：{{ summary.anomaly }} 次</li>
          <li>待审批权限：{{ summary.pending }} 项</li>
          <li>今日审计日志：{{ summary.logs }} 条</li>
          <li>高危权限账号：{{ summary.highRisk }} 个</li>
        </ul>
      </div>
    </section>

    <section class="card">
      <div class="table-header">
        <h3>用户与权限清单</h3>
        <span>共 {{ users.length }} 条数据</span>
      </div>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>用户编号</th>
              <th>姓名</th>
              <th>角色</th>
              <th>最近登录</th>
              <th>访问级别</th>
              <th>状态</th>
              <th>审计标签</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td>{{ user.id }}</td>
              <td>{{ user.name }}</td>
              <td>{{ user.role }}</td>
              <td>{{ user.lastLogin }}</td>
              <td>{{ user.level }}</td>
              <td>{{ user.status }}</td>
              <td>{{ user.audit }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <ModalDialog :show="modalOpen" :title="modalTitle" @close="closeModal">
      <template v-if="activeModal === 'role'">
        <p>设置用户角色与权限范围。</p>
        <div class="form-grid">
          <label>角色名称<input v-model="form.role" /></label>
          <label>权限级别<select v-model="form.level"><option>标准</option><option>高级</option><option>管理员</option></select></label>
          <label>可访问模块<select v-model="form.modules"><option>全模块</option><option>商标+版权</option><option>分析+配置</option></select></label>
        </div>
      </template>
      <template v-else-if="activeModal === 'behavior'">
        <p>筛选用户行为记录，支持导出。</p>
        <div class="form-grid">
          <label>用户姓名<input v-model="form.user" /></label>
          <label>行为类型<select v-model="form.action"><option>登录</option><option>导出报告</option><option>修改权限</option></select></label>
          <label>时间范围<select v-model="form.range"><option>今日</option><option>近7天</option><option>近30天</option></select></label>
        </div>
      </template>
      <template v-else-if="activeModal === 'access'">
        <p>配置访问控制与安全设置。</p>
        <div class="form-grid">
          <label>登录策略<select v-model="form.policy"><option>双因素认证</option><option>短信验证码</option><option>动态口令</option></select></label>
          <label>IP 白名单<input v-model="form.ip" placeholder="192.168.1.0/24" /></label>
          <label>安全级别<select v-model="form.security"><option>普通</option><option>严格</option><option>最高</option></select></label>
        </div>
      </template>
      <template v-else-if="activeModal === 'multi'">
        <p>设置多级权限审批流程。</p>
        <div class="form-grid">
          <label>审批层级<select v-model="form.layers"><option>两级</option><option>三级</option><option>四级</option></select></label>
          <label>审批角色<input v-model="form.approver" placeholder="负责人/主管" /></label>
          <label>触发条件<select v-model="form.trigger"><option>高危操作</option><option>数据导出</option><option>权限变更</option></select></label>
        </div>
      </template>
      <template v-else-if="activeModal === 'audit'">
        <p>审计日志归档与导出设置。</p>
        <div class="form-grid">
          <label>日志保存期限<select v-model="form.retention"><option>6个月</option><option>1年</option><option>3年</option></select></label>
          <label>导出格式<select v-model="form.format"><option>CSV</option><option>PDF</option><option>JSON</option></select></label>
        </div>
      </template>
      <template v-else-if="activeModal === 'progress'">
        <p>权限调整与审计任务正在更新。</p>
        <progress class="progress" :value="progress" max="100"></progress>
        <span>完成度：{{ progress }}%</span>
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

const users = ref([
  { id: 'U-001', name: '李晴', role: '管理员', lastLogin: '10:45', level: 'L5', status: '在线', audit: '高危' },
  { id: 'U-002', name: '王晨', role: '审核员', lastLogin: '09:20', level: 'L4', status: '在线', audit: '关注' },
  { id: 'U-003', name: '张宁', role: '运营', lastLogin: '08:55', level: 'L3', status: '离线', audit: '正常' },
  { id: 'U-004', name: '陈雨', role: '分析师', lastLogin: '昨日 19:32', level: 'L3', status: '离线', audit: '正常' },
  { id: 'U-005', name: '周峰', role: '审核员', lastLogin: '昨日 18:12', level: 'L4', status: '在线', audit: '关注' },
  { id: 'U-006', name: '刘欣', role: '管理员', lastLogin: '昨日 17:40', level: 'L5', status: '在线', audit: '高危' },
  { id: 'U-007', name: '杨哲', role: '运营', lastLogin: '昨日 16:10', level: 'L3', status: '离线', audit: '正常' },
  { id: 'U-008', name: '孙晴', role: '审计', lastLogin: '昨日 15:25', level: 'L4', status: '在线', audit: '关注' },
  { id: 'U-009', name: '黄杰', role: '分析师', lastLogin: '昨日 14:50', level: 'L3', status: '离线', audit: '正常' },
  { id: 'U-010', name: '宋琳', role: '运营', lastLogin: '昨日 14:20', level: 'L2', status: '在线', audit: '正常' },
  { id: 'U-011', name: '郑浩', role: '审核员', lastLogin: '昨日 13:10', level: 'L4', status: '在线', audit: '关注' },
  { id: 'U-012', name: '潘蕾', role: '管理员', lastLogin: '昨日 12:58', level: 'L5', status: '离线', audit: '高危' },
  { id: 'U-013', name: '鲁星', role: '运营', lastLogin: '昨日 11:40', level: 'L2', status: '在线', audit: '正常' },
  { id: 'U-014', name: '彭珊', role: '审计', lastLogin: '昨日 11:05', level: 'L4', status: '在线', audit: '关注' },
  { id: 'U-015', name: '魏东', role: '审核员', lastLogin: '昨日 10:30', level: 'L4', status: '离线', audit: '关注' },
  { id: 'U-016', name: '陆瑶', role: '分析师', lastLogin: '昨日 09:50', level: 'L3', status: '在线', audit: '正常' },
  { id: 'U-017', name: '侯静', role: '运营', lastLogin: '昨日 09:10', level: 'L2', status: '离线', audit: '正常' },
  { id: 'U-018', name: '杜晨', role: '管理员', lastLogin: '昨日 08:30', level: 'L5', status: '在线', audit: '高危' },
  { id: 'U-019', name: '邓豪', role: '审计', lastLogin: '昨日 08:10', level: 'L4', status: '离线', audit: '关注' },
  { id: 'U-020', name: '白雪', role: '运营', lastLogin: '昨日 07:50', level: 'L2', status: '离线', audit: '正常' },
  { id: 'U-021', name: '顾航', role: '分析师', lastLogin: '昨日 07:35', level: 'L3', status: '离线', audit: '正常' }
])

const roleChart = [
  { label: '管理员', value: 25 },
  { label: '审核员', value: 30 },
  { label: '运营', value: 28 },
  { label: '审计', value: 17 }
]

const summary = {
  active: 86,
  anomaly: 3,
  pending: 7,
  logs: 126,
  highRisk: 4
}

const activeModal = ref('')
const modalOpen = computed(() => Boolean(activeModal.value))
const progress = ref(48)

const form = reactive({
  role: '',
  level: '标准',
  modules: '全模块',
  user: '',
  action: '登录',
  range: '近7天',
  policy: '双因素认证',
  ip: '',
  security: '严格',
  layers: '两级',
  approver: '',
  trigger: '高危操作',
  retention: '1年',
  format: 'CSV'
})

const modalTitle = computed(() => {
  const titles = {
    role: '用户角色与权限管理',
    behavior: '用户行为追踪',
    access: '访问控制与安全设置',
    multi: '多级权限分配',
    audit: '审计与日志管理',
    progress: '权限流程进度'
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
  if (activeModal.value === 'role' && form.role) {
    users.value.unshift({
      id: `U-${String(users.value.length + 1).padStart(3, '0')}`,
      name: '新用户',
      role: form.role,
      lastLogin: '刚刚',
      level: form.level === '管理员' ? 'L5' : 'L3',
      status: '在线',
      audit: '关注'
    })
  }
  if (activeModal.value === 'progress') {
    progress.value = Math.min(progress.value + 10, 100)
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
  background: linear-gradient(90deg, #f472b6, #ec4899);
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
