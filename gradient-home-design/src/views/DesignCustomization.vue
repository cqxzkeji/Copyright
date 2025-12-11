<template>
  <div class="grid" style="gap: 18px">
    <div class="card">
      <header class="section">
        <div>
          <p class="section-title">设计定制</p>
          <p class="hint">调整家具、材质与渐变色映射，让方案贴合客户需求。</p>
        </div>
        <button class="btn btn-primary" @click="openFormModal">提交定制请求</button>
      </header>
      <div class="responsive-row">
        <div class="card" style="background: linear-gradient(135deg,#f8fafc,#eef2ff);">
          <p class="section-title">材质映射</p>
          <p class="hint">渐变色同步到布艺、木饰面与金属条。</p>
          <button class="btn btn-secondary" @click="openMaterialModal">调整材质</button>
        </div>
        <div class="card" style="background: linear-gradient(135deg,#fff7ed,#fffbeb);">
          <p class="section-title">家具组合</p>
          <p class="hint">根据空间动线，组合沙发、茶几、灯具。</p>
          <button class="btn btn-secondary" @click="openFurnitureModal">调整组合</button>
        </div>
      </div>
    </div>

    <div class="card">
      <p class="section-title">方案定制记录（10 条）</p>
      <table class="table">
        <thead>
          <tr>
            <th>客户</th>
            <th>空间</th>
            <th>偏好</th>
            <th>进度</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in customRecords" :key="item.client + item.space">
            <td>{{ item.client }}</td>
            <td>{{ item.space }}</td>
            <td>{{ item.preference }}</td>
            <td>
              <div class="progress-bar" style="width: 140px"><span :style="{ width: item.progress + '%' }"></span></div>
            </td>
            <td><button class="btn btn-secondary" @click="track(item)">查看</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div v-if="showForm" class="modal-backdrop" @click.self="closeModals">
    <div class="modal">
      <header>
        <span>提交定制需求</span>
        <button class="btn btn-secondary" @click="closeModals">关闭</button>
      </header>
      <div class="body grid" style="gap: 10px">
        <label>客户姓名<input v-model="form.client" class="input" /></label>
        <label>空间类型<select v-model="form.space" class="input"><option>客厅</option><option>卧室</option><option>书房</option></select></label>
        <label>色彩偏好<textarea v-model="form.preference" rows="2" class="input"></textarea></label>
      </div>
      <footer>
        <button class="btn btn-secondary" @click="closeModals">取消</button>
        <button class="btn btn-primary" @click="submitForm">提交</button>
      </footer>
    </div>
  </div>

  <div v-if="showMaterial" class="modal-backdrop" @click.self="closeModals">
    <div class="modal">
      <header>
        <span>材质映射</span>
        <button class="btn btn-secondary" @click="closeModals">关闭</button>
      </header>
      <div class="body">
        <p>选择渐变套用的材质层级：</p>
        <label><input type="checkbox" v-model="materialMapping.fabric" /> 布艺</label>
        <label><input type="checkbox" v-model="materialMapping.wood" /> 木饰面</label>
        <label><input type="checkbox" v-model="materialMapping.metal" /> 金属条</label>
      </div>
      <footer>
        <button class="btn btn-primary" @click="closeModals">完成</button>
      </footer>
    </div>
  </div>

  <div v-if="showFurniture" class="modal-backdrop" @click.self="closeModals">
    <div class="modal">
      <header>
        <span>家具组合</span>
        <button class="btn btn-secondary" @click="closeModals">关闭</button>
      </header>
      <div class="body">
        <p>针对布局动线调整组合：</p>
        <label>沙发人数<select v-model="furniture.sofa" class="input"><option>双人</option><option>三人</option><option>转角</option></select></label>
        <label>灯光<select v-model="furniture.light" class="input"><option>落地灯</option><option>轨道灯</option><option>吊灯</option></select></label>
      </div>
      <footer>
        <button class="btn btn-primary" @click="closeModals">完成</button>
      </footer>
    </div>
  </div>

  <div v-if="showTracking" class="modal-backdrop" @click.self="closeModals">
    <div class="modal">
      <header>
        <span>进度跟踪</span>
        <button class="btn btn-secondary" @click="closeModals">关闭</button>
      </header>
      <div class="body">
        <p>{{ activeRecord.client }} · {{ activeRecord.space }}</p>
        <div class="progress-bar"><span :style="{ width: activeRecord.progress + '%' }"></span></div>
      </div>
      <footer>
        <button class="btn btn-primary" @click="closeModals">好的</button>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const customRecords = reactive([
  { client: '李先生', space: '客厅', preference: '暖橙+木纹', progress: 80 },
  { client: '王女士', space: '卧室', preference: '雾霾蓝+灰布艺', progress: 55 },
  { client: '刘小姐', space: '书房', preference: '绿蓝渐变', progress: 45 },
  { client: '陈先生', space: '儿童房', preference: '森林绿', progress: 30 },
  { client: '赵女士', space: '玄关', preference: '星云紫', progress: 65 },
  { client: '黄先生', space: '阳台', preference: '水岸蓝', progress: 75 },
  { client: '周小姐', space: '餐厅', preference: '麦田风', progress: 40 },
  { client: '孙先生', space: '卫浴', preference: '海雾灰', progress: 50 },
  { client: '吴女士', space: '厨房', preference: '极地光', progress: 35 },
  { client: '张小姐', space: '影音室', preference: '暮霭粉', progress: 60 }
]);

const showForm = ref(false);
const showMaterial = ref(false);
const showFurniture = ref(false);
const showTracking = ref(false);
const activeRecord = reactive({ client: '', space: '', progress: 0 });

const form = reactive({ client: '', space: '客厅', preference: '' });
const materialMapping = reactive({ fabric: true, wood: true, metal: false });
const furniture = reactive({ sofa: '三人', light: '轨道灯' });

const openFormModal = () => { showForm.value = true; };
const openMaterialModal = () => { showMaterial.value = true; };
const openFurnitureModal = () => { showFurniture.value = true; };

const submitForm = () => {
  customRecords.unshift({
    client: form.client || '新客户',
    space: form.space,
    preference: form.preference || '偏好未填写',
    progress: 20
  });
  closeModals();
};

const track = (record) => {
  Object.assign(activeRecord, record);
  showTracking.value = true;
};

const closeModals = () => {
  showForm.value = false;
  showMaterial.value = false;
  showFurniture.value = false;
  showTracking.value = false;
};
</script>

<style scoped>
.section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.responsive-row .card {
  box-shadow: none;
  border: 1px dashed #cbd5e1;
}
</style>
