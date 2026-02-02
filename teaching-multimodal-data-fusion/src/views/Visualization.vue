<template>
  <div class="page">
    <div class="card">
      <div class="section-title">可视化仪表</div>
      <div class="dashboard-grid">
        <div class="dashboard-card">
          <div class="dashboard-title">课堂专注度</div>
          <div class="ring">
            <span>86%</span>
          </div>
          <p>高于昨日 4%</p>
        </div>
        <div class="dashboard-card">
          <div class="dashboard-title">互动参与度</div>
          <div class="ring ring-blue">
            <span>78%</span>
          </div>
          <p>稳定上升趋势</p>
        </div>
        <div class="dashboard-card">
          <div class="dashboard-title">情绪稳定度</div>
          <div class="ring ring-green">
            <span>91%</span>
          </div>
          <p>波动较小</p>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="section-title">反馈趋势图</div>
      <div class="trend">
        <div v-for="item in trend" :key="item.label" class="trend-item">
          <div class="trend-label">{{ item.label }}</div>
          <div class="trend-bar">
            <div class="trend-fill" :style="{ width: item.value + '%' }"></div>
          </div>
          <div class="trend-value">{{ item.value }}%</div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="section-title">可视化快照记录（20条）</div>
      <div class="action-row">
        <button class="btn primary" @click="openModal('export')">导出报告</button>
        <button class="btn" @click="openModal('progress')">生成进度</button>
        <button class="btn ghost" @click="openModal('tip')">查看提示</button>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>时间</th>
            <th>教学场景</th>
            <th>指标焦点</th>
            <th>评分</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.time">
            <td>{{ row.time }}</td>
            <td>{{ row.scene }}</td>
            <td>{{ row.focus }}</td>
            <td>{{ row.score }}</td>
            <td><span class="badge" :class="row.statusClass">{{ row.status }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <Modal v-if="activeModal === 'export'" title="导出可视化报告" @close="closeModal">
      <div class="form-grid">
        <label class="form-field">
          报告名称
          <input placeholder="如：课堂反馈周报" />
        </label>
        <label class="form-field">
          导出格式
          <select>
            <option>PDF</option>
            <option>PPT</option>
            <option>PNG 图集</option>
          </select>
        </label>
        <label class="form-field">
          数据范围
          <select>
            <option>最近 7 天</option>
            <option>最近 30 天</option>
            <option>自定义区间</option>
          </select>
        </label>
        <label class="form-field">
          备注
          <textarea rows="2" placeholder="补充说明"></textarea>
        </label>
      </div>
      <template #actions>
        <button class="btn ghost" type="button" @click="closeModal">取消</button>
        <button class="btn primary" type="button" @click="closeModal">开始导出</button>
      </template>
    </Modal>

    <Modal v-if="activeModal === 'progress'" title="生成进度" @close="closeModal">
      <p>可视化报告正在生成，包含 12 张图表。</p>
      <div class="progress-bar">
        <div class="progress-value" style="width: 46%"></div>
      </div>
      <p>预计 1 分钟内完成并可下载。</p>
    </Modal>

    <Modal v-if="activeModal === 'tip'" title="提示信息" @close="closeModal">
      <p>点击表格中的某条记录，可在右侧详情面板查看对应的课堂反馈解读。</p>
    </Modal>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Modal from '../components/Modal.vue';

const activeModal = ref('');

const trend = [
  { label: '周一', value: 72 },
  { label: '周二', value: 76 },
  { label: '周三', value: 81 },
  { label: '周四', value: 78 },
  { label: '周五', value: 85 },
  { label: '周六', value: 69 }
];

const rows = Array.from({ length: 20 }, (_, index) => {
  const status = index % 3 === 0 ? '已发布' : index % 3 === 1 ? '待审核' : '已归档';
  const statusClass = status === '已发布' ? 'green' : status === '待审核' ? 'orange' : 'blue';
  return {
    time: `2024-04-${String(index + 1).padStart(2, '0')} 14:00`,
    scene: `课堂 ${index + 1}`,
    focus: index % 2 === 0 ? '专注度' : '互动热度',
    score: `${80 + index}%`,
    status,
    statusClass
  };
});

const openModal = (name) => {
  activeModal.value = name;
};

const closeModal = () => {
  activeModal.value = '';
};
</script>

<style scoped>
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.dashboard-card {
  background: #f7f9ff;
  border-radius: 14px;
  padding: 16px;
  display: grid;
  gap: 10px;
  text-align: center;
}

.dashboard-title {
  font-weight: 600;
}

.ring {
  width: 120px;
  height: 120px;
  margin: 0 auto;
  border-radius: 50%;
  background: conic-gradient(#5f89ff 0deg 310deg, #e5ecf7 310deg 360deg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: #2b4c9c;
}

.ring-blue {
  background: conic-gradient(#49b1ff 0deg 280deg, #e5ecf7 280deg 360deg);
}

.ring-green {
  background: conic-gradient(#45c38b 0deg 330deg, #e5ecf7 330deg 360deg);
}

.trend {
  display: grid;
  gap: 12px;
}

.trend-item {
  display: grid;
  grid-template-columns: 60px 1fr 60px;
  align-items: center;
  gap: 12px;
}

.trend-bar {
  height: 10px;
  background: #eef2f8;
  border-radius: 999px;
  overflow: hidden;
}

.trend-fill {
  height: 100%;
  background: linear-gradient(90deg, #55a7ff, #7ee3ff);
}

.trend-value {
  text-align: right;
  font-weight: 600;
}

.action-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
}
</style>
