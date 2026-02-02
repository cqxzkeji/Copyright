<template>
  <div class="grid grid-2">
    <div class="page-card">
      <div class="section-title">实时采集状态</div>
      <div class="grid grid-3">
        <div class="page-card">
          <div class="badge">视频流</div>
          <h3>{{ stats.video }} 路</h3>
          <p>清晰度校验通过</p>
        </div>
        <div class="page-card">
          <div class="badge">音频流</div>
          <h3>{{ stats.audio }} 路</h3>
          <p>噪声控制达标</p>
        </div>
        <div class="page-card">
          <div class="badge">传感器</div>
          <h3>{{ stats.sensor }} 组</h3>
          <p>实时上报正常</p>
        </div>
      </div>
      <div class="chart-card">
        <div class="section-title">多模态融合质量</div>
        <svg viewBox="0 0 320 140" width="100%" height="140" aria-label="融合质量图">
          <defs>
            <linearGradient id="fusion" x1="0" x2="1">
              <stop offset="0%" stop-color="#4f7cff" />
              <stop offset="100%" stop-color="#67d1ff" />
            </linearGradient>
          </defs>
          <polyline
            fill="none"
            stroke="url(#fusion)"
            stroke-width="4"
            points="0,110 40,90 80,95 120,60 160,72 200,40 240,55 280,35 320,48"
          />
          <circle v-for="(point, index) in points" :key="index" :cx="point.x" :cy="point.y" r="4" fill="#4f7cff" />
        </svg>
        <div class="chart-legend">
          <span>⏱ 最新采样: {{ stats.sampleRate }}Hz</span>
          <span>✅ 对齐率: {{ stats.sync }}%</span>
          <span>🔄 融合延迟: {{ stats.latency }}ms</span>
        </div>
      </div>
    </div>
    <div class="page-card">
      <div class="section-title">采集控制台</div>
      <div class="grid grid-2">
        <button class="primary-btn" @click="openForm">开启采集任务</button>
        <button class="secondary-btn" @click="openProgress">查看同步进度</button>
        <button class="ghost-btn" @click="openHint">采集提示信息</button>
        <button class="secondary-btn" @click="openDevice">设备校准</button>
      </div>
      <div class="section-title" style="margin-top: 20px;">采集清单</div>
      <table class="table">
        <thead>
          <tr>
            <th>序号</th>
            <th>采集源</th>
            <th>类型</th>
            <th>状态</th>
            <th>质量评分</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.id">
            <td>{{ row.id }}</td>
            <td>{{ row.source }}</td>
            <td>{{ row.type }}</td>
            <td>{{ row.status }}</td>
            <td>{{ row.score }}</td>
            <td>
              <button class="ghost-btn" @click="openRow(row)">查看</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <ModalDialog v-if="modal.open" :title="modal.title" @close="closeModal">
    <div v-if="modal.type === 'form'" class="modal-body">
      <div class="form-grid">
        <label>
          采集任务名称
          <input v-model="form.name" placeholder="请输入任务名称" />
        </label>
        <label>
          采集时长
          <select v-model="form.duration">
            <option value="30分钟">30分钟</option>
            <option value="45分钟">45分钟</option>
            <option value="60分钟">60分钟</option>
          </select>
        </label>
        <label>
          数据存储策略
          <select v-model="form.storage">
            <option value="实时上传">实时上传</option>
            <option value="本地缓冲">本地缓冲</option>
            <option value="双通道备份">双通道备份</option>
          </select>
        </label>
        <label>
          采集说明
          <textarea v-model="form.note" rows="3" placeholder="填写课堂信息"></textarea>
        </label>
      </div>
    </div>
    <div v-else-if="modal.type === 'progress'" class="modal-body">
      <p>{{ modal.message }}</p>
      <div class="progress">
        <span :style="{ width: modal.progress + '%' }"></span>
      </div>
      <p class="tag">同步完成度 {{ modal.progress }}%</p>
    </div>
    <div v-else class="modal-body">
      <p>{{ modal.message }}</p>
      <ul>
        <li v-for="item in modal.list" :key="item">{{ item }}</li>
      </ul>
    </div>
    <template #actions>
      <button class="secondary-btn" @click="closeModal">关闭</button>
      <button v-if="modal.type === 'form'" class="primary-btn" @click="submit">保存任务</button>
    </template>
  </ModalDialog>
</template>

<script setup>
import { reactive } from "vue";
import ModalDialog from "../components/ModalDialog.vue";

const stats = {
  video: 6,
  audio: 4,
  sensor: 8,
  sampleRate: 50,
  sync: 96,
  latency: 180
};

const points = [
  { x: 0, y: 110 },
  { x: 40, y: 90 },
  { x: 80, y: 95 },
  { x: 120, y: 60 },
  { x: 160, y: 72 },
  { x: 200, y: 40 },
  { x: 240, y: 55 },
  { x: 280, y: 35 },
  { x: 320, y: 48 }
];

const rows = Array.from({ length: 20 }, (_, index) => ({
  id: index + 1,
  source: `教室区域-${index + 1}`,
  type: index % 2 === 0 ? "高清视频" : "红外传感",
  status: index % 3 === 0 ? "正常" : "采集中",
  score: `${92 + (index % 6)}分`
}));

const modal = reactive({
  open: false,
  title: "",
  type: "info",
  message: "",
  list: [],
  progress: 0
});

const form = reactive({
  name: "课堂同步采集",
  duration: "45分钟",
  storage: "实时上传",
  note: "高一数学课堂" 
});

const openForm = () => {
  modal.open = true;
  modal.title = "新建采集任务";
  modal.type = "form";
};

const openProgress = () => {
  modal.open = true;
  modal.title = "多模态同步进度";
  modal.type = "progress";
  modal.message = "视频、音频、传感器正在同步校验。";
  modal.progress = 72;
};

const openHint = () => {
  modal.open = true;
  modal.title = "采集提示";
  modal.type = "info";
  modal.message = "建议在课堂开始前完成光照与音频噪声校准。";
  modal.list = ["检查镜头角度", "确认麦克风阵列", "同步座位传感器"];
};

const openDevice = () => {
  modal.open = true;
  modal.title = "设备校准计划";
  modal.type = "info";
  modal.message = "系统将依次校准教室设备，预计耗时 4 分钟。";
  modal.list = ["摄像头色彩校准", "麦克风噪声抑制", "姿态传感器对齐"];
};

const openRow = (row) => {
  modal.open = true;
  modal.title = `采集源详情 - ${row.source}`;
  modal.type = "info";
  modal.message = `类型: ${row.type}，当前状态: ${row.status}，质量评分: ${row.score}`;
  modal.list = ["采样频率 50Hz", "延迟 160ms", "信号稳定"];
};

const submit = () => {
  modal.open = false;
};

const closeModal = () => {
  modal.open = false;
};
</script>
