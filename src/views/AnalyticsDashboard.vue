<template>
  <div class="module">
    <div class="summary-grid">
      <div class="card highlight">
        <div class="label">本月 GMV</div>
        <div class="value">¥ 12.8M</div>
        <div class="hint">同比 +18%</div>
      </div>
      <div class="card">
        <div class="label">复购率</div>
        <div class="value">41.2%</div>
        <div class="hint">高于目标 6%</div>
      </div>
      <div class="card">
        <div class="label">直播转化</div>
        <div class="value">15.6%</div>
        <div class="hint">本周 +1.4%</div>
      </div>
    </div>

    <div class="panel">
      <div class="panel-header">
        <div>
          <div class="panel-title">运营数据看板</div>
          <div class="panel-sub">洞察各渠道 GMV、转化率与客单价趋势。</div>
        </div>
        <div class="actions">
          <button class="primary" @click="openModal('form')">生成报告</button>
          <button class="ghost" @click="openModal('progress')">刷新数据</button>
          <button class="ghost" @click="openModal('tip')">运营建议</button>
        </div>
      </div>

      <div class="content-grid">
        <div class="chart">
          <div class="chart-title">近10日 GMV 走势</div>
          <div class="bars">
            <div v-for="item in gmvTrend" :key="item.day" class="bar-item">
              <div class="bar" :style="{ height: item.value + '%' }"></div>
              <span>{{ item.day }}</span>
            </div>
          </div>
        </div>
        <div class="table">
          <div class="table-title">渠道表现</div>
          <table>
            <thead>
              <tr>
                <th>渠道</th>
                <th>GMV</th>
                <th>转化率</th>
                <th>客单价</th>
                <th>增长</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in channels" :key="item.name">
                <td>{{ item.name }}</td>
                <td>{{ item.gmv }}</td>
                <td>{{ item.rate }}</td>
                <td>{{ item.aov }}</td>
                <td>{{ item.growth }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="panel">
      <div class="panel-header">
        <div>
          <div class="panel-title">运营监控事件</div>
          <div class="panel-sub">监测异常波动与重点活动。</div>
        </div>
        <button class="ghost" @click="openModal('form')">新增监控规则</button>
      </div>
      <div class="table">
        <table>
          <thead>
            <tr>
              <th>事件</th>
              <th>触发条件</th>
              <th>负责人</th>
              <th>级别</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in events" :key="item.name">
              <td>{{ item.name }}</td>
              <td>{{ item.rule }}</td>
              <td>{{ item.owner }}</td>
              <td>{{ item.level }}</td>
              <td>{{ item.status }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="modalOpen" class="modal-backdrop">
      <div class="modal">
        <template v-if="modalType === 'form'">
          <h3>生成运营报告</h3>
          <form class="form">
            <label>报告周期<select><option>近7日</option><option>近30日</option><option>本季度</option></select></label>
            <label>关注指标<select><option>GMV</option><option>转化率</option><option>复购率</option></select></label>
            <label>接收邮箱<input type="email" placeholder="输入邮箱" /></label>
            <button type="button" class="primary" @click="closeModal">生成并发送</button>
          </form>
        </template>
        <template v-else-if="modalType === 'progress'">
          <h3>数据刷新中</h3>
          <p>正在同步渠道与仓配数据。</p>
          <div class="progress">
            <div class="progress-bar" :style="{ width: '70%' }"></div>
          </div>
          <button class="primary" @click="closeModal">完成</button>
        </template>
        <template v-else>
          <h3>运营建议</h3>
          <ul>
            <li>晚间场次客单价高，可加大推广。</li>
            <li>内容复用率下降，建议优化脚本。</li>
            <li>复购率提升可尝试会员券。</li>
          </ul>
          <button class="primary" @click="closeModal">已了解</button>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const modalOpen = ref(false);
const modalType = ref("form");

const openModal = (type) => {
  modalType.value = type;
  modalOpen.value = true;
};

const closeModal = () => {
  modalOpen.value = false;
};

const gmvTrend = [
  { day: "D1", value: 62 },
  { day: "D2", value: 70 },
  { day: "D3", value: 58 },
  { day: "D4", value: 80 },
  { day: "D5", value: 76 },
  { day: "D6", value: 84 },
  { day: "D7", value: 90 },
  { day: "D8", value: 68 },
  { day: "D9", value: 88 },
  { day: "D10", value: 75 }
];

const channels = [
  { name: "直播间", gmv: "¥5.2M", rate: "16.8%", aov: "¥168", growth: "+12%" },
  { name: "短视频", gmv: "¥2.9M", rate: "12.4%", aov: "¥142", growth: "+8%" },
  { name: "社群团购", gmv: "¥1.8M", rate: "18.2%", aov: "¥210", growth: "+15%" },
  { name: "商城首页", gmv: "¥1.5M", rate: "9.6%", aov: "¥125", growth: "+6%" },
  { name: "会员专区", gmv: "¥680K", rate: "22.1%", aov: "¥260", growth: "+9%" },
  { name: "品牌联名", gmv: "¥520K", rate: "14.8%", aov: "¥198", growth: "+11%" },
  { name: "社媒引流", gmv: "¥430K", rate: "10.3%", aov: "¥132", growth: "+4%" },
  { name: "线下快闪", gmv: "¥380K", rate: "19.5%", aov: "¥240", growth: "+13%" },
  { name: "团长分销", gmv: "¥350K", rate: "17.9%", aov: "¥205", growth: "+7%" },
  { name: "新客专场", gmv: "¥290K", rate: "13.6%", aov: "¥118", growth: "+5%" }
];

const events = [
  { name: "GMV 突增", rule: "30分钟增长>15%", owner: "王琳", level: "高", status: "跟进中" },
  { name: "复购下降", rule: "周环比下降>5%", owner: "陈彬", level: "中", status: "已处理" },
  { name: "客单异常", rule: "客单低于¥100", owner: "郑芸", level: "中", status: "监控中" },
  { name: "库存告警", rule: "库存低于20%", owner: "傅强", level: "高", status: "处理完成" },
  { name: "直播流失", rule: "停留时长下降", owner: "罗菲", level: "中", status: "优化中" },
  { name: "转化提升", rule: "转化率提升>3%", owner: "梁润", level: "低", status: "已记录" },
  { name: "投诉预警", rule: "投诉量>10", owner: "孙悦", level: "高", status: "处理中" },
  { name: "活动触达", rule: "触达<50%", owner: "贺倩", level: "中", status: "跟进中" },
  { name: "物流延迟", rule: "超时率>3%", owner: "曹刚", level: "高", status: "处理中" },
  { name: "内容热度", rule: "互动下降>8%", owner: "朱宁", level: "中", status: "已处理" }
];
</script>

<style scoped>
.module {
  display: grid;
  gap: 24px;
}

.summary-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.card {
  background: #ffffff;
  padding: 18px;
  border-radius: 16px;
  box-shadow: 0 10px 24px rgba(30, 60, 114, 0.08);
  display: grid;
  gap: 8px;
}

.card.highlight {
  background: linear-gradient(135deg, #e9f3ff, #ffffff);
}

.label {
  font-size: 13px;
  color: #7a8bad;
}

.value {
  font-size: 22px;
  font-weight: 700;
}

.hint {
  font-size: 12px;
  color: #6c7ea0;
}

.panel {
  background: #ffffff;
  border-radius: 18px;
  padding: 20px;
  display: grid;
  gap: 16px;
  box-shadow: 0 12px 30px rgba(30, 60, 114, 0.08);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  align-items: center;
}

.panel-title {
  font-weight: 600;
}

.panel-sub {
  color: #7a8bad;
  font-size: 12px;
  margin-top: 4px;
}

.actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

button {
  border: none;
  border-radius: 10px;
  padding: 10px 14px;
  cursor: pointer;
}

button.primary {
  background: linear-gradient(135deg, #3a7bff, #5ed0ff);
  color: #ffffff;
}

button.ghost {
  background: #f1f5ff;
  color: #35548b;
}

.content-grid {
  display: grid;
  gap: 18px;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

.chart {
  background: #f8faff;
  border-radius: 16px;
  padding: 16px;
}

.chart-title {
  font-weight: 600;
  margin-bottom: 10px;
}

.bars {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 6px;
  align-items: end;
  height: 160px;
}

.bar-item {
  display: grid;
  gap: 6px;
  justify-items: center;
  font-size: 11px;
  color: #6b7d9f;
}

.bar {
  width: 100%;
  background: linear-gradient(180deg, #3a7bff, #a4d8ff);
  border-radius: 6px 6px 2px 2px;
}

.table table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.table th,
.table td {
  padding: 10px 8px;
  text-align: left;
  border-bottom: 1px solid #eef2f8;
}

.table-title {
  font-weight: 600;
  margin-bottom: 8px;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20;
}

.modal {
  width: min(420px, 90%);
  background: #ffffff;
  padding: 24px;
  border-radius: 16px;
  display: grid;
  gap: 16px;
}

.form {
  display: grid;
  gap: 12px;
}

.form label {
  display: grid;
  gap: 6px;
  font-size: 13px;
  color: #4a5b7c;
}

.form input,
.form select {
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid #d7dfef;
  background: #f9fbff;
}

.progress {
  height: 10px;
  border-radius: 999px;
  background: #eef3ff;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #3a7bff, #5ed0ff);
}

@media (max-width: 720px) {
  .panel-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
