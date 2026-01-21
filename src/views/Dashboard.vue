<template>
  <div class="grid grid-3">
    <div class="card">
      <h4>实时运行节点</h4>
      <h2>128</h2>
      <p>覆盖 7 个区域供应链集群</p>
    </div>
    <div class="card">
      <h4>风险预警</h4>
      <h2>6</h2>
      <p>高等级预警 2 项</p>
    </div>
    <div class="card">
      <h4>准点交付率</h4>
      <h2>96.8%</h2>
      <p>环比提升 1.4%</p>
    </div>
  </div>

  <div class="grid grid-2" style="margin-top: 16px;">
    <div class="card">
      <h3>链路监控走势</h3>
      <p>展示关键链路的运行稳定度。</p>
      <div class="chart">
        <div v-for="(item, index) in monitorData" :key="index" class="chart-bar" :style="{ height: item + '%' }" />
      </div>
      <div class="flex">
        <button @click="openModal('alert')">发布预警</button>
        <button class="secondary" @click="openModal('report')">生成分析报告</button>
        <button class="ghost" @click="openModal('notice')">通知协同方</button>
      </div>
    </div>
    <div class="card">
      <h3>预警事件总览</h3>
      <div class="grid grid-2">
        <div class="card">
          <h4>供应中断</h4>
          <h2>2</h2>
          <span class="tag">重点跟踪</span>
        </div>
        <div class="card">
          <h4>运输延迟</h4>
          <h2>3</h2>
          <span class="tag">处理中</span>
        </div>
        <div class="card">
          <h4>需求波动</h4>
          <h2>1</h2>
          <span class="tag">观察</span>
        </div>
        <div class="card">
          <h4>库存异常</h4>
          <h2>2</h2>
          <span class="tag">已缓解</span>
        </div>
      </div>
      <div class="flex">
        <button class="secondary" @click="openModal('schedule')">预警复盘</button>
        <button class="ghost" @click="openModal('setting')">阈值设置</button>
      </div>
    </div>
  </div>

  <div class="card" style="margin-top: 16px;">
    <h3>实时监控列表</h3>
    <table class="table">
      <thead>
        <tr>
          <th>监控对象</th>
          <th>状态</th>
          <th>最新预警</th>
          <th>更新时间</th>
          <th>责任组</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in tableData" :key="item.name">
          <td>{{ item.name }}</td>
          <td>{{ item.status }}</td>
          <td>{{ item.alert }}</td>
          <td>{{ item.time }}</td>
          <td><span class="tag">{{ item.team }}</span></td>
        </tr>
      </tbody>
    </table>
  </div>

  <BaseModal v-if="activeModal === 'alert'" title="发布预警" @close="closeModal">
    <div class="form-field">
      <label>预警级别</label>
      <select>
        <option>高</option>
        <option>中</option>
        <option>低</option>
      </select>
    </div>
    <div class="form-field">
      <label>预警描述</label>
      <textarea rows="3" placeholder="请输入预警描述"></textarea>
    </div>
    <button @click="closeModal">发布</button>
  </BaseModal>

  <BaseModal v-if="activeModal === 'report'" title="分析报告生成进度" @close="closeModal">
    <p>正在汇总监控指标与预警事件。</p>
    <div class="progress-track">
      <div class="progress-bar" :style="{ width: `${progress}%` }"></div>
    </div>
    <p>当前进度：{{ progress }}%</p>
    <button class="secondary" @click="closeModal">后台生成</button>
  </BaseModal>

  <BaseModal v-if="activeModal === 'notice'" title="通知协同方" @close="closeModal">
    <div class="form-field">
      <label>通知对象</label>
      <input placeholder="供应商/物流伙伴" />
    </div>
    <div class="form-field">
      <label>说明内容</label>
      <textarea rows="3" placeholder="请输入说明"></textarea>
    </div>
    <button @click="closeModal">发送通知</button>
  </BaseModal>

  <BaseModal v-if="activeModal === 'schedule'" title="预警复盘安排" @close="closeModal">
    <div class="form-field">
      <label>复盘时间</label>
      <input type="date" />
    </div>
    <div class="form-field">
      <label>参与部门</label>
      <input placeholder="采购、物流、计划" />
    </div>
    <button @click="closeModal">安排复盘</button>
  </BaseModal>

  <BaseModal v-if="activeModal === 'setting'" title="阈值设置" @close="closeModal">
    <div class="form-field">
      <label>延迟阈值（小时）</label>
      <input placeholder="例如：6" />
    </div>
    <div class="form-field">
      <label>库存预警线</label>
      <input placeholder="例如：安全库存 80%" />
    </div>
    <button @click="closeModal">保存阈值</button>
  </BaseModal>
