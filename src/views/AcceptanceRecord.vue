<template>
  <div class="card">
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <div>
        <h2 class="header-title">验收记录与问题跟踪</h2>
        <p class="subtle">记录缺陷、整改与复验</p>
      </div>
      <div style="display: flex; gap: 10px;">
        <button class="button" @click="openModal('record')">新增记录</button>
        <button class="button secondary" @click="openModal('remind')">提醒整改</button>
      </div>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th>记录编号</th>
          <th>区域</th>
          <th>问题描述</th>
          <th>责任人</th>
          <th>状态</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in records" :key="item.id">
          <td>{{ item.id }}</td>
          <td>{{ item.area }}</td>
          <td>{{ item.desc }}</td>
          <td>{{ item.owner }}</td>
          <td><span class="badge">{{ item.status }}</span></td>
          <td><button class="button secondary" @click="openDetail(item)">处理</button></td>
        </tr>
      </tbody>
    </table>
  </div>

  <div v-if="modal === 'record'" class="modal-backdrop">
    <div class="modal">
      <h3>新增验收记录</h3>
      <form @submit.prevent="addRecord">
        <div class="form-group">
          <label>区域</label>
          <input v-model="form.area" required />
        </div>
        <div class="form-group">
          <label>问题描述</label>
          <textarea v-model="form.desc" rows="3" required></textarea>
        </div>
        <div class="form-group">
          <label>责任人</label>
          <input v-model="form.owner" required />
        </div>
        <div class="form-group">
          <label>状态</label>
          <select v-model="form.status">
            <option>待整改</option>
            <option>整改中</option>
            <option>复验通过</option>
          </select>
        </div>
        <div style="display: flex; gap: 10px; justify-content: flex-end;">
          <button class="button secondary" type="button" @click="closeModal">取消</button>
          <button class="button" type="submit">保存</button>
        </div>
      </form>
    </div>
  </div>

  <div v-if="modal === 'detail'" class="modal-backdrop">
    <div class="modal">
      <h3>问题处理</h3>
      <p class="subtle">{{ current?.desc }}</p>
      <div class="form-group">
        <label>整改进展</label>
        <textarea v-model="current.solution" rows="3"></textarea>
      </div>
      <div class="form-group">
        <label>状态</label>
        <select v-model="current.status">
          <option>待整改</option>
          <option>整改中</option>
          <option>复验通过</option>
        </select>
      </div>
      <div class="form-group">
        <label>上传照片</label>
        <input type="file" />
      </div>
      <div style="display: flex; gap: 10px; justify-content: flex-end;">
        <button class="button secondary" @click="closeModal">关闭</button>
        <button class="button" @click="saveDetail">提交结果</button>
      </div>
    </div>
  </div>

  <div v-if="modal === 'remind'" class="modal-backdrop">
    <div class="modal">
      <h3>提醒整改</h3>
      <p class="subtle">发送到责任人企业微信</p>
      <div class="form-group">
        <label>选择记录</label>
        <select v-model="remindId">
          <option v-for="item in records" :key="item.id" :value="item.id">{{ item.id }} - {{ item.owner }}</option>
        </select>
      </div>
      <div class="form-group">
        <label>提醒内容</label>
        <textarea rows="3" placeholder="请于今日18点前完成现场整改" />
      </div>
      <div class="progress-bar" style="margin: 12px 0;">
        <div class="progress-bar__value" style="width: 66%"></div>
      </div>
      <div style="display: flex; gap: 10px; justify-content: flex-end;">
        <button class="button secondary" @click="closeModal">取消</button>
        <button class="button" @click="closeModal">发送提醒</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const records = reactive([
  { id: 'AC-001', area: 'B2 车库A区', desc: '喷淋末端试水不畅', owner: '王强', status: '整改中', solution: '' },
  { id: 'AC-002', area: 'B1 电梯厅', desc: '导向标识缺失', owner: '李倩', status: '待整改', solution: '' },
  { id: 'AC-003', area: '泵房', desc: '水泵减震垫未安装', owner: '刘伟', status: '待整改', solution: '' },
  { id: 'AC-004', area: '坡道', desc: '防滑条间距不符', owner: '赵云', status: '整改中', solution: '' },
  { id: 'AC-005', area: '人防区', desc: '人防门闭锁不严', owner: '陈浩', status: '待整改', solution: '' },
  { id: 'AC-006', area: '弱电间', desc: '桥架未做防火封堵', owner: '周晨', status: '待整改', solution: '' },
  { id: 'AC-007', area: '设备层', desc: '排烟机振动偏大', owner: '孙悦', status: '整改中', solution: '' },
  { id: 'AC-008', area: '车库B区', desc: '照明切换延时', owner: '黄雷', status: '待整改', solution: '' },
  { id: 'AC-009', area: '风机房', desc: '风阀复位不及时', owner: '蒋勇', status: '待整改', solution: '' },
  { id: 'AC-010', area: '管井', desc: '管线标识缺失', owner: '张敏', status: '整改中', solution: '' }
]);

const modal = ref('');
const current = ref(null);
const remindId = ref('AC-001');
const form = reactive({ area: '', desc: '', owner: '', status: '待整改' });

const openModal = (type) => {
  modal.value = type;
};

const closeModal = () => {
  modal.value = '';
};

const addRecord = () => {
  records.push({ id: `AC-${(records.length + 1).toString().padStart(3, '0')}`, ...form });
  Object.assign(form, { area: '', desc: '', owner: '', status: '待整改' });
  closeModal();
};

const openDetail = (item) => {
  current.value = item;
  modal.value = 'detail';
};

const saveDetail = () => {
  closeModal();
};
</script>
