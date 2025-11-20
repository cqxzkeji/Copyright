<template>
  <div class="module">
    <header class="module-header">
      <div>
        <h2>通知与提醒管理</h2>
        <p>统一管理日报提醒策略、审批通知与风险预警。</p>
      </div>
      <button class="primary" @click="openSend">发送提醒</button>
    </header>

    <div class="notifications">
      <article v-for="notice in notices" :key="notice.id" class="notice-card">
        <div>
          <h3>{{ notice.title }}</h3>
          <p>{{ notice.content }}</p>
        </div>
        <span class="target">{{ notice.target }}</span>
      </article>
    </div>

    <section class="rules">
      <h3>提醒策略</h3>
      <ul>
        <li>日报未提交 18:00 自动推送微信与邮件。</li>
        <li>审批超时 2 小时短信通知责任人。</li>
        <li>异常日报实时同步至项目群机器人。</li>
      </ul>
      <button class="outline" @click="showRules = true">调整策略</button>
    </section>

    <ModalDialog :show="showSend" title="立即发送提醒" @close="showSend = false">
      <p>提醒模板：{{ template }}</p>
      <label class="select">
        推送渠道
        <select v-model="channel">
          <option value="钉钉机器人">钉钉机器人</option>
          <option value="企业微信">企业微信</option>
          <option value="短信">短信</option>
        </select>
      </label>
      <button class="primary" @click="confirmSend">确认发送</button>
    </ModalDialog>

    <ModalDialog :show="showRules" title="策略配置" @close="showRules = false">
      <p>可设置提醒频率、渠道、接收组，支持按团队差异化配置。</p>
    </ModalDialog>

    <ModalDialog :show="Boolean(sentChannel)" title="发送完成" @close="sentChannel = ''">
      <p>已通过 {{ sentChannel }} 触达全员，系统会在 10 分钟后回收反馈数据。</p>
    </ModalDialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ModalDialog from '../components/ModalDialog.vue'

const notices = [
  {
    id: 1,
    title: '日报模板升级',
    content: '新增 KPI 指标字段，明日正式生效，请提前熟悉。',
    target: '全员'
  },
  {
    id: 2,
    title: '审批超时提醒',
    content: '市场拓展项目存在 2 篇日报待批，已自动升级提醒。',
    target: '项目负责人'
  }
]

const template = '您好，您的日报即将超时提交，请在 18:00 前完成。'
const showSend = ref(false)
const showRules = ref(false)
const channel = ref('钉钉机器人')
const sentChannel = ref('')

const openSend = () => {
  showSend.value = true
}

const confirmSend = () => {
  sentChannel.value = channel.value
  showSend.value = false
}
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 24px;
  background: #fff;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 15px 40px rgba(15, 22, 58, 0.08);
}

.notifications {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.notice-card {
  border: 1px solid #e8ecfb;
  border-radius: 16px;
  padding: 18px;
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: center;
}

.target {
  padding: 6px 14px;
  border-radius: 999px;
  background: #edf4ff;
  color: #1f6feb;
  font-size: 12px;
}

.rules {
  border: 1px dashed #b7c9ff;
  border-radius: 16px;
  padding: 18px;
}

ul {
  margin: 12px 0;
  padding-left: 20px;
  color: #4c5772;
}

.primary,
.outline {
  padding: 10px 18px;
  border-radius: 12px;
  border: none;
  font-weight: 600;
}

.primary {
  background: linear-gradient(120deg, #00c6ff, #0072ff);
  color: #fff;
}

.outline {
  border: 1px solid #b2c7ff;
  color: #3958ff;
  background: #fff;
}

.select {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 12px 0;
}

select {
  border: 1px solid #d6dff7;
  border-radius: 10px;
  padding: 8px;
}
</style>
