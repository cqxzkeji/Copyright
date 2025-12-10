<template>
  <div class="card">
    <div class="flex-between">
      <div>
        <h2>畜牧档案管理</h2>
        <p class="muted">集中管理耳标信息、品种、饲养阶段与负责人。</p>
      </div>
      <div class="flex-between" style="gap: 8px;">
        <button class="button" @click="openAdd">新增档案</button>
        <button class="button secondary" @click="openImport">批量导入</button>
      </div>
    </div>
    <div class="chart-row">
      <div class="card">
        <h4>品种分布</h4>
        <div class="progress" v-for="breed in breedStats" :key="breed.name" style="margin-bottom: 8px;">
          <span :style="{ width: breed.percent + '%' }"></span>
        </div>
        <div class="muted" v-for="breed in breedStats" :key="breed.name + '-label'">{{ breed.name }} · {{ breed.count }}头 ({{ breed.percent }}%)</div>
      </div>
      <div class="card">
        <h4>阶段统计</h4>
        <div class="progress" v-for="stage in stageStats" :key="stage.name" style="margin-bottom: 8px;">
          <span :style="{ width: stage.percent + '%' }"></span>
        </div>
        <div class="muted" v-for="stage in stageStats" :key="stage.name + '-label'">{{ stage.name }} · {{ stage.count }}头 ({{ stage.percent }}%)</div>
      </div>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th>耳标号</th>
          <th>品种</th>
          <th>年龄(月)</th>
          <th>阶段</th>
          <th>负责人</th>
          <th>健康状态</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="animal in animals" :key="animal.id">
          <td>{{ animal.tag }}</td>
          <td>{{ animal.breed }}</td>
          <td>{{ animal.age }}</td>
          <td>{{ animal.stage }}</td>
          <td>{{ animal.manager }}</td>
          <td><span class="badge">{{ animal.health }}</span></td>
          <td>
            <button class="button secondary" @click="openEdit(animal)">编辑</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div v-if="showModal" class="modal-backdrop">
    <div class="modal">
      <h3>{{ editing ? '编辑档案' : '新增档案' }}</h3>
      <div class="form-grid">
        <label>耳标号 <input v-model="form.tag" required /></label>
        <label>品种 <input v-model="form.breed" /></label>
        <label>年龄(月) <input v-model.number="form.age" type="number" min="0" /></label>
        <label>阶段
          <select v-model="form.stage">
            <option>犊牛</option>
            <option>青年牛</option>
            <option>泌乳期</option>
            <option>育肥期</option>
          </select>
        </label>
        <label>负责人 <input v-model="form.manager" /></label>
        <label>健康状态
          <select v-model="form.health">
            <option>良好</option>
            <option>观察</option>
            <option>需复查</option>
          </select>
        </label>
      </div>
      <div class="flex-between" style="margin-top: 16px;">
        <button class="button secondary" @click="closeModal">取消</button>
        <button class="button" @click="saveRecord">保存</button>
      </div>
    </div>
  </div>

  <div v-if="importing" class="modal-backdrop">
    <div class="modal">
      <h3>批量导入</h3>
      <p class="muted">正在校验数据…</p>
      <div class="progress"><span :style="{ width: importProgress + '%' }"></span></div>
      <div class="flex-between" style="margin-top: 12px;">
        <span class="muted">{{ importProgress }}% 完成</span>
        <button class="button secondary" @click="finishImport">中止并关闭</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';

const animals = ref([
  { id: 1, tag: 'CN-1001', breed: '荷斯坦', age: 12, stage: '犊牛', manager: '李华', health: '良好' },
  { id: 2, tag: 'CN-1002', breed: '西门塔尔', age: 18, stage: '青年牛', manager: '王强', health: '观察' },
  { id: 3, tag: 'CN-1003', breed: '安格斯', age: 24, stage: '泌乳期', manager: '赵敏', health: '良好' },
  { id: 4, tag: 'CN-1004', breed: '夏洛来', age: 30, stage: '育肥期', manager: '陈浩', health: '良好' },
  { id: 5, tag: 'CN-1005', breed: '布拉曼', age: 20, stage: '青年牛', manager: '刘丽', health: '需复查' },
  { id: 6, tag: 'CN-1006', breed: '荷斯坦', age: 16, stage: '犊牛', manager: '孙杰', health: '良好' },
  { id: 7, tag: 'CN-1007', breed: '西门塔尔', age: 28, stage: '泌乳期', manager: '张伟', health: '观察' },
  { id: 8, tag: 'CN-1008', breed: '安格斯', age: 15, stage: '犊牛', manager: '李霞', health: '良好' },
  { id: 9, tag: 'CN-1009', breed: '夏洛来', age: 22, stage: '青年牛', manager: '邹宁', health: '良好' },
  { id: 10, tag: 'CN-1010', breed: '布拉曼', age: 26, stage: '育肥期', manager: '唐雪', health: '观察' },
  { id: 11, tag: 'CN-1011', breed: '荷斯坦', age: 19, stage: '青年牛', manager: '高源', health: '良好' }
]);

const showModal = ref(false);
const editing = ref(false);
const form = reactive({ id: null, tag: '', breed: '', age: 0, stage: '犊牛', manager: '', health: '良好' });
const importing = ref(false);
const importProgress = ref(0);
let timer;

const breedStats = computed(() => {
  const total = animals.value.length || 1;
  const map = animals.value.reduce((acc, curr) => {
    acc[curr.breed] = (acc[curr.breed] || 0) + 1;
    return acc;
  }, {});
  return Object.entries(map).map(([name, count]) => ({
    name,
    count,
    percent: Math.round((count / total) * 100)
  }));
});

const stageStats = computed(() => {
  const total = animals.value.length || 1;
  const map = animals.value.reduce((acc, curr) => {
    acc[curr.stage] = (acc[curr.stage] || 0) + 1;
    return acc;
  }, {});
  return Object.entries(map).map(([name, count]) => ({
    name,
    count,
    percent: Math.round((count / total) * 100)
  }));
});

const openAdd = () => {
  editing.value = false;
  Object.assign(form, { id: null, tag: '', breed: '', age: 0, stage: '犊牛', manager: '', health: '良好' });
  showModal.value = true;
};

const openEdit = (animal) => {
  editing.value = true;
  Object.assign(form, animal);
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const saveRecord = () => {
  if (editing.value) {
    const idx = animals.value.findIndex((a) => a.id === form.id);
    animals.value[idx] = { ...form };
  } else {
    animals.value.push({ ...form, id: Date.now() });
  }
  showModal.value = false;
};

const openImport = () => {
  importing.value = true;
  importProgress.value = 0;
  timer = setInterval(() => {
    if (importProgress.value >= 100) {
      finishImport();
    } else {
      importProgress.value += 20;
    }
  }, 500);
};

const finishImport = () => {
  clearInterval(timer);
  importing.value = false;
};
</script>
