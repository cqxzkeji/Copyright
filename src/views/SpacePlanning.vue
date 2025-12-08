<template>
  <div class="grid" style="gap:16px">
    <div class="flex-between card" style="flex-wrap:wrap">
      <div>
        <div style="font-weight:700">空间规划展示</div>
        <p style="margin:4px 0;color:var(--muted)">展示分区、路径、节点与叠加图层，模块内不重复描述自身。</p>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button class="button" @click="openLayerModal">导入图层</button>
        <button class="button secondary" @click="openHint('规划图层刷新完成')">刷新</button>
        <button class="button secondary" @click="openProgress">生成渲染</button>
      </div>
    </div>

    <div class="grid" style="grid-template-columns:2fr 1fr;gap:16px">
      <div class="card">
        <div class="flex-between">
          <strong>规划叠加图</strong>
          <span class="badge info">示意图</span>
        </div>
        <svg viewBox="0 0 600 320" style="width:100%;margin-top:10px;border-radius:14px;box-shadow:0 8px 26px rgba(30,136,229,0.12)">
          <defs>
            <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#e3f2fd" />
              <stop offset="100%" stop-color="#f1f8ff" />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="600" height="320" fill="url(#bg)" />
          <path d="M40 220 Q120 140 200 190 T360 200 T520 120" fill="none" stroke="#1e88e5" stroke-width="6" stroke-linecap="round" />
          <path d="M80 260 Q160 180 260 240 T480 200" fill="none" stroke="#ffca28" stroke-width="6" stroke-dasharray="10 6" />
          <circle v-for="(node,index) in nodes" :key="index" :cx="node.x" :cy="node.y" r="12" :fill="node.color" />
          <text v-for="(node,index) in nodes" :key="'t'+index" :x="node.x+14" :y="node.y+4" fill="#1b1b1b" font-size="14">{{ node.label }}</text>
        </svg>
      </div>
      <div class="card">
        <div class="flex-between">
          <strong>片区概览</strong>
          <button class="button secondary" @click="openHint('片区信息提示')">提示</button>
        </div>
        <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(140px,1fr));margin-top:12px">
          <div v-for="area in areas" :key="area.name" class="card" style="box-shadow:none;border:1px dashed var(--border)">
            <div class="flex-between">
              <span style="font-weight:700">{{ area.name }}</span>
              <span class="badge" :class="area.status">{{ area.status }}</span>
            </div>
            <p style="margin:6px 0;color:var(--muted)">人流：{{ area.flow }} /日</p>
            <div class="progress">
              <div class="progress-bar" :style="{ width: area.coverage + '%' }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="flex-between">
        <strong>规划节点与表格</strong>
        <button class="button secondary" @click="openHint('节点表格保存成功')">保存表格</button>
      </div>
      <table class="table" style="margin-top:10px">
        <thead>
          <tr>
            <th>节点</th>
            <th>类型</th>
            <th>设施</th>
            <th>人流</th>
            <th>绿化</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in nodeTable" :key="row.name">
            <td>{{ row.name }}</td>
            <td>{{ row.type }}</td>
            <td>{{ row.facilities }}</td>
            <td>{{ row.flow }}</td>
            <td>{{ row.green }}%</td>
            <td style="display:flex;gap:8px">
              <button class="button secondary" @click="openLayerModal(row)">编辑</button>
              <button class="button secondary" @click="openHint(`已锁定 ${row.name}`)">锁定</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <ModalDialog :show="modal.layer" title="图层/节点设置" @close="modal.layer=false">
      <div class="grid" style="grid-template-columns:1fr 1fr;gap:12px">
        <div>
          <label>图层/节点名称</label>
          <input v-model="layerForm.name" class="input" />
        </div>
        <div>
          <label>类型</label>
          <select v-model="layerForm.type" class="select">
            <option>公共服务</option>
            <option>游憩节点</option>
            <option>交通出入口</option>
            <option>生态修复</option>
          </select>
        </div>
        <div>
          <label>人流预估</label>
          <input v-model.number="layerForm.flow" type="number" class="input" />
        </div>
        <div>
          <label>绿化覆盖率%</label>
          <input v-model.number="layerForm.green" type="number" class="input" />
        </div>
      </div>
      <template #actions>
        <button class="button secondary" @click="modal.layer=false">取消</button>
        <button class="button" @click="saveLayer">保存</button>
      </template>
    </ModalDialog>

    <ModalDialog :show="modal.progress" title="渲染进度" @close="modal.progress=false">
      <p>根据片区数据生成三维渲染，请稍等。</p>
      <div class="progress">
        <div class="progress-bar" :style="{ width: renderProgress + '%' }"></div>
      </div>
    </ModalDialog>

    <ModalDialog :show="modal.hint" title="提示" @close="modal.hint=false">
      <p style="margin:0">{{ hintText }}</p>
    </ModalDialog>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const nodes = [
  { x: 90, y: 180, label: '入口', color: '#1e88e5' },
  { x: 210, y: 150, label: '展馆', color: '#66bb6a' },
  { x: 320, y: 220, label: '集市', color: '#ffa726' },
  { x: 460, y: 160, label: '民宿', color: '#ab47bc' }
];

