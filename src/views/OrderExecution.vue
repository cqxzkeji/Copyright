<template>
  <div class="grid" style="gap:16px">
    <div class="card" style="display:flex;justify-content:space-between;align-items:center;">
      <div>
        <div style="font-weight:800;font-size:18px">订单执行与生产协同</div>
        <div style="color:#6b7c8c">分解订单下发，联动排产与交付节点</div>
      </div>
      <div style="display:flex;gap:8px;align-items:center;">
        <button class="btn ghost" @click="openModal('dispatch')">下发工单</button>
        <button class="btn" @click="openModal('exception')">异常反馈</button>
      </div>
    </div>

    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center; margin-bottom:10px;">
        <div>
          <div style="font-weight:800">执行列表</div>
          <div style="color:#6b7c8c">跟踪生产计划、排产与交付节点</div>
        </div>
        <button class="btn ghost" @click="openModal('sync')">同步进度</button>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>订单</th><th>钢种</th><th>产线</th><th>排产日期</th><th>节点进度</th><th>状态</th><th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in orders" :key="item.id">
            <td>{{ item.order }}</td>
            <td>{{ item.grade }}</td>
            <td>{{ item.line }}</td>
            <td>{{ item.schedule }}</td>
            <td>
              <div class="progress-bar"><div :style="{ width: item.progress + '%' }"></div></div>
            </td>
            <td><span class="badge" :class="item.status==='异常'?'warning':'success'">{{ item.status }}</span></td>
            <td>
              <button class="btn ghost" style="padding:6px 8px" @click="openModal('node')">节点</button>
              <button class="btn ghost" style="padding:6px 8px" @click="openModal('handover')">交付</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <div>
          <div style="font-weight:800">进度反馈</div>
          <div style="color:#6b7c8c">实时反馈生产进度与异常信息</div>
        </div>
        <button class="btn ghost" @click="openModal('feedback')">提交反馈</button>
      </div>
      <ul style="list-style:none;padding:0;margin-top:10px;display:grid;gap:8px;">
        <li class="card" style="padding:10px;" v-for="fb in feedback" :key="fb.title">
          <div style="font-weight:700">{{ fb.title }}</div>
          <div style="color:#6b7c8c;font-size:12px">{{ fb.detail }}</div>
          <div class="progress-bar" style="margin-top:6px"><div :style="{ width: fb.percentage + '%' }"></div></div>
        </li>
      </ul>
    </div>

    <ModalDialog v-if="activeModal" :title="modalTitle" @close="activeModal=''" @confirm="activeModal=''">
      <template v-if="activeModal==='dispatch'">
        <p>将订单分解到炼钢、轧制、热处理产线，并生成工单。</p>
        <div class="form-row">
          <div><label>工单编号</label><input class="input" placeholder="WO-20240601" /></div>
          <div><label>产线</label><select><option>炼钢</option><option>轧钢</option><option>热处理</option></select></div>
        </div>
      </template>
      <template v-else-if="activeModal==='exception'">
        <p>记录异常并推送到质量、计划与物流。</p>
        <textarea rows="4" placeholder="描述成分波动或设备故障"></textarea>
      </template>
      <template v-else-if="activeModal==='sync'">
        <p>同步 MES 与 WMS 进度，更新节点状态。</p>
        <div class="progress-bar"><div :style="{ width: '66%' }"></div></div>
      </template>
      <template v-else-if="activeModal==='node'">
        <p>更新当前节点与预计完成时间。</p>
        <div class="form-row">
          <div><label>节点</label><select><option>炼钢</option><option>轧制</option><option>热处理</option></select></div>
          <div><label>计划完成</label><input class="input" type="date" /></div>
        </div>
      </template>
      <template v-else-if="activeModal==='handover'">
        <p>发运前确认检测结果与包装要求。</p>
        <div class="progress-bar"><div :style="{ width: '54%' }"></div></div>
      </template>
      <template v-else-if="activeModal==='feedback'">
        <p>提交进度反馈，包含产量、异常与纠偏措施。</p>
        <textarea rows="3" placeholder="填写反馈"></textarea>
      </template>
    </ModalDialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const orders = [
  { id: 1, order: 'SO20240601', grade: '20CrMo', line: '炼钢一线', schedule: '06-05', progress: 65, status: '在制' },
  { id: 2, order: 'SO20240602', grade: '42CrMo', line: '热处理一线', schedule: '06-06', progress: 82, status: '在制' },
  { id: 3, order: 'SO20240603', grade: 'H13', line: '轧制二线', schedule: '06-07', progress: 48, status: '异常' },
  { id: 4, order: 'SO20240604', grade: 'P20', line: '热处理二线', schedule: '06-08', progress: 32, status: '在制' }
];

const feedback = [
  { title: '炼钢冶炼', detail: '连铸顺利，成分波动控制在±0.02%', percentage: 90 },
  { title: '轧制精整', detail: '轧机排队，等待 30 分钟', percentage: 55 },
  { title: '热处理', detail: '炉次加载中，预计今晚完成', percentage: 38 },
  { title: '检测交付', detail: '超声探伤排程确定', percentage: 20 }
];

const activeModal = ref('');
const modalTitle = ref('');

const openModal = (key) => {
  activeModal.value = key;
  modalTitle.value = `操作：${key}`;
};
</script>
