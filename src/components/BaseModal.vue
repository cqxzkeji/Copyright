<template>
  <Teleport to="body">
    <div v-if="modelValue" class="overlay" @click.self="close">
      <div class="modal" role="dialog" aria-modal="true">
        <header class="modal-header">
          <h3>{{ title }}</h3>
          <button class="close-btn" @click="close">×</button>
        </header>
        <section class="modal-body">
          <slot />
        </section>
        <footer v-if="$slots.footer" class="modal-footer">
          <slot name="footer" />
        </footer>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
defineProps({
  modelValue: Boolean,
  title: { type: String, default: '提示' }
})

const emit = defineEmits(['update:modelValue'])
const close = () => emit('update:modelValue', false)
</script>

<style scoped>
.overlay { position: fixed; inset: 0; background: rgba(0,0,0,.35); display: grid; place-items: center; z-index: 999; }
.modal { width: min(680px, 92vw); background: #fff; border-radius: 12px; box-shadow: 0 12px 42px rgba(27,39,94,.25); }
.modal-header,.modal-footer{ padding: 14px 18px; border-bottom: 1px solid #edf1f8; display:flex; justify-content:space-between; align-items:center; }
.modal-footer{ border-top:1px solid #edf1f8; border-bottom:0; justify-content:flex-end; gap:10px; }
.modal-body{ padding: 18px; max-height: 70vh; overflow:auto; }
.close-btn{ border:none; background:transparent; font-size:24px; cursor:pointer; color:#5f6482; }
</style>
