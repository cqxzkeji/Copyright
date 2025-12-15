<template>
  <div class="container">
    <div class="flex-between">
      <div>
        <h2>多源数据采集</h2>
        <p class="muted">管理与调度来自传感器、API、日志的采集任务</p>
      </div>
      <div class="flex" style="gap: 10px;">
        <button @click="openAdd">新增数据源</button>
        <button class="secondary" @click="openBatch">批量启停</button>
      </div>
    </div>

    <div class="card" style="margin-top: 14px;">
      <div class="flex-between">
        <h3>采集列表</h3>
        <button class="ghost" @click="openFilter">筛选条件</button>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>名称</th>
            <th>类型</th>
            <th>频率(秒)</th>
            <th>状态</th>
            <th>负责人</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in sources" :key="item.name">
            <td>{{ item.name }}</td>
            <td>{{ item.type }}</td>
            <td>{{ item.freq }}</td>
            <td><span class="badge" :class="item.badge">{{ item.status }}</span></td>
            <td>{{ item.owner }}</td>
            <td class="flex" style="gap: 8px;">
              <button class="ghost" @click="showDetail(item)">详情</button>
              <button class="secondary" @click="startJob(item)">{{ item.status === '运行中' ? '暂停' : '启动' }}</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="modal.add" class="modal-overlay" @click.self="modal.add = false">
      <div class="modal">
        <div class="modal-header">
          <h3>新增数据源</h3>
          <button class="ghost" @click="modal.add = false">关闭</button>
        </div>
        <DataSourceForm @save="saveSource" @cancel="modal.add = false" />
      </div>
    </div>

    <div v-if="modal.filter" class="modal-overlay" @click.self="modal.filter = false">
      <div class="modal">
        <div class="modal-header">
          <h3>筛选条件</h3>
          <button class="ghost" @click="modal.filter = false">关闭</button>
        </div>
        <p>可按类型、负责人、状态快速过滤，模拟条件如下：</p>
        <div class="tag-row">
          <span class="mini-tag" style="background:#eef2ff;color:var(--primary)">类型：API</span>
          <span class="mini-tag" style="background:#ecfeff;color:#0891b2">负责人：张工</span>
          <span class="mini-tag" style="background:#fef3c7;color:#c2410c">状态：延迟</span>
        </div>
        <div class="modal-actions">
          <button class="ghost" @click="modal.filter = false">重置</button>
          <button @click="modal.filter = false">应用筛选</button>
        </div>
      </div>
    </div>

    <div v-if="modal.batch" class="modal-overlay" @click.self="modal.batch = false">
      <div class="modal">
        <div class="modal-header">
          <h3>批量启停</h3>
          <button class="ghost" @click="modal.batch = false">关闭</button>
        </div>
        <p>对选定的采集任务执行启停调度，进度如下：</p>
        <div class="progress">
          <div class="progress-bar" style="width: 60%; background: var(--primary);"></div>
        </div>
        <div class="modal-actions">
          <button class="ghost" @click="modal.batch = false">取消</button>
          <button @click="modal.batch = false">完成</button>
        </div>
      </div>
    </div>

    <div v-if="modal.detail" class="modal-overlay" @click.self="modal.detail = null">
      <div class="modal">
        <div class="modal-header">
          <h3>{{ modal.detail?.name }} - 详情</h3>
          <button class="ghost" @click="modal.detail = null">关闭</button>
        </div>
        <p>类型：{{ modal.detail?.type }} · 采集频率：{{ modal.detail?.freq }} 秒</p>
        <p class="muted">接入地址：{{ modal.detail?.endpoint }}</p>
        <div class="modal-actions">
          <button class="ghost" @click="modal.detail = null">关闭</button>
          <button @click="modal.detail = null">重新调度</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import DataSourceForm from '../components/DataSourceForm.vue';

const sources = reactive([
  { name: '物联网网关-01', type: '传感器', freq: 20, status: '运行中', badge: 'success', owner: '张工', endpoint: 'gw://iot01' },
  { name: 'MES-接口A', type: 'API', freq: 60, status: '运行中', badge: 'info', owner: '李思', endpoint: 'https://mes/api' },
  { name: '能耗计量-北区', type: '传感器', freq: 45, status: '运行中', badge: 'success', owner: '陈慧', endpoint: 'modbus://north' },
  { name: '日志采集-业务线B', type: '日志', freq: 30, status: '延迟', badge: 'warning', owner: '周泽', endpoint: 'log://bizB' },
  { name: '摄像头-仓储', type: '传感器', freq: 15, status: '运行中', badge: 'info', owner: '史德', endpoint: 'rtsp://store' },
  { name: '合作方-数据推送', type: 'API', freq: 120, status: '暂停', badge: 'danger', owner: '王越', endpoint: 'https://partner/api' },
  { name: '数据库-订单', type: '数据库', freq: 90, status: '运行中', badge: 'info', owner: '张工', endpoint: 'jdbc:mysql://db' },
  { name: '数据库-库存', type: '数据库', freq: 80, status: '运行中', badge: 'info', owner: '刘洋', endpoint: 'jdbc:mysql://inv' },
  { name: '车间PLC', type: '传感器', freq: 25, status: '运行中', badge: 'success', owner: '李思', endpoint: 'opc://plc' },
  { name: '用户行为埋点', type: '日志', freq: 35, status: '延迟', badge: 'warning', owner: '陈慧', endpoint: 'kafka://tracker' },
  { name: '第三方质检', type: 'API', freq: 70, status: '运行中', badge: 'info', owner: '周泽', endpoint: 'https://qa/api' }
]);

const modal = reactive({ add: false, filter: false, batch: false, detail: null });

const openAdd = () => { modal.add = true; };
const openFilter = () => { modal.filter = true; };
const openBatch = () => { modal.batch = true; };

const showDetail = (item) => {
  modal.detail = item;
};

const startJob = (item) => {
  modal.detail = { ...item, name: `${item.name} 调度` };
};

const saveSource = (payload) => {
  sources.unshift({
    name: payload.name,
    type: payload.type,
    freq: payload.frequency,
    status: '运行中',
    badge: 'info',
    owner: payload.owner || '未分配',
    endpoint: payload.endpoint
  });
  modal.add = false;
};
</script>

<style scoped>
.muted { color: var(--muted); }
</style>
