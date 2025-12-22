<template>
  <section class="dashboard">
    <div class="stats-grid">
      <div class="stat-card" v-for="card in statCards" :key="card.label">
        <h3>{{ card.value }}</h3>
        <p>{{ card.label }}</p>
        <span>{{ card.note }}</span>
      </div>
    </div>

    <div class="panel">
      <div class="panel-header">
        <h2>直播运营总览</h2>
        <div class="button-group">
          <button class="primary" @click="openModal('broadcast')">发布直播公告</button>
          <button class="ghost" @click="openModal('progress')">同步进度</button>
          <button class="outline" @click="openModal('hint')">提示说明</button>
        </div>
      </div>
      <div class="panel-body">
        <div class="chart">
          <div class="chart-row" v-for="item in chartData" :key="item.label">
            <span>{{ item.label }}</span>
            <div class="bar">
              <div class="fill" :style="{ width: item.value + '%' }"></div>
            </div>
            <strong>{{ item.value }}%</strong>
          </div>
        </div>
        <div class="image-grid">
          <div class="image-card" v-for="(image, index) in images" :key="index">
            <img :src="image" alt="直播封面" />
            <div>
              <h4>优选农场直播 {{ index + 1 }}</h4>
              <p>推送时间：{{ schedule[index] }}</p>
            </div>
            <button class="ghost" @click="openModal('detail')">查看详情</button>
          </div>
        </div>
      </div>
    </div>

    <div class="panel">
      <div class="panel-header">
        <h2>重点指标数据表</h2>
        <button class="primary" @click="openModal('add')">新增指标</button>
      </div>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>日期</th>
              <th>场次</th>
              <th>观看人数</th>
              <th>互动次数</th>
              <th>成交额(万元)</th>
              <th>转化率</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in tableRows" :key="row.date">
              <td>{{ row.date }}</td>
              <td>{{ row.sessions }}</td>
              <td>{{ row.viewers }}</td>
              <td>{{ row.interactions }}</td>
              <td>{{ row.sales }}</td>
              <td>{{ row.rate }}</td>
              <td><span class="tag">{{ row.status }}</span></td>
              <td>
                <button class="ghost" @click="openModal('edit')">编辑</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>

  <BaseModal v-if="activeModal" :title="modalTitle" :confirm-text="confirmText" @close="activeModal = ''" @confirm="handleConfirm">
    <template v-if="activeModal === 'broadcast'">
      <label>
        公告标题
        <input v-model="form.broadcastTitle" placeholder="请输入公告标题" />
      </label>
      <label>
        公告内容
        <textarea v-model="form.broadcastContent" rows="3" placeholder="请输入公告内容"></textarea>
      </label>
      <label>
        覆盖频道
        <select v-model="form.channel">
          <option>首页弹窗</option>
          <option>直播间公告</option>
          <option>活动页推送</option>
        </select>
      </label>
    </template>
    <template v-else-if="activeModal === 'add'">
      <label>
        指标名称
        <input v-model="form.metric" placeholder="例如：优选专场" />
      </label>
      <label>
        目标观看人数
        <input v-model="form.target" type="number" placeholder="请输入目标" />
      </label>
      <label>
        负责人
        <input v-model="form.owner" placeholder="请输入负责人" />
      </label>
    </template>
    <template v-else-if="activeModal === 'edit'">
      <p>已选择今日数据项，请确认是否更新。</p>
      <label>
        状态更新
        <select v-model="form.status">
          <option>已完成</option>
          <option>进行中</option>
          <option>待复盘</option>
        </select>
      </label>
      <label>
        复盘备注
        <textarea v-model="form.note" rows="3" placeholder="填写复盘备注"></textarea>
      </label>
    </template>
    <template v-else-if="activeModal === 'detail'">
      <p>直播间已准备：{{ form.broadcastTitle || '优选农场直播' }}，可查看详细排期与人员安排。</p>
      <ul class="info-list">
        <li>场地：智慧农场 A1</li>
        <li>带货品类：有机蔬果、生鲜礼盒</li>
        <li>预估在线：1.2万</li>
        <li>推荐官：李晓梅</li>
      </ul>
    </template>
    <template v-else-if="activeModal === 'progress'">
      <p>数据同步中，请稍候。</p>
      <div class="progress">
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
      </div>
      <p>已完成 {{ progress }}%</p>
    </template>
    <template v-else-if="activeModal === 'hint'">
      <p>提示：每日 18:00 自动生成直播运营复盘报告。</p>
      <p>如需手动生成，请在数据统计页面点击“生成报告”。</p>
    </template>
  </BaseModal>
