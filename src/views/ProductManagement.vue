<template>
  <div class="module">
    <div class="summary-grid">
      <div class="card highlight">
        <div class="label">在售农产品</div>
        <div class="value">128 款</div>
        <div class="hint">本周上新 12 款</div>
      </div>
      <div class="card">
        <div class="label">安全库存预警</div>
        <div class="value">9 款</div>
        <div class="hint">需补货 3 款</div>
      </div>
      <div class="card">
        <div class="label">平均毛利率</div>
        <div class="value">32.4%</div>
        <div class="hint">较上周 +1.2%</div>
      </div>
    </div>

    <div class="panel">
      <div class="panel-header">
        <div>
          <div class="panel-title">商品库存与定价管理</div>
          <div class="panel-sub">统一维护农产品 SKU、库存、价格与质检信息。</div>
        </div>
        <div class="actions">
          <button class="primary" @click="openModal('form')">新增商品</button>
          <button class="ghost" @click="openModal('progress')">补货进度</button>
          <button class="ghost" @click="openModal('tip')">价格提醒</button>
        </div>
      </div>

      <div class="content-grid">
        <div class="chart">
          <div class="chart-title">库存充足率（Top10）</div>
          <div class="bars">
            <div v-for="item in stockRate" :key="item.name" class="bar-item">
              <div class="bar" :style="{ height: item.value + '%' }"></div>
              <span>{{ item.name }}</span>
            </div>
          </div>
        </div>
        <div class="table">
          <div class="table-title">商品清单</div>
          <table>
            <thead>
              <tr>
                <th>商品</th>
                <th>产地</th>
                <th>库存</th>
                <th>售价</th>
                <th>质检</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in products" :key="item.id">
                <td>{{ item.name }}</td>
                <td>{{ item.origin }}</td>
                <td>{{ item.stock }}</td>
                <td>{{ item.price }}</td>
                <td>{{ item.quality }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="panel">
      <div class="panel-header">
        <div>
          <div class="panel-title">供应商补货联动</div>
          <div class="panel-sub">监控供应商履约周期与物流时效。</div>
        </div>
        <button class="ghost" @click="openModal('form')">新增供应商</button>
      </div>
      <div class="table">
        <table>
          <thead>
            <tr>
              <th>供应商</th>
              <th>主供品类</th>
              <th>补货周期</th>
              <th>合格率</th>
              <th>最近到货</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in suppliers" :key="item.name">
              <td>{{ item.name }}</td>
              <td>{{ item.category }}</td>
              <td>{{ item.cycle }}</td>
              <td>{{ item.rate }}</td>
              <td>{{ item.arrival }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="modalOpen" class="modal-backdrop">
      <div class="modal">
        <template v-if="modalType === 'form'">
          <h3>新增商品信息</h3>
          <form class="form">
            <label>商品名称<input type="text" placeholder="输入商品名称" /></label>
            <label>产地<select><option>山东</option><option>云南</option><option>黑龙江</option></select></label>
            <label>库存数量<input type="number" placeholder="输入库存" /></label>
            <label>售价<input type="text" placeholder="输入售价" /></label>
            <button type="button" class="primary" @click="closeModal">保存商品</button>
          </form>
        </template>
        <template v-else-if="modalType === 'progress'">
          <h3>补货执行进度</h3>
          <p>当前正在协调 3 个供应商补货。</p>
          <div class="progress">
            <div class="progress-bar" :style="{ width: '65%' }"></div>
          </div>
          <button class="primary" @click="closeModal">确认</button>
        </template>
        <template v-else>
          <h3>价格风险提示</h3>
          <ul>
            <li>近期番茄均价上涨 6%。</li>
            <li>建议调整礼盒毛利率。</li>
            <li>留意有机米面竞品价格。</li>
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

const stockRate = [
  { name: "苹果", value: 86 },
  { name: "草莓", value: 72 },
  { name: "香菇", value: 65 },
  { name: "鸡蛋", value: 90 },
  { name: "蜂蜜", value: 78 },
  { name: "玉米", value: 70 },
  { name: "红薯", value: 82 },
  { name: "牛奶", value: 76 },
  { name: "坚果", value: 69 },
  { name: "米面", value: 88 }
];

const products = [
  { id: 1, name: "高原草莓", origin: "云南", stock: "1,200", price: "¥39", quality: "优" },
  { id: 2, name: "有机西红柿", origin: "山东", stock: "980", price: "¥16", quality: "优" },
  { id: 3, name: "生态香菇", origin: "福建", stock: "760", price: "¥28", quality: "良" },
  { id: 4, name: "散养土鸡蛋", origin: "安徽", stock: "1,540", price: "¥22", quality: "优" },
  { id: 5, name: "岭南香蕉", origin: "广西", stock: "890", price: "¥18", quality: "良" },
  { id: 6, name: "松子礼盒", origin: "吉林", stock: "650", price: "¥88", quality: "优" },
  { id: 7, name: "东北大米", origin: "黑龙江", stock: "1,800", price: "¥68", quality: "优" },
  { id: 8, name: "阿坝蜂蜜", origin: "四川", stock: "430", price: "¥98", quality: "优" },
  { id: 9, name: "金黄玉米", origin: "内蒙古", stock: "1,050", price: "¥19", quality: "良" },
  { id: 10, name: "富硒红薯", origin: "河南", stock: "720", price: "¥26", quality: "优" }
];

const suppliers = [
  { name: "丰收田园", category: "蔬菜类", cycle: "3天", rate: "98%", arrival: "今天" },
  { name: "岭南果业", category: "水果类", cycle: "2天", rate: "97%", arrival: "昨天" },
  { name: "黑土粮仓", category: "粮油类", cycle: "5天", rate: "99%", arrival: "前天" },
  { name: "山野菌菇", category: "菌菇类", cycle: "4天", rate: "96%", arrival: "今天" },
  { name: "牧场优品", category: "乳制品", cycle: "2天", rate: "98%", arrival: "今天" },
  { name: "蜂场直供", category: "蜂蜜类", cycle: "6天", rate: "97%", arrival: "3天前" },
  { name: "林下坚果", category: "坚果类", cycle: "5天", rate: "95%", arrival: "4天前" },
  { name: "水产清供", category: "水产类", cycle: "2天", rate: "96%", arrival: "昨天" },
  { name: "禽蛋基地", category: "禽蛋类", cycle: "3天", rate: "99%", arrival: "今天" },
  { name: "地标合作社", category: "特色礼盒", cycle: "7天", rate: "94%", arrival: "5天前" }
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
