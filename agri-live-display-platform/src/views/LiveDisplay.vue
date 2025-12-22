<template>
  <section class="view">
    <div class="panel">
      <div class="panel-header">
        <div>
          <h2>直播展示调度</h2>
          <p>实时调整直播间展示内容与推荐位。</p>
        </div>
        <div class="actions">
          <button class="primary" @click="openModal('schedule')">新增排期</button>
          <button class="ghost" @click="openModal('alert')">推送提醒</button>
          <button class="outline" @click="openModal('progress')">加载进度</button>
        </div>
      </div>
      <div class="card-grid">
        <div class="card" v-for="room in rooms" :key="room.id">
          <img :src="room.cover" alt="直播间" />
          <h3>{{ room.title }}</h3>
          <p>{{ room.desc }}</p>
          <div class="tag-row">
            <span class="tag">{{ room.status }}</span>
            <span class="tag">{{ room.start }}</span>
          </div>
          <button class="ghost" @click="openModal('detail')">查看配置</button>
        </div>
      </div>
    </div>

    <div class="panel">
      <div class="panel-header">
        <h2>直播场次列表</h2>
        <button class="primary" @click="openModal('publish')">发布排期</button>
      </div>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>场次</th>
              <th>主题</th>
              <th>主播</th>
              <th>开播时间</th>
              <th>推荐位</th>
              <th>观看预约</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in schedule" :key="row.session">
              <td>{{ row.session }}</td>
              <td>{{ row.topic }}</td>
              <td>{{ row.anchor }}</td>
              <td>{{ row.time }}</td>
              <td>{{ row.position }}</td>
              <td>{{ row.reserve }}</td>
              <td><span class="tag">{{ row.status }}</span></td>
              <td><button class="ghost" @click="openModal('edit')">编辑</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>

  <BaseModal v-if="activeModal" :title="modalTitle" :confirm-text="confirmText" @close="activeModal = ''" @confirm="confirm">
    <template v-if="activeModal === 'schedule'">
      <label>
        场次名称
        <input v-model="form.session" placeholder="例如：午间专场" />
      </label>
      <label>
        主播选择
        <input v-model="form.anchor" placeholder="请输入主播" />
      </label>
      <label>
        直播时间
        <input v-model="form.time" type="datetime-local" />
      </label>
    </template>
    <template v-else-if="activeModal === 'publish'">
      <p>确定发布今日排期？发布后将同步到首页与预热页。</p>
      <label>
        推送备注
        <textarea v-model="form.note" rows="3" placeholder="填写推送说明"></textarea>
      </label>
    </template>
    <template v-else-if="activeModal === 'edit'">
      <label>
        推荐位更新
        <select v-model="form.position">
          <option>首页推荐</option>
          <option>精选频道</option>
          <option>专题推荐</option>
        </select>
      </label>
      <label>
        状态更新
        <select v-model="form.status">
          <option>已排期</option>
          <option>预热中</option>
          <option>进行中</option>
        </select>
      </label>
    </template>
    <template v-else-if="activeModal === 'detail'">
      <p>直播间配置包括多机位切换、背景音乐与商品轮播。</p>
      <ul class="info-list">
        <li>机位数量：3</li>
        <li>预热视频：已上传</li>
        <li>互动脚本：已同步</li>
      </ul>
    </template>
    <template v-else-if="activeModal === 'alert'">
      <p>已向关注用户发送开播提醒。</p>
      <label>
        提醒内容
        <input v-model="form.alert" placeholder="开播提醒文本" />
      </label>
    </template>
    <template v-else-if="activeModal === 'progress'">
      <p>素材加载进度</p>
      <div class="progress">
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
      </div>
      <p>{{ progress }}% 已完成</p>
    </template>
  </BaseModal>
</template>

<script setup>
import { reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const rooms = [
  {
    id: 1,
    title: '清晨采摘直播间',
    desc: '展示基地采摘与分拣流程。',
    status: '预热中',
    start: '06:30',
    cover: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 2,
    title: '午间厨房体验',
    desc: '主厨现场展示农产品烹饪。',
    status: '即将开始',
    start: '12:10',
    cover: 'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 3,
    title: '夜场团购专场',
    desc: '团购福利与限时秒杀。',
    status: '排期中',
    start: '20:00',
    cover: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=500&q=80'
  }
];

const schedule = [
  { session: 'L-001', topic: '高原番茄专场', anchor: '王倩', time: '08:30', position: '首页推荐', reserve: 1280, status: '预热中' },
  { session: 'L-002', topic: '有机米直播', anchor: '陈琳', time: '09:30', position: '精选频道', reserve: 980, status: '已排期' },
  { session: 'L-003', topic: '山地鸡蛋直供', anchor: '赵磊', time: '10:20', position: '专题推荐', reserve: 1150, status: '已排期' },
  { session: 'L-004', topic: '夏季水果组合', anchor: '唐敏', time: '12:00', position: '首页推荐', reserve: 1620, status: '预热中' },
  { session: 'L-005', topic: '茶叶溯源直播', anchor: '周宁', time: '13:40', position: '精选频道', reserve: 740, status: '已排期' },
  { session: 'L-006', topic: '精品蜂蜜故事', anchor: '马晓', time: '15:00', position: '专题推荐', reserve: 920, status: '已排期' },
  { session: 'L-007', topic: '夜市蔬果拼单', anchor: '何佳', time: '17:30', position: '首页推荐', reserve: 2100, status: '预热中' },
  { session: 'L-008', topic: '生态鱼场直连', anchor: '蒋婷', time: '18:30', position: '精选频道', reserve: 860, status: '已排期' },
  { session: 'L-009', topic: '地理标志好物', anchor: '杨浩', time: '19:20', position: '专题推荐', reserve: 1120, status: '已排期' },
  { session: 'L-010', topic: '晚间福利专场', anchor: '胡悦', time: '20:30', position: '首页推荐', reserve: 1880, status: '预热中' }
];

const activeModal = ref('');
const modalTitle = ref('');
const confirmText = ref('确认');
const progress = ref(52);

const form = reactive({
  session: '',
  anchor: '',
  time: '',
  note: '',
  position: '首页推荐',
  status: '已排期',
  alert: '直播即将开始，欢迎准时观看！'
});

const openModal = (type) => {
  activeModal.value = type;
  const titleMap = {
    schedule: '新增直播排期',
    publish: '发布排期',
    edit: '编辑排期信息',
    detail: '直播间配置',
    alert: '发送提醒',
    progress: '素材加载进度'
  };
  modalTitle.value = titleMap[type];
  confirmText.value = type === 'detail' || type === 'progress' ? '' : '确认';
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

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}

.card {
  background: #f8fafc;
  padding: 14px;
  border-radius: 16px;
  display: grid;
  gap: 10px;
}

.card img {
  height: 140px;
  width: 100%;
  border-radius: 12px;
  object-fit: cover;
}

.tag-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
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
