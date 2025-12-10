<template>
  <div class="card">
    <div class="flex-between">
      <div>
        <h3 class="section-title">冷链运输监控</h3>
        <p style="color: var(--muted);">实时跟踪车辆、温度与告警，保障货物冷链稳定</p>
      </div>
      <div class="chip-row">
        <button class="btn" @click="modals.track=true">追踪车辆</button>
        <button class="btn secondary" @click="modals.refresh=true">刷新状态</button>
        <button class="btn light" @click="modals.alert=true">查看告警</button>
      </div>
    </div>
    <div class="summary-grid" style="margin-top: 12px;">
      <div class="summary-card" v-for="item in cards" :key="item.label">
        <div class="flex-between">
          <div>
            <h4>{{ item.label }}</h4>
            <p style="margin: 4px 0 0; color: var(--muted);">{{ item.desc }}</p>
          </div>
          <span class="status" :class="item.status">{{ item.statusText }}</span>
        </div>
        <div class="progress" style="margin-top: 8px;"><span :style="{ width: item.progress }"></span></div>
      </div>
    </div>
    <div class="grid" style="margin-top: 16px;">
      <div class="card">
        <div class="flex-between">
          <p class="section-title">运输批次</p>
          <span class="badge">不少于 10 条数据</span>
        </div>
        <table class="table">
          <thead>
            <tr>
              <th>批次</th>
              <th>车辆</th>
              <th>当前位置</th>
              <th>温度(℃)</th>
              <th>湿度(%)</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="batch in batches" :key="batch.id">
              <td>{{ batch.id }}</td>
              <td>{{ batch.truck }}</td>
              <td>{{ batch.location }}</td>
              <td>{{ batch.temp }}</td>
              <td>{{ batch.humidity }}</td>
              <td><span class="status" :class="batch.level">{{ batch.status }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="card">
        <div class="flex-between">
          <p class="section-title">温度稳定度图</p>
          <span style="color: var(--muted);">平均 3.8℃</span>
        </div>
        <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px;">
          <div class="card" v-for="line in trends" :key="line.route" style="padding: 12px;">
            <div class="flex-between">
              <strong>{{ line.route }}</strong>
              <span class="tag">{{ line.temperature }}℃</span>
            </div>
            <p style="margin: 6px 0; color: var(--muted);">冷链段：{{ line.segment }}</p>
            <div class="chart-bar"><span :style="{ width: line.score + '%' }"></span></div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <ModalDialog :visible="modals.track" title="追踪车辆" helper="填写车辆与批次信息" @close="modals.track=false" @confirm="modals.track=false">
    <div class="form-grid">
      <div class="form-group">
        <label>车辆编号</label>
        <input placeholder="如 C-102" />
      </div>
      <div class="form-group">
        <label>运输批次</label>
        <input placeholder="批次号" />
      </div>
      <div class="form-group">
        <label>目的地</label>
        <input placeholder="北京-顺义冷库" />
      </div>
      <div class="form-group">
        <label>温控阈值(℃)</label>
        <input type="number" placeholder="2-8" />
      </div>
    </div>
  </ModalDialog>

  <ModalDialog :visible="modals.refresh" title="刷新状态" helper="正在同步传感器数据" @close="modals.refresh=false" @confirm="modals.refresh=false">
    <p>更新车辆 GPS、温湿度与告警状态。</p>
    <div class="progress" style="margin-top: 8px;"><span style="width: 65%"></span></div>
  </ModalDialog>

  <ModalDialog :visible="modals.alert" title="最新告警" helper="完成处置后点击确认" @close="modals.alert=false" @confirm="modals.alert=false">
    <ul>
      <li v-for="item in alerts" :key="item.text" style="margin-bottom: 6px;">{{ item.time }} - {{ item.text }}</li>
    </ul>
  </ModalDialog>
</template>

<script setup>
import { reactive } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const modals = reactive({ track: false, refresh: false, alert: false });

const cards = [
  { label: '温度稳定', desc: '连续 24h 保持 2~8℃', statusText: '安全', status: 'safe', progress: '82%' },
  { label: '冷机运行', desc: '节能模式下 18 台', statusText: '正常', status: 'safe', progress: '68%' },
  { label: '线路偏移', desc: '已自动纠偏 3 次', statusText: '注意', status: 'warn', progress: '54%' }
];

const batches = [
  { id: 'CC-2301', truck: '粤A1023', location: '广州增城服务区', temp: '4.1', humidity: '68', status: '平稳', level: 'safe' },
  { id: 'CC-2302', truck: '粤B5521', location: '佛山南海冷链枢纽', temp: '3.7', humidity: '64', status: '平稳', level: 'safe' },
  { id: 'CC-2303', truck: '粤C9981', location: '深圳宝安', temp: '5.2', humidity: '70', status: '偏高', level: 'warn' },
  { id: 'CC-2304', truck: '粤E3123', location: '长沙雨花', temp: '3.9', humidity: '61', status: '平稳', level: 'safe' },
  { id: 'CC-2305', truck: '湘A2311', location: '衡阳', temp: '2.7', humidity: '58', status: '平稳', level: 'safe' },
  { id: 'CC-2306', truck: '湘B5421', location: '郴州北', temp: '6.3', humidity: '66', status: '关注', level: 'warn' },
  { id: 'CC-2307', truck: '皖K2190', location: '合肥肥西', temp: '4.4', humidity: '65', status: '平稳', level: 'safe' },
  { id: 'CC-2308', truck: '皖A8121', location: '南京溧水', temp: '5.9', humidity: '72', status: '偏高', level: 'warn' },
  { id: 'CC-2309', truck: '苏B3321', location: '常州武进', temp: '4.8', humidity: '69', status: '平稳', level: 'safe' },
  { id: 'CC-2310', truck: '苏A7711', location: '上海青浦', temp: '3.2', humidity: '63', status: '平稳', level: 'safe' },
  { id: 'CC-2311', truck: '沪C8831', location: '嘉兴服务区', temp: '2.9', humidity: '60', status: '平稳', level: 'safe' }
];

const trends = [
  { route: '广州 → 深圳', temperature: 3.6, segment: '生鲜 - 电商', score: 82 },
  { route: '长沙 → 合肥', temperature: 4.1, segment: '药品 - 医疗', score: 74 },
  { route: '南京 → 上海', temperature: 3.8, segment: '餐饮 - 预制菜', score: 88 },
  { route: '苏州 → 无锡', temperature: 4.3, segment: '冷冻 - 零售', score: 69 }
];

const alerts = [
  { time: '08:30', text: 'CC-2308 温度达到 6℃，自动加压制冷' },
  { time: '09:15', text: 'CC-2303 位置偏移 1.2km，导航纠偏中' },
  { time: '10:05', text: 'CC-2306 司机迟滞报警，已派单提醒' }
];
</script>
