<template>
  <div class="grid" style="gap: 14px;">
    <div class="card">
      <div class="section-header">
        <div>
          <p class="eyebrow">维修与保养管理</p>
          <h3>年度保养计划</h3>
        </div>
        <div class="action-row">
          <button class="btn secondary" @click="togglePlan">新增计划</button>
          <button class="btn" @click="toggleProgress">执行进度</button>
        </div>
      </div>
      <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));">
        <div v-for="item in planStats" :key="item.title" class="card" style="background:#f7f9fc;">
          <p class="muted">{{ item.title }}</p>
          <h2>{{ item.count }}</h2>
          <div class="progress-bar" style="margin-top:8px;">
            <span :style="{ width: item.rate + '%' }"></span>
          </div>
          <p class="muted">完成率 {{ item.rate }}%</p>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="section-header">
        <h3>维修与保养记录</h3>
        <button class="btn secondary" @click="toggleAdd">登记保养</button>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>工单号</th>
            <th>设备</th>
            <th>类型</th>
            <th>负责人</th>
            <th>计划日期</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="task in tasks" :key="task.id" style="cursor:pointer;" @click="selectTask(task)">
            <td>{{ task.id }}</td>
            <td>{{ task.device }}</td>
            <td>{{ task.type }}</td>
            <td>{{ task.owner }}</td>
            <td>{{ task.date }}</td>
            <td><span class="badge" :class="task.class">{{ task.status }}</span></td>
            <td><button class="btn secondary" @click.stop="selectTask(task)">详情</button></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showAdd" class="modal-backdrop" @click.self="showAdd = false">
      <div class="modal">
        <h3>登记保养</h3>
        <div class="form-row">
          <label>设备编号</label>
          <input placeholder="如 HX-1020" />
        </div>
        <div class="form-row" style="margin-top:10px;">
          <label>保养类型</label>
          <select>
            <option>例行保养</option>
            <option>紧急抢修</option>
            <option>配件更换</option>
          </select>
        </div>
        <div class="form-row" style="margin-top:10px;">
          <label>计划日期</label>
          <input type="date" />
        </div>
        <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:14px;">
          <button class="btn secondary" @click="showAdd = false">取消</button>
          <button class="btn success" @click="submit">保存</button>
        </div>
      </div>
    </div>

    <div v-if="showDetail" class="modal-backdrop" @click.self="showDetail = false">
      <div class="modal">
        <h3>工单 {{ active.id }}</h3>
        <p class="muted">负责人 {{ active.owner }}，类型 {{ active.type }}，状态 {{ active.status }}。</p>
        <div class="progress-bar" style="margin:10px 0;">
          <span :style="{ width: active.progress + '%' }"></span>
        </div>
        <p>进度 {{ active.progress }}%</p>
        <div style="text-align:right;">
          <button class="btn secondary" @click="showDetail = false">关闭</button>
          <button class="btn" @click="toggleProgress">更新进度</button>
        </div>
      </div>
    </div>

    <div v-if="showPlan" class="modal-backdrop" @click.self="showPlan = false">
      <div class="modal">
        <h3>新增年度计划</h3>
        <div class="form-row">
          <label>计划名称</label>
          <input placeholder="如 2024 年消防泵房维护" />
        </div>
        <div class="form-row" style="margin-top:10px;">
          <label>负责人</label>
          <input placeholder="负责人" />
        </div>
        <div class="form-row" style="margin-top:10px;">
          <label>备注</label>
          <textarea rows="3" placeholder="填写工作范围及目标"></textarea>
        </div>
        <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:14px;">
          <button class="btn secondary" @click="showPlan = false">取消</button>
          <button class="btn" @click="confirmPlan">创建</button>
        </div>
      </div>
    </div>

    <div v-if="showProgress" class="modal-backdrop" @click.self="showProgress = false">
      <div class="modal">
        <h3>执行进度</h3>
        <div class="progress-bar" style="margin:12px 0;">
          <span :style="{ width: progress + '%' }"></span>
        </div>
        <p>任务完成度 {{ progress }}%</p>
        <div style="text-align:right;">
          <button class="btn" @click="showProgress = false">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const planStats = reactive([
  { title: '当月计划', count: '12 项', rate: 72 },
  { title: '紧急抢修', count: '3 项', rate: 55 },
  { title: '巡检同步', count: '18 次', rate: 88 },
  { title: '配件更换', count: '6 次', rate: 42 }
]);

const tasks = reactive([
  { id: 'WO-2301', device: 'HX-1002', type: '例行保养', owner: '张涛', date: '2024-05-02', status: '进行中', class: 'warning', progress: 60 },
  { id: 'WO-2302', device: 'HX-1004', type: '紧急抢修', owner: '李强', date: '2024-05-03', status: '未开始', class: 'danger', progress: 10 },
  { id: 'WO-2303', device: 'HX-1006', type: '配件更换', owner: '陈静', date: '2024-05-04', status: '进行中', class: 'warning', progress: 45 },
  { id: 'WO-2304', device: 'HX-1001', type: '例行保养', owner: '刘洋', date: '2024-05-06', status: '待确认', class: 'warning', progress: 30 },
  { id: 'WO-2305', device: 'HX-1003', type: '例行保养', owner: '周雪', date: '2024-05-07', status: '已完成', class: 'success', progress: 100 }
]);

const showAdd = ref(false);
const showDetail = ref(false);
const active = ref({});
const showPlan = ref(false);
const showProgress = ref(false);
const progress = ref(40);

function toggleAdd() { showAdd.value = true; }
function togglePlan() { showPlan.value = true; }

function submit() {
  alert('保养登记已保存');
  showAdd.value = false;
}

function selectTask(task) {
  active.value = task;
  showDetail.value = true;
}

function confirmPlan() {
  alert('年度计划已创建');
  showPlan.value = false;
}

function toggleProgress() {
  showProgress.value = true;
  progress.value = (progress.value + 25) % 100;
}
</script>

<style scoped>
.section-header { display:flex; justify-content: space-between; align-items:center; gap: 10px; flex-wrap: wrap; }
.action-row { display:flex; gap: 10px; flex-wrap: wrap; }
</style>
