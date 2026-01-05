<template>
  <div class="table-card">
    <div class="section-header">
      <div>
        <h2>存量资产台账与基础信息</h2>
        <p>统一建档管理位置、权属、面积、用途、状态等基础信息。</p>
      </div>
      <div class="action-row">
        <button @click="showCreate = true">新增资产</button>
        <button style="background:#10b981" @click="showImport = true">批量导入</button>
        <button style="background:#eef2ff;color:#0b5bd3" @click="showGuideline = true">台账说明</button>
      </div>
    </div>
    <div class="chart-row">
      <div class="bar-chart">
        <h4>用途类型分布</h4>
        <div v-for="(item, idx) in usageStats" :key="idx" style="margin-bottom:8px;">
          <div style="display:flex;justify-content:space-between;font-weight:600;">
            <span>{{ item.label }}</span>
            <span>{{ item.value }}处</span>
          </div>
          <div class="bar"><div class="bar-fill" :style="{ width: item.percent + '%' }"></div></div>
        </div>
      </div>
      <div class="bar-chart">
        <h4>状态分布</h4>
        <div v-for="(item, idx) in statusStats" :key="idx" style="margin-bottom:8px;">
          <div style="display:flex;justify-content:space-between;font-weight:600;">
            <span>{{ item.label }}</span>
            <span>{{ item.value }}处</span>
          </div>
          <div class="bar"><div class="bar-fill" :style="{ width: item.percent + '%' }"></div></div>
        </div>
      </div>
    </div>
    <table class="table" style="margin-top:12px;">
      <thead>
        <tr>
          <th>编号</th>
          <th>名称</th>
          <th>位置</th>
          <th>权属</th>
          <th>面积(㎡)</th>
          <th>用途</th>
          <th>状态</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="asset in assets" :key="asset.id">
          <td>{{ asset.id }}</td>
          <td>{{ asset.name }}</td>
          <td>{{ asset.location }}</td>
          <td>{{ asset.ownership }}</td>
          <td>{{ asset.area }}</td>
          <td>{{ asset.usage }}</td>
          <td><span class="badge" :class="asset.status">{{ labelMap[asset.status] }}</span></td>
        </tr>
      </tbody>
    </table>
  </div>

  <ModalDialog v-if="showCreate" title="新增资产" @close="showCreate = false">
    <div class="form-grid">
      <div class="input-group">
        <label>资产名称</label>
        <input v-model="form.name" placeholder="如：XX街道办公楼" />
      </div>
      <div class="input-group">
        <label>位置</label>
        <input v-model="form.location" placeholder="请输入地址" />
      </div>
      <div class="input-group">
        <label>用途</label>
        <select v-model="form.usage">
          <option>办公</option>
          <option>商业</option>
          <option>产业</option>
          <option>文旅</option>
        </select>
      </div>
      <div class="input-group">
        <label>面积(㎡)</label>
        <input v-model="form.area" type="number" />
      </div>
    </div>
    <template #footer>
      <button style="background:#eef2ff;color:#0b5bd3" @click="showCreate = false">取消</button>
      <button @click="submitCreate">确认入库</button>
    </template>
  </ModalDialog>

  <ModalDialog v-if="showImport" title="批量导入进度" @close="showImport = false">
    <p>系统正在校验表格和影像附件，预计需要几秒钟完成。</p>
    <div class="progress-bar">
      <div class="progress-bar-fill" :style="{ width: importProgress + '%' }"></div>
    </div>
  </ModalDialog>

  <ModalDialog v-if="showGuideline" title="台账管理规范" @close="showGuideline = false">
    <ul>
      <li>统一录入权属、面积、用途、租赁情况，确保口径一致。</li>
      <li>每次变更形成自动版本号，支持追溯和对比。</li>
      <li>推荐季度检查一次使用状态，空置超90天自动预警。</li>
    </ul>
  </ModalDialog>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const showCreate = ref(false);
const showImport = ref(false);
const showGuideline = ref(false);
const importProgress = ref(25);
const form = reactive({ name: '', location: '', usage: '办公', area: 500 });

