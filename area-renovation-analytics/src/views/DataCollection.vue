<template>
  <section>
    <div class="card-grid">
      <div class="card">
        <div class="label">采集通道</div>
        <h3>人工填报、表单导入、系统对接</h3>
        <p class="label">确保数据来源清晰可溯</p>
      </div>
      <div class="card">
        <div class="label">最新对接</div>
        <h3>资金系统 / 现场巡查</h3>
        <p class="label">已完成字段映射与同步测试</p>
      </div>
      <div class="card">
        <div class="label">今日更新</div>
        <h3>32 条</h3>
        <p class="label">来自进度巡查与影像回传</p>
      </div>
    </div>

    <div class="button-row">
      <button class="primary-btn" @click="activeModal = 'manual'">人工填报</button>
      <button class="ghost-btn" @click="activeModal = 'import'">表单导入</button>
      <button class="ghost-btn" @click="activeModal = 'api'">系统对接</button>
      <button class="ghost-btn" @click="activeModal = 'photo'">影像采集</button>
    </div>

    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>序号</th>
            <th>数据类型</th>
            <th>来源</th>
            <th>描述</th>
            <th>采集人</th>
            <th>时间</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in records" :key="row.id">
            <td>{{ row.id }}</td>
            <td>{{ row.type }}</td>
            <td>{{ row.channel }}</td>
            <td>{{ row.desc }}</td>
            <td>{{ row.owner }}</td>
            <td>{{ row.time }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <ModalDialog v-model="activeModal" title="人工填报" sub-title="即时补录" v-if="activeModal === 'manual'">
      <form class="flex" style="flex-direction:column; gap:10px;">
        <select>
          <option>工程进度</option>
          <option>资金拨付</option>
          <option>现场巡查</option>
        </select>
        <input placeholder="标题" />
        <textarea rows="3" placeholder="补录内容"></textarea>
      </form>
    </ModalDialog>

    <ModalDialog v-model="activeModal" title="批量导入" sub-title="导入表单" v-else-if="activeModal === 'import'">
      <p>上传Excel或CSV文件，系统自动完成校验与字段映射。</p>
    </ModalDialog>

    <ModalDialog v-model="activeModal" title="系统对接" sub-title="API配置" v-else-if="activeModal === 'api'">
      <p>填写第三方系统接口地址、Token与同步频率，保存后启用定时采集。</p>
    </ModalDialog>

    <ModalDialog v-model="activeModal" title="影像采集" sub-title="照片与视频" v-else-if="activeModal === 'photo'">
      <p>选择拍摄位置、上传现场照片并输入巡查备注，支持一次上传多张图片。</p>
    </ModalDialog>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const activeModal = ref('');
const records = ref(
  Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    type: ['工程进度', '资金投入', '现场巡查', '影像资料'][i % 4],
    channel: ['人工填报', '表单导入', '系统对接'][i % 3],
    desc: ['节点完成', '拨付申请', '风险排查', '影像回传'][i % 4],
    owner: ['刘伟', '张婷', '陈宇', '杨柳', '王江'][i % 5],
    time: `2024-05-${(i % 28) + 1}`
  }))
);
</script>
