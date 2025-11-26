<template>
  <div class="grid" style="grid-template-columns: 2fr 1fr; align-items: start">
    <div class="card">
      <div class="section-head">
        <div>
          <p class="eyebrow">地块一张图</p>
          <h3>基础数据与台账</h3>
        </div>
        <div class="btn-group">
          <button class="action-btn" @click="showImport = true">批量导入</button>
          <button class="action-btn secondary" @click="showMark = true">标注低效</button>
        </div>
      </div>
      <div class="map-panel">
        <div class="map-placeholder">GIS 模拟视图</div>
        <div class="legend">
          <span class="badge info">闲置地块 8</span>
          <span class="badge warning">低效用地 12</span>
          <span class="badge success">可盘活 21</span>
        </div>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>编码</th>
            <th>名称</th>
            <th>面积(ha)</th>
            <th>现状</th>
            <th>利用效率</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="parcel in parcels" :key="parcel.code">
            <td>{{ parcel.code }}</td>
            <td>{{ parcel.name }}</td>
            <td>{{ parcel.area }}</td>
            <td>{{ parcel.status }}</td>
            <td>
              <div class="chart-bar" :style="{ width: parcel.efficiency + '%' }"></div>
              <small>{{ parcel.efficiency }}%</small>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="card">
      <div class="section-head">
        <div>
          <p class="eyebrow">台账概览</p>
          <h3>编码与标签</h3>
        </div>
        <button class="action-btn" @click="showAdd = true">新增记录</button>
      </div>
      <ul class="ledger">
        <li v-for="item in ledger" :key="item.code">
          <div>
            <strong>{{ item.code }}</strong>
            <p class="muted">{{ item.name }}</p>
            <div class="tag-list">
              <span v-for="tag in item.tags" :key="tag" class="badge info">{{ tag }}</span>
            </div>
          </div>
          <span class="badge" :class="item.flag">{{ item.flagLabel }}</span>
        </li>
      </ul>
    </div>

    <div v-if="showImport" class="modal-mask" @click.self="showImport = false">
      <div class="modal-container">
        <div class="modal-header">
          <h3>批量导入</h3>
          <button class="action-btn secondary" @click="showImport = false">关闭</button>
        </div>
        <div class="form-row">
          <label>数据来源<input placeholder="选择 CSV / Excel" /></label>
          <label>编码前缀<input placeholder="如 PD-2024" /></label>
        </div>
        <div class="form-row">
          <label>覆盖策略
            <select>
              <option>跳过重复编码</option>
              <option>覆盖旧记录</option>
            </select>
          </label>
          <label>批次备注<input placeholder="示例：四季度存量普查" /></label>
        </div>
        <div class="progress-track">
          <div class="progress-bar" :style="{ width: '65%' }"></div>
        </div>
        <p class="muted">导入进度 65%，预计 12s 完成</p>
      </div>
    </div>

    <div v-if="showMark" class="modal-mask" @click.self="showMark = false">
      <div class="modal-container">
        <div class="modal-header">
          <h3>标注闲置 / 低效用地</h3>
          <button class="action-btn secondary" @click="showMark = false">关闭</button>
        </div>
        <div class="form-row">
          <label>地块编码<select><option v-for="p in parcels" :key="p.code">{{ p.code }}</option></select></label>
          <label>标注类型
            <select>
              <option>闲置</option>
              <option>低效</option>
              <option>可盘活</option>
            </select>
          </label>
        </div>
        <label>情况说明<textarea rows="3" placeholder="描述现场踏勘情况"></textarea></label>
        <button class="action-btn" style="margin-top: 12px">提交标注</button>
      </div>
    </div>

    <div v-if="showAdd" class="modal-mask" @click.self="showAdd = false">
      <div class="modal-container">
        <div class="modal-header">
          <h3>新增台账记录</h3>
          <button class="action-btn secondary" @click="showAdd = false">关闭</button>
        </div>
        <div class="form-row">
          <label>地块名称<input placeholder="输入名称" /></label>
          <label>面积 (ha)<input type="number" placeholder="20" /></label>
        </div>
        <div class="form-row">
          <label>规划属性<input placeholder="二类居住 / 工业" /></label>
          <label>现状类型<select><option>存量工业</option><option>棚改地块</option></select></label>
        </div>
        <button class="action-btn" style="margin-top: 12px">保存</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const showImport = ref(false);
const showMark = ref(false);
const showAdd = ref(false);

const parcels = ref([
  { code: 'PD-001', name: '科创智谷', area: 32.1, status: '闲置', efficiency: 32 },
  { code: 'PD-002', name: '机场北物流', area: 28.4, status: '低效', efficiency: 45 },
  { code: 'PD-003', name: '老港工业园', area: 41.2, status: '存量工业', efficiency: 58 },
  { code: 'PD-004', name: '南湾居住片', area: 19.5, status: '存量居住', efficiency: 72 },
  { code: 'PD-005', name: '江滩港口区', area: 23.7, status: '闲置', efficiency: 39 },
  { code: 'PD-006', name: '科普展览区', area: 15.6, status: '低效', efficiency: 44 },
]);

const ledger = ref([
  { code: 'PD-001', name: '科创智谷', tags: ['创新', '科技孵化'], flag: 'warning', flagLabel: '闲置' },
  { code: 'PD-002', name: '机场北物流', tags: ['物流', '近机场'], flag: 'warning', flagLabel: '低效' },
  { code: 'PD-003', name: '老港工业园', tags: ['工业', '可更新'], flag: 'info', flagLabel: '盘活中' },
  { code: 'PD-004', name: '南湾居住片', tags: ['居住', '安置'], flag: 'success', flagLabel: '活化中' },
  { code: 'PD-005', name: '江滩港口区', tags: ['港口', '滨水'], flag: 'warning', flagLabel: '闲置' },
]);
</script>

<style scoped>
.section-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.btn-group {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.map-panel {
  background: linear-gradient(145deg, #e8f3ff, #f8fbff);
  border-radius: 12px;
  border: 1px dashed var(--border);
  padding: 14px;
  margin: 14px 0;
}

.map-placeholder {
  height: 180px;
  background: repeating-linear-gradient(
    135deg,
    rgba(46, 139, 255, 0.2),
    rgba(46, 139, 255, 0.2) 10px,
    rgba(255, 255, 255, 0.6) 10px,
    rgba(255, 255, 255, 0.6) 20px
  );
  border-radius: 10px;
  display: grid;
  place-items: center;
  color: #2e8bff;
  font-weight: 700;
}

.legend {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 10px;
}

.ledger {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 12px;
}

.ledger li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid var(--border);
  padding: 12px;
  border-radius: 10px;
}

@media (max-width: 1100px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
