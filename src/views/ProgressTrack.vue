<template>
  <div class="card-grid">
    <section class="card">
      <h2>个性化进度跟踪</h2>
      <p>综合评估动作表现，提供针对性训练建议。</p>
      <div class="chart" style="margin-top: 12px;">
        <div
          v-for="(value, index) in trend"
          :key="index"
          class="chart-bar"
          :style="{ height: `${value}%` }"
        ></div>
      </div>
      <div class="button-group" style="margin-top: 16px;">
        <button class="primary-button" type="button" @click="openModal('advice')">生成建议</button>
        <button class="secondary-button" type="button" @click="openModal('schedule')">更新计划</button>
        <button class="secondary-button" type="button" @click="openModal('review')">阶段复盘</button>
        <button class="secondary-button" type="button" @click="openModal('tip')">提示信息</button>
      </div>
    </section>
    <section class="card">
      <h2>训练进度概览</h2>
      <p>展示学员近期训练的阶段性成果。</p>
      <table class="table">
        <thead>
          <tr>
            <th>学员</th>
            <th>目标完成率</th>
            <th>稳定度</th>
            <th>最近评估</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in progressList" :key="item.user">
            <td>{{ item.user }}</td>
            <td>{{ item.goal }}</td>
            <td>{{ item.stability }}</td>
            <td>{{ item.date }}</td>
          </tr>
        </tbody>
      </table>
    </section>
    <section class="card">
      <h2>个性化训练建议</h2>
      <p>根据动作分析结果生成个性化训练计划。</p>
      <ul>
        <li v-for="item in suggestions" :key="item.title">
          <strong>{{ item.title }}</strong>：{{ item.detail }}
        </li>
      </ul>
      <div class="button-group" style="margin-top: 14px;">
        <button class="primary-button" type="button" @click="openModal('save')">保存建议</button>
      </div>
    </section>
  </div>
  <BaseModal :open="modal.open" :title="modal.title" @close="closeModal" @confirm="confirmModal">
    <div v-if="modal.type === 'advice'">
      <p>输入目标动作与阶段，系统将生成个性化训练建议。</p>
      <div class="form-grid">
        <label>
          目标动作
          <input v-model="modalForm.action" placeholder="如：步态稳定" />
        </label>
        <label>
          训练阶段
          <select v-model="modalForm.phase">
            <option value="初级">初级</option>
            <option value="提升">提升</option>
            <option value="强化">强化</option>
          </select>
        </label>
      </div>
    </div>
    <div v-else-if="modal.type === 'schedule'">
      <p>调整训练计划频率与提醒方式。</p>
      <div class="form-grid">
        <label>
          训练频次
          <input v-model="modalForm.frequency" />
        </label>
        <label>
          提醒方式
          <select v-model="modalForm.notice">
            <option value="app">App 提醒</option>
            <option value="sms">短信提醒</option>
            <option value="email">邮件提醒</option>
          </select>
        </label>
      </div>
      <div style="margin-top: 12px;">
        <div class="progress-track"><span style="width: 58%"></span></div>
        <small>计划同步 58%</small>
      </div>
    </div>
    <div v-else-if="modal.type === 'review'">
      <p>创建阶段复盘记录，支持多维度评价。</p>
      <div class="form-grid">
        <label>
          复盘周期
          <select v-model="modalForm.reviewRange">
            <option value="weekly">最近一周</option>
            <option value="monthly">最近一月</option>
            <option value="quarter">最近一季</option>
          </select>
        </label>
        <label>
          复盘重点
          <input v-model="modalForm.focus" />
        </label>
      </div>
    </div>
    <div v-else-if="modal.type === 'save'">
      <p>确认保存个性化建议并同步到进度档案。</p>
      <div class="progress-track" style="margin-top: 12px;"><span style="width: 90%"></span></div>
      <small>同步进度 90%</small>
    </div>
    <div v-else>
      <p>持续跟踪阶段目标可提升训练效率与达成度。</p>
      <div class="progress-track" style="margin-top: 12px;"><span style="width: 100%"></span></div>
      <small>提示信息已更新</small>
    </div>
  </BaseModal>
</template>

<script setup>
import { reactive } from 'vue'
import BaseModal from '../components/BaseModal.vue'

const trend = [68, 82, 74, 90, 85, 92, 80]

const progressList = [
  { user: '李欣', goal: '86%', stability: '92%', date: '2024-01-05' },
  { user: '王敏', goal: '82%', stability: '88%', date: '2024-01-06' },
  { user: '周杰', goal: '75%', stability: '80%', date: '2024-01-06' },
  { user: '陈晓', goal: '89%', stability: '91%', date: '2024-01-07' },
  { user: '刘晨', goal: '84%', stability: '87%', date: '2024-01-07' },
  { user: '孙怡', goal: '78%', stability: '83%', date: '2024-01-08' }
]

const suggestions = [
  { title: '步态稳定', detail: '增加低速步行训练，保持节奏一致。' },
  { title: '手势控制', detail: '加强手指伸展动作，提升识别准确率。' },
  { title: '下肢力量', detail: '安排辅助深蹲练习，控制膝盖角度。' }
]

const modalForm = reactive({
  action: '步态稳定',
  phase: '提升',
  frequency: '每周 4 次',
  notice: 'app',
  reviewRange: 'weekly',
  focus: '动作稳定性'
})

const modal = reactive({
  open: false,
  title: '',
  type: 'advice'
})

const openModal = (type) => {
  modal.open = true
  modal.type = type
  const titles = {
    advice: '生成个性化建议',
    schedule: '更新训练计划',
    review: '阶段复盘',
    save: '保存建议',
    tip: '提示信息'
  }
  modal.title = titles[type] || '提示'
}

const closeModal = () => {
  modal.open = false
}

const confirmModal = () => {
  modal.open = false
}
</script>
