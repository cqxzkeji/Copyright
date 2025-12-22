<template>
  <section class="view">
    <div class="panel">
      <div class="panel-header">
        <div>
          <h2>互动交流管理</h2>
          <p>统一管理评论、私信与粉丝提问。</p>
        </div>
        <div class="actions">
          <button class="primary" @click="openModal('reply')">快速回复</button>
          <button class="ghost" @click="openModal('guide')">互动规范</button>
          <button class="outline" @click="openModal('progress')">客服排队</button>
        </div>
      </div>
      <div class="message-grid">
        <div class="message-card" v-for="item in highlights" :key="item.id">
          <h3>{{ item.title }}</h3>
          <p>{{ item.detail }}</p>
          <div class="meta">
            <span>{{ item.time }}</span>
            <span class="tag">{{ item.status }}</span>
          </div>
          <button class="ghost" @click="openModal('detail')">查看详情</button>
        </div>
      </div>
    </div>

    <div class="panel">
      <div class="panel-header">
        <h2>互动明细表</h2>
        <button class="primary" @click="openModal('filter')">筛选条件</button>
      </div>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>用户</th>
              <th>类型</th>
              <th>内容摘要</th>
              <th>来源直播间</th>
              <th>时间</th>
              <th>响应人</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in interactions" :key="row.id">
              <td>{{ row.user }}</td>
              <td>{{ row.type }}</td>
              <td>{{ row.content }}</td>
              <td>{{ row.room }}</td>
              <td>{{ row.time }}</td>
              <td>{{ row.owner }}</td>
              <td><span class="tag">{{ row.status }}</span></td>
              <td><button class="ghost" @click="openModal('resolve')">处理</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>

  <BaseModal v-if="activeModal" :title="modalTitle" :confirm-text="confirmText" @close="activeModal = ''" @confirm="confirm">
    <template v-if="activeModal === 'reply'">
      <label>
        常用话术
        <select v-model="form.script">
          <option>感谢关注，本场福利马上开始！</option>
          <option>私信已收到，稍后回复。</option>
          <option>已为您申请补发，请留意短信。</option>
        </select>
      </label>
      <label>
        回复内容
        <textarea v-model="form.reply" rows="3" placeholder="填写回复内容"></textarea>
      </label>
    </template>
    <template v-else-if="activeModal === 'filter'">
      <label>
        类型筛选
        <select v-model="form.type">
          <option>评论</option>
          <option>私信</option>
          <option>提问</option>
        </select>
      </label>
      <label>
        状态
        <select v-model="form.status">
          <option>待处理</option>
          <option>处理中</option>
          <option>已完成</option>
        </select>
      </label>
    </template>
    <template v-else-if="activeModal === 'resolve'">
      <p>当前互动已标记：{{ form.status }}。</p>
      <label>
        处理结果
        <textarea v-model="form.note" rows="3" placeholder="填写处理结果"></textarea>
      </label>
    </template>
    <template v-else-if="activeModal === 'detail'">
      <p>粉丝咨询集中在物流与优惠券问题，可统一回复。</p>
      <ul class="info-list">
        <li>热点话题：物流时效</li>
        <li>待跟进用户：12 位</li>
        <li>已解决率：88%</li>
      </ul>
    </template>
    <template v-else-if="activeModal === 'guide'">
      <p>互动提示：保持积极语气，针对投诉及时升级工单。</p>
      <p>请避免使用敏感词汇，并引导关注官方公告。</p>
    </template>
    <template v-else-if="activeModal === 'progress'">
      <p>客服排队进度</p>
      <div class="progress">
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
      </div>
      <p>当前排队 {{ progress }}%</p>
    </template>
  </BaseModal>
</template>

