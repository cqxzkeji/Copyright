<template>
  <div class="page">
    <section class="section-card">
      <div class="section-header">
        <div>
          <h2>移交证书生成与移交管理</h2>
          <p>基于验收结论自动生成移交清单与证书</p>
        </div>
        <div class="section-actions">
          <button class="btn ghost" type="button" @click="openModal('template')">证书模板</button>
          <button class="btn secondary" type="button" @click="openModal('handover')">发起移交</button>
          <button class="btn primary" type="button" @click="openModal('generate')">生成证书</button>
        </div>
      </div>
      <div class="summary-grid">
        <div class="summary-card">
          <h4>住宅移交完成</h4>
          <p>12 / 16 套已完成签收</p>
        </div>
        <div class="summary-card">
          <h4>公区移交进度</h4>
          <p>5 / 8 区域已完成交付</p>
        </div>
        <div class="summary-card">
          <h4>商业移交进度</h4>
          <p>3 / 6 区域已完成交付</p>
        </div>
      </div>
      <img class="chart" src="../assets/overview.svg" alt="移交完成趋势" />
    </section>

    <section class="section-card">
      <table class="table">
        <thead>
          <tr>
            <th>证书编号</th>
            <th>移交类型</th>
            <th>范围</th>
            <th>接收单位</th>
            <th>签发时间</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in certRows" :key="item.code">
            <td>{{ item.code }}</td>
            <td>{{ item.type }}</td>
            <td>{{ item.scope }}</td>
            <td>{{ item.receiver }}</td>
            <td>{{ item.time }}</td>
            <td><span class="tag">{{ item.status }}</span></td>
            <td>
              <button class="btn ghost" type="button" @click="openModal('preview', item)">预览</button>
              <button class="btn secondary" type="button" @click="openModal('sign', item)">签收</button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <BaseModal :open="modal.open" :title="modal.title" :subtitle="modal.subtitle" @close="closeModal">
      <template v-if="modal.type === 'template'">
        <p>当前启用模板：竣工验收合格证明（V3.2）</p>
        <label class="field">
          <span>切换模板</span>
          <select class="select">
            <option>竣工验收合格证明（V3.2）</option>
            <option>住宅移交证书（V2.1）</option>
            <option>商业移交证书（V1.8）</option>
          </select>
        </label>
      </template>
      <template v-else-if="modal.type === 'handover'">
        <div class="form-grid">
          <label class="field">
            <span>移交类型</span>
            <select class="select">
              <option>住宅</option>
              <option>公区</option>
              <option>商业</option>
            </select>
          </label>
          <label class="field">
            <span>接收单位</span>
            <input class="input" placeholder="输入接收单位" />
          </label>
          <label class="field">
            <span>移交时间</span>
            <input class="input" type="date" />
          </label>
        </div>
      </template>
      <template v-else-if="modal.type === 'generate'">
        <p>将基于最新验收结论生成证书与移交清单。</p>
        <div class="progress">
          <div class="progress-bar" style="width: 46%"></div>
        </div>
        <p>已生成 8 / 18 份证书。</p>
      </template>
      <template v-else-if="modal.type === 'preview'">
        <p><strong>证书编号：</strong>{{ modal.payload?.code }}</p>
        <p><strong>移交范围：</strong>{{ modal.payload?.scope }}</p>
        <p>提示信息弹窗：可下载 PDF 或推送给接收单位。</p>
      </template>
      <template v-else-if="modal.type === 'sign'">
        <p>确认 {{ modal.payload?.receiver }} 已完成签收。</p>
        <label class="field">
          <span>签收人</span>
          <input class="input" placeholder="输入签收人" />
        </label>
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

const certRows = Array.from({ length: 20 }, (_, index) => {
  const number = index + 1;
  return {
    code: `CERT-${number.toString().padStart(3, "0")}`,
    type: ["住宅", "公区", "商业"][index % 3],
    scope: ["A1-01~08", "A2-公区", "B1-商业区", "B2-机电房"][index % 4],
    receiver: ["物业公司", "运营方", "商管公司"][index % 3],
    time: `2024-12-${(number % 28) + 1}`,
    status: ["待签收", "已签收", "已归档", "待确认"][index % 4]
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
    template: "证书模板配置",
    handover: "发起移交",
    generate: "生成移交证书",
    preview: "证书预览",
    sign: "签收确认"
  };
  const subtitles = {
    template: "提示信息弹窗",
    handover: "弹窗表单",
    generate: "进度条弹窗显示",
    preview: "提示信息弹窗",
    sign: "弹窗表单"
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

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.summary-card {
  background: #f8fafc;
  border-radius: 16px;
  padding: 16px;
}

.chart {
  width: 100%;
  border-radius: 16px;
  margin-top: 16px;
  border: 1px solid #e2e8f0;
}
</style>
