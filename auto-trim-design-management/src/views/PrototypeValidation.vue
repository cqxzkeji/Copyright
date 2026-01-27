<template>
  <section class="module">
    <div class="hero">
      <div>
        <h3>试制验证概览</h3>
        <p>覆盖样件、DV/PV验证、问题单闭环统计。</p>
        <div class="stats">
          <div>
            <strong>DV计划</strong>
            <span>完成 68%</span>
          </div>
          <div>
            <strong>PV计划</strong>
            <span>完成 52%</span>
          </div>
          <div>
            <strong>问题闭环</strong>
            <span>本月 24 条</span>
          </div>
        </div>
      </div>
      <img :src="heroImg" alt="试制验证" />
    </div>

    <div class="toolbar">
      <button class="primary" @click="modals.batch = true">新增试制批次</button>
      <button class="ghost" @click="modals.plan = true">DV/PV验证计划</button>
      <button class="ghost" @click="modals.issue = true">问题登记</button>
      <button class="ghost" @click="modals.assign = true">责任分派</button>
      <button class="ghost" @click="modals.close = true">闭环统计</button>
    </div>

    <div class="table-panel">
      <h3>问题单记录</h3>
      <table>
        <thead>
          <tr>
            <th>问题编号</th>
            <th>类型</th>
            <th>影响区域</th>
            <th>责任人</th>
            <th>整改状态</th>
            <th>验证结论</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in issues" :key="item.code">
            <td>{{ item.code }}</td>
            <td>{{ item.type }}</td>
            <td>{{ item.area }}</td>
            <td>{{ item.owner }}</td>
            <td>{{ item.status }}</td>
            <td>{{ item.result }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>

  <BaseModal v-model="modals.batch" title="新增试制批次">
    <form class="modal-form">
      <label>
        批次编号
        <input placeholder="例如：PT-2024-05" />
      </label>
      <label>
        样件类型
        <select>
          <option>内饰样件</option>
          <option>外饰样件</option>
          <option>整车样件</option>
        </select>
      </label>
      <label>
        计划数量
        <input type="number" placeholder="输入数量" />
      </label>
      <label>
        交付日期
        <input type="date" />
      </label>
    </form>
    <template #footer>
      <button class="ghost" type="button" @click="modals.batch = false">取消</button>
      <button class="primary" type="button" @click="modals.batch = false">创建批次</button>
    </template>
  </BaseModal>

  <BaseModal v-model="modals.plan" title="DV/PV验证计划">
    <form class="modal-form">
      <label>
        验证类型
        <select>
          <option>DV设计验证</option>
          <option>PV生产验证</option>
        </select>
      </label>
      <label>
        计划周期
        <input placeholder="2024/05 - 2024/08" />
      </label>
      <label>
        验证项目
        <textarea rows="3" placeholder="NVH、装配、外观、耐久"></textarea>
      </label>
      <label>
        资源需求
        <input placeholder="试验资源、样件数量" />
      </label>
    </form>
    <template #footer>
      <button class="ghost" type="button" @click="modals.plan = false">保存计划</button>
      <button class="primary" type="button" @click="modals.plan = false">提交审批</button>
    </template>
  </BaseModal>

  <BaseModal v-model="modals.issue" title="问题登记">
    <form class="modal-form">
      <label>
        问题类型
        <select>
          <option>缺陷</option>
          <option>异响</option>
          <option>装配干涉</option>
          <option>外观缺陷</option>
        </select>
      </label>
      <label>
        发现位置
        <input placeholder="例如：副仪表板左侧" />
      </label>
      <label>
        现象描述
        <textarea rows="4" placeholder="记录问题现象及条件"></textarea>
      </label>
    </form>
    <template #footer>
      <button class="ghost" type="button" @click="modals.issue = false">暂存</button>
      <button class="primary" type="button" @click="modals.issue = false">提交问题单</button>
    </template>
  </BaseModal>

  <BaseModal v-model="modals.assign" title="责任分派">
    <form class="modal-form">
      <label>
        问题编号
        <input placeholder="例如：ISS-2024-017" />
      </label>
      <label>
        责任部门
        <select>
          <option>造型工程</option>
          <option>制造工艺</option>
          <option>供应商质量</option>
          <option>采购支持</option>
        </select>
      </label>
      <label>
        整改截止日期
        <input type="date" />
      </label>
    </form>
    <template #footer>
      <button class="ghost" type="button" @click="modals.assign = false">通知责任人</button>
      <button class="primary" type="button" @click="modals.assign = false">确认分派</button>
    </template>
  </BaseModal>

  <BaseModal v-model="modals.close" title="整改闭环统计" width="520px">
    <div class="progress-panel">
      <p>当前试制批次问题单闭环率如下。</p>
      <div class="progress-row">
        <span>外观缺陷</span>
        <div class="progress"><div class="progress-fill" style="width: 78%"></div></div>
        <strong>78%</strong>
      </div>
      <div class="progress-row">
        <span>装配干涉</span>
        <div class="progress"><div class="progress-fill" style="width: 56%"></div></div>
        <strong>56%</strong>
      </div>
      <div class="progress-row">
        <span>异响问题</span>
        <div class="progress"><div class="progress-fill" style="width: 64%"></div></div>
        <strong>64%</strong>
      </div>
    </div>
    <template #footer>
      <button class="ghost" type="button" @click="modals.close = false">导出报告</button>
      <button class="primary" type="button" @click="modals.close = false">确认</button>
    </template>
  </BaseModal>
</template>

<script setup>
import { reactive } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const heroImg =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="520" height="200"><defs><linearGradient id="h" x1="0" y1="0" x2="1" y2="1"><stop stop-color="%23dcfce7" offset="0"/><stop stop-color="%23ffffff" offset="1"/></linearGradient></defs><rect width="520" height="200" rx="18" fill="url(%23h)"/><rect x="40" y="60" width="200" height="16" rx="8" fill="%2386efac"/><rect x="40" y="90" width="160" height="12" rx="6" fill="%23bbf7d0"/><rect x="40" y="120" width="240" height="12" rx="6" fill="%23dcfce7"/><circle cx="430" cy="100" r="56" fill="%2322c55e" opacity="0.6"/></svg>';

const issues = Array.from({ length: 24 }, (_, index) => ({
  code: `ISS-2024-${String(index + 1).padStart(3, '0')}`,
  type: ['缺陷', '异响', '装配干涉', '外观缺陷'][index % 4],
  area: ['仪表板', '门板', '座椅', '保险杠'][index % 4],
  owner: ['蒋工', '马工', '贺工', '严工'][index % 4],
  status: ['整改中', '待验证', '已闭环', '待分析'][index % 4],
  result: ['通过', '复测', '不通过', '待评估'][index % 4]
}));

const modals = reactive({
  batch: false,
  plan: false,
  issue: false,
  assign: false,
  close: false
});
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.hero {
  background: #fff;
  border-radius: 16px;
  padding: 18px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 18px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
  align-items: center;
}

.hero img {
  width: 100%;
  border-radius: 14px;
}

.stats {
  display: grid;
  gap: 10px;
  margin-top: 14px;
}

.stats div {
  display: flex;
  justify-content: space-between;
  background: #f0fdf4;
  padding: 8px 12px;
  border-radius: 10px;
  font-size: 13px;
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
  background: linear-gradient(90deg, #4ade80, #16a34a);
}
</style>
