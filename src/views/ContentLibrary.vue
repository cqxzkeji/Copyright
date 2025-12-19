<template>
  <div class="module">
    <div class="summary-grid">
      <div class="card highlight">
        <div class="label">素材库总量</div>
        <div class="value">2,480 份</div>
        <div class="hint">本周新增 126 份</div>
      </div>
      <div class="card">
        <div class="label">待审核素材</div>
        <div class="value">38 份</div>
        <div class="hint">需要 2 小时内处理</div>
      </div>
      <div class="card">
        <div class="label">内容复用率</div>
        <div class="value">64%</div>
        <div class="hint">高于目标 6%</div>
      </div>
    </div>

    <div class="panel">
      <div class="panel-header">
        <div>
          <div class="panel-title">素材采集与内容排期</div>
          <div class="panel-sub">集中管理直播脚本、海报、短视频与商品详情。</div>
        </div>
        <div class="actions">
          <button class="primary" @click="openModal('form')">上传素材</button>
          <button class="ghost" @click="openModal('progress')">压缩转码</button>
          <button class="ghost" @click="openModal('tip')">运营提示</button>
        </div>
      </div>

      <div class="content-grid">
        <div class="chart">
          <div class="chart-title">内容发布热度</div>
          <div class="bars">
            <div v-for="item in publishHeat" :key="item.day" class="bar-item">
              <div class="bar" :style="{ height: item.value + '%' }"></div>
              <span>{{ item.day }}</span>
            </div>
          </div>
        </div>
        <div class="table">
          <div class="table-title">素材清单</div>
          <table>
            <thead>
              <tr>
                <th>素材</th>
                <th>类型</th>
                <th>标签</th>
                <th>创建人</th>
                <th>状态</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in assets" :key="item.id">
                <td>{{ item.name }}</td>
                <td>{{ item.type }}</td>
                <td>{{ item.tag }}</td>
                <td>{{ item.owner }}</td>
                <td>{{ item.status }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="panel">
      <div class="panel-header">
        <div>
          <div class="panel-title">直播脚本排班</div>
          <div class="panel-sub">保证直播间话术与商品讲解节奏一致。</div>
        </div>
        <button class="ghost" @click="openModal('form')">新增脚本</button>
      </div>
      <div class="table">
        <table>
          <thead>
            <tr>
              <th>脚本</th>
              <th>直播场次</th>
              <th>预计时长</th>
              <th>负责人</th>
              <th>执行状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in scripts" :key="item.name">
              <td>{{ item.name }}</td>
              <td>{{ item.session }}</td>
              <td>{{ item.duration }}</td>
              <td>{{ item.owner }}</td>
              <td>{{ item.status }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="modalOpen" class="modal-backdrop">
      <div class="modal">
        <template v-if="modalType === 'form'">
          <h3>上传素材</h3>
          <form class="form">
            <label>素材名称<input type="text" placeholder="输入素材名称" /></label>
            <label>类型<select><option>海报</option><option>短视频</option><option>脚本</option></select></label>
            <label>标签<input type="text" placeholder="输入标签" /></label>
            <label>负责人<select><option>内容组A</option><option>内容组B</option><option>直播组</option></select></label>
            <button type="button" class="primary" @click="closeModal">提交上传</button>
          </form>
        </template>
        <template v-else-if="modalType === 'progress'">
          <h3>素材转码进度</h3>
          <p>系统正在进行多平台格式转换。</p>
          <div class="progress">
            <div class="progress-bar" :style="{ width: '58%' }"></div>
          </div>
          <button class="primary" @click="closeModal">完成</button>
        </template>
        <template v-else>
          <h3>运营提示</h3>
          <ul>
            <li>热门产品需准备短视频 3 条以上。</li>
            <li>脚本更新时间建议提前 2 小时。</li>
            <li>海报统一使用平台主色调。</li>
          </ul>
          <button class="primary" @click="closeModal">收到</button>
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

const publishHeat = [
  { day: "一", value: 65 },
  { day: "二", value: 72 },
  { day: "三", value: 58 },
  { day: "四", value: 80 },
  { day: "五", value: 76 },
  { day: "六", value: 90 },
  { day: "日", value: 68 },
  { day: "周一", value: 74 },
  { day: "周二", value: 83 },
  { day: "周三", value: 62 }
];

const assets = [
  { id: 1, name: "春季礼盒海报", type: "海报", tag: "礼盒", owner: "内容组A", status: "已发布" },
  { id: 2, name: "蜂蜜短视频", type: "短视频", tag: "蜂蜜", owner: "内容组B", status: "审核中" },
  { id: 3, name: "果蔬上新脚本", type: "脚本", tag: "果蔬", owner: "直播组", status: "已发布" },
  { id: 4, name: "菌菇福利海报", type: "海报", tag: "菌菇", owner: "内容组A", status: "待调整" },
  { id: 5, name: "稻米品牌故事", type: "短视频", tag: "大米", owner: "内容组B", status: "已发布" },
  { id: 6, name: "爆款脚本模板", type: "脚本", tag: "爆款", owner: "直播组", status: "已发布" },
  { id: 7, name: "坚果包装图", type: "海报", tag: "坚果", owner: "内容组A", status: "审核中" },
  { id: 8, name: "冷链物流图解", type: "图文", tag: "物流", owner: "内容组B", status: "已发布" },
  { id: 9, name: "新品橙子海报", type: "海报", tag: "橙子", owner: "内容组A", status: "待发布" },
  { id: 10, name: "直播互动卡", type: "图文", tag: "互动", owner: "直播组", status: "已发布" }
];

const scripts = [
  { name: "早餐档话术", session: "晨间鲜采", duration: "30分钟", owner: "李青", status: "执行中" },
  { name: "午间福利场", session: "午间礼盒", duration: "40分钟", owner: "徐晴", status: "已排期" },
  { name: "新品主推", session: "品质主推", duration: "45分钟", owner: "周楠", status: "已排期" },
  { name: "下午茶互动", session: "下午茶歇", duration: "35分钟", owner: "任霖", status: "执行中" },
  { name: "爆款复盘", session: "晚间爆款", duration: "50分钟", owner: "沈禾", status: "待审核" },
  { name: "夜市秒杀", session: "夜市专区", duration: "40分钟", owner: "苏雨", status: "已排期" },
  { name: "深夜上新", session: "深夜上新", duration: "30分钟", owner: "刘然", status: "执行中" },
  { name: "返场清单", session: "返场秒杀", duration: "25分钟", owner: "秦宇", status: "已排期" },
  { name: "收官福利", session: "轻松收官", duration: "20分钟", owner: "杨珂", status: "已排期" },
  { name: "预热口播", session: "明日预告", duration: "15分钟", owner: "何澄", status: "待发布" }
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
