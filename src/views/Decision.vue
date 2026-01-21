<template>
  <div class="grid grid-2">
    <div class="card">
      <h3>应急决策模拟</h3>
      <p>基于风险场景生成供应调整、库存优化与调度方案。</p>
      <div class="chart">
        <div v-for="(item, index) in planData" :key="index" class="chart-bar" :style="{ height: item + '%' }" />
      </div>
      <div class="flex">
        <button @click="openModal('scenario')">创建风险场景</button>
        <button class="secondary" @click="openModal('optimize')">库存优化建议</button>
        <button class="ghost" @click="openModal('dispatch')">调度策略推演</button>
      </div>
    </div>
    <div class="card">
      <h3>资源调度指标</h3>
      <div class="grid grid-3">
        <div class="card">
          <h4>备选供应商</h4>
          <h2>14</h2>
        </div>
        <div class="card">
          <h4>应急库存天数</h4>
          <h2>18天</h2>
        </div>
        <div class="card">
          <h4>可调度运力</h4>
          <h2>6,200 吨</h2>
        </div>
      </div>
      <div class="flex">
        <button class="secondary" @click="openModal('supplier')">供应替代方案</button>
        <button class="ghost" @click="openModal('approve')">审批路径</button>
      </div>
    </div>
  </div>

  <div class="card" style="margin-top: 16px;">
    <h3>应急方案库</h3>
    <table class="table">
      <thead>
        <tr>
          <th>方案名称</th>
          <th>适用场景</th>
          <th>预估成本</th>
          <th>响应时间</th>
          <th>执行状态</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in tableData" :key="item.name">
          <td>{{ item.name }}</td>
          <td>{{ item.scene }}</td>
          <td>{{ item.cost }}</td>
          <td>{{ item.time }}</td>
          <td><span class="tag">{{ item.status }}</span></td>
        </tr>
      </tbody>
    </table>
  </div>

  <BaseModal v-if="activeModal === 'scenario'" title="创建风险场景" @close="closeModal">
    <div class="form-field">
      <label>场景名称</label>
      <input placeholder="例如：华东港口封锁" />
    </div>
    <div class="form-field">
      <label>影响节点</label>
      <input placeholder="物流、仓储、生产" />
    </div>
    <button @click="closeModal">保存场景</button>
  </BaseModal>

  <BaseModal v-if="activeModal === 'optimize'" title="库存优化建议" @close="closeModal">
    <div class="form-field">
      <label>建议动作</label>
      <textarea rows="3" placeholder="提高华北区域安全库存 15%"></textarea>
    </div>
    <div class="form-field">
      <label>执行时间</label>
      <input type="date" />
    </div>
    <button @click="closeModal">生成优化方案</button>
  </BaseModal>

  <BaseModal v-if="activeModal === 'dispatch'" title="调度策略推演" @close="closeModal">
    <p>正在计算多线路调度与成本对比。</p>
    <div class="progress-track">
      <div class="progress-bar" :style="{ width: `${progress}%` }"></div>
    </div>
    <p>推演进度：{{ progress }}%</p>
    <button class="secondary" @click="closeModal">后台继续</button>
  </BaseModal>

  <BaseModal v-if="activeModal === 'supplier'" title="供应替代方案" @close="closeModal">
    <div class="form-field">
      <label>优先备选供应商</label>
      <input placeholder="华西储备供应商 A/B" />
    </div>
    <button @click="closeModal">确认替代方案</button>
  </BaseModal>

  <BaseModal v-if="activeModal === 'approve'" title="审批路径" @close="closeModal">
    <p>应急方案需经采购、物流、财务三级审批。</p>
    <button class="secondary" @click="closeModal">确认</button>
  </BaseModal>
</template>

<script setup>
import { ref } from "vue";
import BaseModal from "../components/BaseModal.vue";

const planData = [30, 42, 50, 60, 68, 75, 82, 78, 70, 85];
const tableData = [
  { name: "港口封锁转运", scene: "国际物流中断", cost: "￥120万", time: "8小时", status: "可用" },
  { name: "华北库存上调", scene: "需求突增", cost: "￥60万", time: "6小时", status: "评估中" },
  { name: "备用供应商切换", scene: "供应中断", cost: "￥80万", time: "12小时", status: "可用" },
  { name: "多式联运调整", scene: "运输延迟", cost: "￥45万", time: "5小时", status: "执行中" },
  { name: "区域仓储调拨", scene: "库存失衡", cost: "￥30万", time: "4小时", status: "可用" },
  { name: "紧急空运方案", scene: "交付延误", cost: "￥140万", time: "3小时", status: "评估中" },
  { name: "协同生产切换", scene: "产线停机", cost: "￥210万", time: "18小时", status: "待审批" },
  { name: "替代材料采购", scene: "原料短缺", cost: "￥95万", time: "10小时", status: "执行中" },
  { name: "华南备库释放", scene: "需求异常", cost: "￥55万", time: "6小时", status: "可用" },
  { name: "海外仓调拨", scene: "国际运输异常", cost: "￥125万", time: "20小时", status: "待审批" },
  { name: "工厂节拍调整", scene: "供应不足", cost: "￥40万", time: "7小时", status: "可用" },
  { name: "应急供应商扩容", scene: "订单激增", cost: "￥110万", time: "14小时", status: "评估中" },
  { name: "路线切换方案", scene: "道路管制", cost: "￥35万", time: "5小时", status: "执行中" },
  { name: "加工外协调度", scene: "设备故障", cost: "￥150万", time: "16小时", status: "待审批" },
  { name: "库存优先分配", scene: "关键客户保障", cost: "￥25万", time: "2小时", status: "可用" },
  { name: "冷链升级方案", scene: "温控风险", cost: "￥70万", time: "9小时", status: "评估中" },
  { name: "国内转运替代", scene: "航运受阻", cost: "￥90万", time: "11小时", status: "执行中" },
  { name: "跨区调拨计划", scene: "区域缺货", cost: "￥60万", time: "8小时", status: "可用" },
  { name: "多源采购组合", scene: "供应商降产", cost: "￥105万", time: "12小时", status: "评估中" },
  { name: "仓储扩容计划", scene: "库存积压", cost: "￥95万", time: "15小时", status: "待审批" },
  { name: "补货节奏优化", scene: "需求波动", cost: "￥38万", time: "4小时", status: "可用" }
];

const activeModal = ref("");
const progress = ref(0);
let timer;

const openModal = (name) => {
  activeModal.value = name;
  if (name === "dispatch") {
    progress.value = 15;
    clearInterval(timer);
    timer = setInterval(() => {
      progress.value = Math.min(progress.value + 16, 100);
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
