<template>
  <div class="grid" style="grid-template-columns: 3fr 2fr; align-items: start;">
    <div class="card">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h2 class="header-title">验收标准</h2>
          <p class="subtle">地下室及裙楼公区标准条目</p>
        </div>
        <div style="display: flex; gap: 10px;">
          <button class="button" @click="openModal('add')">新增标准</button>
          <button class="button secondary" @click="openModal('import')">批量导入</button>
        </div>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>条目</th>
            <th>检查要点</th>
            <th>合格标准</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in standards" :key="item.id">
            <td>{{ item.category }}</td>
            <td>{{ item.point }}</td>
            <td>{{ item.criteria }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="card">
      <h3 class="header-title">清单模板</h3>
      <p class="subtle">导出前可快速预览</p>
      <ul>
        <li v-for="item in templates" :key="item.title">{{ item.title }} - {{ item.items }}项</li>
      </ul>
      <button class="button" style="margin-top: 12px;" @click="openModal('export')">导出清单</button>
    </div>
  </div>

  <div v-if="modal === 'add'" class="modal-backdrop">
    <div class="modal">
      <h3>新增标准条目</h3>
      <form @submit.prevent="addStandard">
        <div class="form-group">
          <label>条目</label>
          <input v-model="form.category" required />
        </div>
        <div class="form-group">
          <label>检查要点</label>
          <textarea v-model="form.point" rows="2" required></textarea>
        </div>
        <div class="form-group">
          <label>合格标准</label>
          <textarea v-model="form.criteria" rows="2" required></textarea>
        </div>
        <div style="display: flex; gap: 10px; justify-content: flex-end;">
          <button class="button secondary" type="button" @click="closeModal">取消</button>
          <button class="button" type="submit">添加</button>
        </div>
      </form>
    </div>
  </div>

  <div v-if="modal === 'import'" class="modal-backdrop">
    <div class="modal">
      <h3>批量导入</h3>
      <p class="subtle">上传Excel自动生成清单</p>
      <input type="file" accept=".xlsx,.xls" />
      <div class="progress-bar" style="margin: 12px 0;">
        <div class="progress-bar__value" style="width: 40%"></div>
      </div>
      <div style="display: flex; gap: 10px; justify-content: flex-end;">
        <button class="button secondary" @click="closeModal">取消</button>
        <button class="button" @click="closeModal">上传</button>
      </div>
    </div>
  </div>

  <div v-if="modal === 'export'" class="modal-backdrop">
    <div class="modal">
      <h3>导出清单</h3>
      <p class="subtle">包含当前所有标准条目</p>
      <div class="form-group">
        <label>导出格式</label>
        <select>
          <option>Excel</option>
          <option>PDF</option>
        </select>
      </div>
      <div class="form-group">
        <label>文件名</label>
        <input value="地下室验收清单" />
      </div>
      <div style="display: flex; gap: 10px; justify-content: flex-end;">
        <button class="button secondary" @click="closeModal">取消</button>
        <button class="button" @click="closeModal">确认导出</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const standards = reactive([
  { id: 1, category: '结构', point: '梁柱外观、蜂窝麻面', criteria: '无裂缝、平整度满足规范' },
  { id: 2, category: '防水', point: '底板、侧墙卷材搭接', criteria: '搭接宽度≥100mm，节点密封' },
  { id: 3, category: '排水', point: '集水坑泵位及坡度', criteria: '坡度均匀，排水通畅' },
  { id: 4, category: '消防', point: '喷淋末端、消火栓压力', criteria: '末端试水正常，压力达标' },
  { id: 5, category: '通风', point: '排烟风机、风阀联动', criteria: '联动逻辑正确，手自切换正常' },
  { id: 6, category: '电气', point: '照明回路绝缘', criteria: '绝缘电阻大于0.5MΩ', },
  { id: 7, category: '弱电', point: '消防报警、广播测试', criteria: '报警联动、语音清晰' },
  { id: 8, category: '装修', point: '车位划线、反光标识', criteria: '线型清晰、无缺口' },
  { id: 9, category: '安全', point: '防滑措施、扶手稳固', criteria: '踏步防滑可靠，扶手牢固' },
  { id: 10, category: '设备', point: '水泵基础、减震', criteria: '基础平整，减震垫完整' }
]);

const templates = [
  { title: '地下车库机电验收', items: 36 },
  { title: '消防联动专项', items: 24 },
  { title: '装修收口专项', items: 18 }
];

const modal = ref('');
const form = reactive({ category: '', point: '', criteria: '' });

const openModal = (type) => {
  modal.value = type;
};

const closeModal = () => {
  modal.value = '';
};

const addStandard = () => {
  standards.push({ id: standards.length + 1, ...form });
  Object.assign(form, { category: '', point: '', criteria: '' });
  closeModal();
};
</script>
