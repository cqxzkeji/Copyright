<template>
  <div class="page">
    <div class="grid three">
      <div class="card">
        <div class="section-title">采集任务总览</div>
        <p>今日计划采集任务 {{ stats.tasks }} 次</p>
        <p>已完成 {{ stats.completed }} 次 / 待执行 {{ stats.pending }} 次</p>
        <div class="actions">
          <button class="btn" @click="openModal('task')">新增采集任务</button>
          <button class="btn secondary" @click="openModal('device')">设备接入</button>
        </div>
      </div>
      <div class="card">
        <div class="section-title">采集质量评分</div>
        <div class="score">{{ stats.score }}</div>
        <p>传感器在线率 97%，数据完整率 95%</p>
        <div class="progress"><span :style="{ width: stats.score + '%' }"></span></div>
        <div class="actions">
          <button class="btn" @click="openModal('quality')">查看质量详情</button>
        </div>
      </div>
      <div class="card">
        <div class="section-title">采集渠道分布</div>
        <div class="channel-chart">
          <div v-for="item in channels" :key="item.name" class="channel-item">
            <span>{{ item.name }}</span>
            <div class="bar">
              <span :style="{ width: item.value + '%' }"></span>
            </div>
          </div>
        </div>
        <div class="actions">
          <button class="btn" @click="openModal('channel')">渠道配置</button>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="section-title">环境数据采集列表</div>
      <table class="table">
        <thead>
          <tr>
            <th>任务编号</th>
            <th>采集位置</th>
            <th>采集指标</th>
            <th>频率</th>
            <th>负责人</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="task in tasks" :key="task.id">
            <td>{{ task.id }}</td>
            <td>{{ task.zone }}</td>
            <td>{{ task.metric }}</td>
            <td>{{ task.frequency }}</td>
            <td>{{ task.owner }}</td>
            <td><span class="tag">{{ task.status }}</span></td>
            <td>
              <button class="btn secondary" @click="openModal('edit')">编辑</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="activeModal" class="modal-mask" @click.self="closeModal">
      <div class="modal">
        <header>
          <h3>{{ modalTitle }}</h3>
          <button class="btn ghost" @click="closeModal">关闭</button>
        </header>
        <div class="modal-body">
          <template v-if="activeModal === 'task'">
            <p>配置新的环境数据采集任务。</p>
            <label>采集指标<select><option>温度</option><option>湿度</option><option>光照</option><option>土壤水分</option></select></label>
            <label>采集频率<select><option>10 分钟</option><option>30 分钟</option><option>60 分钟</option></select></label>
            <label>负责人<input placeholder="请输入负责人" /></label>
          </template>
          <template v-else-if="activeModal === 'device'">
            <p>接入新的传感器设备并绑定地块。</p>
            <label>设备编号<input placeholder="请输入设备编号" /></label>
            <label>地块<select><option>A区</option><option>B区</option><option>C区</option></select></label>
          </template>
          <template v-else-if="activeModal === 'quality'">
            <p>数据完整率达 {{ stats.score }}%，建议保持每日巡检。</p>
          </template>
          <template v-else-if="activeModal === 'channel'">
            <p>配置采集通道和数据上传方式。</p>
            <label>上传方式<select><option>4G 网关</option><option>有线网络</option><option>LoRa</option></select></label>
            <label>同步频率<select><option>即时</option><option>5 分钟</option><option>30 分钟</option></select></label>
          </template>
          <template v-else>
            <p>编辑采集任务并重新下发至设备。</p>
            <label>任务状态<select><option>运行中</option><option>暂停</option></select></label>
            <label>说明<textarea rows="3" placeholder="请输入备注"></textarea></label>
          </template>
        </div>
        <div class="modal-actions">
          <button class="btn" @click="closeModal">确认</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";

const stats = { tasks: 36, completed: 28, pending: 8, score: 92 };
const activeModal = ref("");

const channels = [
  { name: "温室无线传感器", value: 55 },
  { name: "土壤水分探头", value: 70 },
  { name: "气象站采集", value: 40 }
];

const tasks = Array.from({ length: 22 }, (_, index) => ({
  id: `COL-${200 + index}`,
  zone: ["东区", "西区", "南区", "北区"][index % 4],
  metric: ["温度", "湿度", "光照", "土壤水分"][index % 4],
  frequency: ["10 分钟", "30 分钟", "60 分钟"][index % 3],
  owner: ["张伟", "李敏", "王倩", "刘航"][index % 4],
  status: index % 3 === 0 ? "运行中" : "待巡检"
}));

const modalTitle = computed(() => {
  const titleMap = {
    task: "新增采集任务",
    device: "设备接入",
    quality: "采集质量详情",
    channel: "采集渠道配置",
    edit: "编辑采集任务"
  };
  return titleMap[activeModal.value] || "提示";
});

const openModal = (name) => {
  activeModal.value = name;
};

const closeModal = () => {
  activeModal.value = "";
};
</script>

<style scoped>
.score {
  font-size: 32px;
  font-weight: 700;
  margin: 8px 0;
}

.channel-chart {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.channel-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  color: var(--muted);
}

.bar {
  flex: 1;
  height: 10px;
  border-radius: 999px;
  background: #e5e7eb;
  overflow: hidden;
}

.bar span {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, #2f80ed, #20c997);
}

.modal-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-size: 14px;
}

.modal-body label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: var(--muted);
}
</style>
