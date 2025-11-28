<template>
  <div class="card">
    <header class="card__header">
      <div>
        <p class="eyebrow">调度</p>
        <h3>任务编排与队列</h3>
      </div>
      <div class="buttons">
        <button @click="showCreate = true">新建任务</button>
        <button class="ghost" @click="openProgress('下发队列', 48)">下发队列</button>
      </div>
    </header>

    <table class="data-table">
      <thead>
        <tr><th>任务</th><th>工艺</th><th>目标站位</th><th>节拍</th><th>状态</th><th>操作</th></tr>
      </thead>
      <tbody>
        <tr v-for="task in tasks" :key="task.name">
          <td>{{ task.name }}</td>
          <td>{{ task.process }}</td>
          <td>{{ task.station }}</td>
          <td>{{ task.takt }}</td>
          <td><span class="tag" :class="task.status">{{ task.status }}</span></td>
          <td>
            <div class="row-btns">
              <button class="ghost" @click="openDetails(task)">查看</button>
              <button class="ghost" @click="openProgress('刷新任务 ' + task.name, 60)">同步</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <ModalDialog :show="showCreate" title="新建任务" primary-text="提交任务" @close="showCreate = false" @confirm="saveTask">
    <form class="form">
      <label>任务名称<input v-model="createForm.name" /></label>
      <label>工艺模板<select v-model="createForm.process"><option>焊接</option><option>打磨</option><option>装配</option></select></label>
      <label>目标站位<input v-model="createForm.station" placeholder="如：线体A-工位3" /></label>
      <label>节拍(秒)<input v-model.number="createForm.takt" type="number" /></label>
    </form>
  </ModalDialog>

  <ModalDialog :show="detail.show" :title="detail.data.name" primary-text="关闭" @close="detail.show = false" @confirm="detail.show = false">
    <p class="muted">工艺：{{ detail.data.process }} ｜ 目标：{{ detail.data.station }}</p>
    <ul class="muted">
      <li>节拍：{{ detail.data.takt }} s</li>
      <li>状态：{{ detail.data.status }}</li>
      <li>末端工具：{{ detail.data.tool }}</li>
    </ul>
  </ModalDialog>

  <ModalDialog :show="progress.show" :title="progress.title" :show-footer="false" @close="progress.show = false">
    <p class="muted">正在执行，请稍候…</p>
    <div class="progress"><div class="progress__bar" :style="{ width: progress.value + '%' }"></div></div>
  </ModalDialog>
</template>

<script setup>
import { reactive, ref } from 'vue'
import ModalDialog from '../components/ModalDialog.vue'

const tasks = reactive([
  { name: '焊缝A-晨检', process: '焊接', station: '线体A-1', takt: 42, status: '就绪', tool: '焊枪-长颈' },
  { name: '边缘打磨', process: '打磨', station: '线体B-3', takt: 55, status: '运行中', tool: '打磨-柔性' },
  { name: '螺栓装配', process: '装配', station: '线体A-2', takt: 38, status: '就绪', tool: '夹爪-轻量' },
  { name: '漆面补喷', process: '喷涂', station: '线体C-1', takt: 60, status: '排队', tool: '喷涂-雾化' },
  { name: '相机标定', process: '视觉', station: '质检-1', takt: 45, status: '运行中', tool: '视觉-双目' }
])

const showCreate = ref(false)
const createForm = reactive({ name: '柔性装配', process: '装配', station: '线体A-3', takt: 40 })
const detail = reactive({ show: false, data: {} })
const progress = reactive({ show: false, title: '执行中', value: 0 })

const openProgress = (title, value) => {
  progress.title = title
  progress.value = value
  progress.show = true
  setTimeout(() => (progress.value = 100), 500)
}

const openDetails = (task) => {
  detail.data = task
  detail.show = true
}

const saveTask = () => {
  tasks.push({ ...createForm, status: '就绪', tool: '夹爪-轻量' })
  showCreate.value = false
  openProgress('任务已入队', 58)
}
</script>

<style scoped>
.card { background: #fff; border: 1px solid var(--border); border-radius: 16px; padding: 16px; box-shadow: var(--shadow); display: flex; flex-direction: column; gap: 14px; }
.card__header { display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; }
.eyebrow { color: var(--primary); font-weight: 700; letter-spacing: 0.06em; }
.buttons { display: flex; gap: 10px; }
.buttons button { border: none; border-radius: 12px; padding: 10px 12px; font-weight: 700; cursor: pointer; background: linear-gradient(135deg, var(--primary), var(--primary-strong)); color: #fff; }
.buttons .ghost { background: #eef2f7; color: #1b2a3c; border: 1px solid var(--border); }
.data-table { width: 100%; border-collapse: collapse; }
.data-table th, .data-table td { border-bottom: 1px solid var(--border); padding: 10px 8px; text-align: left; }
.data-table tbody tr:hover { background: #f9fbff; }
.row-btns { display: flex; gap: 6px; flex-wrap: wrap; }
.tag { padding: 4px 8px; border-radius: 10px; font-weight: 700; }
.tag.就绪 { background: #eaf7ff; color: #1c7ab7; }
.tag.运行中 { background: #fff3e0; color: #b95b03; }
.tag.排队 { background: #f0edff; color: #6b46c1; }
.form { display: flex; flex-direction: column; gap: 10px; }
.form label { display: flex; flex-direction: column; gap: 6px; font-weight: 600; color: #1b2a3c; }
.form input, .form select { border: 1px solid var(--border); border-radius: 10px; padding: 10px; }
.progress { height: 12px; border-radius: 12px; background: #eef2f7; overflow: hidden; }
.progress__bar { height: 100%; background: linear-gradient(135deg, var(--primary), var(--success)); transition: width 0.6s ease; }
</style>
