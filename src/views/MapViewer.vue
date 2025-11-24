<template>
  <div class="module">
    <header>
      <div>
        <h2>地图展示与浏览</h2>
        <p>多尺度地图联动，实时反馈坐标与图层状态。</p>
      </div>
      <button class="ghost" @click="openPopup">图层列表</button>
    </header>

    <section class="viewer">
      <div class="map" :style="{ opacity: opacity / 100 }" @mousemove="updatePointer" @click="markPoint($event)">
        <div
          v-for="point in markers"
          :key="point.id"
          class="marker"
          :style="{ left: point.x + '%', top: point.y + '%' }"
        ></div>
        <div class="viewport">虚拟地图</div>
      </div>
      <aside class="panel">
        <label>
          缩放等级：<strong>{{ zoom }}</strong>
          <input type="range" min="2" max="20" v-model.number="zoom" />
        </label>
        <label>
          透明度：<strong>{{ opacity }}%</strong>
          <input type="range" min="20" max="100" v-model.number="opacity" />
        </label>
        <div class="coords">指针位置：{{ pointer.x.toFixed(2) }}, {{ pointer.y.toFixed(2) }}</div>
        <button @click="resetView">重置视图</button>
      </aside>
    </section>

    <ModalDialog v-if="layersPopup" title="图层控制" @close="layersPopup = false">
      <ul>
        <li v-for="layer in layers" :key="layer.name">
          <label>
            <input type="checkbox" v-model="layer.visible" /> {{ layer.name }}
            <span class="badge">{{ layer.status }}</span>
          </label>
        </li>
      </ul>
      <template #footer>
        <button class="ghost" @click="layersPopup = false">完成</button>
      </template>
    </ModalDialog>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const zoom = ref(8);
const opacity = ref(70);
const pointer = reactive({ x: 0, y: 0 });
const markers = ref([]);
const layersPopup = ref(false);
const layers = reactive([
  { name: '底图 - 影像', visible: true, status: '在线' },
  { name: '道路交通', visible: true, status: '延迟' },
  { name: '地形晕渲', visible: false, status: '维护' },
  { name: '行政区划', visible: true, status: '在线' }
]);

const updatePointer = (event) => {
  const rect = event.currentTarget.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 100;
  pointer.y = ((event.clientY - rect.top) / rect.height) * 100;
};

const markPoint = (event) => {
  updatePointer(event);
  markers.value.push({ id: Date.now(), x: pointer.x, y: pointer.y });
};

const resetView = () => {
  zoom.value = 8;
  opacity.value = 70;
  markers.value = [];
};

const openPopup = () => (layersPopup.value = true);
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.viewer {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}
.map {
  flex: 2 1 360px;
  position: relative;
  border-radius: 22px;
  background: linear-gradient(135deg, rgba(58, 134, 255, 0.4), rgba(0, 0, 0, 0.7));
  border: 1px solid rgba(255, 255, 255, 0.15);
  height: 320px;
  overflow: hidden;
}
.viewport {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.4);
  font-size: 1.3rem;
}
.marker {
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #ff6b6b;
  transform: translate(-50%, -50%);
}
.panel {
  flex: 1 1 200px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 18px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
input[type="range"] {
  width: 100%;
}
.coords {
  font-size: 0.95rem;
  opacity: 0.8;
}
button {
  padding: 10px 16px;
  border-radius: 12px;
  background: linear-gradient(120deg, #3a86ff, #a855f7);
  color: #fff;
}
.ghost {
  background: rgba(255, 255, 255, 0.15);
}
ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.badge {
  margin-left: 10px;
  font-size: 0.8rem;
  opacity: 0.7;
}
</style>
