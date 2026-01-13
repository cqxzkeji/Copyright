<template>
  <div class="grid grid-3">
    <ChartCard title="稼动率" value="87.2%" subtitle="今日产线" badge="稳定" :data="[70, 74, 76, 80, 82, 84, 87]" />
    <ChartCard title="能耗趋势" value="128 kWh" subtitle="当班能耗" badge="可控" :data="[90, 95, 100, 110, 115, 120, 128]" />
    <ChartCard title="故障分布" value="12 起" subtitle="本周故障" badge="下降" :data="[20, 18, 16, 14, 13, 12, 12]" />
  </div>

  <div class="card" style="margin-top: 20px;">
    <div class="section-title">数据分析与权限中心</div>
    <div class="toolbar" style="margin-bottom: 16px;">
      <button class="btn" @click="openModal('report', '运行报表生成')">运行报表</button>
      <button class="btn btn-outline" @click="openModal('audit', '追溯审计查询')">追溯审计</button>
      <button class="btn btn-outline" @click="openModal('role', '角色权限配置')">角色权限</button>
      <button class="btn btn-accent" @click="openModal('policy', '策略发布进度')">策略配置</button>
      <button class="btn btn-outline" @click="openModal('tips', '权限提示')">按钮提示</button>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>报表名称</th>
          <th>周期</th>
          <th>稼动率</th>
          <th>能耗</th>
          <th>故障次数</th>
          <th>审核状态</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in reportList" :key="item.name">
          <td>{{ item.name }}</td>
          <td>{{ item.period }}</td>
          <td>{{ item.util }}</td>
          <td>{{ item.energy }}</td>
          <td>{{ item.fault }}</td>
          <td><span class="badge">{{ item.status }}</span></td>
        </tr>
      </tbody>
    </table>
  </div>

  <Modal v-model="modalVisible" :title="modalTitle">
    <div v-if="modalType === 'report'" class="form-row">
      <label class="form-group">
        <span>报表类型</span>
        <select class="form-input">
          <option>稼动率日报</option>
          <option>能耗分析周报</option>
          <option>故障分布月报</option>
        </select>
      </label>
      <label class="form-group">
        <span>统计周期</span>
        <input class="form-input" placeholder="2024-09-01 ~ 2024-09-07" />
      </label>
      <label class="form-group">
        <span>输出格式</span>
        <select class="form-input">
          <option>PDF</option>
          <option>Excel</option>
        </select>
      </label>
      <label class="form-group">
        <span>审批人</span>
        <input class="form-input" placeholder="输入审批人" />
      </label>
      <label class="form-group" style="grid-column: 1 / -1;">
        <span>备注</span>
        <textarea class="form-input" rows="3" placeholder="填写报表备注"></textarea>
      </label>
      <div style="grid-column: 1 / -1; display: flex; justify-content: flex-end; gap: 10px;">
        <button class="btn btn-outline" @click="modalVisible = false">取消</button>
        <button class="btn">生成报表</button>
      </div>
    </div>

    <div v-else-if="modalType === 'audit'" class="form-row">
      <label class="form-group">
        <span>审计对象</span>
        <select class="form-input">
          <option>任务下发记录</option>
          <option>权限变更记录</option>
          <option>设备运行日志</option>
        </select>
      </label>
      <label class="form-group">
        <span>审计周期</span>
        <input class="form-input" placeholder="近30天" />
      </label>
      <label class="form-group">
        <span>关键字</span>
        <input class="form-input" placeholder="设备/人员/事件" />
      </label>
      <label class="form-group">
        <span>导出方式</span>
        <select class="form-input">
          <option>系统内查看</option>
          <option>导出日志包</option>
        </select>
      </label>
      <label class="form-group" style="grid-column: 1 / -1;">
        <span>审计说明</span>
        <textarea class="form-input" rows="3" placeholder="审计范围说明"></textarea>
      </label>
      <div style="grid-column: 1 / -1; display: flex; justify-content: flex-end; gap: 10px;">
        <button class="btn btn-outline" @click="modalVisible = false">取消</button>
        <button class="btn">开始审计</button>
      </div>
    </div>

    <div v-else-if="modalType === 'role'" class="form-row">
      <label class="form-group">
        <span>角色名称</span>
        <input class="form-input" placeholder="如：运维主管" />
      </label>
      <label class="form-group">
        <span>权限模板</span>
        <select class="form-input">
          <option>全流程管理</option>
          <option>监测+告警</option>
          <option>只读审计</option>
        </select>
      </label>
      <label class="form-group">
        <span>授权范围</span>
        <input class="form-input" placeholder="设备组/模块" />
      </label>
      <label class="form-group">
        <span>策略有效期</span>
        <input class="form-input" placeholder="2024-12-31" />
      </label>
      <label class="form-group" style="grid-column: 1 / -1;">
        <span>角色说明</span>
        <textarea class="form-input" rows="3" placeholder="填写角色说明"></textarea>
      </label>
      <div style="grid-column: 1 / -1; display: flex; justify-content: flex-end; gap: 10px;">
        <button class="btn btn-outline" @click="modalVisible = false">取消</button>
        <button class="btn">保存角色</button>
      </div>
    </div>

    <div v-else-if="modalType === 'policy'">
      <p>策略配置已下发至 5 个权限域，请确认进度。</p>
      <div style="margin-top: 16px; display: grid; gap: 12px;">
        <div v-for="item in policyProgress" :key="item.name">
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
            <span>{{ item.name }}</span>
            <span>{{ item.progress }}%</span>
          </div>
          <div class="progress-track">
            <div class="progress-bar" :style="{ width: item.progress + '%' }"></div>
          </div>
        </div>
      </div>
      <div style="margin-top: 16px; display: flex; justify-content: flex-end; gap: 10px;">
        <button class="btn btn-outline" @click="modalVisible = false">暂停发布</button>
        <button class="btn">确认发布</button>
      </div>
    </div>

    <div v-else>
      <p>提示：建议定期复核角色权限，确保操作日志可追溯。</p>
      <div style="margin-top: 16px; display: flex; justify-content: flex-end;">
        <button class="btn" @click="modalVisible = false">确认</button>
      </div>
    </div>
  </Modal>
</template>

<script setup>
import { ref } from "vue";
import Modal from "../components/Modal.vue";
import ChartCard from "../components/ChartCard.vue";

const modalVisible = ref(false);
const modalType = ref("report");
const modalTitle = ref("");

const openModal = (type, title) => {
  modalType.value = type;
  modalTitle.value = title;
  modalVisible.value = true;
};

const reportList = Array.from({ length: 20 }, (_, idx) => ({
  name: `产线运行报表-${idx + 1}`,
  period: `2024-09-${(idx + 1).toString().padStart(2, "0")}`,
  util: `${80 + (idx % 10)}%`,
  energy: `${110 + idx * 2} kWh`,
  fault: `${Math.max(1, 8 - (idx % 6))} 次`,
  status: idx % 3 === 0 ? "待审核" : "已归档"
}));

const policyProgress = [
  { name: "生产线权限域", progress: 70 },
  { name: "运维权限域", progress: 52 },
  { name: "数据分析域", progress: 84 },
  { name: "外协访问域", progress: 63 }
];
</script>
