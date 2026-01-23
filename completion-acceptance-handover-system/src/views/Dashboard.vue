<template>
  <div class="dashboard">
    <section class="section-card">
      <div class="kpi-grid">
        <div class="kpi">
          <p>本月计划验收节点</p>
          <h3>42</h3>
          <span class="tag">完成率 78%</span>
        </div>
        <div class="kpi">
          <p>整改待闭环问题</p>
          <h3>16</h3>
          <span class="tag">平均周期 6 天</span>
        </div>
        <div class="kpi">
          <p>移交证书待签发</p>
          <h3>9</h3>
          <span class="tag">住宅 4 / 公区 3</span>
        </div>
        <div class="kpi">
          <p>资料归档完成率</p>
          <h3>91%</h3>
          <span class="tag">今日新增 12 份</span>
        </div>
      </div>
    </section>

    <section class="section-card">
      <div class="section-header">
        <div>
          <h2>验收通过率趋势</h2>
          <p>住宅、公区、商业多专业综合趋势</p>
        </div>
        <div class="section-actions">
          <button class="btn ghost" type="button" @click="openModal('trend')">查看预警</button>
          <button class="btn primary" type="button" @click="openModal('report')">导出日报</button>
        </div>
      </div>
      <img class="chart" src="../assets/overview.svg" alt="验收趋势图" />
    </section>

    <section class="section-card">
      <div class="section-header">
        <div>
          <h2>关键验收节点清单</h2>
          <p>按专业与楼栋拆分的本周节点</p>
        </div>
        <div class="section-actions">
          <button class="btn ghost" type="button" @click="openModal('sync')">同步进度</button>
          <button class="btn secondary" type="button" @click="openModal('progress')">进度看板</button>
        </div>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>节点编号</th>
            <th>专业</th>
            <th>楼栋</th>
            <th>计划时间</th>
            <th>责任单位</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in scheduleRows" :key="item.code">
            <td>{{ item.code }}</td>
            <td>{{ item.domain }}</td>
            <td>{{ item.building }}</td>
            <td>{{ item.date }}</td>
            <td>{{ item.owner }}</td>
            <td><span class="tag">{{ item.status }}</span></td>
            <td>
              <button class="btn ghost" type="button" @click="openModal('detail', item)">详情</button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <BaseModal :open="modal.open" :title="modal.title" :subtitle="modal.subtitle" @close="closeModal">
      <template v-if="modal.type === 'detail'">
        <p><strong>节点：</strong>{{ modal.payload?.code }}</p>
        <p><strong>范围：</strong>{{ modal.payload?.domain }} / {{ modal.payload?.building }}</p>
        <p><strong>提醒：</strong>请在计划日前完成资料上传与现场自检。</p>
      </template>
      <template v-else-if="modal.type === 'trend'">
        <p>系统已识别 3 条预警记录，请安排专项复核。</p>
        <ul class="modal-list">
          <li>住宅 A2：消防联动测试通过率低于阈值。</li>
          <li>商业 B1：机电系统调试延期 2 天。</li>
          <li>公区 A1：观感验收资料未齐套。</li>
        </ul>
      </template>
      <template v-else-if="modal.type === 'report'">
        <div class="form-grid">
          <label class="field">
            <span>报告类型</span>
            <select class="select">
              <option>日报</option>
              <option>周报</option>
              <option>月度汇总</option>
            </select>
          </label>
          <label class="field">
            <span>发送对象</span>
            <input class="input" placeholder="输入邮件或联系人" />
          </label>
        </div>
        <p>生成后将自动归档至资料库。</p>
      </template>
      <template v-else-if="modal.type === 'sync'">
        <p>确认同步现场检查记录并更新节点状态。</p>
        <div class="progress">
          <div class="progress-bar" style="width: 64%"></div>
        </div>
        <p>当前已同步 18 / 28 条记录。</p>
      </template>
      <template v-else-if="modal.type === 'progress'">
        <p>本周验收节点总体完成度</p>
        <div class="progress">
          <div class="progress-bar" style="width: 78%"></div>
        </div>
        <p>已完成 25 项，待复验 7 项。</p>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import BaseModal from "../components/BaseModal.vue";

const scheduleRows = Array.from({ length: 20 }, (_, index) => {
  const number = index + 1;
  return {
    code: `XN-${number.toString().padStart(3, "0")}`,
    domain: ["住宅", "公区", "商业", "机电", "消防"][index % 5],
    building: ["A1", "A2", "B1", "B2"][index % 4],
    date: `2024-11-${(number % 28) + 1}`,
    owner: ["中建一局", "监理单位", "机电分包", "设计院"][index % 4],
    status: ["准备中", "进行中", "待复验", "已完成"][index % 4]
  };
});

const modal = reactive({
  open: false,
  type: "",
  title: "",
  subtitle: "",
  payload: null
});

const openModal = (type, payload = null) => {
  const titles = {
    detail: "节点详情",
    trend: "风险预警提示",
    report: "导出验收日报",
    sync: "同步进度",
    progress: "进度看板"
  };
  const subtitles = {
    detail: "查看节点责任单位与计划时间",
    trend: "提示信息弹窗",
    report: "弹窗表单",
    sync: "进度条弹窗显示",
    progress: "进度条弹窗显示"
  };
  modal.open = true;
  modal.type = type;
  modal.title = titles[type];
  modal.subtitle = subtitles[type];
  modal.payload = payload;
};

const closeModal = () => {
  modal.open = false;
};
</script>

<style scoped>
.dashboard {
  display: grid;
  gap: 20px;
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.kpi {
  background: #f8fafc;
  border-radius: 18px;
  padding: 16px;
  display: grid;
  gap: 8px;
}

.kpi h3 {
  font-size: 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 16px;
}

.section-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.chart {
  width: 100%;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
}
</style>
