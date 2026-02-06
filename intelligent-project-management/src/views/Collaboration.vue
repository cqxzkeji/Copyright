<template>
  <div class="module">
    <section class="panel">
      <div class="panel-header">
        <div>
          <h3>团队协作动态</h3>
          <p>任务共享与即时沟通。</p>
        </div>
        <div class="panel-actions">
          <button class="ghost-btn" @click="openBot">智能助手</button>
          <button class="primary-btn" @click="openMessage">发送通知</button>
        </div>
      </div>
      <div class="chat-grid">
        <div v-for="message in messages" :key="message.id" class="chat-card">
          <h4>{{ message.user }}</h4>
          <p>{{ message.text }}</p>
          <span class="muted">{{ message.time }}</span>
        </div>
      </div>
    </section>

    <section class="panel">
      <div class="panel-header">
        <div>
          <h3>任务提醒</h3>
          <p>自动推送的关键任务提醒。</p>
        </div>
        <button class="outline-btn" @click="openReminder">创建提醒</button>
      </div>
      <ul class="task-list">
        <li v-for="task in tasks" :key="task.title">
          <div>
            <strong>{{ task.title }}</strong>
            <p>{{ task.desc }}</p>
          </div>
          <span class="tag">{{ task.status }}</span>
        </li>
      </ul>
    </section>

    <ModalBase :show="showMessage" title="发送团队通知" @close="showMessage = false">
      <div class="form-grid">
        <label>
          接收范围
          <select v-model="messageForm.scope">
            <option>全部成员</option>
            <option>研发团队</option>
            <option>项目经理</option>
          </select>
        </label>
        <label>
          重要级别
          <select v-model="messageForm.level">
            <option>普通</option>
            <option>高</option>
            <option>紧急</option>
          </select>
        </label>
        <label class="full">
          通知内容
          <textarea v-model="messageForm.content" rows="3"></textarea>
        </label>
      </div>
      <template #footer>
        <button class="ghost-btn" @click="showMessage = false">取消</button>
        <button class="primary-btn" @click="sendMessage">发送</button>
      </template>
    </ModalBase>

    <ModalBase :show="showBot" title="智能助手" @close="showBot = false">
      <p>请输入问题，智能助手将根据项目数据即时解答。</p>
      <div class="form-grid">
        <label class="full">
          问题描述
          <textarea v-model="botForm.question" rows="3"></textarea>
        </label>
      </div>
      <template #footer>
        <button class="ghost-btn" @click="showBot = false">取消</button>
        <button class="primary-btn" @click="askBot">提交问题</button>
      </template>
    </ModalBase>

    <ModalBase :show="showReminder" title="创建任务提醒" @close="showReminder = false">
      <div class="form-grid">
        <label>
          任务名称
          <input v-model="reminderForm.title" />
        </label>
        <label>
          提醒时间
          <input type="datetime-local" v-model="reminderForm.time" />
        </label>
        <label class="full">
          提醒备注
          <textarea v-model="reminderForm.note" rows="3"></textarea>
        </label>
      </div>
      <template #footer>
        <button class="ghost-btn" @click="showReminder = false">取消</button>
        <button class="primary-btn" @click="saveReminder">保存</button>
      </template>
    </ModalBase>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ModalBase from '../components/ModalBase.vue'

const messages = [
  { id: 1, user: '项目经理 王晨', text: '请今日内确认需求变更影响。', time: '10:30' },
  { id: 2, user: '资源协调 刘洋', text: '供应链平台测试资源已分配。', time: '10:05' },
  { id: 3, user: '质量主管 赵悦', text: '质检模型本周需要追加标注。', time: '09:40' }
]

const tasks = [
  { title: '里程碑评审准备', desc: '整理需求与原型反馈', status: '今日' },
  { title: '数据同步确认', desc: '确认大数据平台接口', status: '明日' },
  { title: '风险复盘会议', desc: '项目风险专题会议', status: '本周' }
]

const showMessage = ref(false)
const showBot = ref(false)
const showReminder = ref(false)

const messageForm = ref({
  scope: '全部成员',
  level: '普通',
  content: ''
})

const botForm = ref({
  question: '如何减少本周排期风险？'
})

const reminderForm = ref({
  title: '跟进资源调配审批',
  time: '',
  note: ''
})

const openMessage = () => {
  showMessage.value = true
}

const sendMessage = () => {
  showMessage.value = false
}

const openBot = () => {
  showBot.value = true
}

const askBot = () => {
  showBot.value = false
}

const openReminder = () => {
  showReminder.value = true
}

const saveReminder = () => {
  showReminder.value = false
}
</script>

<style scoped>
.module {
  display: grid;
  gap: 20px;
}

.panel {
  background: #fff;
  padding: 20px;
  border-radius: 18px;
  box-shadow: 0 16px 30px rgba(15, 23, 42, 0.06);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.panel-header p {
  color: #64748b;
  font-size: 13px;
}

.panel-actions {
  display: flex;
  gap: 10px;
}

.chat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 14px;
}

.chat-card {
  background: #f8fafc;
  border-radius: 14px;
  padding: 14px;
  display: grid;
  gap: 6px;
}

.task-list {
  display: grid;
  gap: 12px;
}

.task-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f1f5f9;
  padding: 12px 14px;
  border-radius: 12px;
  gap: 12px;
}

.task-list p {
  color: #64748b;
  font-size: 13px;
}

.tag {
  background: #dbeafe;
  color: #1d4ed8;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.form-grid label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
  color: #475569;
}

.form-grid input,
.form-grid select,
.form-grid textarea {
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
}

.form-grid .full {
  grid-column: 1 / -1;
}

.primary-btn {
  background: #2563eb;
  color: #fff;
  padding: 8px 14px;
  border-radius: 10px;
  font-size: 13px;
}

.ghost-btn {
  background: #e0f2fe;
  color: #0369a1;
  padding: 8px 14px;
  border-radius: 10px;
}

.outline-btn {
  border: 1px solid #cbd5f5;
  color: #1d4ed8;
  padding: 8px 14px;
  border-radius: 10px;
  background: #ffffff;
}

.muted {
  color: #64748b;
  font-size: 13px;
}
</style>
