<template>
  <section class="module">
    <div class="header">
      <div>
        <h3>供应商协同与资料归档</h3>
        <p>集中管理图纸、规范、3D数模与审核记录，全链路审计可追溯。</p>
      </div>
      <img :src="hero" alt="供应商协同" />
    </div>

    <div class="toolbar">
      <button class="primary" @click="modals.exchange = true">资料收发</button>
      <button class="ghost" @click="modals.ppap = true">PPAP/FAI文档</button>
      <button class="ghost" @click="modals.archive = true">图纸归档</button>
      <button class="ghost" @click="modals.permission = true">权限控制</button>
      <button class="ghost" @click="modals.audit = true">审计日志</button>
    </div>

    <div class="table-panel">
      <h3>供应商资料清单</h3>
      <table>
        <thead>
          <tr>
            <th>供应商</th>
            <th>资料类型</th>
            <th>版本</th>
            <th>接收时间</th>
            <th>负责人</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in archives" :key="item.id">
            <td>{{ item.vendor }}</td>
            <td>{{ item.type }}</td>
            <td>{{ item.version }}</td>
            <td>{{ item.date }}</td>
            <td>{{ item.owner }}</td>
            <td>{{ item.status }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>

  <BaseModal v-model="modals.exchange" title="供应商资料收发">
    <form class="modal-form">
      <label>
        供应商名称
        <input placeholder="输入供应商" />
      </label>
      <label>
        资料类型
        <select>
          <option>3D数模</option>
          <option>图纸</option>
          <option>检验标准</option>
          <option>规范说明</option>
        </select>
      </label>
      <label>
        接收说明
        <textarea rows="3" placeholder="记录收发需求与备注"></textarea>
      </label>
    </form>
    <template #footer>
      <button class="ghost" type="button" @click="modals.exchange = false">保存</button>
      <button class="primary" type="button" @click="modals.exchange = false">确认收发</button>
    </template>
  </BaseModal>

  <BaseModal v-model="modals.ppap" title="PPAP / FAI 文档管理">
    <form class="modal-form">
      <label>
        文档类型
        <select>
          <option>PPAP提交包</option>
          <option>FAI首件报告</option>
          <option>检验计划</option>
        </select>
      </label>
      <label>
        版本说明
        <input placeholder="例如：V2.0 重新提交" />
      </label>
      <label>
        审核结论
        <textarea rows="3" placeholder="合格/需整改"></textarea>
      </label>
    </form>
    <template #footer>
      <button class="ghost" type="button" @click="modals.ppap = false">下载文档</button>
      <button class="primary" type="button" @click="modals.ppap = false">确认归档</button>
    </template>
  </BaseModal>

  <BaseModal v-model="modals.archive" title="图纸/规范归档">
    <form class="modal-form">
      <label>
        文件名称
        <input placeholder="输入图纸或规范名称" />
      </label>
      <label>
        版本号
        <input placeholder="V1.0" />
      </label>
      <label>
        适用范围
        <input placeholder="适用于EV3门板" />
      </label>
    </form>
    <template #footer>
      <button class="ghost" type="button" @click="modals.archive = false">保存草稿</button>
      <button class="primary" type="button" @click="modals.archive = false">完成归档</button>
    </template>
  </BaseModal>

  <BaseModal v-model="modals.permission" title="权限控制">
    <form class="modal-form">
      <label>
        角色选择
        <select>
          <option>项目经理</option>
          <option>供应商质量</option>
          <option>工艺工程师</option>
          <option>采购管理员</option>
        </select>
      </label>
      <label>
        权限范围
        <input placeholder="查看/上传/审批" />
      </label>
      <label>
        审批期限
        <input type="date" />
      </label>
    </form>
    <template #footer>
      <button class="ghost" type="button" @click="modals.permission = false">取消</button>
      <button class="primary" type="button" @click="modals.permission = false">更新权限</button>
    </template>
  </BaseModal>

  <BaseModal v-model="modals.audit" title="全链路审计日志" width="520px">
    <div class="progress-panel">
      <p>系统已同步最新审计记录。</p>
      <div class="progress-row">
        <span>上传行为</span>
        <div class="progress"><div class="progress-fill" style="width: 88%"></div></div>
        <strong>88%</strong>
      </div>
      <div class="progress-row">
        <span>审批行为</span>
        <div class="progress"><div class="progress-fill" style="width: 66%"></div></div>
        <strong>66%</strong>
      </div>
      <div class="progress-row">
        <span>下载行为</span>
        <div class="progress"><div class="progress-fill" style="width: 52%"></div></div>
        <strong>52%</strong>
      </div>
    </div>
    <template #footer>
      <button class="ghost" type="button" @click="modals.audit = false">导出日志</button>
      <button class="primary" type="button" @click="modals.audit = false">确认</button>
    </template>
  </BaseModal>
</template>

<script setup>
import { reactive } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const hero =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="520" height="200"><defs><linearGradient id="s" x1="0" y1="0" x2="1" y2="1"><stop stop-color="%23ede9fe" offset="0"/><stop stop-color="%23ffffff" offset="1"/></linearGradient></defs><rect width="520" height="200" rx="18" fill="url(%23s)"/><rect x="40" y="60" width="210" height="16" rx="8" fill="%23c4b5fd"/><rect x="40" y="90" width="160" height="12" rx="6" fill="%23ddd6fe"/><rect x="40" y="120" width="230" height="12" rx="6" fill="%23ede9fe"/><circle cx="430" cy="100" r="56" fill="%238b5cf6" opacity="0.6"/></svg>';

const archives = Array.from({ length: 24 }, (_, index) => ({
  id: `ARC-${index + 1}`,
  vendor: ['华域', '延锋', '宁德', '敏实', '拓普', '博泽'][index % 6],
  type: ['3D数模', '图纸', '检验标准', 'PPAP文件'][index % 4],
  version: `V${(index % 3) + 1}.${index % 2}`,
  date: `2024-0${(index % 5) + 1}-1${index % 9}`,
  owner: ['林工', '向工', '杜工', '邢工'][index % 4],
  status: ['已归档', '待审核', '更新中', '已发布'][index % 4]
}));

const modals = reactive({
  exchange: false,
  ppap: false,
  archive: false,
  permission: false,
  audit: false
});
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.header {
  background: #fff;
  border-radius: 16px;
  padding: 18px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 18px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
  align-items: center;
}

.header img {
  width: 100%;
  border-radius: 14px;
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
  background: linear-gradient(90deg, #a855f7, #6366f1);
}
</style>
