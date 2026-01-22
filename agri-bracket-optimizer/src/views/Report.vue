<template>
  <section class="module">
    <div class="module-header">
      <div>
        <h3>报告输出</h3>
        <p>自动生成设计结果与优化分析报告，支持导出。</p>
      </div>
      <div class="actions">
        <button @click="buildReport">生成报告</button>
        <button class="ghost" @click="openCover">自定义封面</button>
        <button class="ghost" @click="openTip">导出提示</button>
      </div>
    </div>

    <div class="module-grid">
      <div class="card">
        <h4>报告预览</h4>
        <div class="preview">
          <div class="cover">
            <h5>农业机械动力支撑架优化报告</h5>
            <p>项目编号：AGB-2024</p>
          </div>
          <div class="preview-content">
            <div class="preview-row" v-for="item in previews" :key="item.id">
              <span>{{ item.section }}</span>
              <strong>{{ item.status }}</strong>
            </div>
          </div>
        </div>
        <div class="metrics">
          <div>
            <span>报告页数</span>
            <strong>32 页</strong>
          </div>
          <div>
            <span>图表数量</span>
            <strong>18 张</strong>
          </div>
          <div>
            <span>完成度</span>
            <strong>88%</strong>
          </div>
        </div>
      </div>
      <div class="card">
        <h4>报告章节清单</h4>
        <table>
          <thead>
            <tr>
              <th>章节编号</th>
              <th>章节名称</th>
              <th>内容状态</th>
              <th>负责人</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="section in sections" :key="section.id">
              <td>{{ section.id }}</td>
              <td>{{ section.title }}</td>
              <td>{{ section.state }}</td>
              <td>{{ section.owner }}</td>
              <td>
                <button class="text" @click="openDetail(section)">查看</button>
                <button class="text" @click="openEdit(section)">调整</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="modal.visible" class="modal-backdrop" role="dialog" aria-modal="true">
      <div class="modal">
        <h3>{{ modal.title }}</h3>
        <p v-if="modal.message">{{ modal.message }}</p>
        <form v-if="modal.type === 'form'" @submit.prevent="submitCover">
          <label>
            报告标题
            <input v-model="coverForm.title" required />
          </label>
          <label>
            项目编号
            <input v-model="coverForm.code" required />
          </label>
          <label>
            负责人
            <input v-model="coverForm.owner" required />
          </label>
          <div class="modal-actions">
            <button type="button" class="ghost" @click="closeModal">取消</button>
            <button type="submit">保存</button>
          </div>
        </form>
        <div v-if="modal.type === 'progress'" class="progress">
          <div class="bar" :style="{ width: modal.progress + '%' }"></div>
          <span>报告生成 {{ modal.progress }}%</span>
        </div>
        <div v-if="modal.type === 'info'" class="modal-actions">
          <button @click="closeModal">知道了</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { reactive } from "vue";

const previews = reactive([
  { id: 1, section: "设计概述", status: "已完成" },
  { id: 2, section: "参数建模", status: "已完成" },
  { id: 3, section: "强度校核", status: "已完成" },
  { id: 4, section: "结构优化", status: "更新中" },
  { id: 5, section: "仿真验证", status: "更新中" },
  { id: 6, section: "结论建议", status: "待完善" }
]);

const sections = reactive([
  { id: "01", title: "项目背景", state: "完成", owner: "陈工" },
  { id: "02", title: "设计输入", state: "完成", owner: "李工" },
  { id: "03", title: "参数建模", state: "完成", owner: "周工" },
  { id: "04", title: "强度校核", state: "完成", owner: "王工" },
  { id: "05", title: "刚度分析", state: "完成", owner: "韩工" },
  { id: "06", title: "稳定性分析", state: "完成", owner: "赵工" },
  { id: "07", title: "优化目标", state: "更新中", owner: "陈工" },
  { id: "08", title: "优化方案", state: "更新中", owner: "李工" },
  { id: "09", title: "材料对比", state: "更新中", owner: "周工" },
  { id: "10", title: "仿真模型", state: "完成", owner: "王工" },
  { id: "11", title: "应力云图", state: "完成", owner: "韩工" },
  { id: "12", title: "变形云图", state: "完成", owner: "赵工" },
  { id: "13", title: "工况汇总", state: "完成", owner: "陈工" },
  { id: "14", title: "风险提示", state: "完成", owner: "李工" },
  { id: "15", title: "优化结论", state: "更新中", owner: "周工" },
  { id: "16", title: "成本评估", state: "更新中", owner: "王工" },
  { id: "17", title: "实施建议", state: "待完善", owner: "韩工" },
  { id: "18", title: "验证计划", state: "待完善", owner: "赵工" },
  { id: "19", title: "附件清单", state: "完成", owner: "陈工" },
  { id: "20", title: "版本记录", state: "完成", owner: "李工" }
]);

