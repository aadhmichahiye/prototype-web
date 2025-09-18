<template>
  <div class="search-bar">
    <el-input
      v-model="q"
      placeholder="Search..."
      clearable
      @input="onInput"
      @clear="onClear"
      @keyup.enter.native="onEnter"
      class="search-input"
    >
      <template #prefix>
        <i class="ri-search-line"></i>
      </template>
    </el-input>
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount } from "vue";
import debounce from "lodash.debounce";

const emit = defineEmits(["search"]);
const q = ref("");

// lodash debounce — only one instance
const emitSearch = debounce((value) => {
  emit("search", value == null ? "" : String(value));
}, 450);

function onInput(val) {
  emitSearch(val);
}

function onClear() {
  emitSearch.cancel(); // cancel any pending emit
  q.value = "";
  emit("search", "");
}

function onEnter() {
  emitSearch.cancel();
  emit("search", q.value);
}

onBeforeUnmount(() => {
  emitSearch.cancel();
});
</script>
