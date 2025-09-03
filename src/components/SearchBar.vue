<template>
  <div class="search-bar">
    <el-input
      v-model="query"
      placeholder="Search jobs, contractors, or posts..."
      clearable
      class="search-input"
    >
      <template #prefix>
        <i class="ri-search-line search-icon"></i>
      </template>
    </el-input>
  </div>
</template>

<script setup>
import { ref } from "vue";

const query = ref("");
</script>
