<template>
  <div class="module">
    <div class="actions">
      <div>
        <h2>片区基础信息与更新档案</h2>
        <p>统一管理范围、现状、规划指标与历史档案，形成权威数据库。</p>
      </div>
      <div class="action-buttons">
        <button @click="openAdd">新增档案</button>
        <button class="ghost" @click="openImport">导入历史</button>
        <button class="ghost" @click="openExport">导出清单</button>
      </div>
    </div>

    <div class="stats">
      <div class="stat" v-for="card in stats" :key="card.label">
        <div class="label">{{ card.label }}</div>
        <div class="value">{{ card.value }}</div>
        <div class="bar"><span :style="{ width: card.rate + '%' }"></span></div>
      </div>
    </div>

    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>片区名称</th>
            <th>面积（公顷）</th>
            <th>户数</th>
            <th>规划容积率</th>
            <th>权属</th>
            <th>档案更新时间</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in archiveList" :key="item.name">
            <td>{{ item.name }}</td>
            <td>{{ item.area }}</td>
            <td>{{ item.households }}</td>
            <td>{{ item.plotRatio }}</td>
            <td>{{ item.owner }}</td>
            <td>{{ item.updated }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="modal.visible" class="modal-mask">
      <div class="modal">
        <h3>{{ modal.title }}</h3>
        <p class="desc">{{ modal.desc }}</p>

        <div v-if="modal.type === 'add'" class="form-grid">
          <label>片区名称<input v-model="form.name" placeholder="如：未来科创社区" /></label>
          <label>规划用地<input v-model="form.area" placeholder="如：58" /></label>
          <label>户数<input v-model="form.households" placeholder="如：1600" /></label>
          <label>容积率<input v-model="form.plotRatio" placeholder="如：3.2" /></label>
          <label>权属<input v-model="form.owner" placeholder="如：市属国企" /></label>
        </div>

        <div v-else class="info-box">
          <p v-for="tip in modal.tips" :key="tip">• {{ tip }}</p>
        </div>

        <div class="actions-row">
          <button class="ghost" @click="modal.visible = false">取消</button>
          <button @click="confirmModal">确认</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const stats = [
  { label: '纳入片区', value: '24个', rate: 92 },
  { label: '完成档案', value: '21个', rate: 84 },
  { label: '规划指标校核', value: '18个', rate: 75 }
];

const archiveList = ref([
  { name: '未来科创社区', area: 58, households: 1600, plotRatio: 3.2, owner: '市属国企', updated: '2024-05-12' },
  { name: '港湾湾区', area: 73, households: 2100, plotRatio: 2.8, owner: '区属国企', updated: '2024-05-10' },
  { name: '旧城活力核', area: 45, households: 1300, plotRatio: 3.5, owner: '混合所有', updated: '2024-05-08' },
  { name: '滨河示范片', area: 66, households: 1750, plotRatio: 2.9, owner: '市属国企', updated: '2024-05-06' },
  { name: '大学科教城', area: 82, households: 2400, plotRatio: 3.1, owner: '高校', updated: '2024-05-04' },
  { name: '生态慢行圈', area: 38, households: 980, plotRatio: 2.5, owner: '集体', updated: '2024-05-02' },
  { name: '国际社区', area: 52, households: 1420, plotRatio: 2.7, owner: '社会资本', updated: '2024-05-01' },
  { name: '产城融合港', area: 70, households: 1950, plotRatio: 3.0, owner: '市属国企', updated: '2024-04-29' },
  { name: '文化记忆轴', area: 40, households: 1200, plotRatio: 2.6, owner: '文旅集团', updated: '2024-04-27' },
  { name: '交通枢纽圈', area: 64, households: 1800, plotRatio: 3.4, owner: '轨道公司', updated: '2024-04-26' },
  { name: '青年友好区', area: 55, households: 1650, plotRatio: 2.9, owner: '社会资本', updated: '2024-04-24' },
  { name: '公共服务先导区', area: 47, households: 1400, plotRatio: 2.7, owner: '市属国企', updated: '2024-04-22' },
  { name: '开放街区', area: 36, households: 980, plotRatio: 2.3, owner: '集体', updated: '2024-04-20' },
  { name: '产业共建区', area: 69, households: 1900, plotRatio: 3.2, owner: '合作平台', updated: '2024-04-18' },
  { name: '绿色低碳园', area: 59, households: 1500, plotRatio: 2.4, owner: '市属国企', updated: '2024-04-16' },
  { name: '复合社区', area: 44, households: 1280, plotRatio: 2.8, owner: '社会资本', updated: '2024-04-14' },
  { name: '智慧宜居岛', area: 62, households: 1700, plotRatio: 2.9, owner: '运营公司', updated: '2024-04-12' },
  { name: '创新走廊', area: 77, households: 2100, plotRatio: 3.3, owner: '市属国企', updated: '2024-04-10' },
  { name: '未来城央', area: 80, households: 2300, plotRatio: 3.0, owner: '社会资本', updated: '2024-04-08' },
  { name: '山水邻里', area: 35, households: 920, plotRatio: 2.1, owner: '集体', updated: '2024-04-06' },
  { name: '交通门户区', area: 68, households: 1820, plotRatio: 3.1, owner: '轨道公司', updated: '2024-04-05' }
]);

const modal = reactive({ visible: false, title: '', desc: '', type: 'add', tips: [] });
const form = reactive({ name: '', area: '', households: '', plotRatio: '', owner: '' });

const openAdd = () => {
  modal.visible = true;
  modal.type = 'add';
  modal.title = '新增片区档案';
  modal.desc = '补充基础信息并纳入档案库，支持全过程监测。';
};

const openImport = () => {
  modal.visible = true;
  modal.type = 'info';
  modal.title = '导入历史档案';
  modal.desc = '导入既有资料，自动校验数据完整性与范围一致性。';
  modal.tips = ['支持Excel/CSV上传', '自动匹配权属与规划指标', '导入后生成校验报告'];
};

const openExport = () => {
  modal.visible = true;
  modal.type = 'info';
  modal.title = '导出清单';
  modal.desc = '导出当前检索结果，供评审或档案备份使用。';
  modal.tips = ['可筛选字段导出', '包含时间戳与责任人', '导出完成后推送至邮箱'];
};

const confirmModal = () => {
  modal.visible = false;
  if (modal.type === 'add' && form.name) {
    archiveList.value.unshift({
      name: form.name,
      area: form.area || '-',
      households: form.households || '-',
      plotRatio: form.plotRatio || '-',
      owner: form.owner || '未定义',
      updated: new Date().toISOString().slice(0, 10)
    });
    form.name = form.area = form.households = form.plotRatio = form.owner = '';
  }
};
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.actions {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

h2 {
  margin: 0;
}

p {
  margin: 6px 0 0;
  color: #6b7280;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

button {
  padding: 10px 16px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  background: linear-gradient(90deg, #38bdf8, #3b82f6);
  color: #fff;
  box-shadow: 0 10px 30px rgba(59, 130, 246, 0.25);
}

button.ghost {
  background: #e5edff;
  color: #3157c3;
  box-shadow: none;
}

.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
}

.stat {
  background: #f8fbff;
  border: 1px solid #e5edff;
  border-radius: 12px;
  padding: 12px;
}

.label {
  color: #6b7280;
  font-size: 13px;
}

.value {
  font-size: 22px;
  font-weight: 700;
}

.bar {
  margin-top: 8px;
  background: #e5edff;
  height: 8px;
  border-radius: 10px;
  overflow: hidden;
}

.bar span {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, #22d3ee, #3b82f6);
}

.table-wrapper {
  overflow: auto;
  border: 1px solid #e5edff;
  border-radius: 14px;
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 760px;
}

th, td {
  padding: 10px 12px;
  text-align: left;
  border-bottom: 1px solid #edf2fb;
}

th {
  background: #f3f7ff;
  font-weight: 700;
}

.modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal {
  background: #fff;
  padding: 18px;
  border-radius: 12px;
  width: 520px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
}

.desc {
  color: #6b7280;
  margin: 6px 0 12px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 10px;
}

.form-grid label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: #4b5563;
  font-size: 13px;
}

.form-grid input {
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #d8e2f2;
}

.info-box {
  background: #f5f7ff;
  border: 1px dashed #c7d2fe;
  border-radius: 10px;
  padding: 12px;
  color: #4b5563;
}

.actions-row {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 14px;
}
</style>
