<template>
  <div class="module">
    <section class="panel">
      <div>
        <h3>协作平台与创意分享</h3>
        <p>实时查看团队创意状态，评论、分配与同步到 Slack/企业微信。</p>
      </div>
      <div class="action-row">
        <button @click="scheduleReview">预约评审</button>
        <button @click="shareBoard">分享创意板</button>
        <button @click="openTimeline">查看时间线</button>
      </div>
    </section>

    <section class="panel board">
      <article class="ticket" v-for="ticket in tickets" :key="ticket.id">
        <div class="ticket-header">
          <span class="badge">{{ ticket.channel }}</span>
          <span class="status">{{ ticket.status }}</span>
        </div>
        <h4>{{ ticket.title }}</h4>
        <p>{{ ticket.desc }}</p>
        <div class="contributors">
          <span v-for="member in ticket.members" :key="member">{{ member }}</span>
        </div>
        <button class="secondary" @click="emit('open-modal', '评论提醒', `${ticket.title} 的最新反馈已推送到消息中心。`)">
          查看反馈
        </button>
      </article>
      <article class="timeline" v-if="timelineVisible">
        <h4>协作时间线</h4>
        <ul>
          <li v-for="item in timeline" :key="item.time">
            <strong>{{ item.time }}</strong>
            <span>{{ item.text }}</span>
          </li>
        </ul>
      </article>
    </section>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const emit = defineEmits(['open-modal']);

const tickets = reactive([
  {
    id: 1,
    title: '520 主题 Campaign',
    desc: '线下快闪 + 线上直播，主视觉待定 CTA',
    channel: 'Campaign',
    status: '创意中',
    members: ['晴', 'Leo', 'Mia']
  },
  {
    id: 2,
    title: '新品上市短视频',
    desc: '三支 15s 视频脚本 + 口播字幕',
    channel: 'Video',
    status: '制作中',
    members: ['Yuki', '阿泽']
  },
  {
    id: 3,
    title: '社交互动小游戏',
    desc: '积分抽奖玩法，配套 KV 与海报',
    channel: 'Social',
    status: '待审批',
    members: ['晗', 'Chris']
  }
]);

const timeline = reactive([
  { time: '09:05', text: '策略团队完成受众画像更新' },
  { time: '10:40', text: '设计师上传节日 KV 草图' },
  { time: '12:10', text: '客户确认第二版核心文案' },
  { time: '14:00', text: '跨平台投放计划已排期' }
]);

const timelineVisible = ref(false);

const scheduleReview = () => emit('open-modal', '评审预约成功', '已为今晚 20:00 预约创意评审会。');
const shareBoard = () => emit('open-modal', '分享链接已生成', '链接有效期 24 小时，已同步到 Slack。');
const openTimeline = () => (timelineVisible.value = !timelineVisible.value);
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.panel {
  background: #f8fafc;
  border-radius: 20px;
  padding: 1.5rem;
}

.action-row {
  display: flex;
  gap: 0.75rem;
}

button {
  border: none;
  border-radius: 999px;
  padding: 0.6rem 1.4rem;
  background: #cbd5f5;
  color: #0f172a;
  cursor: pointer;
}

button.secondary {
  background: #22d3ee;
  color: #0f172a;
}

.board {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
}

.ticket {
  background: white;
  border-radius: 18px;
  padding: 1.25rem;
  box-shadow: inset 0 0 0 1px #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.ticket-header {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: #475569;
}

.badge {
  background: #e0f2fe;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
}

.status {
  color: #2563eb;
}

.contributors {
  display: flex;
  gap: 0.35rem;
  flex-wrap: wrap;
}

.contributors span {
  background: #f1f5f9;
  padding: 0.3rem 0.75rem;
  border-radius: 999px;
}

.timeline {
  background: white;
  border-radius: 18px;
  padding: 1.25rem;
  box-shadow: inset 0 0 0 1px #e2e8f0;
}

.timeline ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.timeline li {
  display: flex;
  gap: 1rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid #e2e8f0;
}

.timeline li:last-child {
  border-bottom: none;
}
</style>
