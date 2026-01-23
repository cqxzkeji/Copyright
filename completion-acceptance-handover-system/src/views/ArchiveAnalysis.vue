<template>
  <div class="page">
    <section class="section-card">
      <div class="section-header">
        <div>
          <h2>归档查询与统计分析</h2>
          <p>统一归档资料、移交证书与过程记录</p>
        </div>
        <div class="section-actions">
          <button class="btn ghost" type="button" @click="openModal('filter')">条件查询</button>
          <button class="btn secondary" type="button" @click="openModal('export')">批量导出</button>
          <button class="btn primary" type="button" @click="openModal('analysis')">生成分析</button>
        </div>
      </div>
      <div class="analysis-grid">
        <div class="analysis-card">
          <h4>验收通过率</h4>
          <p class="value">92%</p>
          <span class="tag">近 30 天</span>
        </div>
        <div class="analysis-card">
          <h4>整改平均周期</h4>
          <p class="value">5.6 天</p>
          <span class="tag">重点问题 18 项</span>
        </div>
        <div class="analysis-card">
          <h4>移交完成率</h4>
          <p class="value">76%</p>
          <span class="tag">住宅 + 公区</span>
        </div>
      </div>
      <img class="chart" src="../assets/overview.svg" alt="归档统计趋势" />
    </section>

    <section class="section-card">
      <div class="section-header">
        <div>
          <h2>归档资料清单</h2>
          <p>支持多条件检索与导出</p>
        </div>
        <button class="btn ghost" type="button" @click="openModal('sync')">同步档案</button>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>档案编号</th>
            <th>类型</th>
            <th>关联节点</th>
            <th>归档日期</th>
            <th>责任人</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in archiveRows" :key="item.code">
            <td>{{ item.code }}</td>
            <td>{{ item.type }}</td>
            <td>{{ item.link }}</td>
            <td>{{ item.date }}</td>
            <td>{{ item.owner }}</td>
            <td><span class="tag">{{ item.status }}</span></td>
            <td>
              <button class="btn ghost" type="button" @click="openModal('detail', item)">查看</button>
              <button class="btn secondary" type="button" @click="openModal('download', item)">下载</button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <BaseModal :open="modal.open" :title="modal.title" :subtitle="modal.subtitle" @close="closeModal">
      <template v-if="modal.type === 'filter'">
        <div class="form-grid">
          <label class="field">
            <span>档案类型</span>
            <select class="select">
              <option>全部</option>
              <option>验收资料</option>
              <option>移交证书</option>
              <option>会议纪要</option>
            </select>
          </label>
          <label class="field">
            <span>日期范围</span>
            <input class="input" type="date" />
          </label>
          <label class="field">
            <span>关键字</span>
            <input class="input" placeholder="编号/节点/责任人" />
          </label>
        </div>
      </template>
      <template v-else-if="modal.type === 'export'">
        <p>选择导出范围并生成压缩包。</p>
        <div class="progress">
          <div class="progress-bar" style="width: 41%"></div>
        </div>
        <p>当前导出 16 / 40 份。</p>
      </template>
      <template v-else-if="modal.type === 'analysis'">
        <label class="field">
          <span>分析主题</span>
          <select class="select">
            <option>验收通过率</option>
            <option>整改周期</option>
            <option>移交完成情况</option>
          </select>
        </label>
        <label class="field">
          <span>输出格式</span>
          <select class="select">
            <option>PDF 报告</option>
            <option>Excel 报表</option>
          </select>
        </label>
      </template>
      <template v-else-if="modal.type === 'sync'">
        <p>同步归档资料与证书记录。</p>
        <div class="progress">
          <div class="progress-bar" style="width: 68%"></div>
        </div>
        <p>已同步 54 / 80 条记录。</p>
      </template>
      <template v-else-if="modal.type === 'detail'">
        <p><strong>档案编号：</strong>{{ modal.payload?.code }}</p>
        <p><strong>归档说明：</strong>{{ modal.payload?.memo }}</p>
        <p>提示信息弹窗：可追溯历史版本与流程记录。</p>
      </template>
      <template v-else-if="modal.type === 'download'">
        <p>确认下载 {{ modal.payload?.code }} 相关资料。</p>
        <label class="field">
          <span>接收邮箱</span>
          <input class="input" placeholder="填写邮箱地址" />
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

const archiveRows = Array.from({ length: 20 }, (_, index) => {
  const number = index + 1;
  return {
    code: `ARC-${number.toString().padStart(3, "0")}`,
    type: ["验收资料", "移交证书", "会议纪要", "整改记录"][index % 4],
    link: ["住宅 A1", "商业 B1", "公区 A2", "机电 B2"][index % 4],
    date: `2024-10-${(number % 28) + 1}`,
    owner: ["资料员", "项目经理", "监理工程师", "设计代表"][index % 4],
    status: ["已归档", "归档中", "待复核", "已更新"][index % 4],
    memo: "已完成归档并支持版本追溯"
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
    filter: "条件查询",
    export: "批量导出",
    analysis: "生成统计分析",
    sync: "同步档案",
    detail: "档案详情",
    download: "下载资料"
  };
  const subtitles = {
    filter: "弹窗表单",
    export: "进度条弹窗显示",
    analysis: "弹窗表单",
    sync: "进度条弹窗显示",
    detail: "提示信息弹窗",
    download: "弹窗表单"
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

.analysis-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.analysis-card {
  background: #f8fafc;
  border-radius: 16px;
  padding: 16px;
  display: grid;
  gap: 8px;
}

.value {
  font-size: 22px;
  font-weight: 700;
}

.chart {
  width: 100%;
  border-radius: 16px;
  margin-top: 16px;
  border: 1px solid #e2e8f0;
}
</style>
