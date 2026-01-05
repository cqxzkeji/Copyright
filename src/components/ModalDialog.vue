<template>
  <div v-if="open" class="modal-mask" @click.self="close">
    <div class="modal" role="dialog" aria-modal="true">
      <header>
        <slot name="title">
          <h3 style="margin:0;font-size:18px;">提示</h3>
        </slot>
      </header>
      <div class="body">
        <slot>
          默认内容
        </slot>
      </div>
      <footer>
        <button class="btn ghost" @click="close">取消</button>
        <button class="btn" @click="confirm">确定</button>
      </footer>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  open: Boolean
});
const emit = defineEmits(['close', 'confirm']);
const close = () => emit('close');
const confirm = () => emit('confirm');
</script>
