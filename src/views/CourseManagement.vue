<template>
  <div class="grid" style="gap:16px">
    <div class="flex-between card" style="flex-wrap:wrap">
      <div>
        <div style="font-weight:700">课程管理</div>
        <p style="margin:4px 0;color:var(--muted)">课程排期、讲师与发布节奏集中管理，不重复展示模块信息。</p>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button class="button" @click="openAdd">新增课程</button>
        <button class="button secondary" @click="openProgress">批量发布</button>
        <button class="button secondary" @click="openHint('课程提醒：完整填写课程信息')">提示</button>
      </div>
    </div>

    <div class="card">
      <table class="table">
        <thead>
          <tr>
            <th>课程名</th>
            <th>讲师</th>
            <th>周期</th>
            <th>容量</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="course in courses" :key="course.id">
            <td>{{ course.title }}</td>
            <td>{{ course.teacher }}</td>
            <td>{{ course.schedule }}</td>
            <td>{{ course.capacity }} 人</td>
            <td><span class="badge" :class="course.status === '进行中' ? 'success' : 'warning'">{{ course.status }}</span></td>
            <td style="display:flex;gap:8px">
              <button class="button secondary" @click="openEdit(course)">编辑</button>
              <button class="button secondary" @click="openHint(`课程《${course.title}》提醒已发送`)">提醒</button>
              <button class="button secondary" @click="openHint(`已归档《${course.title}》`)" style="color:#d84315;border-color:#ffccbc">归档</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <ModalDialog :show="modal.add" title="新增课程" @close="modal.add=false">
      <div class="grid" style="grid-template-columns:1fr 1fr;gap:12px">
        <div>
          <label>课程名称</label>
          <input v-model="form.title" class="input" />
        </div>
        <div>
          <label>讲师</label>
          <input v-model="form.teacher" class="input" />
        </div>
        <div>
          <label>周期</label>
          <input v-model="form.schedule" class="input" />
        </div>
        <div>
          <label>容量</label>
          <input v-model.number="form.capacity" type="number" class="input" />
        </div>
      </div>
      <template #actions>
        <button class="button secondary" @click="modal.add=false">取消</button>
        <button class="button" @click="saveCourse">保存课程</button>
      </template>
    </ModalDialog>

    <ModalDialog :show="modal.edit" title="编辑课程" @close="modal.edit=false">
      <p style="margin-top:0">调整课程实时更新到课程表。</p>
      <div class="grid" style="grid-template-columns:1fr 1fr;gap:12px">
        <div>
          <label>课程名称</label>
          <input v-model="form.title" class="input" />
        </div>
        <div>
          <label>讲师</label>
          <input v-model="form.teacher" class="input" />
        </div>
        <div>
          <label>周期</label>
          <input v-model="form.schedule" class="input" />
        </div>
        <div>
          <label>容量</label>
          <input v-model.number="form.capacity" type="number" class="input" />
        </div>
      </div>
      <template #actions>
        <button class="button secondary" @click="modal.edit=false">取消</button>
        <button class="button" @click="saveCourse">更新</button>
      </template>
    </ModalDialog>

    <ModalDialog :show="modal.progress" title="批量发布" @close="modal.progress=false">
      <p>正在同步到教学日历，请等待完成。</p>
      <div class="progress">
        <div class="progress-bar" :style="{ width: publishProgress + '%' }"></div>
      </div>
    </ModalDialog>

    <ModalDialog :show="modal.hint" title="提示" @close="modal.hint=false">
      <p style="margin:0">{{ hintText }}</p>
    </ModalDialog>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const courses = ref([
  { id: 1, title: '乡村公共空间优化', teacher: '李青松', schedule: '周二晚', capacity: 35, status: '进行中' },
  { id: 2, title: '夜间景观灯光设计', teacher: '王宁', schedule: '周四晚', capacity: 30, status: '进行中' },
  { id: 3, title: '生态材料运用', teacher: '许凡', schedule: '周六上午', capacity: 26, status: '进行中' },
  { id: 4, title: '数字化测绘', teacher: '陈婧', schedule: '周日全天', capacity: 40, status: '未开始' },
  { id: 5, title: '文化场景叙事', teacher: '张艺', schedule: '周三晚', capacity: 28, status: '进行中' },
  { id: 6, title: '乡土建筑修缮', teacher: '杨舟', schedule: '周五晚', capacity: 24, status: '未开始' },
  { id: 7, title: '村落交通微更新', teacher: '刘岚', schedule: '周二上午', capacity: 32, status: '进行中' },
  { id: 8, title: '水系治理演练', teacher: '罗晗', schedule: '周三下午', capacity: 30, status: '进行中' },
  { id: 9, title: '乡村文创孵化', teacher: '周思', schedule: '周一晚', capacity: 25, status: '未开始' },
  { id: 10, title: '社区共建共治', teacher: '赵元', schedule: '周日下午', capacity: 36, status: '进行中' }
]);

const modal = reactive({ add: false, edit: false, progress: false, hint: false });
const form = reactive({ id: null, title: '', teacher: '', schedule: '', capacity: 30 });
const hintText = ref('');
const publishProgress = ref(18);

const resetForm = () => {
  form.id = null;
  form.title = '';
  form.teacher = '';
  form.schedule = '';
  form.capacity = 30;
};

const openAdd = () => {
  resetForm();
  modal.add = true;
};

const openEdit = (course) => {
  Object.assign(form, course);
  modal.edit = true;
};

const saveCourse = () => {
  if (form.id) {
    const index = courses.value.findIndex((c) => c.id === form.id);
    courses.value[index] = { ...form };
  } else {
    const newId = Math.max(...courses.value.map((c) => c.id)) + 1;
    courses.value.push({ ...form, id: newId, status: '未开始' });
  }
  modal.add = false;
  modal.edit = false;
  openHint('课程信息已保存');
};

const openProgress = () => {
  modal.progress = true;
  publishProgress.value = 18;
  const timer = setInterval(() => {
    publishProgress.value += 18;
    if (publishProgress.value >= 100) {
      publishProgress.value = 100;
      clearInterval(timer);
      setTimeout(() => (modal.progress = false), 600);
    }
  }, 280);
};

const openHint = (text) => {
  hintText.value = text;
  modal.hint = true;
};
</script>
