<template>
  <div class="module">
    <div class="grid cols-2">
      <div class="card">
        <div class="header">
          <div>
            <h3>健康指数</h3>
            <p class="muted">融合温度、振动、局放与历史缺陷的综合评分</p>
          </div>
          <button class="btn" @click="openProgress('重新评估中...')">重新计算</button>
        </div>
        <div class="score">
          <div class="circle">
            <div class="value">{{ score }}</div>
            <div class="sub">HI</div>
          </div>
          <div class="score-info">
            <p>评分建议：{{ advice }}</p>
            <p class="muted">风险标签：{{ tags.join(' / ') }}</p>
            <button class="btn secondary" @click="openForm('添加巡检记录')">添加巡检记录</button>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="header">
          <div>
            <h3>寿命消耗趋势</h3>
            <p class="muted">近 24 小时的等效寿命消耗率</p>
          </div>
          <button class="btn ghost" @click="openAlert('已下载寿命报表。')">导出</button>
        </div>
        <div class="chart">
          <svg viewBox="0 0 320 140">
            <rect v-for="(item, idx) in life" :key="idx" :x="idx * 45 + 10" :y="140 - item.value" width="28" :height="item.value" :fill="item.color" rx="6" />
            <text v-for="(item, idx) in life" :key="idx + '-label'" :x="idx * 45 + 24" y="135" font-size="10" text-anchor="middle" fill="#475569">{{ item.label }}</text>
          </svg>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="header">
        <div>
          <h3>维护任务排期</h3>
          <p class="muted">结合健康指数生成的建议任务</p>
        </div>
        <button class="btn" @click="openForm('新增维护任务')">新增任务</button>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>任务</th>
            <th>责任人</th>
            <th>优先级</th>
            <th>截止</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="task in tasks" :key="task.title">
            <td>{{ task.title }}</td>
            <td>{{ task.owner }}</td>
            <td><span class="badge" :class="task.badge">{{ task.priority }}</span></td>
            <td>{{ task.deadline }}</td>
            <td class="actions">
              <button class="btn secondary" @click="openAlert(`${task.title} 已派工`)">派工</button>
              <button class="btn ghost" @click="openProgress('正在跟踪任务进展…')">跟踪</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="modal.visible" class="modal-backdrop">
      <div class="modal-panel">
        <h3>{{ modal.title }}</h3>
        <form v-if="modal.type === 'form'" @submit.prevent="submitForm">
          <div class="form-row">
            <label>任务/记录</label>
            <input v-model="form.title" required />
          </div>
          <div class="form-row">
            <label>说明</label>
            <textarea v-model="form.remark" rows="2" required></textarea>
          </div>
          <div class="modal-actions">
            <button class="btn" type="submit">保存</button>
            <button class="btn ghost" type="button" @click="closeModal">取消</button>
          </div>
        </form>
        <div v-else-if="modal.type === 'progress'">
          <p class="muted">{{ modal.message }}</p>
          <div class="progress-bar"><div class="fill" :style="{ width: modal.progress + '%' }"></div></div>
          <p class="muted">{{ modal.progress }}% 完成</p>
          <div class="modal-actions">
            <button class="btn ghost" @click="closeModal">关闭</button>
          </div>
        </div>
        <div v-else>
          <p class="muted">{{ modal.message }}</p>
          <div class="modal-actions">
            <button class="btn" @click="closeModal">知道了</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const score = 86;
const advice = '可带负荷运行，保持每 2 小时复核。';
const tags = ['温升良好', '振动趋稳', '局放可控'];

const life = [
  { label: '00h', value: 60, color: '#1e88e5' },
  { label: '06h', value: 80, color: '#22c55e' },
  { label: '12h', value: 110, color: '#f59e0b' },
  { label: '18h', value: 95, color: '#6366f1' },
  { label: '24h', value: 70, color: '#0ea5e9' },
];

const tasks = reactive([
  { title: '绕组紧固复检', owner: '刘峰', priority: '高', badge: 'danger', deadline: '今天 18:00' },
  { title: '油色谱采样', owner: '王琪', priority: '中', badge: 'warning', deadline: '明天 10:00' },
  { title: '风冷系统检查', owner: '赵丽', priority: '中', badge: 'warning', deadline: '周五 09:30' },
  { title: '局放巡检', owner: '张弛', priority: '低', badge: 'success', deadline: '周六 16:00' },
  { title: '报警逻辑复核', owner: '程浩', priority: '低', badge: 'success', deadline: '下周一 09:00' },
]);

const modal = reactive({ visible: false, type: 'alert', title: '', message: '', progress: 0 });
const form = reactive({ title: '', remark: '' });
const timer = ref(null);

const openForm = (title) => {
  modal.visible = true;
  modal.type = 'form';
  modal.title = title;
};

const openProgress = (message) => {
  modal.visible = true;
  modal.type = 'progress';
  modal.title = '处理中';
  modal.message = message;
  modal.progress = 25;
  clearInterval(timer.value);
  timer.value = setInterval(() => {
    if (modal.progress >= 100) {
      clearInterval(timer.value);
    } else {
      modal.progress += 12;
    }
  }, 500);
};

const openAlert = (message) => {
  modal.visible = true;
  modal.type = 'alert';
  modal.title = '提示';
  modal.message = message;
};

const submitForm = () => {
  modal.type = 'alert';
  modal.title = '已保存';
  modal.message = '信息已同步到健康档案。';
};

const closeModal = () => {
  modal.visible = false;
  clearInterval(timer.value);
};
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.score {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 12px;
}

.circle {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: conic-gradient(var(--primary) 0deg, #42b9f5 220deg, #e2e8f0 220deg);
  color: white;
}

.circle .value {
  font-size: 40px;
  font-weight: 800;
}

.circle .sub {
  font-weight: 700;
  opacity: 0.9;
}

.score-info {
  flex: 1;
}

.chart {
  margin-top: 12px;
  background: linear-gradient(180deg, rgba(14, 165, 233, 0.06), transparent);
  border-radius: 12px;
  padding: 8px;
}

.actions {
  display: flex;
  gap: 8px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 12px;
}
</style>
