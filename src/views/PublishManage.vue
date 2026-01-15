<template>
  <section class="page">
    <header class="page-header">
      <div>
        <h3>广告投放与发布管理</h3>
        <p>多渠道发布计划、排期与状态监控。</p>
      </div>
      <div class="actions">
        <button class="primary" @click="openModal('schedule')">创建发布计划</button>
        <button class="outline" @click="openModal('channel')">选择投放渠道</button>
        <button class="outline" @click="openModal('param')">投放参数配置</button>
        <button class="ghost" @click="openModal('monitor')">发布状态监控</button>
        <button class="ghost" @click="openModal('log')">发布日志留存</button>
      </div>
    </header>

    <div class="grid">
      <div class="card">
        <h4>发布状态概览</h4>
        <div class="status-grid">
          <div v-for="item in status" :key="item.label">
            <span>{{ item.label }}</span>
            <strong>{{ item.value }}</strong>
          </div>
        </div>
        <div class="timeline">
          <div v-for="item in timeline" :key="item.day" class="timeline-item">
            <span>{{ item.day }}</span>
            <div class="dot"></div>
            <p>{{ item.event }}</p>
          </div>
        </div>
      </div>

      <div class="card">
        <h4>发布排期清单</h4>
        <table>
          <thead>
            <tr>
              <th>计划编号</th>
              <th>活动名称</th>
              <th>渠道</th>
              <th>时间</th>
              <th>状态</th>
              <th>覆盖区域</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="plan in plans" :key="plan.id">
              <td>{{ plan.id }}</td>
              <td>{{ plan.title }}</td>
              <td>{{ plan.channel }}</td>
              <td>{{ plan.time }}</td>
              <td>{{ plan.status }}</td>
              <td>{{ plan.region }}</td>
              <td>
                <button class="link" @click="openModal('detail', plan)">详情</button>
                <button class="link" @click="openModal('offline', plan)">下线</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Modal v-if="activeModal" :title="modalTitle" @close="closeModal">
      <template v-if="activeModal === 'schedule'">
        <label>
          活动名称
          <input v-model="form.title" placeholder="如：夏日上新" />
        </label>
        <label>
          发布日期
          <input v-model="form.date" type="date" />
        </label>
        <label>
          排期时段
          <select v-model="form.slot">
            <option>上午 9:00 - 12:00</option>
            <option>下午 14:00 - 18:00</option>
            <option>晚间 19:00 - 22:00</option>
          </select>
        </label>
      </template>

      <template v-else-if="activeModal === 'channel'">
        <p>请选择发布渠道：</p>
        <div class="channel-tags">
          <span>抖音信息流</span>
          <span>小红书</span>
          <span>朋友圈广告</span>
          <span>户外大屏</span>
          <span>电梯屏</span>
        </div>
      </template>

      <template v-else-if="activeModal === 'param'">
        <label>
          覆盖人群
          <input v-model="form.audience" placeholder="如：18-30 女性" />
        </label>
        <label>
          投放频次
          <input v-model="form.frequency" placeholder="如：每日 3 次" />
        </label>
        <label>
          覆盖区域
          <input v-model="form.region" placeholder="如：华东 / 华南" />
        </label>
      </template>

      <template v-else-if="activeModal === 'monitor'">
        <p>当前发布状态</p>
        <div class="progress">
          <div class="progress-bar" style="width: 66%"></div>
        </div>
        <p>待发布 3 · 已发布 12 · 已下线 2</p>
      </template>

      <template v-else-if="activeModal === 'log'">
        <p>发布日志</p>
        <ul>
          <li v-for="entry in logs" :key="entry">{{ entry }}</li>
        </ul>
      </template>

      <template v-else-if="activeModal === 'detail'">
        <p><strong>{{ selectedPlan.title }}</strong> 发布详情</p>
        <p>渠道：{{ selectedPlan.channel }} · 状态：{{ selectedPlan.status }}</p>
        <p>时间：{{ selectedPlan.time }} · 区域：{{ selectedPlan.region }}</p>
      </template>

      <template v-else-if="activeModal === 'offline'">
        <p>确认下线计划：{{ selectedPlan.title }}</p>
        <label>
          下线原因
          <textarea v-model="form.reason" rows="3" placeholder="填写下线原因"></textarea>
        </label>
      </template>

      <template #footer>
        <button class="ghost" type="button" @click="closeModal">取消</button>
        <button class="primary" type="button" @click="closeModal">确认</button>
      </template>
    </Modal>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue';
