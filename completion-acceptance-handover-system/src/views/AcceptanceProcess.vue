<template>
  <div class="page">
    <section class="section-card">
      <div class="section-header">
        <div>
          <h2>竣工验收流程审批与记录</h2>
          <p>建设单位、监理、施工、设计多方协同审批</p>
        </div>
        <div class="section-actions">
          <button class="btn ghost" type="button" @click="openModal('flow')">流程说明</button>
          <button class="btn secondary" type="button" @click="openModal('sign')">签字确认</button>
          <button class="btn primary" type="button" @click="openModal('meeting')">新增会议纪要</button>
        </div>
      </div>
      <div class="process-grid">
        <div v-for="step in flowSteps" :key="step.name" class="process-card">
          <h4>{{ step.name }}</h4>
          <p>{{ step.desc }}</p>
          <span class="tag">{{ step.status }}</span>
        </div>
      </div>
      <img class="chart" src="../assets/overview.svg" alt="流程执行趋势" />
    </section>

    <section class="section-card">
      <table class="table">
        <thead>
          <tr>
            <th>流程编号</th>
            <th>验收节点</th>
            <th>参与单位</th>
            <th>当前阶段</th>
            <th>最近更新时间</th>
            <th>结论</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in processRows" :key="item.code">
            <td>{{ item.code }}</td>
            <td>{{ item.node }}</td>
            <td>{{ item.team }}</td>
            <td>{{ item.phase }}</td>
            <td>{{ item.time }}</td>
            <td><span class="tag">{{ item.result }}</span></td>
            <td>
              <button class="btn ghost" type="button" @click="openModal('record', item)">记录</button>
              <button class="btn secondary" type="button" @click="openModal('approve', item)">审批</button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <BaseModal :open="modal.open" :title="modal.title" :subtitle="modal.subtitle" @close="closeModal">
      <template v-if="modal.type === 'flow'">
        <ul class="modal-list">
          <li>施工自检完成后提交验收申请。</li>
          <li>监理单位线上预审资料与现场。</li>
          <li>建设单位组织联合验收并签字确认。</li>
          <li>形成最终验收结论并归档。</li>
        </ul>
      </template>
      <template v-else-if="modal.type === 'sign'">
        <div class="form-grid">
          <label class="field">
            <span>验收节点</span>
            <input class="input" placeholder="选择节点" />
          </label>
          <label class="field">
            <span>签字人员</span>
            <input class="input" placeholder="输入人员姓名" />
          </label>
        </div>
        <p>签字确认后自动锁定流程记录。</p>
      </template>
      <template v-else-if="modal.type === 'meeting'">
        <label class="field">
          <span>会议主题</span>
          <input class="input" placeholder="填写会议主题" />
        </label>
        <label class="field">
          <span>纪要内容</span>
          <textarea class="textarea" rows="4" placeholder="填写验收会议纪要"></textarea>
        </label>
      </template>
      <template v-else-if="modal.type === 'record'">
        <p><strong>验收节点：</strong>{{ modal.payload?.node }}</p>
        <p><strong>记录摘要：</strong>{{ modal.payload?.memo }}</p>
        <div class="progress">
          <div class="progress-bar" style="width: 88%"></div>
        </div>
        <p>流程完成度 88%</p>
      </template>
      <template v-else-if="modal.type === 'approve'">
        <p>审批 {{ modal.payload?.node }} 的验收结论。</p>
        <div class="form-grid">
          <label class="field">
            <span>审批结论</span>
            <select class="select">
              <option>同意</option>
              <option>需整改</option>
            </select>
          </label>
          <label class="field">
            <span>备注</span>
            <input class="input" placeholder="填写意见" />
          </label>
        </div>
      </template>
      <template #footer>
        <button class="btn ghost" type="button" @click="closeModal">取消</button>
        <button class="btn primary" type="button" @click="closeModal">确认</button>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import BaseModal from "../components/BaseModal.vue";

const flowSteps = [
  { name: "施工自检", desc: "施工单位完成自检并提交资料", status: "已完成" },
  { name: "监理预审", desc: "监理单位线上审核资料", status: "进行中" },
  { name: "联合验收", desc: "建设、监理、设计联合验收", status: "待启动" },
  { name: "结论归档", desc: "生成结论并归档", status: "待启动" }
];

const processRows = Array.from({ length: 20 }, (_, index) => {
  const number = index + 1;
  return {
    code: `PROC-${number.toString().padStart(3, "0")}`,
    node: ["住宅 A1", "商业 B1", "公区 A2", "机电 B2"][index % 4],
    team: ["建设/监理", "施工/设计", "监理/施工", "建设/设计"][index % 4],
    phase: ["资料预审", "现场验收", "整改复验", "结论归档"][index % 4],
    time: `2024-11-${(number % 28) + 1} 10:00`,
    result: ["通过", "整改中", "待审批", "待归档"][index % 4],
    memo: "已记录现场验收要点与整改建议"
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
    flow: "流程说明",
    sign: "签字确认",
    meeting: "新增会议纪要",
    record: "验收记录",
    approve: "审批意见"
  };
  const subtitles = {
    flow: "提示信息弹窗",
    sign: "弹窗表单",
    meeting: "弹窗表单",
    record: "进度条弹窗显示",
    approve: "审批流程"
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
.page {
  display: grid;
  gap: 20px;
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

.process-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.process-card {
  background: #f8fafc;
  border-radius: 16px;
  padding: 16px;
  display: grid;
  gap: 6px;
}

.chart {
  width: 100%;
  border-radius: 16px;
  margin-top: 16px;
  border: 1px solid #e2e8f0;
}
</style>
