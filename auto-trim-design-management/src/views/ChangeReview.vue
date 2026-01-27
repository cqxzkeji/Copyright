<template>
  <section class="module">
    <div class="overview">
      <div class="card">
        <h3>本月变更</h3>
        <p>36 项</p>
        <span>含外饰 18 / 内饰 18</span>
      </div>
      <div class="card">
        <h3>待签审</h3>
        <p>7 项</p>
        <span>工程/质量/采购/制造</span>
      </div>
      <div class="card">
        <h3>关键影响</h3>
        <p>成本 +3.2%</p>
        <span>重量 -4.8kg</span>
      </div>
    </div>

    <div class="toolbar">
      <button class="primary" @click="modals.ecr = true">发起ECR</button>
      <button class="ghost" @click="modals.impact = true">影响分析</button>
      <button class="ghost" @click="modals.review = true">评审会议纪要</button>
      <button class="ghost" @click="modals.approval = true">签审流转</button>
      <button class="ghost" @click="modals.progress = true">签审进度</button>
    </div>

    <div class="table-panel">
      <h3>设计变更清单</h3>
      <table>
        <thead>
          <tr>
            <th>变更编号</th>
            <th>类型</th>
            <th>影响区域</th>
            <th>成本影响</th>
            <th>负责人</th>
            <th>当前状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in changes" :key="item.code">
            <td>{{ item.code }}</td>
            <td>{{ item.type }}</td>
            <td>{{ item.scope }}</td>
            <td>{{ item.cost }}</td>
            <td>{{ item.owner }}</td>
            <td>{{ item.status }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>

  <BaseModal v-model="modals.ecr" title="发起设计变更 (ECR)">
    <form class="modal-form">
      <label>
        变更对象
        <input placeholder="仪表板/门板/保险杠" />
      </label>
      <label>
        变更原因
        <textarea rows="3" placeholder="法规/客户需求/工艺优化"></textarea>
      </label>
      <label>
        优先级
        <select>
          <option>高</option>
          <option>中</option>
          <option>低</option>
        </select>
      </label>
      <label>
        预计完成日期
        <input type="date" />
      </label>
    </form>
    <template #footer>
      <button class="ghost" type="button" @click="modals.ecr = false">暂存</button>
      <button class="primary" type="button" @click="modals.ecr = false">提交ECR</button>
    </template>
  </BaseModal>

  <BaseModal v-model="modals.impact" title="影响分析">
    <form class="modal-form">
      <label>
        成本影响
        <input placeholder="±金额或百分比" />
      </label>
      <label>
        重量影响
        <input placeholder="±kg" />
      </label>
      <label>
        工艺/法规风险
        <textarea rows="3" placeholder="列出法规、工艺、供应商影响"></textarea>
      </label>
      <label>
        关联供应商
        <input placeholder="供应商名称" />
      </label>
    </form>
    <template #footer>
      <button class="ghost" type="button" @click="modals.impact = false">保存分析</button>
      <button class="primary" type="button" @click="modals.impact = false">发布分析</button>
    </template>
  </BaseModal>

  <BaseModal v-model="modals.review" title="评审会议纪要">
    <form class="modal-form">
      <label>
        会议主题
        <input placeholder="变更评审会" />
      </label>
      <label>
        参会部门
        <input placeholder="工程/采购/质量/制造" />
      </label>
      <label>
        结论记录
        <textarea rows="4" placeholder="记录结论与待办项"></textarea>
      </label>
    </form>
    <template #footer>
      <button class="ghost" type="button" @click="modals.review = false">下载纪要</button>
      <button class="primary" type="button" @click="modals.review = false">确认纪要</button>
    </template>
  </BaseModal>

  <BaseModal v-model="modals.approval" title="签审流转">
    <form class="modal-form">
      <label>
        当前节点
        <select>
          <option>工程评审</option>
          <option>质量评审</option>
          <option>采购评审</option>
          <option>制造评审</option>
        </select>
      </label>
      <label>
        审批人
        <input placeholder="输入审批人" />
      </label>
      <label>
        备注
        <textarea rows="3" placeholder="补充说明或条件"></textarea>
      </label>
    </form>
    <template #footer>
      <button class="ghost" type="button" @click="modals.approval = false">退回</button>
      <button class="primary" type="button" @click="modals.approval = false">流转签审</button>
    </template>
  </BaseModal>

  <BaseModal v-model="modals.progress" title="签审流转进度" width="520px">
    <div class="progress-panel">
      <p>当前ECR正在进入制造评审阶段。</p>
      <div class="progress-row">
        <span>工程评审</span>
        <div class="progress"><div class="progress-fill" style="width: 100%"></div></div>
        <strong>完成</strong>
      </div>
      <div class="progress-row">
        <span>质量评审</span>
        <div class="progress"><div class="progress-fill" style="width: 80%"></div></div>
        <strong>80%</strong>
      </div>
      <div class="progress-row">
        <span>制造评审</span>
        <div class="progress"><div class="progress-fill" style="width: 45%"></div></div>
        <strong>45%</strong>
      </div>
    </div>
    <template #footer>
      <button class="ghost" type="button" @click="modals.progress = false">稍后查看</button>
      <button class="primary" type="button" @click="modals.progress = false">确认</button>
    </template>
  </BaseModal>
</template>

<script setup>
import { reactive } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const changes = Array.from({ length: 24 }, (_, index) => ({
  code: `ECN-${2024}${index + 1}`,
  type: ['ECR', 'ECN'][index % 2],
  scope: ['仪表板包覆', '门板包边', '外饰灯具', '保险杠'][index % 4],
  cost: ['+2.3%', '-1.2%', '+0.6%', '+3.1%'][index % 4],
  owner: ['周工', '冯工', '陈工', '韩工'][index % 4],
  status: ['评审中', '待签审', '已批准', '已关闭'][index % 4]
}));

const modals = reactive({
  ecr: false,
  impact: false,
  review: false,
  approval: false,
  progress: false
});
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.card {
  background: #fff;
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
}

.card h3 {
  margin: 0 0 6px;
  font-size: 16px;
}

.card p {
  margin: 0 0 4px;
  font-size: 20px;
  font-weight: 600;
}

.card span {
  color: #64748b;
  font-size: 12px;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.primary {
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 10px 16px;
  cursor: pointer;
}

.ghost {
  background: #e2e8f0;
  color: #1f2a44;
  border: none;
  border-radius: 10px;
  padding: 10px 16px;
  cursor: pointer;
}

.table-panel {
  background: #fff;
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
  overflow-x: auto;
}

.table-panel table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

th,
 td {
  padding: 10px 12px;
  border-bottom: 1px solid #eef2f7;
  text-align: left;
}

th {
  background: #f8fafc;
  font-weight: 600;
}

.modal-form {
  display: grid;
  gap: 12px;
}

.modal-form label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
}

.modal-form input,
.modal-form select,
.modal-form textarea {
  padding: 8px 10px;
  border-radius: 10px;
  border: 1px solid #dbe3f0;
  background: #f9fbff;
  font-family: inherit;
}

.progress-panel {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.progress-row {
  display: grid;
  grid-template-columns: 90px 1fr 60px;
  gap: 10px;
  align-items: center;
}

.progress {
  height: 8px;
  background: #e5e7eb;
  border-radius: 999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #22d3ee, #2563eb);
}
</style>
