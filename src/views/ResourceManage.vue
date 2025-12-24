<template>
  <div class="grid">
    <ChartPanel
      title="主体活跃度"
      subtitle="上周数据"
      :labels="chartLabels"
      :values="chartValues"
    />
    <div class="card">
      <div class="section-title">
        <h3>主体清单</h3>
        <div class="actions">
          <button class="btn" @click="showAdd = true">新增主体</button>
          <button class="btn secondary" @click="startSync">同步资源</button>
          <button class="btn ghost" @click="showInfo = true">操作提示</button>
        </div>
      </div>
      <div class="table-wrapper">
        <table class="table">
          <thead>
            <tr>
              <th>主体名称</th>
              <th>类型</th>
              <th>地区</th>
              <th>联系人</th>
              <th class="hide-mobile">供应能力</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in subjectList" :key="row.name">
              <td>{{ row.name }}</td>
              <td>{{ row.type }}</td>
              <td>{{ row.region }}</td>
              <td>{{ row.contact }}</td>
              <td class="hide-mobile">{{ row.capacity }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <BaseModal v-model="showAdd" title="新增主体">
    <div class="form-grid">
      <label>主体名称<input v-model="form.name" placeholder="如：杨柳村果蔬合作社" /></label>
      <label>类型
        <select v-model="form.type">
          <option>合作社</option>
          <option>家庭农场</option>
          <option>村集体</option>
        </select>
      </label>
      <label>所属地区<input v-model="form.region" placeholder="省/市/县" /></label>
      <label>联系人<input v-model="form.contact" placeholder="负责人" /></label>
      <label class="full-width">供货描述<textarea v-model="form.note" rows="3" placeholder="填写产能、品类"></textarea></label>
    </div>
    <template #actions>
      <button class="btn ghost" @click="showAdd = false">取消</button>
      <button class="btn" @click="saveSubject">保存</button>
    </template>
  </BaseModal>

  <BaseModal v-model="showInfo" title="资源整合小提示">
    <div class="toast">同步时自动校验主体身份证、合作社备案与供货证明，确保资源合规。</div>
  </BaseModal>

  <BaseModal v-model="showProgress" title="正在同步资源">
    <p>系统正在校验主体资质与供货标签……</p>
    <div class="progress-bar"><div class="progress-bar__fill" :style="{ width: progress + '%' }"></div></div>
    <p>{{ progress }}% 已完成</p>
  </BaseModal>
</template>

<script setup>
import { reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';
import ChartPanel from '../components/ChartPanel.vue';

const showAdd = ref(false);
const showInfo = ref(false);
const showProgress = ref(false);
const progress = ref(0);
const form = reactive({ name: '', type: '合作社', region: '', contact: '', note: '' });

const chartLabels = ['茶叶', '蔬菜', '菌菇', '水产', '粮油', '药材', '水果'];
const chartValues = [70, 85, 60, 50, 76, 63, 90];

const subjectList = ref([
  { name: '松林茶叶基地', type: '家庭农场', region: '福建南平', contact: '陈鑫', capacity: '春茶15吨' },
  { name: '清源果蔬合作社', type: '合作社', region: '四川眉山', contact: '刘玉', capacity: '青见橘每周20吨' },
  { name: '稻花香稻谷库', type: '村集体', region: '黑龙江五常', contact: '孙亮', capacity: '稻米年500吨' },
  { name: '润禾食用菌园区', type: '合作社', region: '河南南阳', contact: '徐田', capacity: '香菇日产3吨' },
  { name: '竹里笋业', type: '家庭农场', region: '浙江安吉', contact: '葛琳', capacity: '春笋日供800斤' },
  { name: '白云土鸡蛋场', type: '家庭农场', region: '湖南邵阳', contact: '吴立', capacity: '蛋类月12万枚' },
  { name: '蒲江猕猴桃联合社', type: '合作社', region: '四川蒲江', contact: '王安', capacity: '猕猴桃月40吨' },
  { name: '岭南药材基地', type: '村集体', region: '广西玉林', contact: '苏颖', capacity: '三七、罗汉果' },
  { name: '槐林蜂场', type: '家庭农场', region: '山东泰安', contact: '杜林', capacity: '蜂蜜年6吨' },
  { name: '江源水产', type: '合作社', region: '江西九江', contact: '黎航', capacity: '鳜鱼月15吨' }
]);

const saveSubject = () => {
  if (!form.name) return;
  subjectList.value.unshift({ ...form });
  showAdd.value = false;
};

const startSync = () => {
  progress.value = 0;
  showProgress.value = true;
  const timer = setInterval(() => {
    progress.value += 20;
    if (progress.value >= 100) {
      progress.value = 100;
      clearInterval(timer);
      setTimeout(() => (showProgress.value = false), 700);
    }
  }, 400);
};
</script>

<style scoped>
.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.full-width {
  grid-column: 1 / -1;
}
</style>