<script setup>
import { reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const highlights = [
  { id: 1, title: '高频咨询', detail: '物流时效相关问题持续增长。', time: '10:12', status: '已提醒' },
  { id: 2, title: '新品反馈', detail: '用户对有机大米口感评价较高。', time: '11:05', status: '已整理' },
  { id: 3, title: '售后升级', detail: '建议优化退款流程响应速度。', time: '12:18', status: '待跟进' }
];

const interactions = [
  { id: 1, user: '王先生', type: '评论', content: '能否加推果蔬礼包？', room: '夜场团购', time: '09:10', owner: '客服A', status: '待处理' },
  { id: 2, user: '李女士', type: '私信', content: '订单未发货怎么办', room: '午间厨房', time: '09:22', owner: '客服B', status: '处理中' },
  { id: 3, user: '陈先生', type: '提问', content: '能否提供溯源证书', room: '清晨采摘', time: '09:35', owner: '客服A', status: '待处理' },
  { id: 4, user: '赵女士', type: '评论', content: '直播画面很清晰', room: '夜场团购', time: '10:02', owner: '客服C', status: '已完成' },
  { id: 5, user: '孙先生', type: '私信', content: '想订购礼盒', room: '午间厨房', time: '10:18', owner: '客服B', status: '处理中' },
  { id: 6, user: '周小姐', type: '提问', content: '明天的直播什么时候', room: '清晨采摘', time: '10:33', owner: '客服A', status: '已完成' },
  { id: 7, user: '吴先生', type: '评论', content: '优惠券怎么使用', room: '夜场团购', time: '10:45', owner: '客服C', status: '待处理' },
  { id: 8, user: '郑女士', type: '私信', content: '收到货有破损', room: '午间厨房', time: '11:02', owner: '客服B', status: '处理中' },
  { id: 9, user: '韩先生', type: '提问', content: '是否支持团购价', room: '夜场团购', time: '11:18', owner: '客服C', status: '待处理' },
  { id: 10, user: '冯女士', type: '评论', content: '主播讲解很专业', room: '清晨采摘', time: '11:35', owner: '客服A', status: '已完成' }
];

const activeModal = ref('');
const modalTitle = ref('');
const confirmText = ref('确认');
const progress = ref(64);

const form = reactive({
  script: '感谢关注，本场福利马上开始！',
  reply: '',
  type: '评论',
  status: '待处理',
  note: ''
});

const openModal = (type) => {
  activeModal.value = type;
  const titleMap = {
    reply: '快速回复',
    guide: '互动规范提示',
    progress: '客服排队进度',
    filter: '筛选条件',
    resolve: '处理互动',
    detail: '互动热点详情'
  };
  modalTitle.value = titleMap[type];
  confirmText.value = type === 'detail' || type === 'guide' || type === 'progress' ? '' : '确认';
};

const confirm = () => {
  activeModal.value = '';
};
</script>

<style scoped>
.view {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.panel {
  background: #fff;
  padding: 20px;
  border-radius: 18px;
  box-shadow: 0 16px 30px rgba(15, 23, 42, 0.06);
  display: grid;
  gap: 16px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.panel-header p {
  color: #64748b;
  font-size: 13px;
}

.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.message-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}

.message-card {
  background: #f8fafc;
  padding: 14px;
  border-radius: 16px;
  display: grid;
  gap: 10px;
}

.message-card .meta {
  display: flex;
  justify-content: space-between;
  color: #94a3b8;
  font-size: 12px;
}

.tag {
  background: #e0f2fe;
  color: #0369a1;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
}

.table-wrapper {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

thead {
  background: #f1f5f9;
}

th,
td {
  padding: 10px 12px;
  text-align: left;
}

tr + tr {
  border-top: 1px solid #e2e8f0;
}

.primary {
  background: #2563eb;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
}

.ghost {
  background: #e0f2fe;
  color: #0369a1;
  border: none;
  padding: 6px 14px;
  border-radius: 8px;
  cursor: pointer;
}

.outline {
  background: transparent;
  border: 1px solid #cbd5f5;
  color: #1d4ed8;
  padding: 6px 14px;
  border-radius: 8px;
  cursor: pointer;
}

.progress {
  height: 12px;
  background: #e2e8f0;
  border-radius: 999px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #4ade80, #22d3ee);
}

input,
select,
textarea {
  width: 100%;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.info-list {
  padding-left: 18px;
  color: #475569;
}
</style>
