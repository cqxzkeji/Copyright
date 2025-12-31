<template>
  <div class="card">
    <div class="section-title">YOLOv5 模型训练</div>
    <p class="muted">配置数据集、超参数并启动囊肿检测模型训练，实时显示进度。</p>
    <div class="toolbar">
      <button @click="showParams = true">超参配置</button>
      <button @click="startTraining">开始训练</button>
      <button @click="showLog = true">查看训练记录</button>
    </div>

    <div class="grid" style="margin-top: 12px;">
      <div class="stat">
        <div class="muted">当前配置</div>
        <div class="section-title">batch={{ params.batch }} / lr={{ params.lr }}</div>
        <p>输入尺寸 {{ params.imgSize }} ，最大轮次 {{ params.epochs }}。</p>
      </div>
      <div class="stat">
        <div class="muted">数据拆分</div>
        <div class="section-title">训练 {{ splits.train }} / 验证 {{ splits.val }} / 测试 {{ splits.test }}</div>
        <p>自动校验类别覆盖率 100%。</p>
      </div>
    </div>
  </div>

  <BaseModal v-model="showParams" title="超参数配置" confirm-text="保存配置" @confirm="saveParams">
    <label>Batch Size
      <input type="number" v-model.number="params.batch" />
    </label>
    <label>学习率
      <input type="number" step="0.0001" v-model.number="params.lr" />
    </label>
    <label>输入尺寸
      <input v-model="params.imgSize" />
    </label>
    <label>训练轮次
      <input type="number" v-model.number="params.epochs" />
    </label>
  </BaseModal>

  <BaseModal v-model="showTrain" title="训练进度" confirm-text="继续后台训练" @confirm="() => (showTrain = false)">
    <p>YOLOv5s 模型训练中，包含增强与 Mosaic 策略。</p>
    <div class="progress-bar">
      <div class="progress" :style="{ width: trainProgress + '%' }"></div>
    </div>
    <p class="muted">已完成 {{ trainProgress }}% · 最优 mAP {{ bestMap }}%</p>
  </BaseModal>

  <BaseModal v-model="showLog" title="训练记录" confirm-text="关闭" @confirm="() => (showLog = false)">
    <table class="table">
      <thead>
        <tr>
          <th>轮次</th>
          <th>mAP@0.5</th>
          <th>Recall</th>
          <th>学习率</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in logs" :key="row.epoch">
          <td>{{ row.epoch }}</td>
          <td>{{ row.map }}</td>
          <td>{{ row.recall }}</td>
          <td>{{ row.lr }}</td>
        </tr>
      </tbody>
    </table>
  </BaseModal>
</template>

<script setup>
import { reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const params = reactive({ batch: 8, lr: 0.001, imgSize: '640x640', epochs: 80 });
const splits = reactive({ train: '70%', val: '20%', test: '10%' });
const logs = reactive(
  Array.from({ length: 20 }).map((_, i) => ({
    epoch: i + 1,
    map: (60 + i * 1.2).toFixed(1) + '%',
    recall: (70 + i * 0.8).toFixed(1) + '%',
    lr: (0.001 - i * 0.00001).toFixed(5)
  }))
);

const showParams = ref(false);
const showTrain = ref(false);
const showLog = ref(false);
const trainProgress = ref(0);
const bestMap = ref(0);
let timer;

const saveParams = () => {
  showParams.value = false;
  alert('配置已更新，即将按新参数训练');
};

const startTraining = () => {
  showTrain.value = true;
  trainProgress.value = 0;
  bestMap.value = 0;
  clearInterval(timer);
  timer = setInterval(() => {
    trainProgress.value = Math.min(100, trainProgress.value + 10);
    bestMap.value = Math.min(98, bestMap.value + 2);
    if (trainProgress.value >= 100) {
      clearInterval(timer);
    }
  }, 600);
};
</script>
