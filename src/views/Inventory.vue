<template>
  <div class="module">
    <section class="summary">
      <div class="card">
        <div class="label">备件库存</div>
        <div class="value">256 件</div>
        <div class="trend">低库存 12 件</div>
      </div>
      <div class="card">
        <div class="label">出入库记录</div>
        <div class="value">38 条</div>
        <div class="trend">本周出库 15 次</div>
      </div>
      <div class="card">
        <div class="label">安全库存</div>
        <div class="value">82%</div>
        <div class="trend">需补货 4 项</div>
      </div>
    </section>

    <section class="actions">
      <button class="primary" @click="openModal('in')">备件入库</button>
      <button class="ghost" @click="openModal('out')">备件出库</button>
      <button class="ghost" @click="openModal('warning')">低库存预警</button>
      <button class="ghost" @click="openModal('progress')">库存盘点进度</button>
      <button class="ghost" @click="openModal('tip')">按钮提示信息</button>
    </section>

    <section class="panel">
      <div class="panel-header">
        <div class="panel-title">库存占用率</div>
        <div class="panel-subtitle">各仓位库存占用比例</div>
      </div>
      <div class="chart">
        <div v-for="item in chartData" :key="item.area" class="bar">
          <div class="bar-fill" :style="{ height: item.value + '%' }"></div>
          <span>{{ item.area }}</span>
          <em>{{ item.value }}%</em>
        </div>
      </div>
    </section>

    <section class="panel">
      <div class="panel-header">
        <div class="panel-title">备件库存明细</div>
        <div class="panel-subtitle">表数据共 {{ items.length }} 条</div>
      </div>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>备件编号</th>
              <th>名称</th>
              <th>库存</th>
              <th>安全库存</th>
              <th>仓位</th>
              <th>负责人</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in items" :key="item.id">
              <td>{{ item.id }}</td>
              <td>{{ item.name }}</td>
              <td>{{ item.stock }}</td>
              <td>{{ item.safe }}</td>
              <td>{{ item.area }}</td>
              <td>{{ item.owner }}</td>
              <td>
                <button class="link" @click="openModal('detail', item)">调整</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <div v-if="modal.visible" class="modal-backdrop">
      <div class="modal">
        <h3>{{ modal.title }}</h3>
        <p class="modal-message">{{ modal.message }}</p>

        <form v-if="modal.type === 'in'" class="modal-form">
          <input placeholder="备件编号" />
          <input placeholder="入库数量" />
          <input placeholder="供应商" />
        </form>

        <form v-if="modal.type === 'out'" class="modal-form">
          <input placeholder="备件编号" />
          <input placeholder="出库数量" />
          <input placeholder="领用部门" />
        </form>

        <form v-if="modal.type === 'warning'" class="modal-form">
          <input placeholder="预警对象" />
          <input placeholder="阈值" />
          <textarea rows="3" placeholder="通知说明"></textarea>
        </form>

        <div v-if="modal.type === 'progress'" class="progress">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: progress + '%' }"></div>
          </div>
          <div class="progress-text">盘点完成度 {{ progress }}%</div>
        </div>

        <div class="modal-actions">
          <button class="ghost" @click="closeModal">取消</button>
          <button class="primary" @click="confirmModal">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";

const chartData = [
  { area: "A区", value: 72 },
  { area: "B区", value: 64 },
  { area: "C区", value: 58 },
  { area: "D区", value: 81 },
  { area: "E区", value: 69 },
  { area: "F区", value: 55 }
];

const items = Array.from({ length: 20 }, (_, index) => ({
  id: `SP-${300 + index}`,
  name: `密封件-${index + 1}`,
  stock: 40 - (index % 8),
  safe: 20,
  area: `仓位-${(index % 6) + 1}`,
  owner: ["赵工", "胡工", "谢工", "陶工"][index % 4]
}));

const modal = reactive({
  visible: false,
  title: "",
  message: "",
  type: "",
  payload: null
});

const progress = ref(73);

const openModal = (type, payload = null) => {
  modal.type = type;
  modal.payload = payload;
  modal.visible = true;
  if (type === "in") {
    modal.title = "备件入库";
    modal.message = "登记入库数量与供应商。";
  }
  if (type === "out") {
    modal.title = "备件出库";
    modal.message = "记录领用部门与出库数量。";
  }
  if (type === "warning") {
    modal.title = "低库存预警";
    modal.message = "配置低库存阈值并发送提醒。";
  }
  if (type === "progress") {
    modal.title = "库存盘点进度";
    modal.message = "实时查看盘点完成度。";
  }
  if (type === "detail") {
    modal.title = "库存调整";
    modal.message = `备件 ${payload.name} 当前库存 ${payload.stock} 件。`;
  }
  if (type === "tip") {
    modal.title = "提示信息";
    modal.message = "请对低于安全库存的备件及时补货。";
  }
};

const closeModal = () => {
  modal.visible = false;
};

const confirmModal = () => {
  modal.visible = false;
};
</script>

<style scoped>
.module {
  display: grid;
  gap: 24px;
}

.summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.card {
  background: #fff;
  padding: 18px;
  border-radius: 16px;
  box-shadow: 0 12px 20px rgba(15, 23, 42, 0.08);
}

.label {
  color: #64748b;
  font-size: 13px;
}

.value {
  font-size: 24px;
  font-weight: 700;
  margin: 8px 0 4px;
  color: #7c3aed;
}

.trend {
  font-size: 12px;
  color: #94a3b8;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.primary {
  height: 36px;
  border-radius: 10px;
  border: none;
  background: #7c3aed;
  color: #fff;
  padding: 0 16px;
  cursor: pointer;
}

.ghost {
  height: 36px;
  border-radius: 10px;
  border: 1px solid #ddd6fe;
  background: #f5f3ff;
  color: #6d28d9;
  padding: 0 16px;
  cursor: pointer;
}

.panel {
  background: #fff;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 12px 20px rgba(15, 23, 42, 0.08);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.panel-title {
  font-weight: 600;
}

.panel-subtitle {
  font-size: 13px;
  color: #94a3b8;
}

.chart {
  margin-top: 16px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
  gap: 16px;
  align-items: end;
}

.bar {
  background: #f1f5f9;
  border-radius: 12px;
  height: 150px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 8px;
  text-align: center;
  font-size: 12px;
  color: #475569;
}

.bar-fill {
  background: linear-gradient(180deg, #c4b5fd, #7c3aed);
  border-radius: 10px;
  width: 100%;
}

.bar span {
  margin-top: 8px;
}

.bar em {
  font-style: normal;
  font-weight: 600;
}

.table-wrapper {
  overflow-x: auto;
  margin-top: 16px;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

th,
td {
  padding: 10px 12px;
  border-bottom: 1px solid #e2e8f0;
  text-align: left;
}

.link {
  border: none;
  background: transparent;
  color: #7c3aed;
  cursor: pointer;
  padding: 0;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  z-index: 40;
}

.modal {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  width: min(420px, 100%);
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.2);
}

.modal-message {
  color: #475569;
}

.modal-form {
  display: grid;
  gap: 12px;
  margin: 16px 0;
}

.modal-form input,
.modal-form textarea {
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 8px 12px;
}

.progress {
  margin: 16px 0;
}

.progress-bar {
  height: 10px;
  background: #e2e8f0;
  border-radius: 999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #c4b5fd, #7c3aed);
}

.progress-text {
  margin-top: 8px;
  font-size: 13px;
  color: #475569;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
