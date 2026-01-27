<template>
  <section class="module">
    <div class="banner">
      <div>
        <h3>内外饰系统拆分</h3>
        <p>覆盖仪表板、门板、座椅、顶棚、保险杠、灯具等全生命周期BOM。</p>
      </div>
      <img :src="hero" alt="BOM示意" />
    </div>

    <div class="toolbar">
      <button class="primary" @click="modals.create = true">新增部件</button>
      <button class="ghost" @click="modals.bom = true">EBOM/MBOM关联</button>
      <button class="ghost" @click="modals.version = true">版本对比</button>
      <button class="ghost" @click="modals.material = true">材料配置</button>
      <button class="ghost" @click="modals.sync = true">BOM同步进度</button>
    </div>

    <div class="table-panel">
      <h3>内外饰部件清单</h3>
      <table>
        <thead>
          <tr>
            <th>部件编号</th>
            <th>系统</th>
            <th>版本</th>
            <th>材料/颜色</th>
            <th>EBOM</th>
            <th>MBOM</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in parts" :key="item.code">
            <td>{{ item.code }}</td>
            <td>{{ item.system }}</td>
            <td>{{ item.version }}</td>
            <td>{{ item.material }}</td>
            <td>{{ item.ebom }}</td>
            <td>{{ item.mbom }}</td>
            <td>{{ item.status }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>

  <BaseModal v-model="modals.create" title="新增零部件">
    <form class="modal-form">
      <label>
        部件名称
        <input placeholder="例如：仪表板上本体" />
      </label>
      <label>
        系统归属
        <select>
          <option>仪表板</option>
          <option>门板</option>
          <option>座椅</option>
          <option>顶棚</option>
          <option>保险杠</option>
        </select>
      </label>
      <label>
        版本号
        <input placeholder="V1.0" />
      </label>
      <label>
        关键特性
        <input placeholder="重量、装配间隙、纹理" />
      </label>
    </form>
    <template #footer>
      <button class="ghost" type="button" @click="modals.create = false">取消</button>
      <button class="primary" type="button" @click="modals.create = false">保存</button>
    </template>
  </BaseModal>

  <BaseModal v-model="modals.bom" title="EBOM/MBOM关联">
    <form class="modal-form">
      <label>
        选择EBOM
        <select>
          <option>EV3-INT-EBOM-003</option>
          <option>XN9-EXT-EBOM-021</option>
          <option>LR5-INT-EBOM-007</option>
        </select>
      </label>
      <label>
        选择MBOM
        <select>
          <option>EV3-INT-MBOM-002</option>
          <option>XN9-EXT-MBOM-014</option>
          <option>LR5-INT-MBOM-005</option>
        </select>
      </label>
      <label>
        关联说明
        <textarea rows="3" placeholder="注明工艺或装配差异"></textarea>
      </label>
    </form>
    <template #footer>
      <button class="ghost" type="button" @click="modals.bom = false">保存草稿</button>
      <button class="primary" type="button" @click="modals.bom = false">确认关联</button>
    </template>
  </BaseModal>

  <BaseModal v-model="modals.version" title="部件版本对比">
    <form class="modal-form">
      <label>
        对比版本A
        <select>
          <option>仪表板 V2.1</option>
          <option>门板 V1.4</option>
          <option>保险杠 V3.0</option>
        </select>
      </label>
      <label>
        对比版本B
        <select>
          <option>仪表板 V1.9</option>
          <option>门板 V1.2</option>
          <option>保险杠 V2.8</option>
        </select>
      </label>
      <label>
        差异说明
        <textarea rows="4" placeholder="重量、卡扣数量、表皮纹理"></textarea>
      </label>
    </form>
    <template #footer>
      <button class="ghost" type="button" @click="modals.version = false">导出比对表</button>
      <button class="primary" type="button" @click="modals.version = false">确认记录</button>
    </template>
  </BaseModal>

  <BaseModal v-model="modals.material" title="材料/颜色/表皮配置">
    <form class="modal-form">
      <label>
        材料
        <input placeholder="例如：PC+ABS" />
      </label>
      <label>
        颜色
        <input placeholder="深曜黑" />
      </label>
      <label>
        表皮纹理
        <input placeholder="N5 细纹" />
      </label>
      <label>
        适用部件
        <input placeholder="门板包覆/扶手" />
      </label>
    </form>
    <template #footer>
      <button class="ghost" type="button" @click="modals.material = false">取消</button>
      <button class="primary" type="button" @click="modals.material = false">保存配置</button>
    </template>
  </BaseModal>

  <BaseModal v-model="modals.sync" title="BOM同步进度" width="520px">
    <div class="progress-panel">
      <p>系统正在同步最新零部件版本与MBOM数据。</p>
      <div class="progress-row">
        <span>仪表板系统</span>
        <div class="progress"><div class="progress-fill" style="width: 68%"></div></div>
        <strong>68%</strong>
      </div>
      <div class="progress-row">
        <span>外饰系统</span>
        <div class="progress"><div class="progress-fill" style="width: 54%"></div></div>
        <strong>54%</strong>
      </div>
      <div class="progress-row">
        <span>座椅系统</span>
        <div class="progress"><div class="progress-fill" style="width: 83%"></div></div>
        <strong>83%</strong>
      </div>
    </div>
    <template #footer>
      <button class="ghost" type="button" @click="modals.sync = false">稍后查看</button>
      <button class="primary" type="button" @click="modals.sync = false">完成</button>
    </template>
  </BaseModal>
</template>

<script setup>
import { reactive } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const hero =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="560" height="200"><defs><linearGradient id="b" x1="0" y1="0" x2="1" y2="1"><stop stop-color="%23fef3c7" offset="0"/><stop stop-color="%23ffffff" offset="1"/></linearGradient></defs><rect width="560" height="200" rx="18" fill="url(%23b)"/><rect x="40" y="50" width="220" height="16" rx="8" fill="%23fcd34d"/><rect x="40" y="80" width="180" height="12" rx="6" fill="%23fde68a"/><rect x="40" y="110" width="240" height="12" rx="6" fill="%23fef3c7"/><circle cx="470" cy="100" r="56" fill="%23f59e0b" opacity="0.7"/></svg>';

const parts = Array.from({ length: 24 }, (_, index) => ({
  code: `TR-${index + 1}`.padStart(5, '0'),
  system: ['仪表板', '门板', '座椅', '顶棚', '保险杠', '灯具'][index % 6],
  version: `V${(index % 4) + 1}.${index % 3}`,
  material: ['PC+ABS/黑色', '真皮/米白', '织物/灰色', 'TPO/黑色'][index % 4],
  ebom: `EBOM-${100 + index}`,
  mbom: `MBOM-${80 + index}`,
  status: ['受控', '评审中', '冻结', '待验证'][index % 4]
}));

const modals = reactive({
  create: false,
  bom: false,
  version: false,
  material: false,
  sync: false
});
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.banner {
  background: #fff;
  border-radius: 16px;
  padding: 18px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 18px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
  align-items: center;
}

.banner img {
  width: 100%;
  border-radius: 14px;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.primary {
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 10px 16px;
  cursor: pointer;
}

.ghost {
  background: #e2e8f0;
  color: #1f2a44;
  border: none;
  border-radius: 10px;
  padding: 10px 16px;
  cursor: pointer;
}

.table-panel {
  background: #fff;
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
  overflow-x: auto;
}

.table-panel table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

th,
 td {
  padding: 10px 12px;
  border-bottom: 1px solid #eef2f7;
  text-align: left;
}

th {
  background: #f8fafc;
  font-weight: 600;
}

.modal-form {
  display: grid;
  gap: 12px;
}

.modal-form label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
}

.modal-form input,
.modal-form select,
.modal-form textarea {
  padding: 8px 10px;
  border-radius: 10px;
  border: 1px solid #dbe3f0;
  background: #f9fbff;
  font-family: inherit;
}

.progress-panel {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.progress-row {
  display: grid;
  grid-template-columns: 100px 1fr 50px;
  gap: 10px;
  align-items: center;
}

.progress {
  height: 8px;
  background: #e5e7eb;
  border-radius: 999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #fbbf24, #f97316);
}
</style>
