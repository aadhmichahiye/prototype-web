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
          <router-link to="/dashboard" class="nav-link" type="button">
            <button class="nav-item" type="button">
              <i class="ri-dashboard-line"></i>
              <span class="nav-label">Dashboard</span>
            </button>
          </router-link>

          <router-link to="/my-posts" class="nav-link" type="button">
            <button class="nav-item" type="button">
              <i class="ri-briefcase-line nav-icon"></i>
              <span class="nav-label">My Posts</span>
            </button>
          </router-link>

          <router-link to="/client/list" class="nav-link" type="button">
            <button class="nav-item" type="button">
              <i class="ri-briefcase-line nav-icon"></i>
              <span class="nav-label">Client List</span>
            </button>
          </router-link>

          <router-link to="/contractor/list" class="nav-link" type="button">
            <button class="nav-item" type="button">
              <i class="ri-briefcase-line nav-icon"></i>
              <span class="nav-label">Contractor List</span>
            </button>
          </router-link>

          <router-link to="/create-post" class="nav-link" type="button">
            <button class="nav-item" type="button">
              <i class="ri-add-circle-line nav-icon"></i>
              <span class="nav-label">Create Post</span>
            </button>
          </router-link>

          <router-link to="/settings" class="nav-link" type="button">
            <button class="nav-item" type="button">
              <i class="ri-settings-3-line nav-icon"></i>
              <span class="nav-label">Settings</span>
            </button>
          </router-link>

          <div class="bottom-spacer"></div>

          <button class="nav-item logout" type="button">
            <i class="ri-logout-box-line nav-icon"></i>
            <span class="nav-label">Logout</span>
          </button>
        </nav>
      </aside>
    </transition>
  </div>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount, watch } from "vue";
import { useSidebarStore } from "../stores/sidebar";

const sidebar = useSidebarStore();

function handleResize() {
  sidebar.handleResize();
}

function toggleSidebar() {
  sidebar.toggle();
}

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

<style scoped>
/* Toggle / hamburger */
.hamburger {
  position: fixed;
  top: 12px;
  left: 12px;
  z-index: 1400;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  background: rgb(159, 159, 159);
  color: #0f0f0f;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  cursor: pointer;
  transition: transform 0.12s ease;
}
.hamburger:active {
  transform: scale(0.96);
}

/* Overlay fade */
.overlay-fade-enter-active,
.overlay-fade-leave-active {
  transition: opacity 0.3s ease;
}
.overlay-fade-enter-from,
.overlay-fade-leave-to {
  opacity: 0;
}
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(74, 74, 74, 0.35);
  z-index: 1300;
}

/* Sidebar slide for mobile */
.sidebar-slide-enter-active,
.sidebar-slide-leave-active {
  transition: transform 0.35s cubic-bezier(0.25, 0.8, 0.25, 1),
    opacity 0.25s ease;
}
.sidebar-slide-enter-from,
.sidebar-slide-leave-to {
  transform: translateX(-100%);
  opacity: 0.7;
}
.sidebar-slide-enter-to,
.sidebar-slide-leave-from {
  transform: translateX(0);
  opacity: 1;
}

/* Sidebar base */
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  background: var(--sidebar-bg);
  border-right: 1px solid var(--sidebar-border);
  z-index: 1350;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 20px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  transition: width 0.36s cubic-bezier(0.25, 0.8, 0.25, 1);
}

/* Desktop states */
.sidebar.expanded {
  width: var(--sidebar-width-expanded);
}
.sidebar.collapsed {
  width: var(--sidebar-width-collapsed);
}

/* Header/brand inside sidebar */
.sidebar-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-bottom: 1px solid var(--sidebar-border);
}
.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}
.brand-logo {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: rgb(97, 97, 97);
}
.brand-name {
  font-weight: 600;
  font-size: 16px;
  color: #222;
  white-space: nowrap;
  opacity: 1;
  transition: opacity 0.18s ease;
}

/* Nav menu */
.nav-menu {
  display: flex;
  flex-direction: column;
  padding: 8px;
  gap: 6px;
  flex: 1;
}
.nav-link {
  text-decoration: none;
  color: inherit;
  display: block;
}
.nav-link.router-link-active .nav-item {
  background: #f0f0f0; /* active highlight */
  font-weight: 500;
}
.nav-link.router-link-exact-active .nav-item {
  background: #e5e5e5; /* exact route highlight */
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #333;
  text-align: left;
  transition: background 0.24s ease, transform 0.08s ease;
}
.nav-item:hover {
  background: #f5f7fb;
  transform: translateX(2px);
}
.nav-icon {
  font-size: 20px;
  width: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* Labels */
.nav-label {
  opacity: 1;
  transition: opacity 0.36s ease, transform 0.36s ease;
  transform-origin: left center;
  white-space: nowrap;
}

/* Collapsed state */
.sidebar.collapsed .nav-label,
.sidebar.collapsed .brand-name {
  opacity: 0;
  transform: translateX(-6px);
  pointer-events: none;
  width: 0;
}
.sidebar.collapsed .nav-item {
  justify-content: center;
  padding-left: 0;
  padding-right: 0;
}

/* Spacer & logout */
.bottom-spacer {
  flex: 1;
}
.logout {
  margin-bottom: 14px;
}

/* Mobile tweaks */
@media (max-width: 1023px) {
  .hamburger {
    left: 12px;
    top: 12px;
  }
  .sidebar {
    width: var(--sidebar-width-expanded);
  }
  .nav-item {
    padding: 14px 16px;
    font-size: 15px;
  }
  .brand-name {
    display: inline-block;
    opacity: 1;
  }
}
</style>