const areas = [
  { name: '核心展示区', status: 'success', flow: 960, coverage: 82 },
  { name: '乡味集市', status: 'warning', flow: 760, coverage: 68 },
  { name: '静谧栈道', status: 'info', flow: 540, coverage: 74 },
  { name: '亲水互动', status: 'success', flow: 880, coverage: 80 }
];

const nodeTable = ref([
  { name: '入口A', type: '交通出入口', facilities: '停车、引导', flow: 1200, green: 35 },
  { name: '入口B', type: '交通出入口', facilities: '驿站、照明', flow: 920, green: 32 },
  { name: '栈道口', type: '游憩节点', facilities: '栈道、灯带', flow: 650, green: 62 },
  { name: '展馆前坪', type: '公共服务', facilities: '休息、展板', flow: 800, green: 55 },
  { name: '集市中心', type: '公共服务', facilities: '摊位、水电', flow: 980, green: 30 },
  { name: '民宿庭院', type: '生态修复', facilities: '绿植、采光', flow: 420, green: 78 },
  { name: '水岸平台', type: '游憩节点', facilities: '座椅、护栏', flow: 560, green: 70 },
  { name: '观景台', type: '游憩节点', facilities: '栏杆、望远镜', flow: 430, green: 68 },
  { name: '停车场', type: '交通出入口', facilities: '车位、标识', flow: 860, green: 25 },
  { name: '游客服务中心', type: '公共服务', facilities: '信息、票务', flow: 1020, green: 48 }
]);

const modal = reactive({ layer: false, progress: false, hint: false });
const layerForm = reactive({ name: '', type: '公共服务', flow: 500, green: 60 });
const hintText = ref('');
const renderProgress = ref(10);

const openLayerModal = (row) => {
  if (row) Object.assign(layerForm, row);
  else Object.assign(layerForm, { name: '新图层', type: '公共服务', flow: 500, green: 60 });
  modal.layer = true;
};

const saveLayer = () => {
  const existingIndex = nodeTable.value.findIndex((r) => r.name === layerForm.name);
  if (existingIndex >= 0) nodeTable.value[existingIndex] = { ...layerForm };
  else nodeTable.value.push({ ...layerForm });
  modal.layer = false;
  openHint('图层/节点已保存');
};

const openProgress = () => {
  modal.progress = true;
  renderProgress.value = 10;
  const timer = setInterval(() => {
    renderProgress.value += 22;
    if (renderProgress.value >= 100) {
      renderProgress.value = 100;
      clearInterval(timer);
      setTimeout(() => (modal.progress = false), 600);
    }
  }, 320);
};

const openHint = (text) => {
  hintText.value = text;
  modal.hint = true;
};
</script>
