<template>
  <div class="page">
    <div class="grid three">
      <div class="card">
        <div class="section-title">系统配置概览</div>
        <p>已配置地块 12 个 / 作物类型 8 种</p>
        <div class="actions">
          <button class="btn" @click="openModal('user')">新增用户</button>
          <button class="btn secondary" @click="openModal('plot')">新增地块</button>
        </div>
      </div>
      <div class="card">
        <div class="section-title">设备运行健康度</div>
        <p>健康度评分 96</p>
        <div class="progress"><span :style="{ width: 96 + '%' }"></span></div>
        <div class="actions">
          <button class="btn" @click="openModal('health')">查看详情</button>
        </div>
      </div>
      <div class="card">
        <div class="section-title">基础管理快捷入口</div>
        <div class="grid two">
          <button class="btn" @click="openModal('crop')">作物管理</button>
          <button class="btn secondary" @click="openModal('device')">设备登记</button>
          <button class="btn ghost" @click="openModal('permission')">权限设置</button>
          <button class="btn" @click="openModal('backup')">数据备份</button>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="section-title">用户与基础信息配置表</div>
      <table class="table">
        <thead>
          <tr>
            <th>编号</th>
            <th>姓名</th>
            <th>角色</th>
            <th>负责地块</th>
            <th>作物类型</th>
            <th>设备数</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in users" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.role }}</td>
            <td>{{ item.plot }}</td>
            <td>{{ item.crop }}</td>
            <td>{{ item.devices }}</td>
            <td><span class="tag">{{ item.status }}</span></td>
            <td>
              <button class="btn secondary" @click="openModal('edit')">编辑</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="activeModal" class="modal-mask" @click.self="closeModal">
      <div class="modal">
        <header>
          <h3>{{ modalTitle }}</h3>
          <button class="btn ghost" @click="closeModal">关闭</button>
        </header>
        <div class="modal-body">
          <template v-if="activeModal === 'user'">
            <p>新增平台用户并分配角色。</p>
            <label>姓名<input placeholder="请输入姓名" /></label>
            <label>角色<select><option>管理员</option><option>技术员</option><option>操作员</option></select></label>
            <label>联系方式<input placeholder="手机号或邮箱" /></label>
          </template>
          <template v-else-if="activeModal === 'plot'">
            <p>新增种植地块信息。</p>
            <label>地块名称<input placeholder="例如 东区A1" /></label>
            <label>面积(亩)<input type="number" placeholder="请输入面积" /></label>
          </template>
          <template v-else-if="activeModal === 'health'">
            <p>设备健康度高，建议安排每周巡检。</p>
          </template>
          <template v-else-if="activeModal === 'crop'">
            <p>登记新的作物类型与生长周期。</p>
            <label>作物名称<input placeholder="请输入作物" /></label>
            <label>生长周期<select><option>短周期</option><option>中周期</option><option>长周期</option></select></label>
          </template>
          <template v-else-if="activeModal === 'device'">
            <p>新增设备并绑定责任人。</p>
            <label>设备类型<select><option>传感器</option><option>灌溉设备</option><option>通风设备</option></select></label>
            <label>责任人<input placeholder="请输入责任人" /></label>
          </template>
          <template v-else-if="activeModal === 'permission'">
            <p>配置不同角色的访问权限。</p>
            <label>角色<select><option>管理员</option><option>技术员</option><option>操作员</option></select></label>
            <label>权限<select><option>全量管理</option><option>查看与控制</option><option>仅查看</option></select></label>
          </template>
          <template v-else-if="activeModal === 'backup'">
            <p>执行平台数据备份并生成记录。</p>
            <label>备份范围<select><option>全部数据</option><option>配置数据</option><option>运行数据</option></select></label>
            <label>备份周期<select><option>立即</option><option>每周</option><option>每月</option></select></label>
          </template>
          <template v-else>
            <p>更新基础信息并保存。</p>
            <label>状态<select><option>启用</option><option>停用</option></select></label>
            <label>备注<textarea rows="3" placeholder="请输入备注"></textarea></label>
          </template>
        </div>
        <div class="modal-actions">
          <button class="btn" @click="closeModal">确认</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";

const activeModal = ref("");

const users = Array.from({ length: 22 }, (_, index) => ({
  id: `USR-${300 + index}`,
  name: ["张伟", "李敏", "王倩", "刘航"][index % 4],
  role: ["管理员", "技术员", "操作员"][index % 3],
  plot: ["东区A", "东区B", "西区C", "南区D"][index % 4],
  crop: ["番茄", "黄瓜", "辣椒", "草莓"][index % 4],
  devices: 6 + (index % 5),
  status: index % 3 === 0 ? "启用" : "维护中"
}));

const modalTitle = computed(() => {
  const titleMap = {
    user: "新增用户",
    plot: "新增地块",
    health: "设备健康度",
    crop: "作物管理",
    device: "设备登记",
    permission: "权限设置",
    backup: "数据备份",
    edit: "编辑信息"
  };
  return titleMap[activeModal.value] || "提示";
});

const openModal = (name) => {
  activeModal.value = name;
};

const closeModal = () => {
  activeModal.value = "";
};
</script>

<style scoped>
.modal-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-size: 14px;
}

.modal-body label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: var(--muted);
}
</style>
