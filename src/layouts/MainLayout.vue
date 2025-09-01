<template>
  <div class="main-layout">
    <!-- Sidebar is already fixed-position -->
    <SideBar />

    <!-- Main Content -->
    <div class="content" :class="{ expanded: sidebar.desktopExpanded }">
      <router-view />
      <!-- <Footer /> -->
    </div>
  </div>
</template>

<script setup>
import SideBar from "../layouts/Sidebar.vue";
// import Footer from "@/layouts/Footer.vue";
import { useSidebarStore } from "../stores/sidebar";

const sidebar = useSidebarStore();
</script>

<style scoped>
.main-layout {
  height: 100vh;
  width: 100%;
  overflow: hidden;
}

/* Content should auto-resize based on sidebar state */
.content {
  height: 100%;
  transition: width 0.36s cubic-bezier(0.25, 0.8, 0.25, 1);
  margin-left: var(--sidebar-width-collapsed); /* default collapsed */
  width: calc(100% - var(--sidebar-width-collapsed));
}

.content.expanded {
  margin-left: var(--sidebar-width-expanded);
  width: calc(100% - var(--sidebar-width-expanded));
}

/* Mobile: Sidebar overlays, content is always 100% */
@media (max-width: 1023px) {
  .content,
  .content.expanded {
    margin-left: 0;
    width: 100%;
  }
}
</style>