</template>

<script setup>
import { reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const statCards = [
  { label: '今日直播场次', value: '12 场', note: '较昨日 +2 场' },
  { label: '在线峰值人数', value: '4.8 万', note: '峰值出现在 20:30' },
  { label: '成交额', value: '152.6 万', note: '环比 +12%' },
  { label: '复购用户', value: '3,980', note: '新会员占比 38%' }
];

const chartData = [
  { label: '直播间转化', value: 78 },
  { label: '评论活跃度', value: 66 },
  { label: '点赞满意度', value: 85 },
  { label: '分享传播', value: 58 },
  { label: '到达率', value: 72 }
];

const images = [
  'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?auto=format&fit=crop&w=400&q=80'
];

const schedule = ['08:30', '12:00', '19:30'];

const tableRows = [
  { date: '04-01', sessions: 3, viewers: '1.2万', interactions: 3200, sales: 18.2, rate: '6.2%', status: '已完成' },
  { date: '04-02', sessions: 4, viewers: '1.8万', interactions: 4100, sales: 22.4, rate: '6.9%', status: '已完成' },
  { date: '04-03', sessions: 2, viewers: '9,500', interactions: 2800, sales: 12.8, rate: '5.4%', status: '已完成' },
  { date: '04-04', sessions: 3, viewers: '1.1万', interactions: 3100, sales: 16.5, rate: '6.1%', status: '已完成' },
  { date: '04-05', sessions: 4, viewers: '2.1万', interactions: 5200, sales: 24.3, rate: '7.4%', status: '已完成' },
  { date: '04-06', sessions: 3, viewers: '1.7万', interactions: 4600, sales: 21.1, rate: '6.7%', status: '已完成' },
  { date: '04-07', sessions: 5, viewers: '2.4万', interactions: 6100, sales: 28.2, rate: '7.8%', status: '已完成' },
  { date: '04-08', sessions: 3, viewers: '1.5万', interactions: 3900, sales: 19.7, rate: '6.3%', status: '进行中' },
  { date: '04-09', sessions: 4, viewers: '1.9万', interactions: 5200, sales: 25.9, rate: '7.1%', status: '进行中' },
  { date: '04-10', sessions: 3, viewers: '1.6万', interactions: 4200, sales: 20.4, rate: '6.4%', status: '待复盘' }
];

const activeModal = ref('');
const modalTitle = ref('');
const confirmText = ref('确认');
const progress = ref(68);

const form = reactive({
  broadcastTitle: '',
  broadcastContent: '',
  channel: '首页弹窗',
  metric: '',
  target: '',
  owner: '',
  status: '已完成',
  note: ''
});

const openModal = (type) => {
  activeModal.value = type;
  const titleMap = {
    broadcast: '发布直播公告',
    add: '新增关键指标',
    edit: '编辑指标数据',
    detail: '直播排期详情',
    progress: '数据同步进度',
    hint: '提示信息'
  };
  modalTitle.value = titleMap[type];
  confirmText.value = type === 'detail' || type === 'hint' ? '' : '确认';
};

const handleConfirm = () => {
  activeModal.value = '';
};
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.stat-card {
  background: #fff;
  padding: 18px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
}

.stat-card h3 {
  font-size: 24px;
  margin-bottom: 6px;
}

.stat-card p {
  color: #475569;
  font-weight: 600;
}

.stat-card span {
  color: #94a3b8;
  font-size: 12px;
}

.panel {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 16px 30px rgba(15, 23, 42, 0.06);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.panel-body {
  display: grid;
  gap: 20px;
}

.button-group {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.chart {
  display: grid;
  gap: 12px;
}

.chart-row {
  display: grid;
  grid-template-columns: 120px 1fr 60px;
  align-items: center;
  gap: 12px;
}

.bar {
  height: 10px;
  background: #e2e8f0;
  border-radius: 999px;
  overflow: hidden;
}

.fill {
  height: 100%;
  background: linear-gradient(90deg, #38bdf8, #a5b4fc);
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}

.image-card {
  background: #f8fafc;
  padding: 12px;
  border-radius: 14px;
  display: grid;
  gap: 10px;
}

.image-card img {
  width: 100%;
  border-radius: 12px;
  height: 140px;
  object-fit: cover;
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

.tag {
  background: #e0f2fe;
  color: #0369a1;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
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

.info-list {
  padding-left: 18px;
  color: #475569;
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
</style>
