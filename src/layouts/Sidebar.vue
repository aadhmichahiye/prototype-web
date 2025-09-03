<template>
  <div>
    <!-- Toggle button (always visible) -->
    <div
      class="hamburger"
      :aria-label="
        sidebar.isDesktop
          ? sidebar.desktopExpanded
            ? 'Collapse sidebar'
            : 'Expand sidebar'
          : sidebar.mobileOpen
          ? 'Close menu'
          : 'Open menu'
      "
      @click="toggleSidebar"
    >
      <i class="ri-side-bar-line"></i>
    </div>

    <!-- Overlay (mobile only) with fade transition -->
    <transition name="overlay-fade">
      <div
        v-if="sidebar.mobileOpen && !sidebar.isDesktop"
        class="overlay"
        @click="sidebar.mobileOpen = false"
      ></div>
    </transition>

    <!-- Sidebar with slide transition -->
    <transition name="sidebar-slide">
      <aside
        v-if="sidebar.isDesktop || sidebar.mobileOpen"
        :class="[
          'sidebar',
          {
            expanded: sidebar.isDesktop && sidebar.desktopExpanded,
            collapsed: sidebar.isDesktop && !sidebar.desktopExpanded,
            'mobile-open': !sidebar.isDesktop && sidebar.mobileOpen,
          },
        ]"
      >
        <div class="sidebar-header">
          <div class="brand">
            <div class="brand-logo"></div>
            <div
              v-if="sidebar.isDesktop && sidebar.desktopExpanded"
              class="brand-name"
            >
              Aadhmichahiye
            </div>
          </div>
        </div>

        <nav class="nav-menu">
          <!-- <router-link to="/dashboard" class="nav-link" type="button">
            <button class="nav-item" type="button">
              <i class="ri-dashboard-line"></i>
              <span class="nav-label">Dashboard</span>
            </button>
          </router-link> -->

          <router-link to="/client-posts/list" class="nav-link" type="button">
            <button class="nav-item" type="button">
              <i class="ri-briefcase-4-line nav-icon"></i>
              <span class="nav-label">Client Posts</span>
            </button>
          </router-link>

          <router-link
            to="/contractor-posts/list"
            class="nav-link"
            type="button"
          >
            <button class="nav-item" type="button">
              <i class="ri-briefcase-4-line nav-icon"></i>
              <span class="nav-label">Contractor Posts</span>
            </button>
          </router-link>

          <!-- <router-link to="/client/list" class="nav-link" type="button">
            <button class="nav-item" type="button">
              <i class="ri-briefcase-line nav-icon"></i>
              <span class="nav-label">Client visit contractor List</span>
            </button>
          </router-link> -->

          <!-- <router-link to="/contractor/list" class="nav-link" type="button">
            <button class="nav-item" type="button">
              <i class="ri-briefcase-line nav-icon"></i>
              <span class="nav-label">Contractor visit client List</span>
            </button>
          </router-link> -->

          <router-link to="/client-posts/create" class="nav-link" type="button">
            <button class="nav-item" type="button">
              <i class="ri-add-circle-line nav-icon"></i>
              <span class="nav-label">Create client Post</span>
            </button>
          </router-link>

          <router-link
            to="/contractor-posts/create"
            class="nav-link"
            type="button"
          >
            <button class="nav-item" type="button">
              <i class="ri-add-circle-line nav-icon"></i>
              <span class="nav-label">Create contractor Post</span>
            </button>
          </router-link>

          <router-link to="/settings" class="nav-link" type="button">
            <button class="nav-item" type="button">
              <i class="ri-settings-3-line nav-icon"></i>
              <span class="nav-label">Settings</span>
            </button>
          </router-link>

          <div class="bottom-spacer"></div>

          <div class="dark-devider"></div>

          <button class="nav-item logout" type="button">
            <i class="ri-logout-box-line nav-icon"></i>
            <span class="nav-label" @click="handleLogout">Logout</span>
          </button>
        </nav>
      </aside>
    </transition>
  </div>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount, watch } from "vue";
import { useSidebarStore } from "../stores/sidebar";
import { useRouter } from "vue-router";

const sidebar = useSidebarStore();
const router = useRouter();

function handleResize() {
  sidebar.handleResize();
}

function toggleSidebar() {
  sidebar.toggle();
}

const handleLogout = () => {
  router.push("/login");
};

onMounted(() => window.addEventListener("resize", handleResize));
onBeforeUnmount(() => window.removeEventListener("resize", handleResize));

watch(
  () => sidebar.isDesktop,
  (newVal) => {
    if (newVal) sidebar.mobileOpen = false;
  },
  { immediate: true }
);
</script>
