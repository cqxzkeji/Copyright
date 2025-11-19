<template>
  <div class="modal-overlay" v-if="open">
    <div class="modal-card">
      <header style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;">
        <h3 style="margin:0;font-size:1.2rem;">{{ title }}</h3>
        <button style="background:#e2e8f0;color:#0f172a;padding:0.2rem 0.6rem;" @click="$emit('close')">×</button>
      </header>
      <slot />
      <footer style="margin-top:1.2rem;display:flex;justify-content:flex-end;gap:0.6rem;">
        <slot name="actions">
          <button @click="$emit('close')">关闭</button>
        </slot>
      </footer>
    </div>
  </div>
</template>

<script setup>
defineProps({
  open: Boolean,
  title: {
    type: String,
    default: '提示'
  }
});
</script>
