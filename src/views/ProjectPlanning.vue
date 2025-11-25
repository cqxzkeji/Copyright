<template>
  <div class="module">
    <div class="header">
      <div>
        <h3>项目立项与规划管理</h3>
        <p class="muted">维护立项信息、规划方案与审批动态</p>
      </div>
      <div class="actions">
        <button class="primary-btn" @click="openProjectForm">新增立项</button>
        <button class="secondary-btn" @click="openDocModal">上传规划方案</button>
      </div>
    </div>

    <div class="card-grid">
      <div class="card">
        <div class="card-head">
          <strong>立项库</strong>
          <span class="badge" style="background:#dbeafe">共 {{ projects.length }} 条</span>
        </div>
        <table class="table">
          <thead>
            <tr>
              <th>项目</th>
              <th>片区</th>
              <th>立项阶段</th>
              <th>责任人</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="project in projects" :key="project.name">
              <td>{{ project.name }}</td>
              <td>{{ project.area }}</td>
              <td>
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: project.stage + '%' }"></div>
                </div>
              </td>
              <td>{{ project.owner }}</td>
              <td class="table-actions">
                <button class="secondary-btn" @click="viewDetail(project)">审批节点</button>
                <button class="primary-btn" @click="openDocModal">方案上传</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="card">
        <div class="card-head">
          <strong>规划方案文件</strong>
          <button class="secondary-btn" @click="openDocModal">新增版本</button>
        </div>
        <ul class="doc-list">
          <li v-for="doc in documents" :key="doc.title">
            <div>
              <div class="doc-title">{{ doc.title }}</div>
              <div class="muted">更新于 {{ doc.date }} · 负责人 {{ doc.owner }}</div>
            </div>
            <button class="primary-btn" @click="previewDoc(doc)">预览</button>
          </li>
        </ul>
      </div>
    </div>

    <div v-if="showForm" class="modal-mask" @click.self="showForm=false">
      <div class="modal-container">
        <div class="modal-header">
          <span>新增立项</span>
          <button class="secondary-btn" @click="showForm=false">关闭</button>
        </div>
        <div class="grid-2">
          <label>项目名称<input v-model="form.name" class="input" /></label>
          <label>所在片区<input v-model="form.area" class="input" /></label>
          <label>责任人<input v-model="form.owner" class="input" /></label>
          <label>规划容量(万㎡)<input v-model="form.capacity" class="input" /></label>
        </div>
        <label>规划亮点<textarea v-model="form.highlights" class="input" rows="3"></textarea></label>
        <button class="primary-btn" style="margin-top:12px" @click="submitProject">保存立项</button>
      </div>
    </div>

    <div v-if="showDoc" class="modal-mask" @click.self="showDoc=false">
      <div class="modal-container">
        <div class="modal-header">
          <span>上传/变更规划方案</span>
          <button class="secondary-btn" @click="showDoc=false">关闭</button>
        </div>
        <div class="grid-2">
          <label>项目<select v-model="docForm.project" class="input">
            <option v-for="p in projects" :key="p.name">{{ p.name }}</option>
          </select></label>
          <label>提交人<input v-model="docForm.owner" class="input" /></label>
        </div>
        <label>方案说明<textarea v-model="docForm.desc" class="input" rows="3"></textarea></label>
        <button class="primary-btn" style="margin-top:12px" @click="confirmDoc">上传并提醒</button>
      </div>
    </div>

    <div v-if="showAlert" class="modal-mask" @click.self="showAlert=false">
      <div class="modal-container">
        <div class="modal-header">
          <span>审批节点详情</span>
          <button class="secondary-btn" @click="showAlert=false">关闭</button>
        </div>
        <p class="muted">{{ alertMsg }}</p>
        <div style="margin-top:12px" class="tag-row">
          <span class="badge" style="background:#dcfce7" v-for="tag in ['控规','总规审查','专家会','公示','批前']" :key="tag">{{ tag }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'

const projects = reactive([
  { name: '滨江活力更新单元', area: '江北新区', stage: 62, owner: '陈立' },
  { name: '轨交枢纽综合体', area: '城东副中心', stage: 45, owner: '李然' },
  { name: '老城肌理修复', area: '中心城区', stage: 78, owner: '王敏' },
  { name: '智慧生态科创谷', area: '高新区', stage: 31, owner: '周静' },
  { name: '滨水居住品质提升', area: '江南片', stage: 54, owner: '赵炎' }
])

const documents = reactive([
  { title: '滨江活力更新单元 规划调整v2.1', date: '2024-06-02', owner: '陈立' },
  { title: '轨交枢纽综合体 控规报批件', date: '2024-05-28', owner: '李然' },
  { title: '老城肌理修复 专家会意见汇总', date: '2024-05-25', owner: '王敏' },
  { title: '生态科创谷 绿色建筑清单', date: '2024-05-20', owner: '周静' },
  { title: '滨水品质提升 公众公示材料', date: '2024-05-16', owner: '赵炎' }
])

const showForm = ref(false)
const showDoc = ref(false)
const showAlert = ref(false)
const alertMsg = ref('')

const form = reactive({ name: '', area: '', owner: '', capacity: '', highlights: '' })
const docForm = reactive({ project: '滨江活力更新单元', owner: '陈立', desc: '' })

const openProjectForm = () => {
  showForm.value = true
}

const openDocModal = () => {
  showDoc.value = true
}

const submitProject = () => {
  showForm.value = false
  alertMsg.value = `已保存立项 ${form.name || '新项目'}，并同步至审批日程。`
  showAlert.value = true
}

const confirmDoc = () => {
  showDoc.value = false
  alertMsg.value = `${docForm.project} 的规划方案已提交，提醒规划审查与批复部门。`
  showAlert.value = true
}

const viewDetail = (project) => {
  alertMsg.value = `${project.name} 审批节点：控规会签完成 ${project.stage}%，请推进下一批次公示。`
  showAlert.value = true
}

const previewDoc = (doc) => {
  alertMsg.value = `正在预览 ${doc.title}，自动加载批注与版本对比。`
  showAlert.value = true
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

.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.doc-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0;
}

.doc-title {
  font-weight: 700;
}
</style>
