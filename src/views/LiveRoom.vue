<template>
  <div class="module">
    <div class="summary-grid">
      <div class="card highlight">
        <div class="label">今日直播场次</div>
        <div class="value">6 场</div>
        <div class="hint">待开播 2 场，进行中 1 场</div>
      </div>
      <div class="card">
        <div class="label">实时在线观众</div>
        <div class="value">28,460</div>
        <div class="hint">互动率 8.6%</div>
      </div>
      <div class="card">
        <div class="label">直播转化率</div>
        <div class="value">14.3%</div>
        <div class="hint">成交 GMV ¥452,300</div>
      </div>
    </div>

    <div class="panel">
      <div class="panel-header">
        <div>
          <div class="panel-title">直播间排期与互动监控</div>
          <div class="panel-sub">实时同步主播排班、互动热度与商品讲解节奏。</div>
        </div>
        <div class="actions">
          <button class="primary" @click="openModal('form')">新增直播排期</button>
          <button class="ghost" @click="openModal('progress')">互动热度提升</button>
          <button class="ghost" @click="openModal('tip')">直播注意事项</button>
        </div>
      </div>

      <div class="content-grid">
        <div class="chart">
          <div class="chart-title">近10场观众峰值</div>
          <div class="bars">
            <div v-for="item in audienceTrend" :key="item.session" class="bar-item">
              <div class="bar" :style="{ height: item.value + '%'}"></div>
              <span>{{ item.session }}</span>
            </div>
          </div>
        </div>
        <div class="table">
          <div class="table-title">直播间排期</div>
          <table>
            <thead>
              <tr>
                <th>场次</th>
                <th>主播</th>
                <th>品类</th>
                <th>开始时间</th>
                <th>互动热度</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in schedule" :key="item.id">
                <td>{{ item.session }}</td>
                <td>{{ item.host }}</td>
                <td>{{ item.category }}</td>
                <td>{{ item.time }}</td>
                <td>{{ item.hot }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="panel">
      <div class="panel-header">
        <div>
          <div class="panel-title">互动指令与客服响应</div>
          <div class="panel-sub">统一管理弹幕关键词、优惠指令与客服排班。</div>
        </div>
        <button class="ghost" @click="openModal('form')">配置互动关键词</button>
      </div>
      <div class="table">
        <table>
          <thead>
            <tr>
              <th>关键词</th>
              <th>触发动作</th>
              <th>回复模板</th>
              <th>生效时间</th>
              <th>执行次数</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in keywordRules" :key="item.word">
              <td>{{ item.word }}</td>
              <td>{{ item.action }}</td>
              <td>{{ item.reply }}</td>
              <td>{{ item.window }}</td>
              <td>{{ item.count }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="modalOpen" class="modal-backdrop">
      <div class="modal">
        <template v-if="modalType === 'form'">
          <h3>新增直播排期</h3>
          <form class="form">
            <label>直播主题<input type="text" placeholder="输入主题" /></label>
            <label>主播<select><option>林海</option><option>文栖</option><option>晓禾</option></select></label>
            <label>开播时间<input type="time" /></label>
            <label>主推品类<select><option>蔬果礼盒</option><option>有机米面</option><option>蜂蜜坚果</option></select></label>
            <button type="button" class="primary" @click="closeModal">提交排期</button>
          </form>
        </template>
        <template v-else-if="modalType === 'progress'">
          <h3>互动热度提升进度</h3>
          <p>自动推送互动指令并优化弹幕节奏。</p>
          <div class="progress">
            <div class="progress-bar" :style="{ width: '72%' }"></div>
          </div>
          <button class="primary" @click="closeModal">完成</button>
        </template>
        <template v-else>
          <h3>直播注意事项</h3>
          <ul>
            <li>开播前确认商品库存与优惠券。</li>
            <li>每15分钟提醒观众领券。</li>
            <li>高热度时段加派客服。</li>
          </ul>
          <button class="primary" @click="closeModal">知道了</button>
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

const audienceTrend = [
  { session: "S1", value: 62 },
  { session: "S2", value: 78 },
  { session: "S3", value: 55 },
  { session: "S4", value: 84 },
  { session: "S5", value: 73 },
  { session: "S6", value: 69 },
  { session: "S7", value: 91 },
  { session: "S8", value: 60 },
  { session: "S9", value: 86 },
  { session: "S10", value: 74 }
];

const schedule = [
  { id: 1, session: "晨间鲜采", host: "林海", category: "绿叶菜", time: "09:00", hot: "高" },
  { id: 2, session: "午间礼盒", host: "文栖", category: "果蔬礼盒", time: "11:30", hot: "中" },
  { id: 3, session: "品质主推", host: "晓禾", category: "有机米面", time: "13:00", hot: "高" },
  { id: 4, session: "下午茶歇", host: "鹿鸣", category: "蜂蜜坚果", time: "15:30", hot: "中" },
  { id: 5, session: "新品速报", host: "子晴", category: "特色菌菇", time: "17:00", hot: "高" },
  { id: 6, session: "晚间爆款", host: "沐歌", category: "肉禽蛋类", time: "19:30", hot: "爆" },
  { id: 7, session: "夜市专区", host: "映雪", category: "农家小吃", time: "20:30", hot: "高" },
  { id: 8, session: "深夜上新", host: "立夏", category: "时令水果", time: "21:30", hot: "中" },
  { id: 9, session: "返场秒杀", host: "予安", category: "优选组合", time: "22:00", hot: "高" },
  { id: 10, session: "轻松收官", host: "书云", category: "休闲零食", time: "23:00", hot: "中" }
];

const keywordRules = [
  { word: "领券", action: "发放优惠券", reply: "已发送" , window: "全程", count: 582 },
  { word: "包邮", action: "置顶说明", reply: "满99包邮", window: "09:00-12:00", count: 214 },
  { word: "秒杀", action: "切换商品", reply: "进入秒杀页", window: "13:00-15:00", count: 367 },
  { word: "库存", action: "更新库存", reply: "库存充足", window: "14:00-18:00", count: 190 },
  { word: "售后", action: "引导客服", reply: "请私信客服", window: "全天", count: 125 },
  { word: "试吃", action: "展示口播", reply: "主播试吃", window: "15:00-17:00", count: 98 },
  { word: "推荐", action: "推爆款", reply: "爆款链接", window: "18:00-20:00", count: 402 },
  { word: "评价", action: "弹出好评", reply: "好评截图", window: "19:00-21:00", count: 250 },
  { word: "加购", action: "加购提醒", reply: "加购优惠", window: "20:00-22:00", count: 310 },
  { word: "到货", action: "物流说明", reply: "48小时发货", window: "全天", count: 178 }
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
