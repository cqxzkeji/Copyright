<template>
  <div>
    <section class="panel">
      <h2>智能算法与模型优化</h2>
      <div class="grid two">
        <div class="card">
          <h3>训练状态</h3>
          <p>当前模型：CNN-V3.2</p>
          <p>最新准确率：97.6%</p>
          <p>损失值：0.034</p>
        </div>
        <div class="card">
          <h3>模型训练曲线</h3>
          <img :src="railImage" alt="模型训练曲线" style="width: 100%; border-radius: 12px;" />
        </div>
      </div>
    </section>

    <section class="panel">
      <h2>模型训练记录</h2>
      <div class="actions">
        <button class="btn" @click="openModal('train')">启动模型训练</button>
        <button class="btn secondary" @click="openModal('tune')">参数优化设置</button>
        <button class="btn ghost" @click="openModal('evaluate')">性能评估</button>
        <button class="btn secondary" @click="openModal('deploy')">部署策略</button>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>版本</th>
              <th>训练轮次</th>
              <th>准确率</th>
              <th>召回率</th>
              <th>更新时间</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="record in records" :key="record.version">
              <td>{{ record.version }}</td>
              <td>{{ record.epoch }}</td>
              <td>{{ record.acc }}</td>
              <td>{{ record.recall }}</td>
              <td>{{ record.time }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <div v-if="activeModal" class="modal-mask">
      <div class="modal">
        <h3>{{ modalTitle }}</h3>
        <div v-if="activeModal === 'train'">
          <form>
            <input placeholder="训练批次名称" />
            <input placeholder="学习率 0.001" />
            <select>
              <option>Adam 优化器</option>
              <option>SGD 优化器</option>
              <option>RMSProp</option>
            </select>
          </form>
          <div class="progress-bar" style="margin-top: 10px;">
            <span :style="{ width: '64%' }"></span>
          </div>
          <p style="margin-top: 6px; color: #4b5a78;">反向传播 64%</p>
        </div>
        <div v-else-if="activeModal === 'tune'">
          <form>
            <input placeholder="权重衰减 0.0005" />
            <input placeholder="批量大小 32" />
            <textarea rows="3" placeholder="调优策略备注"></textarea>
          </form>
        </div>
        <div v-else-if="activeModal === 'evaluate'">
          <p>模型评估完成，AUC 达到 0.981。</p>
          <div class="progress-bar">
            <span :style="{ width: '90%' }"></span>
          </div>
        </div>
        <div v-else>
          <form>
            <select>
              <option>灰斑检测主线部署</option>
              <option>边缘设备轻量部署</option>
              <option>云端离线训练</option>
            </select>
            <input placeholder="目标节点数量" />
            <textarea rows="3" placeholder="部署说明"></textarea>
          </form>
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

const records = Array.from({ length: 20 }, (_, index) => ({
  version: `V3.${index}`,
  epoch: 40 + index,
  acc: `${(94.5 + index * 0.15).toFixed(2)}%`,
  recall: `${(92.1 + index * 0.2).toFixed(2)}%`,
  time: `2024-09-${(index % 28) + 1} 1${index % 9}:00`
}));

const modalTitleMap = {
  train: "启动模型训练",
  tune: "参数优化设置",
  evaluate: "性能评估",
  deploy: "部署策略"
};

const modalTitle = computed(() => modalTitleMap[activeModal.value]);

const openModal = (type) => {
  activeModal.value = type;
};

const closeModal = () => {
  activeModal.value = "";
};
</script>
