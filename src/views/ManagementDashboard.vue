<template>
  <div class="section-card">
    <div class="section-title">
      <h2>管理后台模块</h2>
      <span class="status-chip">多角色</span>
    </div>
    <div class="toolbar" style="margin: 10px 0">
      <button @click="showRole = true">分配角色</button>
      <button @click="showAudit = true">查看审计</button>
      <button @click="showNotice = true">发布公告</button>
    </div>
    <div class="card-grid">
      <div class="chart-panel">
        <div class="section-title">
          <h3>模块使用频率</h3>
          <span class="badge">本月</span>
        </div>
        <div class="chart-bars">
          <div
            v-for="item in usage"
            :key="item.name"
            class="chart-bar"
            :style="{ height: `${item.count * 1.5}px` }"
          ></div>
        </div>
        <div class="flex-row" style="justify-content: space-between; margin-top: 8px; font-size: 12px; color: var(--muted);">
          <span v-for="item in usage" :key="item.name">{{ item.name }}</span>
        </div>
      </div>
      <div class="table-card">
        <div class="section-title">
          <h3>成员列表</h3>
          <span class="badge">10+人</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>成员</th>
              <th>部门</th>
              <th>权限</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="member in members" :key="member.name">
              <td>{{ member.name }}</td>
              <td>{{ member.team }}</td>
              <td>{{ member.role }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <ModalDialog :open="showRole" title="分配角色" :on-close="() => (showRole = false)">
      <div class="label">成员</div>
      <input class="input-field" v-model="assign.name" placeholder="输入成员姓名" />
      <div class="label">角色</div>
      <input class="input-field" v-model="assign.role" placeholder="管理员 / 编辑 / 访客" />
      <div class="modal-actions">
        <button @click="saveRole">保存</button>
      </div>
    </ModalDialog>
    <ModalDialog :open="showAudit" title="审计日志" :on-close="() => (showAudit = false)">
      <p>最近十条关键操作已生成审计记录。</p>
      <div class="progress-bar">
        <div class="progress-inner" :style="{ width: `${auditProgress}%` }"></div>
      </div>
      <div class="modal-actions">
        <button @click="auditProgress = Math.min(100, auditProgress + 15)">加载更多</button>
      </div>
    </ModalDialog>
    <ModalDialog :open="showNotice" title="公告发布" :on-close="() => (showNotice = false)">
      <div class="label">公告标题</div>
      <input class="input-field" v-model="notice.title" placeholder="例：版本更新" />
      <div class="label">公告内容</div>
      <textarea class="input-field" rows="3" v-model="notice.content" placeholder="输入内容"></textarea>
      <div class="modal-actions">
        <button @click="publishNotice">发布</button>
      </div>
    </ModalDialog>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import ModalDialog from '../components/ModalDialog.vue'

const usage = [
  { name: '内容', count: 64 },
  { name: '分析', count: 58 },
  { name: '训练', count: 46 },
  { name: '交互', count: 52 },
  { name: '管理', count: 71 },
  { name: '审计', count: 43 },
  { name: '通知', count: 55 }
]

const members = [
  { name: '李华', team: '产品', role: '管理员' },
  { name: '王敏', team: '运营', role: '编辑' },
  { name: '赵强', team: '研发', role: '访客' },
  { name: '陈冰', team: '设计', role: '编辑' },
  { name: '刘洋', team: '数据', role: '管理员' },
  { name: '张伟', team: '销售', role: '访客' },
  { name: '孙悦', team: '市场', role: '编辑' },
  { name: '周琪', team: '市场', role: '管理员' },
  { name: '韩梅', team: '法务', role: '访客' },
  { name: '郭峰', team: '客服', role: '编辑' }
]

const assign = reactive({ name: '', role: '' })
const notice = reactive({ title: '', content: '' })
const showRole = ref(false)
const showAudit = ref(false)
const showNotice = ref(false)
const auditProgress = ref(65)

const saveRole = () => {
  showRole.value = false
  auditProgress.value = 80
}

const publishNotice = () => {
  showNotice.value = false
  showAudit.value = true
  auditProgress.value = 100
}
</script>