const assets = ref([
  { id: 'A-01', name: '阳光办公楼', location: '东城区广顺路18号', ownership: '国有', area: 4200, usage: '办公', status: 'active' },
  { id: 'A-02', name: '产业孵化中心', location: '产业园路99号', ownership: '国有', area: 8600, usage: '产业', status: 'active' },
  { id: 'A-03', name: '临街商铺组团', location: '民生街88号', ownership: '国有', area: 2100, usage: '商业', status: 'active' },
  { id: 'A-04', name: '旧粮仓', location: '铁路西路12号', ownership: '集体', area: 5500, usage: '仓储', status: 'idle' },
  { id: 'A-05', name: '历史街区房', location: '文化巷3号', ownership: '国有', area: 1300, usage: '文旅', status: 'pending' },
  { id: 'A-06', name: '社区服务中心', location: '和谐路16号', ownership: '国有', area: 2600, usage: '公共', status: 'active' },
  { id: 'A-07', name: '物流场站', location: '环城大道200号', ownership: '国有', area: 9100, usage: '仓储', status: 'idle' },
  { id: 'A-08', name: '人才公寓', location: '青年路56号', ownership: '国有', area: 4800, usage: '居住', status: 'active' },
  { id: 'A-09', name: '滨河文创厂房', location: '滨河东街33号', ownership: '国有', area: 3600, usage: '文旅', status: 'pending' },
  { id: 'A-10', name: '广场地下空间', location: '中心广场', ownership: '国有', area: 5000, usage: '商业', status: 'idle' },
  { id: 'A-11', name: '公共停车楼', location: '交通路5号', ownership: '国有', area: 2700, usage: '公共', status: 'active' },
  { id: 'A-12', name: '科研实验楼', location: '创新路36号', ownership: '国有', area: 6100, usage: '科研', status: 'pending' },
  { id: 'A-13', name: '沿街老旧住宅', location: '幸福里9号', ownership: '国有', area: 1900, usage: '居住', status: 'idle' },
  { id: 'A-14', name: '文化活动中心', location: '文化路18号', ownership: '国有', area: 3300, usage: '公共', status: 'active' },
  { id: 'A-15', name: '闲置厂房', location: '工业园北区7号', ownership: '国有', area: 7200, usage: '产业', status: 'idle' },
  { id: 'A-16', name: '综合体育馆', location: '体育北路10号', ownership: '国有', area: 8400, usage: '公共', status: 'active' },
  { id: 'A-17', name: '教学培训楼', location: '教育街15号', ownership: '国有', area: 3900, usage: '教育', status: 'active' },
  { id: 'A-18', name: '立体车库', location: '政务中心旁', ownership: '国有', area: 2400, usage: '公共', status: 'pending' },
  { id: 'A-19', name: '城郊农贸市场', location: '城郊路88号', ownership: '集体', area: 2800, usage: '商业', status: 'active' },
  { id: 'A-20', name: '科技孵化楼', location: '高新区创新街6号', ownership: '国有', area: 6600, usage: '科研', status: 'pending' }
]);

const labelMap = { active: '在用', idle: '闲置', pending: '调整中' };

const usageStats = computed(() => {
  const counts = {};
  assets.value.forEach((a) => {
    counts[a.usage] = (counts[a.usage] || 0) + 1;
  });
  const total = assets.value.length;
  return Object.entries(counts).map(([label, value]) => ({
    label,
    value,
    percent: Math.round((value / total) * 100)
  }));
});

const statusStats = computed(() => {
  const counts = { active: 0, idle: 0, pending: 0 };
  assets.value.forEach((a) => counts[a.status]++);
  const total = assets.value.length;
  return Object.entries(counts).map(([key, value]) => ({
    label: labelMap[key],
    value,
    percent: Math.round((value / total) * 100)
  }));
});

onMounted(() => {
  const timer = setInterval(() => {
    importProgress.value = Math.min(importProgress.value + 10, 100);
    if (importProgress.value === 100) clearInterval(timer);
  }, 600);
});

const submitCreate = () => {
  assets.value.unshift({
    id: `A-${assets.value.length + 1}`,
    name: form.name || '新增资产',
    location: form.location || '待完善',
    ownership: '国有',
    area: Number(form.area) || 0,
    usage: form.usage,
    status: 'pending'
  });
  showCreate.value = false;
};
</script>
