<template>
  <section class="module">
    <div class="summary">
      <div class="card">
        <h3>在研项目</h3>
        <p>12 个</p>
        <span>概念-量产 全周期跟踪</span>
      </div>
      <div class="card">
        <h3>平台覆盖</h3>
        <p>5 大平台</p>
        <span>新能源/燃油/混动</span>
      </div>
      <div class="card">
        <h3>跨部门任务</h3>
        <p>128 条</p>
        <span>本周更新 32 条</span>
      </div>
    </div>

    <div class="toolbar">
      <button class="primary" @click="modals.create = true">立项新车型</button>
      <button class="ghost" @click="modals.milestone = true">里程碑更新</button>
      <button class="ghost" @click="modals.assign = true">任务协同</button>
      <button class="ghost" @click="modals.delivery = true">交付物清单</button>
      <button class="ghost" @click="modals.alert = true">风险提示</button>
    </div>

    <div class="content-grid">
      <div class="panel">
        <h3>车型平台概览</h3>
        <img :src="hero" alt="车型平台" />
      </div>
      <div class="panel">
        <h3>项目阶段进度</h3>
        <ul>
          <li v-for="stage in stages" :key="stage.name">
            <span>{{ stage.name }}</span>
            <div class="progress">
              <div class="progress-fill" :style="{ width: stage.value + '%' }"></div>
            </div>
            <strong>{{ stage.value }}%</strong>
          </li>
        </ul>
      </div>
    </div>

    <div class="table-panel">
      <h3>项目与车型平台清单</h3>
      <table>
        <thead>
          <tr>
            <th>车型代号</th>
            <th>平台</th>
            <th>阶段</th>
            <th>里程碑</th>
            <th>负责人</th>
            <th>交付物</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in projects" :key="item.code">
            <td>{{ item.code }}</td>
            <td>{{ item.platform }}</td>
            <td>{{ item.stage }}</td>
            <td>{{ item.milestone }}</td>
            <td>{{ item.owner }}</td>
            <td>{{ item.delivery }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>

  <BaseModal v-model="modals.create" title="车型平台立项">
    <form class="modal-form">
      <label>
        车型代号
        <input placeholder="例如：XH7-NEO" />
      </label>
      <label>
        平台类型
        <select>
          <option>新能源纯电平台</option>
          <option>混动平台</option>
          <option>豪华燃油平台</option>
        </select>
      </label>
      <label>
        项目阶段
        <select>
          <option>概念阶段</option>
          <option>造型冻结</option>
          <option>工程冻结</option>
          <option>量产准备</option>
        </select>
      </label>
      <label>
        核心交付物
        <input placeholder="概念造型包、目标重量" />
      </label>
    </form>
    <template #footer>
      <button class="ghost" type="button" @click="modals.create = false">取消</button>
      <button class="primary" type="button" @click="modals.create = false">提交立项</button>
    </template>
  </BaseModal>

  <BaseModal v-model="modals.milestone" title="阶段里程碑更新">
    <form class="modal-form">
      <label>
        车型项目
        <select>
          <option>XN9 平台</option>
          <option>LR5 平台</option>
          <option>EV3 平台</option>
        </select>
      </label>
      <label>
        里程碑节点
        <input placeholder="造型冻结/工程冻结/量产确认" />
      </label>
      <label>
        进度说明
        <textarea rows="3" placeholder="同步关键任务完成情况"></textarea>
      </label>
      <div class="progress-hint">
        <span>阶段完成度</span>
        <div class="progress">
          <div class="progress-fill" style="width: 72%"></div>
        </div>
        <strong>72%</strong>
      </div>
    </form>
    <template #footer>
      <button class="ghost" type="button" @click="modals.milestone = false">保存草稿</button>
      <button class="primary" type="button" @click="modals.milestone = false">发布更新</button>
    </template>
  </BaseModal>

  <BaseModal v-model="modals.assign" title="跨部门任务协同">
    <form class="modal-form">
      <label>
        协同部门
        <select>
          <option>造型中心</option>
          <option>采购管理</option>
          <option>制造工艺</option>
          <option>质量验证</option>
        </select>
      </label>
      <label>
        任务描述
        <input placeholder="例如：更新门板包边方案" />
      </label>
      <label>
        期望完成时间
        <input type="date" />
      </label>
    </form>
    <template #footer>
      <button class="ghost" type="button" @click="modals.assign = false">取消</button>
      <button class="primary" type="button" @click="modals.assign = false">创建任务</button>
    </template>
  </BaseModal>

  <BaseModal v-model="modals.delivery" title="里程碑交付物清单">
    <form class="modal-form">
      <label>
        里程碑节点
        <select>
          <option>概念阶段</option>
          <option>造型冻结</option>
          <option>工程冻结</option>
          <option>量产交付</option>
        </select>
      </label>
      <label>
        交付物列表
        <textarea rows="4" placeholder="例如：外饰A面数模、内饰CMF方案"></textarea>
      </label>
      <label>
        责任人
        <input placeholder="责任工程师" />
      </label>
    </form>
    <template #footer>
      <button class="ghost" type="button" @click="modals.delivery = false">导出清单</button>
      <button class="primary" type="button" @click="modals.delivery = false">确认更新</button>
    </template>
  </BaseModal>

  <BaseModal v-model="modals.alert" title="项目风险提示">
    <form class="modal-form">
      <label>
        风险类型
        <select>
          <option>供应链延期</option>
          <option>重量超标</option>
          <option>关键里程碑滞后</option>
        </select>
      </label>
      <label>
        风险描述
        <textarea rows="4" placeholder="说明风险影响范围与解决方案"></textarea>
      </label>
      <label>
        责任部门
        <input placeholder="采购/工程/质量" />
      </label>
    </form>
    <template #footer>
      <button class="ghost" type="button" @click="modals.alert = false">暂存</button>
      <button class="primary" type="button" @click="modals.alert = false">发布提示</button>
    </template>
  </BaseModal>
</template>

<script setup>
import { reactive } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const hero =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="560" height="220"><defs><linearGradient id="p" x1="0" y1="0" x2="1" y2="1"><stop stop-color="%23dbeafe" offset="0"/><stop stop-color="%23ffffff" offset="1"/></linearGradient></defs><rect width="560" height="220" rx="18" fill="url(%23p)"/><rect x="40" y="60" width="160" height="16" rx="8" fill="%2393c5fd"/><rect x="40" y="90" width="260" height="12" rx="6" fill="%23bfdbfe"/><rect x="40" y="120" width="220" height="12" rx="6" fill="%23e0f2fe"/><circle cx="460" cy="110" r="60" fill="%2360a5fa"/></svg>';

const stages = [
  { name: '概念阶段', value: 86 },
  { name: '造型冻结', value: 74 },
  { name: '工程冻结', value: 61 },
  { name: '量产准备', value: 38 }
];

const projects = Array.from({ length: 24 }, (_, index) => ({
  code: `EV-${index + 1}`.padStart(5, '0'),
  platform: ['EV3', 'XN9', 'LR5', 'HF2'][index % 4],
  stage: ['概念阶段', '造型冻结', '工程冻结', '量产准备'][index % 4],
  milestone: ['造型包提交', '工程冻结评审', '试制启动', '量产签收'][index % 4],
  owner: ['张工', '李工', '王工', '赵工'][index % 4],
  delivery: ['A面数模', 'CMF方案', '工艺可行性', '供应链确认'][index % 4]
}));

const modals = reactive({
  create: false,
  milestone: false,
  assign: false,
  delivery: false,
  alert: false
});
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.summary {
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

.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
}

.panel {
  background: #fff;
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
}

.panel img {
  width: 100%;
  border-radius: 14px;
  margin-top: 12px;
}

.panel ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.panel li {
  display: grid;
  grid-template-columns: 90px 1fr 50px;
  align-items: center;
  gap: 10px;
  font-size: 13px;
}

.progress {
  height: 8px;
  background: #e5e7eb;
  border-radius: 999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #38bdf8, #2563eb);
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

.progress-hint {
  display: grid;
  grid-template-columns: 90px 1fr 50px;
  align-items: center;
  gap: 10px;
  font-size: 13px;
}
</style>
