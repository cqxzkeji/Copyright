<template>
  <div class="section-card">
    <div class="section-title">
      <h2>内容生成模块</h2>
      <span class="status-chip">智能草稿在线</span>
    </div>
    <div class="toolbar" style="margin: 10px 0">
      <button @click="openGenerator">生成方案</button>
      <button @click="openGuides">查看提示</button>
      <button @click="openProgress">生成进度</button>
    </div>
    <div class="card-grid">
      <div class="chart-panel">
        <div class="section-title">
          <h3>主题热度</h3>
          <span class="badge">近7天</span>
        </div>
        <div class="chart-bars">
          <div
            v-for="topic in topics"
            :key="topic.name"
            class="chart-bar"
            :style="{ height: `${topic.score * 1.4}px` }"
          ></div>
        </div>
        <div class="flex-row" style="justify-content: space-between; margin-top: 8px; font-size: 12px; color: var(--muted);">
          <span v-for="topic in topics" :key="topic.name">{{ topic.name }}</span>
        </div>
      </div>
      <div class="table-card">
        <div class="section-title">
          <h3>草稿列表</h3>
          <span class="badge">10+草稿</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>标题</th>
              <th>渠道</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="draft in drafts" :key="draft.title">
              <td>{{ draft.title }}</td>
              <td>{{ draft.channel }}</td>
              <td>{{ draft.status }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <ModalDialog :open="showGenerator" title="生成方案" :on-close="() => (showGenerator = false)">
      <div class="label">生成目标</div>
      <input class="input-field" v-model="form.topic" placeholder="输入主题，如新品发布" />
      <div class="label">风格</div>
      <input class="input-field" v-model="form.tone" placeholder="科技感 / 生活化" />
      <div class="modal-actions">
        <button @click="startDraft">提交生成</button>
      </div>
    </ModalDialog>
    <ModalDialog :open="showGuide" title="创作提示" :on-close="() => (showGuide = false)">
      <ul>
        <li>保持场景描述具体，便于模型理解。</li>
        <li>限制字数与语气，让生成更聚焦。</li>
        <li>在生成后使用改写按钮快速微调。</li>
      </ul>
      <div class="modal-actions">
        <button @click="showGuide = false">关闭</button>
      </div>
    </ModalDialog>
    <ModalDialog :open="showProgress" title="生成进度" :on-close="() => (showProgress = false)">
      <p>实时渲染草稿中，请稍候...</p>
      <div class="progress-bar">
        <div class="progress-inner" :style="{ width: `${progress}%` }"></div>
      </div>
      <div class="modal-actions">
        <button @click="increaseProgress">刷新进度</button>
      </div>
    </ModalDialog>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import ModalDialog from '../components/ModalDialog.vue'

const topics = [
  { name: 'AI 创作', score: 90 },
  { name: '营销文案', score: 76 },
  { name: '教育培训', score: 68 },
  { name: '产品上新', score: 82 },
  { name: '企业报道', score: 74 },
  { name: '数据洞察', score: 60 },
  { name: '社区互动', score: 58 }
]

const drafts = [
  { title: 'AI助手发布稿', channel: '官网', status: '待审阅' },
  { title: '新品短文案', channel: '短视频', status: '已导出' },
  { title: '教育招生海报文案', channel: '社群', status: '草稿' },
  { title: '行业白皮书摘要', channel: '邮件', status: '排队中' },
  { title: '客户案例集锦', channel: '网站', status: '已发布' },
  { title: '创始人访谈提纲', channel: '播客', status: '草稿' },
  { title: '增长周报标题', channel: '飞书', status: '排队中' },
  { title: '产品FAQ优化', channel: '客服', status: '已导出' },
  { title: '线下沙龙邀请函', channel: '邮件', status: '草稿' },
  { title: '用户调研问卷文案', channel: '站内信', status: '待审阅' }
]

const form = reactive({ topic: '', tone: '' })
const showGenerator = ref(false)
const showGuide = ref(false)
const showProgress = ref(false)
const progress = ref(35)

const openGenerator = () => {
  showGenerator.value = true
}

const openGuides = () => {
  showGuide.value = true
}

const openProgress = () => {
  showProgress.value = true
}

const startDraft = () => {
  progress.value = 45
  showGenerator.value = false
  showProgress.value = true
}

const increaseProgress = () => {
  progress.value = Math.min(100, progress.value + 20)
}
</script>
