<template>
  <div class="page-container">
    <div class="grid assets-grid">
      <div class="card">
        <div class="section-header">
          <h2 class="section-title">权属确权概览</h2>
          <div class="actions">
            <button class="button" @click="openModal('archive')">新建确权档案</button>
            <button class="button secondary" @click="openModal('verify')">批量核验</button>
          </div>
        </div>
        <div class="grid stats-grid">
          <div class="stat">
            <strong>2,340</strong>
            <span>已建档地块</span>
          </div>
          <div class="stat">
            <strong>182</strong>
            <span>待确权</span>
          </div>
          <div class="stat">
            <strong>98%</strong>
            <span>权属核验通过</span>
          </div>
          <div class="stat">
            <strong>36</strong>
            <span>权属变更留痕</span>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="section-header">
          <h2 class="section-title">地块分布示意</h2>
          <button class="button ghost" @click="openModal('map')">更新地图</button>
        </div>
        <div class="map">
          <div v-for="parcel in parcels" :key="parcel.id" class="parcel" :style="{ background: parcel.color }">
            <div>
              <strong>{{ parcel.name }}</strong>
              <span>{{ parcel.area }}亩</span>
            </div>
            <small>{{ parcel.type }}</small>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="section-header">
        <h2 class="section-title">地块确权台账</h2>
        <div class="actions">
          <button class="button" @click="openModal('merge')">地块分合并</button>
          <button class="button secondary" @click="openModal('change')">权属变更登记</button>
          <button class="button ghost" @click="openModal('tips')">提示</button>
        </div>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>地块编号</th>
            <th>位置</th>
            <th>面积</th>
            <th>地类</th>
            <th>权属状态</th>
            <th>经营主体</th>
            <th>核验批次</th>
            <th>链上凭证</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in landTable" :key="row.id">
            <td>{{ row.id }}</td>
            <td>{{ row.location }}</td>
            <td>{{ row.area }}</td>
            <td>{{ row.category }}</td>
            <td><span class="badge">{{ row.status }}</span></td>
            <td>{{ row.owner }}</td>
            <td>{{ row.batch }}</td>
            <td>{{ row.hash }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <ModalDialog :show="modal.show" :title="modal.title" @close="closeModal">
      <template v-if="modal.type === 'archive'">
        <div class="modal-form">
          <label>地块位置
            <input class="input" v-model="form.location" placeholder="乡镇/村组/坐标" />
          </label>
          <label>面积（亩）
            <input class="input" v-model="form.area" placeholder="请输入面积" />
          </label>
          <label>承包/经营权材料
            <input class="input" v-model="form.files" placeholder="上传材料清单" />
          </label>
          <label>权属核验方式
            <select class="input" v-model="form.verifyMode">
              <option>不动产登记联查</option>
              <option>村集体台账比对</option>
              <option>农村产权系统核验</option>
            </select>
          </label>
        </div>
      </template>
      <template v-else-if="modal.type === 'verify'">
        <div class="progress">
          <div class="progress-bar" :style="{ width: '62%' }"></div>
        </div>
        <p class="progress-text">已完成 31/50 条核验，比对结果将自动存证。</p>
      </template>
      <template v-else-if="modal.type === 'merge'">
        <div class="modal-form">
          <label>原地块编号
            <input class="input" v-model="form.origin" placeholder="多个编号以逗号分隔" />
          </label>
          <label>合并后面积
            <input class="input" v-model="form.mergeArea" placeholder="请输入合并面积" />
          </label>
          <label>合并原因
            <input class="input" v-model="form.reason" placeholder="例如：连片整理" />
          </label>
        </div>
      </template>
      <template v-else-if="modal.type === 'change'">
        <div class="modal-form">
          <label>变更地块编号
            <input class="input" v-model="form.changeId" placeholder="请输入地块编号" />
          </label>
          <label>新权属主体
            <input class="input" v-model="form.newOwner" placeholder="合作社/农户" />
          </label>
          <label>变更原因
            <input class="input" v-model="form.changeReason" placeholder="流转/继承/纠纷处理" />
          </label>
        </div>
      </template>
      <template v-else-if="modal.type === 'map'">
        <div class="modal-form">
          <label>数据来源
            <select class="input" v-model="form.mapSource">
              <option>农村产权系统</option>
              <option>不动产登记</option>
              <option>村集体台账</option>
            </select>
          </label>
          <label>同步范围
            <input class="input" v-model="form.mapScope" placeholder="请输入乡镇范围" />
          </label>
          <label>地图渲染级别
            <select class="input" v-model="form.mapLevel">
              <option>地块级</option>
              <option>村级</option>
              <option>县级</option>
            </select>
          </label>
        </div>
      </template>
      <template v-else>
        <p>提示：权属变更将自动生成历史版本，支持链上追溯。</p>
      </template>
      <template #footer>
        <button class="button secondary" type="button" @click="closeModal">取消</button>
        <button class="button" type="button" @click="confirmModal">提交</button>
      </template>
    </ModalDialog>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const parcels = [
  { id: 1, name: '东岭', area: 48, type: '水田', color: '#93c5fd' },
  { id: 2, name: '南湾', area: 62, type: '旱地', color: '#bae6fd' },
  { id: 3, name: '北坡', area: 39, type: '林地', color: '#bfdbfe' },
  { id: 4, name: '西河', area: 51, type: '果园', color: '#60a5fa' },
  { id: 5, name: '松岭', area: 74, type: '茶园', color: '#93c5fd' },
  { id: 6, name: '河谷', area: 56, type: '水田', color: '#7dd3fc' }
];

const landTable = Array.from({ length: 22 }, (_, index) => ({
  id: `LD-${2024}${String(index + 1).padStart(3, '0')}`,
  location: ['清河镇', '石湾镇', '东山镇', '莲花镇'][index % 4],
  area: `${32 + index}亩`,
  category: ['水田', '旱地', '林地'][index % 3],
  status: ['已确权', '待补证', '核验中'][index % 3],
  owner: ['春晖合作社', '丰收家庭农场', '富民农户'][index % 3],
  batch: `QY-${String(110 + index)}`,
  hash: `0x${(58000 + index).toString(16)}`
}));

const modal = reactive({
  show: false,
  type: 'tips',
  title: ''
});

const form = reactive({
  location: '',
  area: '',
  files: '',
  verifyMode: '不动产登记联查',
  origin: '',
  mergeArea: '',
  reason: '',
  changeId: '',
  newOwner: '',
  changeReason: '',
  mapSource: '农村产权系统',
  mapScope: '',
  mapLevel: '地块级'
});

const openModal = (type) => {
  modal.show = true;
  modal.type = type;
  modal.title =
    type === 'archive'
      ? '新建农地确权档案'
      : type === 'verify'
        ? '权属批量核验进度'
        : type === 'merge'
          ? '地块分合并申请'
          : type === 'change'
            ? '权属变更留痕登记'
            : type === 'map'
              ? '地块地图同步'
              : '按钮提示';
};

const closeModal = () => {
  modal.show = false;
};

const confirmModal = () => {
  modal.show = false;
};
</script>

<style scoped>
.assets-grid {
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  margin-bottom: 20px;
}

.stats-grid {
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  margin-top: 12px;
}

.stat {
  background: #f8fafc;
  border-radius: 12px;
  padding: 12px;
  display: grid;
  gap: 4px;
}

.stat strong {
  font-size: 20px;
}

.stat span {
  color: #64748b;
  font-size: 12px;
}

.map {
  display: grid;
  gap: 12px;
}

.parcel {
  padding: 12px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #0f172a;
}

.parcel span {
  display: block;
  color: #1e3a8a;
  font-size: 12px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}

.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.modal-form {
  display: grid;
  gap: 12px;
  font-size: 14px;
  color: #475569;
}

.modal-form label {
  display: grid;
  gap: 6px;
}

.progress {
  width: 100%;
  height: 10px;
  border-radius: 999px;
  background: #e2e8f0;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #22d3ee, #3b82f6);
}

.progress-text {
  margin-top: 12px;
  color: #64748b;
  font-size: 13px;
}
</style>
