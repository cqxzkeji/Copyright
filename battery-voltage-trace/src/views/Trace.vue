<template>
  <div class="card">
    <div class="flex-between" style="margin-bottom: 12px;">
      <div>
        <h3 class="section-title">数据追溯管理</h3>
        <p style="color:var(--muted);">按设备与时间链路追溯电压数据及操作记录。</p>
      </div>
      <div class="toolbar">
        <button class="btn btn-primary" @click="filterModal = true">筛选链路</button>
        <button class="btn btn-ghost" @click="timelineModal = true">查看操作</button>
        <button class="btn btn-ghost" @click="exportModal = true">导出链路</button>
      </div>
    </div>

    <div class="form-row">
      <div>
        <label>设备编号</label>
        <select class="select" v-model="query.device">
          <option>全部</option>
          <option v-for="d in devices" :key="d">{{ d }}</option>
        </select>
      </div>
      <div>
        <label>时间范围</label>
        <input class="input" type="text" placeholder="2024-05-01 08:00 ~ 12:00" v-model="query.range" />
      </div>
      <div>
        <label>链路节点</label>
        <input class="input" v-model="query.nodes" placeholder="采集->校验->分析" />
      </div>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>时间</th>
          <th>设备</th>
          <th>链路节点</th>
          <th>电压(V)</th>
          <th>操作人</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in traces" :key="row.id">
          <td>{{ row.time }}</td>
          <td>{{ row.device }}</td>
          <td>{{ row.node }}</td>
          <td>{{ row.voltage }}</td>
          <td>{{ row.owner }}</td>
          <td><button class="btn btn-ghost" @click="viewTrace(row)">追溯</button></td>
        </tr>
      </tbody>
    </table>
  </div>

  <ModalDialog v-model="filterModal" title="筛选链路">
    <div class="form-row">
      <div>
        <label>设备</label>
        <select class="select" v-model="query.device">
          <option>全部</option>
          <option v-for="d in devices" :key="d">{{ d }}</option>
        </select>
      </div>
      <div>
        <label>起止时间</label>
        <input class="input" v-model="query.range" placeholder="2024-05-01 08:00 ~ 12:00" />
      </div>
    </div>
    <div class="tag">将按链路节点聚合显示。</div>
  </ModalDialog>

  <ModalDialog v-model="timelineModal" title="操作记录" :withFooter="false">
    <ul>
      <li v-for="step in steps" :key="step.time" style="margin-bottom:6px;">{{ step.time }} - {{ step.action }}</li>
    </ul>
  </ModalDialog>

  <ModalDialog v-model="exportModal" title="导出链路" :withFooter="false">
    <p>正在生成追溯报告...</p>
    <div class="progress-track" style="margin-top:10px;">
      <div class="progress-bar" :style="{width: exportProgress + '%'}"></div>
    </div>
  </ModalDialog>

  <ModalDialog v-model="traceModal" title="链路详情" :withFooter="false">
    <p>时间：{{ current?.time }}</p>
    <p>节点：{{ current?.node }}</p>
    <p>电压：{{ current?.voltage }} V</p>
    <p>操作人：{{ current?.owner }}</p>
  </ModalDialog>
</template>

<script setup>
import { reactive, ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const devices = ['BV-001', 'BV-004', 'BV-007', 'BV-012', 'BV-016'];
const traces = reactive([
  { id: 1, time: '10:00:01', device: 'BV-001', node: '采集', voltage: 54.3, owner: '采集器' },
  { id: 2, time: '10:00:03', device: 'BV-001', node: '校验', voltage: 54.2, owner: '系统校验' },
  { id: 3, time: '10:00:05', device: 'BV-001', node: '分析', voltage: 54.1, owner: '分析引擎' },
  { id: 4, time: '10:02:01', device: 'BV-004', node: '采集', voltage: 51.2, owner: '采集器' },
  { id: 5, time: '10:02:04', device: 'BV-004', node: '校验', voltage: 51.0, owner: '系统校验' },
  { id: 6, time: '10:02:06', device: 'BV-004', node: '分析', voltage: 50.8, owner: '分析引擎' },
  { id: 7, time: '10:05:01', device: 'BV-007', node: '采集', voltage: 50.8, owner: '采集器' },
  { id: 8, time: '10:05:04', device: 'BV-007', node: '校验', voltage: 50.6, owner: '系统校验' },
  { id: 9, time: '10:05:06', device: 'BV-007', node: '分析', voltage: 50.5, owner: '分析引擎' },
  { id: 10, time: '10:10:01', device: 'BV-012', node: '采集', voltage: 50.9, owner: '采集器' },
  { id: 11, time: '10:10:04', device: 'BV-012', node: '校验', voltage: 50.7, owner: '系统校验' },
  { id: 12, time: '10:10:06', device: 'BV-012', node: '分析', voltage: 50.5, owner: '分析引擎' },
  { id: 13, time: '10:12:01', device: 'BV-016', node: '采集', voltage: 50.5, owner: '采集器' },
  { id: 14, time: '10:12:04', device: 'BV-016', node: '校验', voltage: 50.4, owner: '系统校验' },
  { id: 15, time: '10:12:06', device: 'BV-016', node: '分析', voltage: 50.2, owner: '分析引擎' },
  { id: 16, time: '10:15:01', device: 'BV-001', node: '采集', voltage: 54.2, owner: '采集器' },
  { id: 17, time: '10:15:04', device: 'BV-001', node: '校验', voltage: 54.1, owner: '系统校验' },
  { id: 18, time: '10:15:06', device: 'BV-001', node: '分析', voltage: 54.0, owner: '分析引擎' },
  { id: 19, time: '10:20:01', device: 'BV-004', node: '采集', voltage: 51.1, owner: '采集器' },
  { id: 20, time: '10:20:04', device: 'BV-004', node: '校验', voltage: 50.9, owner: '系统校验' }
]);

const query = reactive({ device: '全部', range: '10:00 ~ 10:30', nodes: '采集->校验->分析' });
const steps = [
  { time: '09:00', action: '同步采集模板' },
  { time: '09:30', action: '审核链路规则' },
  { time: '09:40', action: '导出追溯快照' }
];

const filterModal = ref(false);
const timelineModal = ref(false);
const exportModal = ref(false);
const traceModal = ref(false);
const exportProgress = ref(55);
const current = ref(null);

const viewTrace = (row) => {
  current.value = row;
  traceModal.value = true;
};
</script>
