<template>
  <div class="page">
    <div class="header card">
      <div>
        <p class="section-title">标准与产品匹配引擎</p>
        <p class="sub">精准匹配客户需求并推荐方案</p>
      </div>
      <div class="actions">
        <button class="action-btn" @click="openModal('run')">启动匹配</button>
        <button class="action-btn secondary" @click="openModal('recommend')">查看方案</button>
        <button class="action-btn secondary" @click="openModal('notify')">发送提醒</button>
        <button class="action-btn secondary" @click="openModal('tip')">操作提示</button>
      </div>
    </div>

    <div class="grid">
      <div class="card">
        <p class="section-title">匹配热力图</p>
        <div class="heatmap">
          <div v-for="cell in heatmap" :key="cell.label" class="cell" :style="{ opacity: cell.value }">
            <span>{{ cell.label }}</span>
          </div>
        </div>
      </div>
      <div class="card">
        <p class="section-title">推荐方案</p>
        <ul class="plan-list">
          <li v-for="plan in plans" :key="plan.name">
            <div>
              <strong>{{ plan.name }}</strong>
              <p>{{ plan.desc }}</p>
            </div>
            <span class="badge info">{{ plan.score }}%</span>
          </li>
        </ul>
      </div>
    </div>

    <div class="card">
      <p class="section-title">匹配记录（{{ matches.length }} 条）</p>
      <table class="table">
        <thead>
          <tr>
            <th>客户</th>
            <th>需求规格</th>
            <th>推荐标准</th>
            <th>相似度</th>
            <th>方案负责人</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="match in matches" :key="match.id">
            <td>{{ match.client }}</td>
            <td>{{ match.spec }}</td>
            <td>{{ match.standard }}</td>
            <td>{{ match.score }}%</td>
            <td>{{ match.owner }}</td>
            <td><span class="badge" :class="match.statusClass">{{ match.status }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <AppModal v-model="modalVisible" :title="modalTitle" @confirm="modalVisible = false">
      <div v-if="modalType === 'run'" class="modal-block">
        <p>系统正在执行 24 条需求的匹配分析。</p>
        <div class="progress-bar">
          <span :style="{ width: `${runProgress}%` }"></span>
        </div>
        <p class="status">实时匹配进度：{{ runProgress }}%</p>
      </div>
      <div v-else-if="modalType === 'recommend'" class="modal-block">
        <p>推荐方案详情：</p>
        <ul>
          <li v-for="item in plans" :key="item.name">{{ item.name }} · {{ item.desc }}</li>
        </ul>
        <label>
          输出方式
          <select class="input">
            <option>生成方案文档</option>
            <option>同步至报价中心</option>
          </select>
        </label>
      </div>
      <div v-else-if="modalType === 'tip'" class="modal-block">
        <p>提示：匹配引擎会根据客户规格自动推荐可行标准与工艺方案。</p>
        <ul>
          <li>建议在匹配前确保需求信息完整。</li>
          <li>推荐方案可直接同步至报价中心。</li>
        </ul>
      </div>
      <div v-else class="modal-block">
        <p>将匹配结果通知销售与技术团队。</p>
        <label>
          通知渠道
          <select class="input">
            <option>企业微信</option>
            <option>邮件</option>
            <option>协同看板</option>
          </select>
        </label>
        <label>
          附加说明
          <textarea class="input" rows="3" placeholder="请输入说明"></textarea>
        </label>
      </div>
    </AppModal>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import AppModal from '../components/AppModal.vue';

const heatmap = [
  { label: '轴承钢', value: 0.9 },
  { label: '模具钢', value: 0.7 },
  { label: '齿轮钢', value: 0.8 },
  { label: '耐热钢', value: 0.6 },
  { label: '高温合金', value: 0.5 },
  { label: '高速钢', value: 0.75 }
];

const plans = [
  { name: '高洁净轴承方案', desc: '控制夹杂≤1.0级，匹配高疲劳需求', score: 94 },
  { name: '模具钢快交付方案', desc: '优化热处理窗口，缩短交期8天', score: 88 },
  { name: '耐热钢梯度控碳方案', desc: '满足高温蠕变与韧性双目标', score: 83 }
];

const matches = ref(
  Array.from({ length: 21 }, (_, i) => ({
    id: i + 1,
    client: ['华东汽配', '重型装备', '能源装备', '轨道交通', '海工平台'][i % 5],
    spec: `Φ${50 + i}*${100 + i}mm`,
    standard: ['STD-2024-01', 'STD-2024-05', 'STD-2024-12', 'STD-2024-18'][i % 4],
    score: 78 + (i % 10),
    owner: ['赵工', '钱工', '孙工', '李工'][i % 4],
    status: i % 3 === 0 ? '方案确认' : i % 3 === 1 ? '待评审' : '匹配完成',
    statusClass: i % 3 === 0 ? 'success' : i % 3 === 1 ? 'warn' : 'info'
  }))
);

const modalVisible = ref(false);
const modalType = ref('run');
const modalTitle = ref('启动匹配');
const runProgress = ref(12);

const openModal = (type) => {
  modalType.value = type;
  modalTitle.value =
    type === 'run' ? '启动匹配' : type === 'recommend' ? '推荐方案' : type === 'notify' ? '发送提醒' : '操作提示';
  modalVisible.value = true;
};

watch(modalVisible, (visible) => {
  if (visible && modalType.value === 'run') {
    runProgress.value = 10;
    const timer = setInterval(() => {
      runProgress.value += 18;
      if (runProgress.value >= 100) {
        runProgress.value = 100;
        clearInterval(timer);
      }
    }, 200);
  }
});
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.sub {
  margin: 6px 0 0;
  font-size: 13px;
  color: #6b7a99;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 18px;
}

.heatmap {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
}

.cell {
  background: #2f6df6;
  color: #fff;
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  font-weight: 600;
}

.plan-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.plan-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f6f8ff;
  padding: 12px;
  border-radius: 12px;
}

.plan-list p {
  margin: 6px 0 0;
  color: #6b7a99;
  font-size: 12px;
}

.modal-block {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.status {
  color: #2f6df6;
}
</style>
