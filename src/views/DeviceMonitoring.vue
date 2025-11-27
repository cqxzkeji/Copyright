<template>
  <div class="grid" style="gap: 16px;">
    <div class="card">
      <div class="section-header">
        <div>
          <p class="eyebrow">设备状态实时监控</p>
          <h3>站点在线率与告警</h3>
        </div>
        <div class="action-row">
          <button class="btn secondary" @click="openProgress">快速刷新</button>
          <button class="btn" @click="openAdd">新增设备</button>
          <button class="btn danger" @click="openAlert">触发告警</button>
        </div>
      </div>
      <div class="chart-wrapper">
        <div class="chart-bar" v-for="item in onlineStats" :key="item.name">
          <div class="label">{{ item.name }}</div>
          <div class="bar">
            <span :style="{ width: item.online + '%' }"></span>
          </div>
          <div class="value">在线 {{ item.online }}% / 离线 {{ 100 - item.online }}%</div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="section-header">
        <h3>重点设备运行态势</h3>
        <span class="muted">所有行均可点击并弹窗查看详情</span>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>设备编号</th>
            <th>位置</th>
            <th>状态</th>
            <th>温度</th>
            <th>电压</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.id" @click="selectRow(row)" style="cursor:pointer;">
            <td>{{ row.id }}</td>
            <td>{{ row.location }}</td>
            <td><span class="badge" :class="row.statusClass">{{ row.status }}</span></td>
            <td>{{ row.temp }}℃</td>
            <td>{{ row.voltage }}V</td>
            <td>
              <button class="btn secondary" @click.stop="selectRow(row)">查看</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showDetail" class="modal-backdrop" @click.self="showDetail = false">
      <div class="modal">
        <h3>设备 {{ activeRow.id }} 状态详情</h3>
        <p class="muted">上次心跳：{{ activeRow.lastSeen }}，当前温度：{{ activeRow.temp }}℃，电压：{{ activeRow.voltage }}V。</p>
        <div class="progress-bar" style="margin:12px 0;">
          <span :style="{ width: activeRow.health + '%' }"></span>
        </div>
        <p>健康度：{{ activeRow.health }}%</p>
        <div style="text-align: right; margin-top: 10px;">
          <button class="btn" @click="showDetail = false">关闭</button>
        </div>
      </div>
    </div>

    <div v-if="showAdd" class="modal-backdrop" @click.self="showAdd = false">
      <div class="modal">
        <h3>新增设备</h3>
        <div class="form-row">
          <label>设备编号</label>
          <input placeholder="如 HX-1009" />
        </div>
        <div class="form-row" style="margin-top:10px;">
          <label>安装位置</label>
          <input placeholder="楼层/分区" />
        </div>
        <div class="form-row" style="margin-top:10px;">
          <label>设备类型</label>
          <select>
            <option>喷淋泵</option>
            <option>烟感</option>
            <option>灭火器</option>
          </select>
        </div>
        <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:16px;">
          <button class="btn secondary" @click="showAdd = false">取消</button>
          <button class="btn success" @click="submitAdd">提交</button>
        </div>
      </div>
    </div>

    <div v-if="showAlert" class="modal-backdrop" @click.self="showAlert = false">
      <div class="modal">
        <h3>手动告警</h3>
        <p>确认后将模拟触发消防主机告警。</p>
        <div style="display:flex; justify-content:flex-end; gap:10px; margin-top: 14px;">
          <button class="btn secondary" @click="showAlert = false">取消</button>
          <button class="btn danger" @click="confirmAlert">立即告警</button>
        </div>
      </div>
    </div>

    <div v-if="showProgress" class="modal-backdrop" @click.self="showProgress = false">
      <div class="modal">
        <h3>刷新进度</h3>
        <div class="progress-bar" style="margin: 10px 0;">
          <span :style="{ width: progress + '%' }"></span>
        </div>
        <p>当前刷新：{{ progress }}%</p>
        <div style="text-align:right;">
          <button class="btn" @click="showProgress = false">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const onlineStats = reactive([
  { name: '消防泵房', online: 94 },
  { name: '地下车库', online: 87 },
  { name: 'A 座机房', online: 92 },
  { name: 'B 座机房', online: 90 }
]);

const rows = reactive([
  { id: 'HX-1001', location: '一层大厅', status: '在线', statusClass: 'success', temp: 32, voltage: 220, lastSeen: '1 分钟前', health: 92 },
  { id: 'HX-1002', location: '消防泵房', status: '在线', statusClass: 'success', temp: 28, voltage: 221, lastSeen: '2 分钟前', health: 88 },
  { id: 'HX-1003', location: 'A 座 12F', status: '预警', statusClass: 'warning', temp: 46, voltage: 219, lastSeen: '刚刚', health: 73 },
  { id: 'HX-1004', location: '地下车库', status: '离线', statusClass: 'danger', temp: 0, voltage: 0, lastSeen: '25 分钟前', health: 40 },
  { id: 'HX-1005', location: 'B 座 5F', status: '在线', statusClass: 'success', temp: 30, voltage: 222, lastSeen: '3 分钟前', health: 86 },
  { id: 'HX-1006', location: '宿舍 3F', status: '在线', statusClass: 'success', temp: 29, voltage: 221, lastSeen: '6 分钟前', health: 84 }
]);

const showDetail = ref(false);
const activeRow = ref({});
const showAdd = ref(false);
const showAlert = ref(false);
const showProgress = ref(false);
const progress = ref(35);

function selectRow(row) {
  activeRow.value = row;
  showDetail.value = true;
}

function submitAdd() {
  alert('已提交新增设备');
  showAdd.value = false;
}

function confirmAlert() {
  alert('已模拟触发告警并通知值班人员');
  showAlert.value = false;
}

function openAdd() { showAdd.value = true; }
function openAlert() { showAlert.value = true; }
function openProgress() {
  showProgress.value = true;
  progress.value = 0;
  const timer = setInterval(() => {
    progress.value += 20;
    if (progress.value >= 100) clearInterval(timer);
  }, 300);
}
</script>

<style scoped>
.section-header { display:flex; justify-content: space-between; gap: 12px; align-items: center; flex-wrap: wrap; }
.action-row { display: flex; gap: 10px; flex-wrap: wrap; }
.chart-wrapper { display: grid; gap: 12px; }
.chart-bar { background: #f7f9fc; padding: 12px; border-radius: 12px; display: grid; grid-template-columns: 160px 1fr 160px; align-items: center; gap: 10px; }
.bar { background: #e9eef5; height: 12px; border-radius: 10px; overflow: hidden; }
.bar span { display: block; height: 100%; background: linear-gradient(90deg, #1e88e5, #7ac4ff); }
.label { font-weight: 700; }
.value { text-align: right; color: var(--muted); font-weight: 600; }
</style>
