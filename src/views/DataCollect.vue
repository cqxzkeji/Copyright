<template>
  <div class="content-card full-height-card">
    <div class="header" style="margin-bottom: 8px;">
      <div class="section-title">数据采集与接入</div>
      <div class="table-actions">
        <el-button type="primary" :icon="CirclePlus" @click="showAdd = true">新增数据源</el-button>
        <el-button type="success" :icon="VideoPlay" @click="openSync">启动批量同步</el-button>
        <el-button type="info" :icon="Bell" @click="openNotice">连接告警</el-button>
      </div>
    </div>

    <el-table :data="sources" border stripe height="420px">
      <el-table-column prop="name" label="数据源名称" width="180" />
      <el-table-column prop="type" label="类型" width="130" />
      <el-table-column prop="mode" label="接入模式" width="140" />
      <el-table-column prop="status" label="状态" width="120">
        <template #default="scope">
          <el-tag :type="scope.row.status === '在线' ? 'success' : 'danger'">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="latency" label="延迟(ms)" width="120" />
      <el-table-column prop="freshness" label="数据新鲜度" />
      <el-table-column label="操作" width="150">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="viewDetail(scope.row)">详情</el-button>
          <el-button link type="warning" size="small" @click="testConnect(scope.row)">测试</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="showAdd" title="新增数据源" width="480px" align-center>
      <el-form :model="form" label-width="90px" status-icon>
        <el-form-item label="名称">
          <el-input v-model="form.name" placeholder="如：用户行为库" />
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="form.type" placeholder="选择类型">
            <el-option label="MySQL" value="MySQL" />
            <el-option label="PostgreSQL" value="PostgreSQL" />
            <el-option label="Hive" value="Hive" />
            <el-option label="Kafka" value="Kafka" />
            <el-option label="API" value="API" />
          </el-select>
        </el-form-item>
        <el-form-item label="接入模式">
          <el-radio-group v-model="form.mode">
            <el-radio-button label="批量" />
            <el-radio-button label="实时" />
            <el-radio-button label="准实时" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="连接串">
          <el-input v-model="form.endpoint" placeholder="输入连接串或URL" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAdd = false">取消</el-button>
        <el-button type="primary" @click="submitAdd">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="showProgress" title="批量同步" width="400px" align-center>
      <p style="margin-bottom: 10px;">正在同步所选数据源，保持窗口开启以查看实时进度。</p>
      <el-progress :percentage="progress" status="success" :striped="true" :stroke-width="14" />
    </el-dialog>

    <el-dialog v-model="showTest" :title="currentSource?.name" width="420px" align-center>
      <p>连接模式：{{ currentSource?.mode }} · 类型：{{ currentSource?.type }}</p>
      <el-alert type="success" show-icon title="连接可用" description="延迟 {{ currentSource?.latency }} ms，数据新鲜度 {{ currentSource?.freshness }}" />
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const sources = reactive(
  Array.from({ length: 20 }, (_, i) => ({
    name: `业务数据源-${i + 1}`,
    type: ['MySQL', 'Kafka', 'Hive', 'API'][i % 4],
    mode: ['批量', '实时', '准实时'][i % 3],
    status: i % 6 === 0 ? '离线' : '在线',
    latency: 30 + i * 2,
    freshness: `${5 + (i % 5)} 分钟`
  }))
);

const showAdd = ref(false);
const showProgress = ref(false);
const progress = ref(12);
const showTest = ref(false);
const currentSource = ref(null);

const form = reactive({ name: '', type: '', mode: '批量', endpoint: '' });

const submitAdd = () => {
  if (!form.name || !form.type || !form.endpoint) {
    ElMessage.warning('请补充完整信息');
    return;
  }
  sources.unshift({ ...form, status: '在线', latency: 20, freshness: '5 分钟' });
  showAdd.value = false;
  ElMessage.success('数据源已创建并接入');
};

const openSync = () => {
  progress.value = 12;
  showProgress.value = true;
  const timer = setInterval(() => {
    progress.value += 18;
    if (progress.value >= 100) {
      progress.value = 100;
      clearInterval(timer);
      ElMessageBox.alert('批量同步完成，增量任务已启动。', '同步完成', { type: 'success' });
      showProgress.value = false;
    }
  }, 700);
};

const viewDetail = (row) => {
  currentSource.value = row;
  showTest.value = true;
};

const testConnect = (row) => {
  currentSource.value = row;
  showTest.value = true;
};

const openNotice = () => {
  ElMessageBox.alert('已开启连接失败告警，异常将通过邮件与短信推送。', '告警配置', { type: 'info' });
};
</script>
