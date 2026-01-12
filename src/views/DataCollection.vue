<template>
  <div>
    <section class="panel">
      <h2>数据采集与预处理</h2>
      <div class="grid two">
        <div class="card">
          <h3>采集概览</h3>
          <p>当日采集批次：12</p>
          <p>平均噪声等级：0.16</p>
          <p>图像标准化率：96.8%</p>
        </div>
        <div class="card">
          <h3>灰斑图像预览</h3>
          <img :src="railImage" alt="灰斑采集预览" style="width: 100%; border-radius: 12px;" />
        </div>
      </div>
    </section>

    <section class="panel">
      <h2>采集任务列表</h2>
      <div class="actions">
        <button class="btn" @click="openModal('create')">新增采集任务</button>
        <button class="btn secondary" @click="openModal('filter')">噪声过滤设置</button>
        <button class="btn ghost" @click="openModal('start')">启动采集</button>
        <button class="btn secondary" @click="openModal('export')">导出数据</button>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>任务编号</th>
              <th>线路区段</th>
              <th>采集时间</th>
              <th>图像数量</th>
              <th>噪声等级</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="task in tasks" :key="task.id">
              <td>{{ task.id }}</td>
              <td>{{ task.section }}</td>
              <td>{{ task.time }}</td>
              <td>{{ task.count }}</td>
              <td>{{ task.noise }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <div v-if="activeModal" class="modal-mask">
      <div class="modal">
        <h3>{{ modalTitle }}</h3>
        <div v-if="activeModal === 'create'">
          <form>
            <input placeholder="采集任务名称" />
            <input placeholder="目标线路区段" />
            <input type="date" />
            <select>
              <option>高速线路</option>
              <option>重载线路</option>
              <option>客货混行</option>
            </select>
          </form>
        </div>
        <div v-else-if="activeModal === 'filter'">
          <form>
            <input placeholder="目标噪声阈值" />
            <select>
              <option>中值滤波</option>
              <option>高斯滤波</option>
              <option>双边滤波</option>
            </select>
            <textarea rows="3" placeholder="说明备注"></textarea>
          </form>
        </div>
        <div v-else-if="activeModal === 'start'">
          <p>采集任务正在初始化，请等待进度完成。</p>
          <div class="progress-bar">
            <span :style="{ width: '72%' }"></span>
          </div>
          <p style="margin-top: 8px; color: #4b5a78;">设备校准 72%</p>
        </div>
        <div v-else>
          <p>已生成 24 份数据包，将导出为 CSV 与图像压缩包。</p>
        </div>
        <div class="modal-footer">
          <button class="btn secondary" @click="closeModal">关闭</button>
          <button class="btn" @click="closeModal">确认</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import railImage from "../assets/rail-sample.svg";

const activeModal = ref("");

const tasks = Array.from({ length: 20 }, (_, index) => ({
  id: `DC-${202400 + index}`,
  section: `区段 ${index + 1}A`,
  time: `2024-09-${(index % 28) + 1} 0${index % 8}:30`,
  count: 120 + index * 3,
  noise: (0.12 + index * 0.01).toFixed(2)
}));

const modalTitleMap = {
  create: "新增采集任务",
  filter: "噪声过滤设置",
  start: "采集进度监控",
  export: "导出数据说明"
};

const modalTitle = computed(() => modalTitleMap[activeModal.value]);

const openModal = (type) => {
  activeModal.value = type;
};

const closeModal = () => {
  activeModal.value = "";
};
</script>
