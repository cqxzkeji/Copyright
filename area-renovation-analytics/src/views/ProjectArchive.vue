<template>
  <section>
    <div class="card-grid">
      <div class="card">
        <div class="label">档案数量</div>
        <h3>{{ archives.length }} 个</h3>
        <p class="label">覆盖所有片区的历史与在建项目</p>
      </div>
      <div class="card">
        <div class="label">最新更新</div>
        <h3>{{ archives[0].update }}</h3>
        <p class="label">最近一次档案变更时间</p>
      </div>
      <div class="card">
        <div class="label">项目类型</div>
        <h3>旧城提升、环境整治</h3>
        <p class="label">包含生态修复、道路改造等类型</p>
      </div>
    </div>

    <div class="button-row">
      <button class="primary-btn" @click="activeModal = 'create'">新增项目</button>
      <button class="ghost-btn" @click="activeModal = 'import'">导入档案</button>
      <button class="ghost-btn" @click="activeModal = 'download'">下载模板</button>
      <button class="ghost-btn" @click="activeModal = 'export'">导出清单</button>
    </div>

    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>编号</th>
            <th>项目名称</th>
            <th>片区</th>
            <th>实施主体</th>
            <th>阶段</th>
            <th>计划起止</th>
            <th>更新时间</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in archives" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.region }}</td>
            <td>{{ item.owner }}</td>
            <td>{{ item.stage }}</td>
            <td>{{ item.period }}</td>
            <td>{{ item.update }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <ModalDialog v-model="activeModal" title="新增档案" sub-title="基础信息" v-if="activeModal === 'create'">
      <form class="flex" style="flex-direction:column; gap:10px;">
        <input placeholder="项目名称" />
        <div class="flex">
          <select style="flex:1;">
            <option>旧城提升</option>
            <option>生态修复</option>
            <option>基础设施</option>
          </select>
          <input placeholder="片区" />
        </div>
        <div class="flex">
          <input placeholder="实施主体" />
          <input placeholder="负责人" />
        </div>
        <textarea placeholder="项目概述" rows="3"></textarea>
      </form>
    </ModalDialog>

    <ModalDialog v-model="activeModal" title="批量导入" sub-title="导入档案" v-else-if="activeModal === 'import'">
      <p>请选择要导入的Excel表单，系统会校验字段与数据质量。</p>
      <div class="label">支持字段：名称/片区/实施主体/计划起止/负责人/联系方式</div>
    </ModalDialog>

    <ModalDialog v-model="activeModal" title="模板下载" sub-title="标准字段" v-else-if="activeModal === 'download'">
      <p>立即获取最新档案模板，包含必填与选填项说明。</p>
    </ModalDialog>

    <ModalDialog v-model="activeModal" title="导出清单" sub-title="归档输出" v-else-if="activeModal === 'export'">
      <p>将当前筛选结果导出为PDF/Excel，便于现场核查和归档。</p>
    </ModalDialog>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const activeModal = ref('');
const archives = ref(
  Array.from({ length: 20 }, (_, index) => {
    const id = index + 1;
    return {
      id: `PJ-${id.toString().padStart(3, '0')}`,
      name: `片区整治示范项目 ${id}`,
      region: ['老城区', '滨水带', '产业园区'][index % 3],
      owner: ['城投集团', '住建局', '街道办'][index % 3],
      stage: ['策划', '设计', '施工', '验收'][index % 4],
      period: `2024-0${(index % 6) + 1} ~ 2024-1${(index % 6) + 1}`,
      update: `2024-0${(index % 9) + 1}-12`
    };
  })
);
</script>
