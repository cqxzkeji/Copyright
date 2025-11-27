<template>
  <div class="card" style="display: grid; gap: 14px;">
    <div class="grid responsive-grid" style="grid-template-columns: 1.5fr 1fr; align-items: start;">
      <div class="card">
        <header style="display: flex; justify-content: space-between; align-items: center; gap: 8px;">
          <div>
            <h3 style="margin: 0;">维护与故障</h3>
            <p class="muted" style="margin: 4px 0 0;">记录维保、备件与报警，至少保持 5 条可追溯</p>
          </div>
          <button class="primary-btn" @click="showLog = true">新增记录</button>
        </header>
        <table class="table">
          <thead>
            <tr>
              <th>编号</th>
              <th>类型</th>
              <th>责任人</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in records" :key="item.id">
              <td>{{ item.id }}</td>
              <td>{{ item.type }}</td>
              <td>{{ item.owner }}</td>
              <td>{{ item.state }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="card">
        <h3 style="margin-top: 0;">报警趋势</h3>
        <svg viewBox="0 0 200 120" style="width: 100%; height: auto;">
          <rect x="10" y="10" width="180" height="100" rx="12" fill="#fff" stroke="#e5e7eb" />
          <polyline
            points="10,90 40,70 70,82 100,60 130,55 160,65 190,50"
            fill="none"
            stroke="#f97316"
            stroke-width="3"
          />
        </svg>
        <button class="secondary-btn" style="margin-top: 10px;" @click="showTip = true">报警策略</button>
      </div>
    </div>

    <div class="card">
      <h4 style="margin: 0 0 8px;">备件库存</h4>
      <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));">
        <div v-for="part in parts" :key="part.name" class="stat">
          <small>{{ part.name }}</small>
          <strong>{{ part.stock }} 件</strong>
          <button class="secondary-btn" @click="openReserve(part.name)">预留</button>
        </div>
      </div>
    </div>

    <div v-if="showLog" class="modal-backdrop" @click.self="showLog = false">
      <div class="modal-card">
        <h3>新增维护</h3>
        <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 10px;">
          <label class="field">
            <span>类型</span>
            <select v-model="form.type">
              <option>保养</option>
              <option>故障</option>
              <option>更换备件</option>
            </select>
          </label>
          <label class="field">
            <span>责任人</span>
            <input v-model="form.owner" placeholder="填写负责工程师" />
          </label>
        </div>
        <div style="margin-top: 12px; display: flex; justify-content: flex-end; gap: 8px;">
          <button class="secondary-btn" @click="showLog = false">取消</button>
          <button class="primary-btn" @click="addRecord">保存</button>
        </div>
      </div>
    </div>

    <div v-if="showTip" class="modal-backdrop" @click.self="showTip = false">
      <div class="modal-card">
        <h3>报警策略</h3>
        <ul style="margin: 0 0 12px; padding-left: 18px; color: #4b5563;">
          <li>温度、震动、功率偏差同时触发时升级报警等级。</li>
          <li>故障处理未完成前自动暂停新任务。</li>
          <li>备件低于 2 件时推送采购提醒。</li>
        </ul>
        <button class="secondary-btn" @click="showTip = false">关闭</button>
      </div>
    </div>

    <div v-if="showReserve" class="modal-backdrop" @click.self="showReserve = false">
      <div class="modal-card">
        <h3>备件预留</h3>
        <p class="muted">为 {{ reserveTarget }} 预留库存并通知库管。</p>
        <button class="primary-btn" @click="showReserve = false">确认预留</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const records = ref([
  { id: 'MT-01', type: '保养', owner: '王工', state: '完成' },
  { id: 'MT-02', type: '故障', owner: '李工', state: '处理中' },
  { id: 'MT-03', type: '备件', owner: '赵工', state: '待确认' },
  { id: 'MT-04', type: '保养', owner: '周工', state: '排程' },
  { id: 'MT-05', type: '故障', owner: '陈工', state: '处理中' },
  { id: 'MT-06', type: '备件', owner: '张工', state: '完成' }
]);

const parts = [
  { name: '喷嘴组件', stock: 6 },
  { name: '导轨滑块', stock: 12 },
  { name: '伺服驱动', stock: 3 },
  { name: '冷却泵', stock: 4 },
  { name: '滤芯', stock: 9 }
];

const showLog = ref(false);
const showTip = ref(false);
const showReserve = ref(false);
const reserveTarget = ref('');
const form = reactive({ type: '保养', owner: '' });

const addRecord = () => {
  records.value.push({
    id: `MT-${String(records.value.length + 1).padStart(2, '0')}`,
    type: form.type,
    owner: form.owner || '待指派',
    state: '排程'
  });
  showLog.value = false;
};

const openReserve = (target) => {
  reserveTarget.value = target;
  showReserve.value = true;
};
</script>
