<template>
  <teleport to="body">
    <div v-if="modelValue" class="modal-mask" @click.self="$emit('update:modelValue', false)">
      <div class="modal-panel">
        <header>
          <h3>{{ title }}</h3>
          <button class="icon-btn" @click="$emit('update:modelValue', false)">×</button>
        </header>
        <main><slot /></main>
        <footer>
          <button class="btn" @click="$emit('update:modelValue', false)">关闭</button>
          <button v-if="confirmText" class="btn primary" @click="$emit('confirm')">{{ confirmText }}</button>
        </footer>
      </div>
    </div>
  </teleport>
</template>

<script setup>
defineProps({
  modelValue: Boolean,
  title: { type: String, default: '提示' },
  confirmText: { type: String, default: '' }
})
defineEmits(['update:modelValue', 'confirm'])
</script>

<style scoped>
.modal-mask { position: fixed; inset: 0; background: rgba(0,0,0,.35); display:flex; align-items:center; justify-content:center; z-index: 99; }
.modal-panel { width:min(560px,92vw); background:#fff; border-radius:14px; box-shadow:0 12px 30px rgba(15,40,90,.2); padding:16px; }
header{display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #e8eef8;padding-bottom:8px}
main{padding:14px 0;max-height:60vh;overflow:auto}
footer{display:flex;justify-content:flex-end;gap:8px;border-top:1px solid #e8eef8;padding-top:10px}
.icon-btn{border:none;background:#f2f6ff;width:32px;height:32px;border-radius:8px;cursor:pointer;font-size:20px}
.btn{border:none;padding:8px 14px;border-radius:10px;cursor:pointer;background:#edf2ff}
.primary{background:#3b82f6;color:#fff}
</style>
