<template>
  <div class="monitoring">
    <section class="live">
      <div class="video">
        <p>实时影像 - 北部地块</p>
        <div class="screen">
          <span>LIVE</span>
        </div>
      </div>
      <div class="actions">
        <button @click="showModal('捕获成功', '已保存高清截图，供病虫害识别模型使用。')">抓取画面</button>
        <button class="ghost" @click="showModal('云台复位', '云台回到默认巡航角度。')">云台复位</button>
        <button class="ghost" @click="showModal('语音播报', '向田间作业人员推送安全提示。')">语音播报</button>
      </div>
    </section>
    <section class="sensors">
      <article v-for="item in sensors" :key="item.name" class="sensor">
        <div>
          <h4>{{ item.name }}</h4>
          <p>{{ item.value }} {{ item.unit }}</p>
        </div>
        <button class="ghost" @click="showModal(item.name, item.recommend)">操作</button>
      </article>
    </section>
    <ModalDialog v-if="visible" :title="modalTitle" @close="visible = false">
      <p>{{ modalContent }}</p>
    </ModalDialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const sensors = [
  { name: '空气温度', value: 26.5, unit: '℃', recommend: '温度适宜，可继续保持遮阳与通风策略。' },
  { name: '空气湿度', value: 68, unit: '%', recommend: '湿度略高，建议启动风机 5 分钟。' },
  { name: '土壤墒情', value: 34, unit: '%', recommend: '建议低流量补灌 12 分钟。' },
  { name: '二氧化碳', value: 415, unit: 'ppm', recommend: '维持现有通风，无需额外干预。' }
];

const visible = ref(false);
const modalTitle = ref('');
const modalContent = ref('');

const showModal = (title, content) => {
  visible.value = true;
  modalTitle.value = title;
  modalContent.value = content;
};
</script>

<style scoped>
.monitoring {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.live {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.video {
  flex: 1;
  min-width: 260px;
  background: #0f172a;
  color: #fff;
  padding: 1.2rem;
  border-radius: 18px;
}

.screen {
  height: 220px;
  margin-top: 1rem;
  background: linear-gradient(120deg, rgba(34, 197, 94, 0.45), rgba(56, 189, 248, 0.45));
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  letter-spacing: 0.5rem;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex: 0 0 240px;
}

button {
  border: none;
  border-radius: 16px;
  padding: 0.75rem 1rem;
  cursor: pointer;
  font-weight: 600;
  background: #22c55e;
  color: #fff;
}

button.ghost {
  background: rgba(37, 99, 235, 0.12);
  color: #2563eb;
}

.sensors {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}

.sensor {
  background: #f8fafc;
  padding: 1.2rem;
  border-radius: 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
