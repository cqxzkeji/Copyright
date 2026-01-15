<template>
  <div class="module">
    <section class="module-header">
      <div>
        <h2>运行监控</h2>
        <p>实时监测装备状态、关键参数与运行趋势。</p>
      </div>
      <div class="actions">
        <button @click="openModal('alert')">异常提示设置</button>
        <button @click="openModal('trend')">趋势预测</button>
        <button @click="openModal('progress')">状态同步进度</button>
      </div>
    </section>

    <div class="cards">
      <div class="card">
        <h3>实时状态</h3>
        <p>在线率 96%，告警设备 4 台。</p>
        <div class="metric">
          <span>CPU 平均负载</span>
          <strong>62%</strong>
        </div>
        <div class="metric">
          <span>主链路丢包率</span>
          <strong>0.8%</strong>
        </div>
      </div>
      <div class="card">
        <h3>异常提示</h3>
        <p>今日已触发 9 条异常告警。</p>
        <ul>
          <li>EC-004 链路抖动</li>
          <li>EC-010 电池温度异常</li>
          <li>EC-016 传感器校准偏移</li>
        </ul>
      </div>
      <div class="card">
        <h3>运行趋势</h3>
        <p>过去 6 小时负载趋势稳定。</p>
        <div class="trend">
          <span v-for="point in trend" :key="point" :style="{ height: point + '%' }" />
        </div>
      </div>
    </div>

    <div class="table-card">
      <h3>运行参数监测表</h3>
      <table>
        <thead>
          <tr>
            <th>设备编号</th>
            <th>场景</th>
            <th>运行状态</th>
            <th>功耗</th>
            <th>温度</th>
            <th>更新时间</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in monitorList" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.scene }}</td>
            <td>{{ item.status }}</td>
            <td>{{ item.power }}</td>
            <td>{{ item.temp }}</td>
            <td>{{ item.time }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <ModalDialog
      :open="modal.open"
      :title="modal.title"
      :confirm-text="modal.confirmText"
      @close="modal.open = false"
      @confirm="modal.open = false"
    >
      <div v-if="modal.type === 'alert'">
        <p>设置异常提示策略，支持多级告警。</p>
        <form class="form-grid">
          <label>告警级别<select><option>一级</option><option>二级</option><option>三级</option></select></label>
          <label>触发阈值<input placeholder="如：温度 > 80℃" /></label>
          <label>通知方式<select><option>短信</option><option>平台弹窗</option><option>邮件</option></select></label>
          <label>值班人<select><option>监控组 A</option><option>监控组 B</option></select></label>
        </form>
      </div>
      <div v-else-if="modal.type === 'trend'">
        <p>趋势预测结果将在 3 分钟内生成。</p>
        <form class="form-grid">
          <label>预测周期<select><option>24 小时</option><option>72 小时</option><option>7 天</option></select></label>
          <label>关注指标<select><option>负载</option><option>功耗</option><option>链路质量</option></select></label>
          <label>输出格式<select><option>可视化报告</option><option>数据表</option></select></label>
          <label>生成频率<select><option>单次</option><option>每日自动</option></select></label>
        </form>
      </div>
      <div v-else>
        <p>正在同步 128 台设备状态。</p>
        <div class="progress">
          <div class="bar" :style="{ width: '68%' }"></div>
        </div>
        <p class="progress-text">已完成 68%，预计 40 秒</p>
      </div>
    </ModalDialog>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const trend = [30, 50, 40, 70, 60, 80, 65, 72, 68, 75, 60, 55];

const monitorList = Array.from({ length: 20 }, (_, index) => {
  const id = `EC-${String(index + 1).padStart(3, '0')}`;
  const scenes = ['海域巡防', '机库保障', '港口指挥', '边境警戒', '远程监控'];
  const statuses = ['运行中', '待命', '维护中'];
  return {
    id,
    scene: scenes[index % scenes.length],
    status: statuses[index % statuses.length],
    power: `${48 + (index % 6) * 4} kW`,
    temp: `${42 + (index % 8)} ℃`,
    time: `10:${String(10 + index).padStart(2, '0')}`
  };
});

const modal = reactive({
  open: false,
  type: '',
  title: '',
  confirmText: ''
});

const openModal = (type) => {
  modal.open = true;
  modal.type = type;
  const titles = {
    alert: '异常提示设置',
    trend: '趋势预测',
    progress: '状态同步'
  };
  modal.title = titles[type];
  modal.confirmText = type === 'progress' ? '' : '保存设置';
};
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.module-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.actions button {
  border: none;
  background: #eef3ff;
  color: #2f3c4a;
  padding: 8px 16px;
  border-radius: 10px;
  cursor: pointer;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.card {
  background: #ffffff;
  padding: 18px;
  border-radius: 16px;
  box-shadow: 0 10px 20px rgba(32, 64, 122, 0.08);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.metric {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #5b6b82;
}

.trend {
  display: flex;
  gap: 6px;
  align-items: flex-end;
  height: 80px;
}

.trend span {
  width: 12px;
  background: linear-gradient(120deg, #2f80ed, #56ccf2);
  border-radius: 6px 6px 0 0;
}

.table-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 10px 20px rgba(32, 64, 122, 0.08);
}

.table-card table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.table-card th,
.table-card td {
  text-align: left;
  padding: 10px 8px;
  border-bottom: 1px solid #eef2fb;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.form-grid label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 14px;
  color: #5b6b82;
}

.form-grid input,
.form-grid select {
  padding: 8px 10px;
  border-radius: 10px;
  border: 1px solid #d9e3f3;
  background: #f7faff;
}

.progress {
  height: 10px;
  background: #e4ecfb;
  border-radius: 6px;
  overflow: hidden;
  margin-top: 12px;
}

.bar {
  height: 100%;
  background: linear-gradient(120deg, #2f80ed, #56ccf2);
}

.progress-text {
  margin-top: 10px;
  color: #5b6b82;
}
</style>
