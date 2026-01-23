<template>
  <div class="page">
    <section class="section-card">
      <div class="section-header">
        <div>
          <h2>竣工验收计划与节点管理</h2>
          <p>按专业、楼栋、批次拆分验收节点并跟踪状态</p>
        </div>
        <div class="section-actions">
          <button class="btn ghost" type="button" @click="openModal('notice')">发送提醒</button>
          <button class="btn secondary" type="button" @click="openModal('batch')">批量调整</button>
          <button class="btn primary" type="button" @click="openModal('add')">新增计划</button>
        </div>
      </div>
      <div class="form-grid">
        <label class="field">
          <span>专业</span>
          <select class="select">
            <option>全部</option>
            <option>住宅</option>
            <option>公区</option>
            <option>商业</option>
            <option>机电</option>
            <option>消防</option>
          </select>
        </label>
        <label class="field">
          <span>楼栋</span>
          <select class="select">
            <option>A1</option>
            <option>A2</option>
            <option>B1</option>
            <option>B2</option>
          </select>
        </label>
        <label class="field">
          <span>批次</span>
          <select class="select">
            <option>一期</option>
            <option>二期</option>
            <option>三期</option>
          </select>
        </label>
        <label class="field">
          <span>关键词</span>
          <input class="input" placeholder="节点名称/责任单位" />
        </label>
      </div>
      <img class="chart" src="../assets/overview.svg" alt="计划节点趋势" />
    </section>

    <section class="section-card">
      <table class="table">
        <thead>
          <tr>
            <th>节点编号</th>
            <th>专业</th>
            <th>楼栋</th>
            <th>批次</th>
            <th>计划日期</th>
            <th>责任单位</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in planRows" :key="row.code">
            <td>{{ row.code }}</td>
            <td>{{ row.domain }}</td>
            <td>{{ row.building }}</td>
            <td>{{ row.phase }}</td>
            <td>{{ row.date }}</td>
            <td>{{ row.owner }}</td>
            <td><span class="tag">{{ row.status }}</span></td>
            <td>
              <button class="btn ghost" type="button" @click="openModal('detail', row)">查看</button>
              <button class="btn secondary" type="button" @click="openModal('assign', row)">指派</button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <BaseModal :open="modal.open" :title="modal.title" :subtitle="modal.subtitle" @close="closeModal">
      <template v-if="modal.type === 'add'">
        <div class="form-grid">
          <label class="field">
            <span>节点名称</span>
            <input class="input" placeholder="输入节点名称" />
          </label>
          <label class="field">
            <span>专业</span>
            <select class="select">
              <option>住宅</option>
              <option>公区</option>
              <option>商业</option>
              <option>机电</option>
              <option>消防</option>
            </select>
          </label>
          <label class="field">
            <span>楼栋</span>
            <select class="select">
              <option>A1</option>
              <option>A2</option>
              <option>B1</option>
              <option>B2</option>
            </select>
          </label>
          <label class="field">
            <span>计划日期</span>
            <input class="input" type="date" />
          </label>
        </div>
        <label class="field">
          <span>说明</span>
          <textarea class="textarea" rows="3" placeholder="填写验收范围与资料要求"></textarea>
        </label>
      </template>
      <template v-else-if="modal.type === 'notice'">
        <p>请选择需要提醒的节点并发送通知。</p>
        <div class="progress">
          <div class="progress-bar" style="width: 52%"></div>
        </div>
        <p>已确认 13 / 25 个节点。</p>
      </template>
      <template v-else-if="modal.type === 'batch'">
        <p>批量调整计划日期并同步到责任单位。</p>
        <div class="form-grid">
          <label class="field">
            <span>调整方式</span>
            <select class="select">
              <option>顺延 1 天</option>
              <option>顺延 3 天</option>
              <option>提前 2 天</option>
            </select>
          </label>
          <label class="field">
            <span>影响节点数</span>
            <input class="input" value="18" disabled />
          </label>
        </div>
      </template>
      <template v-else-if="modal.type === 'detail'">
        <p><strong>节点编号：</strong>{{ modal.payload?.code }}</p>
        <p><strong>责任单位：</strong>{{ modal.payload?.owner }}</p>
        <p><strong>计划状态：</strong>{{ modal.payload?.status }}</p>
        <p>提示信息弹窗：可在验收前 2 天自动推送资料清单。</p>
      </template>
      <template v-else-if="modal.type === 'assign'">
        <div class="form-grid">
          <label class="field">
            <span>当前责任单位</span>
            <input class="input" :value="modal.payload?.owner" disabled />
          </label>
          <label class="field">
            <span>指派新单位</span>
            <input class="input" placeholder="输入单位名称" />
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

const planRows = Array.from({ length: 20 }, (_, index) => {
  const number = index + 1;
  return {
    code: `PLAN-${number.toString().padStart(3, "0")}`,
    domain: ["住宅", "公区", "商业", "机电", "消防"][index % 5],
    building: ["A1", "A2", "B1", "B2"][index % 4],
    phase: ["一期", "二期", "三期"][index % 3],
    date: `2024-12-${(number % 28) + 1}`,
    owner: ["施工总包", "监理单位", "机电分包", "消防分包"][index % 4],
    status: ["待确认", "进行中", "待复验", "已完成"][index % 4]
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
    add: "新增验收计划",
    notice: "节点提醒",
    batch: "批量调整",
    detail: "节点详情",
    assign: "责任单位指派"
  };
  const subtitles = {
    add: "弹窗表单",
    notice: "进度条弹窗显示",
    batch: "调整计划时间",
    detail: "提示信息弹窗",
    assign: "绑定责任单位"
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

.chart {
  width: 100%;
  border-radius: 16px;
  margin-top: 16px;
  border: 1px solid #e2e8f0;
}
</style>
