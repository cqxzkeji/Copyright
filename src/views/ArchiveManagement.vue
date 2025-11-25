<template>
  <div class="module">
    <div class="header">
      <div>
        <h3>档案管理与综合监管</h3>
        <p class="muted">全过程档案存储，项目库综合监管</p>
      </div>
      <div class="actions">
        <button class="primary-btn" @click="openArchive">归档资料</button>
        <button class="secondary-btn" @click="openAudit">监管巡检</button>
      </div>
    </div>

    <div class="card">
      <div class="card-head">
        <strong>档案库</strong>
        <span class="badge" style="background:#dbeafe">共 {{ archives.length }} 条</span>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>项目</th>
            <th>阶段</th>
            <th>文件</th>
            <th>归档时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in archives" :key="item.file">
            <td>{{ item.project }}</td>
            <td>{{ item.phase }}</td>
            <td>{{ item.file }}</td>
            <td>{{ item.date }}</td>
            <td class="table-actions">
              <button class="secondary-btn" @click="openAudit">查看</button>
              <button class="primary-btn" @click="openArchive">续传</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="card-grid">
      <div class="card">
        <div class="card-head">
          <strong>综合监管</strong>
          <button class="secondary-btn" @click="openAudit">发起巡检</button>
        </div>
        <ul class="doc-list">
          <li v-for="audit in audits" :key="audit.title">
            <div>
              <div class="doc-title">{{ audit.title }}</div>
              <div class="muted">{{ audit.msg }}</div>
            </div>
            <button class="primary-btn" @click="openAudit">执行</button>
          </li>
        </ul>
      </div>
      <div class="card">
        <div class="card-head">
          <strong>档案进度条</strong>
        </div>
        <div class="chart">
          <div v-for="item in archives" :key="item.file" class="bar-row">
            <span>{{ item.project }}</span>
            <div class="bar-shell">
              <div class="bar-fill" :style="{ width: item.progress + '%', background: '#22c55e' }"></div>
            </div>
            <span class="muted">{{ item.progress }}%</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showArchive" class="modal-mask" @click.self="showArchive=false">
      <div class="modal-container">
        <div class="modal-header">
          <span>档案归集</span>
          <button class="secondary-btn" @click="showArchive=false">关闭</button>
        </div>
        <div class="grid-2">
          <label>项目<select class="input">
            <option v-for="item in archives" :key="item.project">{{ item.project }}</option>
          </select></label>
          <label>文件名称<input class="input" placeholder="上传文件名" /></label>
        </div>
        <button class="primary-btn" style="margin-top:12px" @click="showArchive=false">上传并备案</button>
      </div>
    </div>

    <div v-if="showAudit" class="modal-mask" @click.self="showAudit=false">
      <div class="modal-container">
        <div class="modal-header">
          <span>监管巡检</span>
          <button class="secondary-btn" @click="showAudit=false">关闭</button>
        </div>
        <p class="muted">已将巡检清单推送至项目单位，并同步提醒责任人提交整改结果。</p>
        <div class="progress-bar" style="margin-top:10px">
          <div class="progress-fill" style="width:50%"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'

const archives = reactive([
  { project: '滨江活力更新单元', phase: '规划批复', file: '控规批复件.pdf', date: '2024-05-30', progress: 82 },
  { project: '轨交枢纽综合体', phase: '施工许可', file: '施工许可扫描件.zip', date: '2024-05-28', progress: 70 },
  { project: '老城肌理修复', phase: '征收安置', file: '签约台账.xlsx', date: '2024-05-22', progress: 46 },
  { project: '智慧生态科创谷', phase: '开工备案', file: '开工许可证.pdf', date: '2024-05-18', progress: 93 },
  { project: '滨水居住品质提升', phase: '方案批复', file: '设计方案批复.docx', date: '2024-05-15', progress: 58 }
])

const audits = reactive([
  { title: '资金支付合规巡检', msg: '检查资金拨付凭证与实物工作量匹配情况。' },
  { title: '工程质量抽检', msg: '现场结构安全与材料检测抽样。' },
  { title: '档案齐备性检查', msg: '核对规划、用地、施工、验收全链条资料。' }
])

const showArchive = ref(false)
const showAudit = ref(false)

const openArchive = () => {
  showArchive.value = true
}

const openAudit = () => {
  showAudit.value = true
}
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.actions {
  display: flex;
  gap: 10px;
}

.chart {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.bar-row {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  align-items: center;
  gap: 10px;
}

.bar-shell {
  background: #e5e7eb;
  border-radius: 999px;
  overflow: hidden;
  width: 100%;
  height: 12px;
}

.bar-fill {
  height: 100%;
}
</style>
