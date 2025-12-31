<template>
  <div class="card">
    <div class="section-title">结果展示与复核</div>
    <p class="muted">可视化显示检测框与置信度，支持人工复核、修正与通过操作。</p>
    <div class="toolbar">
      <button @click="showReview = true">人工复核</button>
      <button @click="showApprove = true">批量通过</button>
      <button @click="showReject = true">打回修正</button>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>影像编号</th>
          <th>预测类型</th>
          <th>置信度</th>
          <th>复核医生</th>
          <th>状态</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in reviewList" :key="item.id">
          <td>{{ item.id }}</td>
          <td>{{ item.type }}</td>
          <td>{{ item.score }}%</td>
          <td>{{ item.doctor }}</td>
          <td>{{ item.status }}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <BaseModal v-model="showReview" title="人工复核" confirm-text="保存标注" @confirm="saveReview">
    <label>影像编号
      <input v-model="reviewForm.id" placeholder="CT-051" />
    </label>
    <label>调整后的标签
      <select v-model="reviewForm.label">
        <option>牙源性囊肿</option>
        <option>角化囊肿</option>
        <option>骨性囊肿</option>
      </select>
    </label>
    <label>备注
      <textarea rows="3" v-model="reviewForm.note" placeholder="标注框向远中调整 2mm"></textarea>
    </label>
  </BaseModal>

  <BaseModal v-model="showApprove" title="批量通过" confirm-text="确认通过" @confirm="approveAll">
    <p>确认将今日导出的检测结果标记为“已复核”并锁定？</p>
    <ul>
      <li v-for="i in 3" :key="i">批次 {{ i }} ：{{ 15 + i }} 例</li>
    </ul>
  </BaseModal>

  <BaseModal v-model="showReject" title="打回修正" confirm-text="提交打回" @confirm="reject">
    <label>打回原因
      <textarea rows="3" v-model="rejectReason" placeholder="框偏移、置信度偏低、需要重新标注"></textarea>
    </label>
  </BaseModal>
</template>

<script setup>
import { reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const reviewList = reactive(
  Array.from({ length: 20 }).map((_, i) => ({
    id: `CT-${String(i + 51).padStart(3, '0')}`,
    type: i % 2 === 0 ? '囊肿' : '骨性囊肿',
    score: (82 - i * 0.8).toFixed(1),
    doctor: i % 2 === 0 ? '李晨' : '王敏',
    status: i % 3 === 0 ? '待复核' : '已确认'
  }))
);

const showReview = ref(false);
const showApprove = ref(false);
const showReject = ref(false);
const reviewForm = reactive({ id: '', label: '牙源性囊肿', note: '' });
const rejectReason = ref('');

const saveReview = () => {
  showReview.value = false;
  alert(`影像 ${reviewForm.id} 复核已保存`);
};

const approveAll = () => {
  showApprove.value = false;
  alert('批次结果已全部通过');
};

const reject = () => {
  showReject.value = false;
  alert(`已打回: ${rejectReason.value}`);
};
</script>
