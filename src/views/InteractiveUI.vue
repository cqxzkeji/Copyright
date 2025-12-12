<template>
  <div class="section-card">
    <div class="section-title">
      <h2>交互式 UI 模块</h2>
      <span class="status-chip">实时反馈</span>
    </div>
    <div class="toolbar" style="margin: 10px 0">
      <button @click="showPrototype = true">预览原型</button>
      <button @click="showFeedback = true">收集反馈</button>
      <button @click="showGuide = true">交互提示</button>
    </div>
    <div class="card-grid">
      <div class="chart-panel">
        <div class="section-title">
          <h3>交互路径完成度</h3>
          <span class="badge">实时</span>
        </div>
        <div class="chart-bars">
          <div
            v-for="item in flows"
            :key="item.name"
            class="chart-bar"
            :style="{ height: `${item.completion * 1.8}px` }"
          ></div>
        </div>
        <div class="flex-row" style="justify-content: space-between; margin-top: 8px; font-size: 12px; color: var(--muted);">
          <span v-for="item in flows" :key="item.name">{{ item.name }}</span>
        </div>
      </div>
      <div class="table-card">
        <div class="section-title">
          <h3>体验问题清单</h3>
          <span class="badge">10+项</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>问题</th>
              <th>位置</th>
              <th>优先级</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="issue in issues" :key="issue.title">
              <td>{{ issue.title }}</td>
              <td>{{ issue.place }}</td>
              <td>{{ issue.priority }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <ModalDialog :open="showPrototype" title="原型预览" :on-close="() => (showPrototype = false)">
      <p>原型加载完成，可以在弹窗内滚动查看关键交互。</p>
      <div class="progress-bar">
        <div class="progress-inner" :style="{ width: `${prototypeProgress}%` }"></div>
      </div>
      <div class="modal-actions">
        <button @click="prototypeProgress = Math.min(100, prototypeProgress + 20)">刷新帧</button>
      </div>
    </ModalDialog>
    <ModalDialog :open="showFeedback" title="反馈表单" :on-close="() => (showFeedback = false)">
      <div class="label">反馈内容</div>
      <textarea class="input-field" rows="3" v-model="feedback" placeholder="描述交互体验"></textarea>
      <div class="modal-actions">
        <button @click="submitFeedback">提交反馈</button>
      </div>
    </ModalDialog>
    <ModalDialog :open="showGuide" title="交互提示" :on-close="() => (showGuide = false)">
      <ul>
        <li>保持按钮区分度，使用主要与次要样式。</li>
        <li>重要操作必须二次确认，避免误触。</li>
        <li>在移动端使用底部标签栏承载高频操作。</li>
      </ul>
      <div class="modal-actions">
        <button @click="showGuide = false">关闭</button>
      </div>
    </ModalDialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ModalDialog from '../components/ModalDialog.vue'

const flows = [
  { name: '注册', completion: 82 },
  { name: '引导', completion: 74 },
  { name: '工作台', completion: 63 },
  { name: '搜索', completion: 70 },
  { name: '收藏', completion: 58 },
  { name: '分享', completion: 65 },
  { name: '设置', completion: 76 }
]

const issues = [
  { title: '按钮文字过长', place: '内容页 CTA', priority: '中' },
  { title: '转场动画延迟', place: '模块切换', priority: '高' },
  { title: '表格在移动端拥挤', place: '数据分析卡片', priority: '高' },
  { title: '提示信息不明显', place: '训练页浮层', priority: '中' },
  { title: '导航缺少返回', place: '管理后台', priority: '高' },
  { title: '输入框对齐问题', place: '登录页', priority: '低' },
  { title: '进度条没有标签', place: '生成页', priority: '中' },
  { title: '弹窗遮罩透明度高', place: '全局', priority: '低' },
  { title: '卡片阴影过重', place: '仪表盘', priority: '低' },
  { title: '图表缺少对比色', place: '数据分析', priority: '中' }
]

const showPrototype = ref(false)
const showFeedback = ref(false)
const showGuide = ref(false)
const prototypeProgress = ref(55)
const feedback = ref('')

const submitFeedback = () => {
  showFeedback.value = false
  prototypeProgress.value = 90
}
</script>
