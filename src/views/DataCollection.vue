<script setup>
import { reactive, ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const sources = reactive([
  { name: 'CRM客户库', type: 'MySQL', status: '在线', last: '09:12', owner: '市场' },
  { name: '订单中心', type: 'PostgreSQL', status: '在线', last: '09:18', owner: '电商' },
  { name: '支付流水', type: 'Kafka', status: '延迟', last: '09:05', owner: '财务' },
  { name: '仓储WMS', type: 'MongoDB', status: '在线', last: '08:59', owner: '仓储' },
  { name: '客服IM', type: 'Redis', status: '维护', last: '08:40', owner: '客服' },
  { name: '供应商档案', type: 'Excel', status: '在线', last: '09:00', owner: '采购' },
  { name: 'BI明细', type: 'ClickHouse', status: '在线', last: '09:16', owner: '数据' },
  { name: 'IoT监控', type: 'MQTT', status: '延迟', last: '08:52', owner: '研发' },
  { name: '会员标签', type: 'Hive', status: '在线', last: '09:07', owner: '运营' },
  { name: '营销投放', type: 'API', status: '在线', last: '09:20', owner: '市场' }
]);

const formModal = ref(false);
const collectModal = ref(false);
const logModal = ref(false);
const progress = ref(0);
const logLines = reactive([
  '09:20 开始执行全量采集任务',
  '09:20 检查数据源连通性...',
  '09:21 CRM客户库通过，订单中心通过，支付流水延迟',
  '09:21 开始提取增量字段...',
  '09:22 发现3条异常记录，已标记回查',
  '09:23 数据写入ODS完成',
  '09:24 校验通过，等待清洗',
  '09:25 清洗完成，更新维度表',
  '09:26 更新指标缓存',
  '09:27 全量采集完成'
]);

const form = reactive({ name: '', type: 'MySQL', owner: '', desc: '' });

const startCollect = () => {
  progress.value = 0;
  collectModal.value = true;
  const timer = setInterval(() => {
    progress.value += 15;
    if (progress.value >= 100) {
      progress.value = 100;
      clearInterval(timer);
    }
  }, 400);
};

const addSource = () => {
  sources.unshift({ name: form.name, type: form.type, status: '在线', last: '刚刚', owner: form.owner });
  form.name = '';
  form.owner = '';
  form.desc = '';
  formModal.value = false;
};
</script>

<template>
  <div>
    <div class="section-header">
      <h2>数据采集与整合</h2>
      <div class="button-row">
        <button @click="formModal = true">添加数据源</button>
        <button class="secondary" @click="startCollect">一键采集</button>
        <button class="ghost" @click="logModal = true">查看日志</button>
      </div>
    </div>

    <div class="card">
      <table>
        <thead>
          <tr>
            <th>数据源</th>
            <th>类型</th>
            <th>负责人</th>
            <th>状态</th>
            <th>上次同步</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="source in sources" :key="source.name">
            <td>{{ source.name }}</td>
            <td>{{ source.type }}</td>
            <td>{{ source.owner }}</td>
            <td>
              <span class="status" :class="{ success: source.status === '在线', warning: source.status === '延迟', danger: source.status === '维护' }">
                {{ source.status }}
              </span>
            </td>
            <td>{{ source.last }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <ModalDialog title="新建数据源" :show="formModal" @close="formModal = false">
      <div class="form-grid">
        <label>
          数据源名称
          <input v-model="form.name" placeholder="如：订单中心" />
        </label>
        <label>
          类型
          <select v-model="form.type">
            <option>MySQL</option>
            <option>PostgreSQL</option>
            <option>Kafka</option>
            <option>MongoDB</option>
            <option>Redis</option>
          </select>
        </label>
        <label>
          负责人
          <input v-model="form.owner" placeholder="负责人" />
        </label>
        <label style="grid-column: span 2">
          描述
          <textarea v-model="form.desc" rows="3" placeholder="采集目的与注意事项"></textarea>
        </label>
      </div>
      <div class="button-row" style="margin-top: 12px">
        <button @click="addSource">提交</button>
        <button class="ghost" @click="formModal = false">取消</button>
      </div>
    </ModalDialog>

    <ModalDialog title="采集进度" :show="collectModal" @close="collectModal = false">
      <p>正在执行采集与清洗，请勿关闭窗口。</p>
      <div class="progress" style="margin: 12px 0">
        <div class="progress-inner" :style="{ width: progress + '%' }"></div>
      </div>
      <p>当前进度：{{ progress }}%</p>
    </ModalDialog>

    <ModalDialog title="采集日志" :show="logModal" @close="logModal = false">
      <ul style="padding-left: 18px; margin: 0">
        <li v-for="line in logLines" :key="line" style="margin: 6px 0">{{ line }}</li>
      </ul>
    </ModalDialog>
  </div>
</template>
