<template>
  <div class="dashboard-grid">
    <div class="card">
      <div class="flex-between">
        <h2 class="section-title">数据溯源</h2>
        <button class="btn" @click="openTraceModal">历史追溯</button>
      </div>
      <p class="hint">记录数据来源、采集时间、设备信息，支持快速查询</p>
      <div class="list-row" v-for="item in traceList" :key="item.id">
        <div>
          <strong>{{ item.device }}</strong> ｜ {{ item.time }}
          <p style="margin: 4px 0 0; color: var(--muted);">来源：{{ item.source }} ｜ 电压 {{ item.voltage }} V</p>
        </div>
        <button class="btn secondary" @click="showItem(item)">详情</button>
      </div>
    </div>

    <div class="card">
      <div class="flex-between">
        <h3 class="section-title">溯源查询</h3>
        <button class="btn" @click="openFilter">筛选</button>
      </div>
      <div class="form-grid">
        <div>
          <label>设备编号</label>
          <input v-model="filter.device" class="input" placeholder="如：D-001" />
        </div>
        <div>
          <label>时间范围</label>
          <input v-model="filter.range" class="input" placeholder="例如：近24小时" />
        </div>
        <div class="full">
          <label>关键字</label>
          <input v-model="filter.keyword" class="input" placeholder="来源、备注、标签" />
        </div>
      </div>
      <div class="flex-between" style="margin-top: 12px;">
        <span class="chip">填写后点击查询</span>
        <button class="btn" @click="doSearch">查询</button>
      </div>
      <ul style="margin: 12px 0 0; padding: 0; list-style: none;">
        <li class="list-row" v-for="hit in searchHits" :key="hit.id">
          <span>{{ hit.desc }}</span>
          <button class="btn secondary" @click="showItem(hit)">查看</button>
        </li>
      </ul>
    </div>
  </div>

  <div v-if="modal.type" class="modal-backdrop">
    <div class="modal-card">
      <div class="flex-between">
        <h3>{{ modal.title }}</h3>
        <button class="btn secondary" @click="closeModal">关闭</button>
      </div>
      <div v-if="modal.type === 'trace'">
        <p>已加载 {{ traceList.length }} 条历史记录。</p>
        <div class="progress-bar">
          <span :style="{ width: loadPercent + '%' }"></span>
        </div>
        <p style="color: var(--muted);">加载进度 {{ loadPercent }}%</p>
      </div>
      <div v-else-if="modal.type === 'detail'">
        <p>设备：{{ currentItem.device }}</p>
        <p>时间：{{ currentItem.time }} ｜ 来源：{{ currentItem.source }}</p>
        <p>电压：{{ currentItem.voltage }} V</p>
        <p>备注：{{ currentItem.note }}</p>
      </div>
      <div v-else-if="modal.type === 'filter'">
        <p>当前筛选：{{ filter.device || '全部设备' }} ｜ {{ filter.range || '不限时间' }}</p>
        <div class="progress-bar">
          <span :style="{ width: 80 + '%' }"></span>
        </div>
        <p style="color: var(--muted);">筛选完毕，可查看结果</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const traceList = reactive([
  { id: 1, device: 'D-001', time: '2024-05-16 08:10', source: '任务 夜间巡检', voltage: 12.6, note: '定期巡检记录' },
  { id: 2, device: 'D-004', time: '2024-05-16 08:15', source: '任务 夜间巡检', voltage: 12.7, note: '电压稳定' },
  { id: 3, device: 'D-011', time: '2024-05-16 08:17', source: '告警复测', voltage: 11.9, note: '确认短暂下跌' },
  { id: 4, device: 'D-002', time: '2024-05-16 08:22', source: '白班抽检', voltage: 12.5, note: '正常' },
  { id: 5, device: 'D-020', time: '2024-05-16 08:26', source: '白班抽检', voltage: 12.4, note: '蓝牙稳定' },
  { id: 6, device: 'D-005', time: '2024-05-15 23:58', source: '夜间巡检', voltage: 0, note: '离线未采集' },
  { id: 7, device: 'D-015', time: '2024-05-15 23:50', source: '夜间巡检', voltage: 0, note: '离线' },
  { id: 8, device: 'D-003', time: '2024-05-15 21:12', source: '夜间巡检', voltage: 11.6, note: '电压偏低' }
]);

const filter = reactive({ device: '', range: '', keyword: '' });
const searchHits = reactive([]);
const modal = reactive({ type: '', title: '' });
const loadPercent = ref(35);
const currentItem = ref({});

const openTraceModal = () => {
  modal.type = 'trace';
  modal.title = '历史追溯加载';
  loadPercent.value = 35;
  const timer = setInterval(() => {
    loadPercent.value = Math.min(100, loadPercent.value + 20);
    if (loadPercent.value >= 100) clearInterval(timer);
  }, 500);
};

const showItem = (item) => {
  currentItem.value = item;
  modal.type = 'detail';
  modal.title = '溯源详情';
};

const openFilter = () => {
  modal.type = 'filter';
  modal.title = '筛选处理';
};

const doSearch = () => {
  searchHits.splice(
    0,
    searchHits.length,
    ...traceList
      .filter((item) =>
        (!filter.device || item.device.includes(filter.device)) &&
        (!filter.keyword || item.source.includes(filter.keyword) || item.note.includes(filter.keyword))
      )
      .map((item) => ({ id: item.id, desc: `${item.device} ｜ ${item.time} ｜ ${item.source}` }))
  );
  openFilter();
};

const closeModal = () => {
  modal.type = '';
};
</script>

<style scoped>
.hint {
  color: var(--muted);
  margin: 6px 0 12px;
}
</style>
