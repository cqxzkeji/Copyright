<template>
  <div class="grid" style="gap: 14px;">
    <div class="card">
      <div class="section-header">
        <div>
          <p class="eyebrow">设备巡检管理</p>
          <h3>巡检计划与执行</h3>
        </div>
        <div class="action-row">
          <button class="btn secondary" @click="togglePlan">创建巡检</button>
          <button class="btn" @click="toggleProgress">同步巡检</button>
        </div>
      </div>
      <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));">
        <div v-for="item in summary" :key="item.label" class="card" style="background:#f7f9fc;">
          <p class="muted">{{ item.label }}</p>
          <h2>{{ item.value }}</h2>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="section-header">
        <h3>巡检路线与记录</h3>
        <button class="btn secondary" @click="toggleAdd">登记巡检结果</button>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>路线</th>
            <th>巡检员</th>
            <th>计划时间</th>
            <th>完成时间</th>
            <th>发现问题</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="route in routes" :key="route.name" style="cursor:pointer;" @click="selectRoute(route)">
            <td>{{ route.name }}</td>
            <td>{{ route.owner }}</td>
            <td>{{ route.plan }}</td>
            <td>{{ route.done || '-' }}</td>
            <td>{{ route.issues }}</td>
            <td><span class="badge" :class="route.class">{{ route.status }}</span></td>
            <td><button class="btn secondary" @click.stop="selectRoute(route)">详情</button></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showPlan" class="modal-backdrop" @click.self="showPlan = false">
      <div class="modal">
        <h3>创建巡检</h3>
        <div class="form-row">
          <label>巡检路线</label>
          <input placeholder="如 地下车库-北区" />
        </div>
        <div class="form-row" style="margin-top:10px;">
          <label>巡检员</label>
          <input placeholder="姓名" />
        </div>
        <div class="form-row" style="margin-top:10px;">
          <label>计划时间</label>
          <input type="datetime-local" />
        </div>
        <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:12px;">
          <button class="btn secondary" @click="showPlan = false">取消</button>
          <button class="btn success" @click="confirmPlan">创建</button>
        </div>
      </div>
    </div>

    <div v-if="showAdd" class="modal-backdrop" @click.self="showAdd = false">
      <div class="modal">
        <h3>登记巡检结果</h3>
        <div class="form-row">
          <label>路线</label>
          <select>
            <option v-for="route in routes" :key="route.name">{{ route.name }}</option>
          </select>
        </div>
        <div class="form-row" style="margin-top:10px;">
          <label>发现问题</label>
          <input placeholder="如 灭火器压力不足" />
        </div>
        <div class="form-row" style="margin-top:10px;">
          <label>整改负责人</label>
          <input placeholder="负责人" />
        </div>
        <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:12px;">
          <button class="btn secondary" @click="showAdd = false">取消</button>
          <button class="btn" @click="submit">保存</button>
        </div>
      </div>
    </div>

    <div v-if="showDetail" class="modal-backdrop" @click.self="showDetail = false">
      <div class="modal">
        <h3>{{ active.name }} 巡检详情</h3>
        <p class="muted">巡检员 {{ active.owner }}，状态 {{ active.status }}，发现 {{ active.issues }} 项问题。</p>
        <div class="progress-bar" style="margin:10px 0;">
          <span :style="{ width: active.progress + '%' }"></span>
        </div>
        <p>整改进度 {{ active.progress }}%</p>
        <div style="text-align:right;">
          <button class="btn secondary" @click="showDetail = false">关闭</button>
          <button class="btn" @click="toggleProgress">推进进度</button>
        </div>
      </div>
    </div>

    <div v-if="showProgress" class="modal-backdrop" @click.self="showProgress = false">
      <div class="modal">
        <h3>巡检同步</h3>
        <div class="progress-bar" style="margin: 8px 0;">
          <span :style="{ width: progress + '%' }"></span>
        </div>
        <p>同步进度 {{ progress }}%</p>
        <div style="text-align:right;">
          <button class="btn" @click="showProgress = false">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const summary = reactive([
  { label: '今日计划', value: '8 条' },
  { label: '已完成', value: '5 条' },
  { label: '待整改', value: '3 项' },
  { label: '严重问题', value: '1 项' }
]);

const routes = reactive([
  { name: '地下车库', owner: '王凯', plan: '09:00', done: '09:40', issues: 1, status: '已完成', class: 'success', progress: 100 },
  { name: 'A 座消防泵房', owner: '刘明', plan: '10:00', done: '', issues: 2, status: '进行中', class: 'warning', progress: 60 },
  { name: 'B 座弱电间', owner: '赵云', plan: '13:00', done: '', issues: 0, status: '未开始', class: 'danger', progress: 0 },
  { name: '宿舍楼道', owner: '李雪', plan: '14:00', done: '', issues: 1, status: '进行中', class: 'warning', progress: 40 },
  { name: '仓库区域', owner: '周峰', plan: '16:00', done: '', issues: 0, status: '未开始', class: 'danger', progress: 0 }
]);

const showPlan = ref(false);
const showAdd = ref(false);
const showDetail = ref(false);
const showProgress = ref(false);
const progress = ref(25);
const active = ref({});

function togglePlan() { showPlan.value = true; }
function toggleAdd() { showAdd.value = true; }
function toggleProgress() {
  showProgress.value = true;
  progress.value = Math.min(progress.value + 30, 100);
}

function submit() {
  alert('巡检结果已登记');
  showAdd.value = false;
}

function confirmPlan() {
  alert('巡检计划已创建');
  showPlan.value = false;
}

function selectRoute(route) {
  active.value = route;
  showDetail.value = true;
}
</script>

<style scoped>
.section-header { display:flex; justify-content: space-between; align-items:center; gap: 10px; flex-wrap: wrap; }
.action-row { display:flex; gap: 10px; flex-wrap: wrap; }
</style>
