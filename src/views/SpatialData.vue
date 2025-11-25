<template>
  <div class="module">
    <div class="header">
      <div>
        <h3>空间数据与地图展示</h3>
        <p class="muted">地块空间范围、GIS 图层叠加与现状监测</p>
      </div>
      <div class="actions">
        <button class="primary-btn" @click="openLayerModal">叠加图层</button>
        <button class="secondary-btn" @click="openMapShot">生成截图</button>
      </div>
    </div>

    <div class="card-grid">
      <div class="card">
        <div class="card-head">
          <strong>地块范围</strong>
          <span class="badge" style="background:#fee2e2">{{ parcels.length }} 个地块</span>
        </div>
        <table class="table">
          <thead>
            <tr>
              <th>地块</th>
              <th>面积</th>
              <th>规划用途</th>
              <th>热度</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="parcel in parcels" :key="parcel.name">
              <td>{{ parcel.name }}</td>
              <td>{{ parcel.size }} 公顷</td>
              <td>{{ parcel.use }}</td>
              <td><span class="badge" :style="{ background: parcel.heatColor }">{{ parcel.heat }}</span></td>
              <td class="table-actions">
                <button class="secondary-btn" @click="highlight(parcel)">高亮</button>
                <button class="primary-btn" @click="openLayerModal">叠加</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="card">
        <div class="card-head">
          <strong>地图窗口</strong>
          <button class="secondary-btn" @click="openMapShot">刷新截图</button>
        </div>
        <div class="map">
          <div class="map-overlay">GIS 图层叠加示意</div>
          <div class="tag-row" style="margin-top:12px">
            <span class="badge" style="background:#dbeafe">现状底图</span>
            <span class="badge" style="background:#fef3c7">控规范围</span>
            <span class="badge" style="background:#dcfce7">建设年限</span>
            <span class="badge" style="background:#fee2e2">风险区域</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showLayer" class="modal-mask" @click.self="showLayer=false">
      <div class="modal-container">
        <div class="modal-header">
          <span>选择叠加图层</span>
          <button class="secondary-btn" @click="showLayer=false">关闭</button>
        </div>
        <div class="grid-2">
          <label v-for="layer in layers" :key="layer" style="font-weight:600">
            <input type="checkbox" checked /> {{ layer }}
          </label>
        </div>
        <button class="primary-btn" style="margin-top:12px" @click="applyLayer">应用图层</button>
      </div>
    </div>

    <div v-if="showShot" class="modal-mask" @click.self="showShot=false">
      <div class="modal-container">
        <div class="modal-header">
          <span>地图输出</span>
          <button class="secondary-btn" @click="showShot=false">关闭</button>
        </div>
        <p class="muted">已生成截图并推送至档案模块，供审批资料留存。</p>
        <div class="progress-bar" style="margin-top:10px">
          <div class="progress-fill" style="width:80%"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'

const parcels = reactive([
  { name: '河西A1地块', size: 12.4, use: '商住混合', heat: '高', heatColor: '#fecdd3' },
  { name: '科创谷核心区', size: 18.9, use: '产业研发', heat: '中', heatColor: '#fde68a' },
  { name: '老城更新示范区', size: 9.2, use: '居住改善', heat: '中', heatColor: '#fde68a' },
  { name: '滨江活力区', size: 15.6, use: '商服+公共', heat: '高', heatColor: '#fecdd3' },
  { name: '枢纽TOD北区', size: 11.1, use: '轨交综合体', heat: '低', heatColor: '#dcfce7' }
])

const layers = reactive(['用地现状', '控规边界', '地下管线', '拆迁范围', '风险隐患', '时序进度'])

const showLayer = ref(false)
const showShot = ref(false)

const openLayerModal = () => {
  showLayer.value = true
}

const openMapShot = () => {
  showShot.value = true
}

const highlight = (parcel) => {
  showShot.value = true
}

const applyLayer = () => {
  showLayer.value = false
  showShot.value = true
}
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.actions {
  display: flex;
  gap: 10px;
}

.map {
  height: 260px;
  border-radius: 14px;
  background: linear-gradient(120deg, #bfdbfe, #e0f2fe);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #0f172a;
  font-weight: 700;
  position: relative;
}

.map-overlay {
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.92);
  border-radius: 14px;
  box-shadow: var(--shadow);
}
</style>
