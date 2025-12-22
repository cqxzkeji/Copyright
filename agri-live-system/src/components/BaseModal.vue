<template>
  <teleport to="body">
    <div v-if="show" class="modal-mask" role="dialog" aria-modal="true">
      <div class="modal-card" :style="{ maxWidth: width }">
        <header class="modal-header">
          <h3>{{ title }}</h3>
          <button class="icon-button" type="button" @click="emit('close')">✕</button>
        </header>
        <section class="modal-body">
          <slot />
        </section>
        <footer class="modal-footer">
          <slot name="footer">
            <button class="btn ghost" type="button" @click="emit('close')">关闭</button>
          </slot>
        </footer>
      </div>
    </div>
  </teleport>
</template>

<script setup>
const props = defineProps({
  show: Boolean,
  title: {
    type: String,
    default: ''
  },
  width: {
    type: String,
    default: '520px'
  }
})

const emit = defineEmits(['close'])
</script>