const modal = reactive({
  visible: false,
  title: "",
  message: "",
  type: "info",
  progress: 0
});

const coverForm = reactive({
  title: "",
  code: "",
  owner: ""
});

const buildReport = () => {
  modal.visible = true;
  modal.title = "生成报告";
  modal.message = "系统正在汇总优化数据与仿真图表。";
  modal.type = "progress";
  modal.progress = 0;
  const timer = setInterval(() => {
    if (modal.progress >= 100) {
      clearInterval(timer);
      modal.title = "报告生成完成";
      modal.message = "报告已生成，可导出 PDF 或 Word。";
      modal.type = "info";
      return;
    }
    modal.progress += 20;
  }, 200);
};

const openCover = () => {
  modal.visible = true;
  modal.title = "自定义封面";
  modal.message = "请填写封面信息，保存后同步到预览。";
  modal.type = "form";
};

const openTip = () => {
  modal.visible = true;
  modal.title = "导出提示";
  modal.message = "导出前请确认仿真图表已更新并完成审批流程。";
  modal.type = "info";
};

const openDetail = (section) => {
  modal.visible = true;
  modal.title = "章节详情";
  modal.message = `${section.title} 由 ${section.owner} 负责，目前状态：${section.state}。`;
  modal.type = "info";
};

const openEdit = (section) => {
  modal.visible = true;
  modal.title = "调整章节";
  modal.message = `已进入 ${section.title} 调整模式，请在编辑器中更新内容。`;
  modal.type = "info";
};

const submitCover = () => {
  previews[0].section = coverForm.title || previews[0].section;
  modal.visible = false;
  coverForm.title = "";
  coverForm.code = "";
  coverForm.owner = "";
};

const closeModal = () => {
  modal.visible = false;
};
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.module-header {
  background: #ffffff;
  border-radius: 18px;
  padding: 20px 24px;
  box-shadow: var(--shadow);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.module-header h3 {
  margin: 0 0 6px;
  font-size: 18px;
}

.module-header p {
  margin: 0;
  color: var(--muted);
}

.actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

button {
  border: none;
  border-radius: 12px;
  padding: 8px 16px;
  background: var(--primary);
  color: white;
  cursor: pointer;
  font-weight: 600;
}

button.ghost {
  background: #f1f5ff;
  color: var(--primary);
}

button.text {
  background: transparent;
  color: var(--primary);
  padding: 0 8px;
}

.module-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 20px;
}

.card {
  background: #ffffff;
  border-radius: 18px;
  padding: 20px;
  box-shadow: var(--shadow);
  display: grid;
  gap: 16px;
}

.preview {
  border-radius: 16px;
  border: 1px solid var(--border);
  overflow: hidden;
}

.cover {
  padding: 18px;
  background: linear-gradient(135deg, #e8f2ff, #ffffff);
}

.cover h5 {
  margin: 0 0 6px;
  font-size: 16px;
}

.preview-content {
  padding: 12px 16px;
  display: grid;
  gap: 8px;
}

.preview-row {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: var(--muted);
}

.preview-row strong {
  color: var(--text);
}

.metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
  font-size: 13px;
  color: var(--muted);
}

.metrics strong {
  display: block;
  color: var(--text);
  font-size: 16px;
  margin-top: 6px;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

th,
td {
  padding: 10px;
  border-bottom: 1px solid var(--border);
  text-align: left;
}

th {
  background: #f3f6ff;
  color: var(--muted);
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 25, 40, 0.4);
  display: grid;
  place-items: center;
  z-index: 20;
  padding: 20px;
}

.modal {
  width: min(420px, 100%);
  background: #ffffff;
  border-radius: 18px;
  padding: 24px;
  display: grid;
  gap: 14px;
}

.modal p {
  margin: 0;
  color: var(--muted);
}

form {
  display: grid;
  gap: 12px;
}

form label {
  display: grid;
  gap: 6px;
  font-size: 13px;
}

form input {
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 8px 10px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.progress {
  display: grid;
  gap: 8px;
}

.progress .bar {
  height: 8px;
  border-radius: 999px;
  background: var(--accent);
}

@media (max-width: 768px) {
  .module-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