</template>

<script setup>
import { ref } from "vue";
import BaseModal from "../components/BaseModal.vue";

const monitorData = [48, 58, 66, 72, 78, 84, 90, 86, 80, 88];
const tableData = [
  { name: "华东供应商集群", status: "运行稳定", alert: "无", time: "10:05", team: "供应链A组" },
  { name: "华南生产基地", status: "轻微波动", alert: "原料到货延迟", time: "10:04", team: "制造B组" },
  { name: "华北物流干线", status: "延迟", alert: "运输延迟 3h", time: "10:02", team: "物流C组" },
  { name: "华中仓储中心", status: "运行稳定", alert: "无", time: "09:58", team: "仓储A组" },
  { name: "国际采购网络", status: "关注", alert: "汇率波动", time: "09:55", team: "采购D组" },
  { name: "华东成品库", status: "运行稳定", alert: "无", time: "09:52", team: "仓储B组" },
  { name: "华南港口群", status: "轻微波动", alert: "清关延迟", time: "09:50", team: "物流C组" },
  { name: "西南协同工厂", status: "关注", alert: "设备维护", time: "09:48", team: "制造A组" },
  { name: "华北原料库", status: "运行稳定", alert: "无", time: "09:46", team: "仓储C组" },
  { name: "海外备件中心", status: "延迟", alert: "航班延误", time: "09:44", team: "物流D组" },
  { name: "华东分销渠道", status: "运行稳定", alert: "无", time: "09:40", team: "销售A组" },
  { name: "华中冷链", status: "关注", alert: "温控偏差", time: "09:38", team: "物流B组" },
  { name: "华南备料中心", status: "运行稳定", alert: "无", time: "09:36", team: "采购B组" },
  { name: "西北配件网", status: "轻微波动", alert: "备件延迟", time: "09:34", team: "供应链B组" },
  { name: "华北应急库", status: "运行稳定", alert: "无", time: "09:32", team: "仓储A组" },
  { name: "东南加工链", status: "关注", alert: "需求波动", time: "09:30", team: "制造C组" },
  { name: "中部集配中心", status: "运行稳定", alert: "无", time: "09:28", team: "物流A组" },
  { name: "国际运输航线", status: "延迟", alert: "海况不佳", time: "09:26", team: "物流D组" },
  { name: "华西供应商群", status: "运行稳定", alert: "无", time: "09:24", team: "供应链C组" },
  { name: "北方区域仓", status: "关注", alert: "库存紧张", time: "09:22", team: "仓储D组" },
  { name: "华东备件供应", status: "运行稳定", alert: "无", time: "09:20", team: "采购A组" }
];

const activeModal = ref("");
const progress = ref(0);
let timer;

const openModal = (name) => {
  activeModal.value = name;
  if (name === "report") {
    progress.value = 22;
    clearInterval(timer);
    timer = setInterval(() => {
      progress.value = Math.min(progress.value + 14, 100);
      if (progress.value >= 100) {
        clearInterval(timer);
      }
    }, 420);
  }
};

const closeModal = () => {
  activeModal.value = "";
  clearInterval(timer);
};
</script>