import Modal from '../components/Modal.vue';

const activeModal = ref('');
const selectedPlan = ref({});
const form = ref({
  title: '',
  date: '',
  slot: '上午 9:00 - 12:00',
  audience: '',
  frequency: '',
  region: '',
  reason: ''
});

const status = [
  { label: '待发布', value: 3 },
  { label: '已发布', value: 12 },
  { label: '已下线', value: 2 },
  { label: '暂停中', value: 1 }
];

const timeline = [
  { day: '周一', event: '抖音信息流发布' },
  { day: '周二', event: '小红书种草投放' },
  { day: '周三', event: '朋友圈广告上新' },
  { day: '周四', event: '户外大屏切换' }
];

const logs = [
  '2024/05/22 10:00 发布计划 PR-023 已上线',
  '2024/05/22 15:30 预算调整 15%',
  '2024/05/23 09:10 下线计划 PR-011',
  '2024/05/24 19:20 频次上调至 4 次/日'
];

const plans = Array.from({ length: 21 }, (_, index) => ({
  id: `PR-${String(index + 1).padStart(3, '0')}`,
  title: `夏日上新投放 ${index + 1}`,
  channel: ['抖音', '小红书', '朋友圈', '户外屏', '电梯屏'][index % 5],
  time: `2024-06-${String((index % 28) + 1).padStart(2, '0')} ${index % 2 ? '下午' : '上午'}`,
  status: ['待发布', '已发布', '下线', '暂停'][index % 4],
  region: ['华东', '华南', '华北', '西南'][index % 4]
}));

const openModal = (type, plan) => {
  activeModal.value = type;
  selectedPlan.value = plan || {};
};

const closeModal = () => {
  activeModal.value = '';
};

const modalTitle = computed(() => {
  const titles = {
    schedule: '创建发布计划',
    channel: '投放渠道选择',
    param: '投放参数配置',
    monitor: '发布状态监控',
    log: '发布日志留存',
    detail: '发布详情',
    offline: '计划下线'
  };
  return titles[activeModal.value] || '操作';
});
</script>

<style scoped>
.page {
  display: grid;
  gap: 20px;
}

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  background: #fff;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 6px 16px rgba(15, 23, 42, 0.05);
}

.page-header p {
  margin: 0;
  color: #64748b;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.primary {
  background: #2563eb;
  color: #fff;
  border: none;
  padding: 8px 14px;
  border-radius: 10px;
  cursor: pointer;
}

.outline {
  background: #fff;
  border: 1px solid #cbd5f5;
  color: #2563eb;
  padding: 8px 14px;
  border-radius: 10px;
  cursor: pointer;
}

.ghost {
  background: #f8fafc;
  border: 1px dashed #cbd5f5;
  color: #475569;
  padding: 8px 14px;
  border-radius: 10px;
  cursor: pointer;
}

.grid {
  display: grid;
  gap: 20px;
}

.card {
  background: #fff;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 6px 16px rgba(15, 23, 42, 0.05);
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
  margin-bottom: 16px;
}

.status-grid div {
  background: #f8fafc;
  border-radius: 12px;
  padding: 12px;
  display: grid;
  gap: 6px;
}

.timeline {
  display: grid;
  gap: 12px;
}

.timeline-item {
  display: grid;
  grid-template-columns: 60px 12px 1fr;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: #475569;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #2563eb;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

th,
td {
  text-align: left;
  padding: 10px;
  border-bottom: 1px solid #e2e8f0;
}

.link {
  background: transparent;
  border: none;
  color: #2563eb;
  cursor: pointer;
  margin-right: 8px;
}

input,
select,
textarea {
  width: 100%;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
}

.channel-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.channel-tags span {
  background: #dbeafe;
  color: #1d4ed8;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 12px;
}

.progress {
  height: 12px;
  background: #e2e8f0;
  border-radius: 999px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #2563eb, #38bdf8);
}
</style>
