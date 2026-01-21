<template>
  <div class="grid grid-2">
    <div class="card">
      <h3>韧性评分趋势</h3>
      <p>从稳定性、恢复能力、替代能力三维度进行综合评分。</p>
      <div class="chart">
        <div v-for="(item, index) in trendData" :key="index" class="chart-bar" :style="{ height: item + '%' }" />
      </div>
      <div class="flex">
        <button @click="openModal('evaluate')">发起评估</button>
        <button class="secondary" @click="openModal('bench')">对标配置</button>
        <button class="ghost" @click="openModal('report')">生成评估报告</button>
      </div>
    </div>
    <div class="card">
      <h3>关键节点韧性表现</h3>
      <div class="grid grid-3">
        <div class="card">
          <h4>核心供应商</h4>
          <h2>92</h2>
          <span class="tag">稳定性</span>
        </div>
        <div class="card">
          <h4>生产节点</h4>
          <h2>88</h2>
          <span class="tag">恢复力</span>
        </div>
        <div class="card">
          <h4>物流网络</h4>
          <h2>84</h2>
          <span class="tag">替代力</span>
        </div>
      </div>
      <div class="flex">
        <button class="secondary" @click="openModal('warning')">异常说明</button>
        <button class="ghost" @click="openModal('plan')">改善计划</button>
      </div>
    </div>
  </div>

  <div class="card" style="margin-top: 16px;">
    <h3>韧性评估明细</h3>
    <table class="table">
      <thead>
        <tr>
          <th>节点</th>
          <th>稳定性</th>
          <th>恢复能力</th>
          <th>替代能力</th>
          <th>综合等级</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in tableData" :key="item.name">
          <td>{{ item.name }}</td>
          <td>{{ item.stable }}</td>
          <td>{{ item.recover }}</td>
          <td>{{ item.alternative }}</td>
          <td><span class="tag">{{ item.level }}</span></td>
        </tr>
      </tbody>
    </table>
  </div>

  <BaseModal v-if="activeModal === 'evaluate'" title="发起韧性评估" @close="closeModal">
    <div class="form-field">
      <label>评估范围</label>
      <select>
        <option>全链路</option>
        <option>关键供应商</option>
        <option>区域物流网络</option>
      </select>
    </div>
    <div class="form-field">
      <label>评估周期</label>
      <input type="date" />
    </div>
    <button @click="closeModal">提交评估任务</button>
  </BaseModal>

  <BaseModal v-if="activeModal === 'bench'" title="对标配置" @close="closeModal">
    <div class="form-field">
      <label>对标行业</label>
      <select>
        <option>电子制造</option>
        <option>汽车零部件</option>
        <option>装备制造</option>
      </select>
    </div>
    <div class="form-field">
      <label>目标分数</label>
      <input placeholder="请输入目标综合分数" />
    </div>
    <button @click="closeModal">保存对标参数</button>
  </BaseModal>

  <BaseModal v-if="activeModal === 'report'" title="评估报告生成进度" @close="closeModal">
    <p>系统正在聚合各节点韧性指标。</p>
    <div class="progress-track">
      <div class="progress-bar" :style="{ width: `${progress}%` }"></div>
    </div>
    <p>已完成：{{ progress }}%</p>
    <button class="secondary" @click="closeModal">后台继续</button>
  </BaseModal>

  <BaseModal v-if="activeModal === 'warning'" title="异常说明" @close="closeModal">
    <p>华北物流干线近期受天气影响，稳定性下降 4.2%。</p>
    <button class="secondary" @click="closeModal">已知晓</button>
  </BaseModal>

  <BaseModal v-if="activeModal === 'plan'" title="改善计划" @close="closeModal">
    <div class="form-field">
      <label>措施描述</label>
      <textarea rows="3" placeholder="例如：启用备用物流商"></textarea>
    </div>
    <div class="form-field">
      <label>责任人</label>
      <input placeholder="请输入责任人姓名" />
    </div>
    <button @click="closeModal">提交计划</button>
  </BaseModal>
</template>

<script setup>
import { ref } from "vue";
import BaseModal from "../components/BaseModal.vue";

const trendData = [72, 68, 75, 80, 84, 82, 88, 90, 86, 92];
const tableData = [
  { name: "华东供应群", stable: 94, recover: 88, alternative: 86, level: "A+" },
  { name: "华南制造基地", stable: 90, recover: 84, alternative: 82, level: "A" },
  { name: "华北物流枢纽", stable: 86, recover: 80, alternative: 78, level: "A-" },
  { name: "西南仓储中心", stable: 82, recover: 76, alternative: 74, level: "B+" },
  { name: "国际采购网络", stable: 88, recover: 81, alternative: 79, level: "A-" },
  { name: "新能源供应链", stable: 90, recover: 85, alternative: 83, level: "A" },
  { name: "精密加工环节", stable: 84, recover: 79, alternative: 77, level: "B+" },
  { name: "全球运输航线", stable: 80, recover: 74, alternative: 70, level: "B" },
  { name: "华中加工基地", stable: 86, recover: 82, alternative: 80, level: "A-" },
  { name: "华东成品库", stable: 88, recover: 84, alternative: 81, level: "A-" },
  { name: "华南港口群", stable: 83, recover: 78, alternative: 76, level: "B+" },
  { name: "西北配件网", stable: 81, recover: 73, alternative: 72, level: "B" },
  { name: "华北原料库", stable: 85, recover: 79, alternative: 77, level: "B+" },
  { name: "海外备件中心", stable: 82, recover: 76, alternative: 74, level: "B+" },
  { name: "华东分销渠道", stable: 89, recover: 83, alternative: 81, level: "A-" },
  { name: "华中冷链", stable: 86, recover: 80, alternative: 79, level: "A-" },
  { name: "华南备料中心", stable: 87, recover: 82, alternative: 80, level: "A-" },
  { name: "西南协同工厂", stable: 84, recover: 78, alternative: 76, level: "B+" },
  { name: "北方应急库", stable: 83, recover: 77, alternative: 75, level: "B+" },
  { name: "东南加工链", stable: 88, recover: 83, alternative: 82, level: "A-" },
  { name: "中部集配中心", stable: 86, recover: 80, alternative: 78, level: "A-" }
];

const activeModal = ref("");
const progress = ref(0);
let timer;

const openModal = (name) => {
  activeModal.value = name;
  if (name === "report") {
    progress.value = 20;
    clearInterval(timer);
    timer = setInterval(() => {
      progress.value = Math.min(progress.value + 15, 100);
      if (progress.value >= 100) {
        clearInterval(timer);
      }
    }, 450);
  }
};

const closeModal = () => {
  activeModal.value = "";
  clearInterval(timer);
};
</script>
