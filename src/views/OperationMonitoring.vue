<template>
  <section class="module">
    <div class="module-header">
      <div>
        <h3>运行监控与安全防护</h3>
        <p>实时采集关键运行指标，提供限位保护、异常报警与急停控制。</p>
      </div>
      <div class="module-actions">
        <button class="secondary" type="button" @click="openModal('limit')">限位保护</button>
        <button class="secondary" type="button" @click="openModal('alarm')">异常报警</button>
        <button class="danger" type="button" @click="openModal('stop')">紧急停机</button>
      </div>
    </div>
    <div class="summary-grid">
      <div class="card">
        <h4>实时健康评分</h4>
        <p class="metric">92 分</p>
        <span>异常等级：低</span>
      </div>
      <div class="card">
        <h4>安全边界触发</h4>
        <p class="metric">4 次</p>
        <span>本周触发记录</span>
      </div>
      <div class="card">
        <h4>故障记录</h4>
        <p class="metric">1 条</p>
        <span>正在处理</span>
      </div>
    </div>
    <div class="panel">
      <div class="panel-header">
        <h4>运行监控日志</h4>
        <button class="ghost" type="button" @click="openModal('notice')">监控提示</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>事件编号</th>
            <th>监控点</th>
            <th>指标值</th>
            <th>状态评估</th>
            <th>触发策略</th>
            <th>时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="log in logs" :key="log.id">
            <td>{{ log.id }}</td>
            <td>{{ log.point }}</td>
            <td>{{ log.value }}</td>
            <td>{{ log.status }}</td>
            <td>{{ log.rule }}</td>
            <td>{{ log.time }}</td>
            <td>
              <button class="table-button" type="button" @click="openRowModal(log)">查看</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <BaseModal v-if="activeModal" :title="modalTitle" @close="closeModal" @confirm="closeModal">
      <template v-if="activeModal === 'limit'">
        <p>设置关节限位与安全边界参数。</p>
        <div class="modal-grid">
          <label>
            最大关节角度
            <input v-model="modalForm.limit" type="text" />
          </label>
          <label>
            安全缓冲区
            <input v-model="modalForm.buffer" type="text" />
          </label>
        </div>
      </template>
      <template v-else-if="activeModal === 'alarm'">
        <p>配置异常报警策略与通知方式。</p>
        <div class="modal-grid">
          <label>
            报警阈值
            <input v-model="modalForm.threshold" type="text" />
          </label>
          <label>
            通知方式
            <select v-model="modalForm.notify">
              <option value="sms">短信 + 邮件</option>
              <option value="app">App 推送</option>
              <option value="center">控制中心播报</option>
            </select>
          </label>
        </div>
      </template>
      <template v-else-if="activeModal === 'stop'">
        <p>紧急停机将立即中断所有任务并保持安全锁定。</p>
        <div class="modal-grid">
          <label>
            停机原因
            <input v-model="modalForm.reason" type="text" />
          </label>
          <label>
            处理人员
            <input v-model="modalForm.operator" type="text" />
          </label>
        </div>
      </template>
      <template v-else-if="activeModal === 'notice'">
        <p>监控系统已接入限位、振动与温度传感器。</p>
        <ul>
          <li>异常报警将同步至运维中心与现场控制面板。</li>
          <li>紧急停机需要安全人员复位后方可恢复。</li>
          <li>故障记录可用于追溯与统计分析。</li>
        </ul>
      </template>
      <template v-else-if="activeModal === 'row'">
        <p>查看事件 {{ selectedLog?.id }} 的详细信息。</p>
        <div class="modal-grid">
          <label>
            处置建议
            <select v-model="modalForm.action">
              <option value="observe">继续观察</option>
              <option value="diagnose">立即诊断</option>
              <option value="stop">启动安全停机</option>
            </select>
          </label>
          <label>
            备注
            <input v-model="modalForm.note" type="text" />
          </label>
        </div>
      </template>
    </BaseModal>
  </section>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const activeModal = ref('');
const selectedLog = ref(null);

const modalForm = reactive({
  limit: '±165°',
  buffer: '5°',
  threshold: '振动 > 2.5g',
  notify: 'sms',
  reason: '外部异常触发',
  operator: '安全员-07',
  action: 'diagnose',
  note: ''
});

const logs = Array.from({ length: 20 }, (_, index) => ({
  id: `EV-${(index + 1).toString().padStart(3, '0')}`,
  point: ['关节温度', '振动监控', '安全边界', '伺服电流'][index % 4],
  value: index % 2 === 0 ? `${36 + index}°C` : `${1.2 + index * 0.05}g`,
  status: index % 3 === 0 ? '预警' : '正常',
  rule: ['阈值监控', '趋势分析', '快速响应'][index % 3],
  time: `2024-07-${(index % 28 + 1).toString().padStart(2, '0')} 10:${(index * 3) % 60}`
}));

const modalTitle = computed(() => {
  const titles = {
    limit: '限位保护设置',
    alarm: '异常报警设置',
    stop: '紧急停机确认',
    notice: '监控提示',
    row: '事件详情'
  };
  return titles[activeModal.value] || '';
});

const openModal = (type) => {
  activeModal.value = type;
};

const openRowModal = (log) => {
  selectedLog.value = log;
  activeModal.value = 'row';
};

const closeModal = () => {
  activeModal.value = '';
};
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.module-header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.module-header p {
  color: #64748b;
  margin-top: 6px;
}

.module-actions {
  display: flex;
  gap: 12px;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.card {
  background: #ffffff;
  padding: 16px;
  border-radius: 16px;
  box-shadow: 0 14px 30px rgba(15, 23, 42, 0.08);
  display: grid;
  gap: 8px;
}

.card .metric {
  font-size: 26px;
  font-weight: 700;
}

.panel {
  background: #ffffff;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 14px 30px rgba(15, 23, 42, 0.08);
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.panel h4 {
  font-size: 18px;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

th,
td {
  text-align: left;
  padding: 10px 8px;
  border-bottom: 1px solid #eef2f7;
}

.table-button {
  border: none;
  background: #e0e7ff;
  color: #1d4ed8;
  padding: 6px 12px;
  border-radius: 8px;
  cursor: pointer;
}

.primary {
  background: #2563eb;
  color: #fff;
  border: none;
  padding: 10px 16px;
  border-radius: 10px;
  cursor: pointer;
}

.secondary {
  background: #e2e8f0;
  border: none;
  padding: 10px 16px;
  border-radius: 10px;
  cursor: pointer;
}

.danger {
  background: #ef4444;
  color: #fff;
  border: none;
  padding: 10px 16px;
  border-radius: 10px;
  cursor: pointer;
}

.ghost {
  background: none;
  border: none;
  color: #2563eb;
  cursor: pointer;
}

.modal-grid {
  display: grid;
  gap: 12px;
}
</style>
