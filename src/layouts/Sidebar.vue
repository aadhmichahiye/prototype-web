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
            <div class="brand-name">Aadhmichahiye</div>
          </div>
        </div>

        <nav class="nav-menu">
          <!-- Client Posts: Visible to everyone (optionally hide for contractor?) -->
          <router-link
            v-if="showClientPosts"
            to="/client-posts/list"
            class="nav-link"
            type="button"
          >
            <button class="nav-item" type="button">
              <i class="ri-briefcase-4-line nav-icon"></i>
              <span class="nav-label">Client Posts</span>
            </button>
          </router-link>

          <!-- Contractor Posts: Visible to everyone -->
          <router-link
            v-if="showContractorPosts"
            to="/contractor-posts/list"
            class="nav-link"
            type="button"
          >
            <button class="nav-item" type="button">
              <i class="ri-briefcase-4-line nav-icon"></i>
              <span class="nav-label">Contractor Posts</span>
            </button>
          </router-link>

          <!-- Create client Post: only client can create client posts -->
          <router-link
            v-if="role === 'client'"
            to="/client-posts/create"
            class="nav-link"
            type="button"
          >
            <button class="nav-item" type="button">
              <i class="ri-add-circle-line nav-icon"></i>
              <span class="nav-label">Create client Post</span>
            </button>
          </router-link>

          <router-link
            v-if="role === 'client'"
            to="/client-posts/my-posts"
            class="nav-link"
            type="button"
          >
            <button class="nav-item" type="button">
              <i class="ri-add-circle-line nav-icon"></i>
              <span class="nav-label">My Posts</span>
            </button>
          </router-link>

          <!-- Create contractor Post: only contractor can create contractor posts -->
          <router-link
            v-if="role === 'contractor'"
            to="/contractor-posts/create"
            class="nav-link"
            type="button"
          >
            <button class="nav-item" type="button">
              <i class="ri-add-circle-line nav-icon"></i>
              <span class="nav-label">Create contractor Post</span>
            </button>
          </router-link>

          <router-link
            v-if="role === 'contractor'"
            to="/contractor-posts/my-posts"
            class="nav-link"
            type="button"
          >
            <button class="nav-item" type="button">
              <i class="ri-add-circle-line nav-icon"></i>
              <span class="nav-label">My Posts</span>
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

          <button class="nav-item logout" type="button" @click="handleLogout">
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
import { useRouter } from "vue-router";
import { useUserStore } from "../stores/userStore";

const sidebar = useSidebarStore();
const userStore = useUserStore();
const router = useRouter();

function handleResize() {
  sidebar.handleResize();
}

function toggleSidebar() {
  sidebar.toggle();
}

// compute role from userstore (fallback to localStorage if needed)
const role = computed(() => {
  // prefer reactive store
  if (userStore && userStore.userData && userStore.userData.role) {
    return userStore.userData.role;
  }
  // fallback: localStorage (if app restored on refresh)
  try {
    const raw = localStorage.getItem("users");
    if (raw) {
      const u = JSON.parse(raw);
      return u.role || "";
    }
  } catch (e) {
    /* ignore parse errors */
  }
  return "";
});

// control visibility rules (adjust as needed)
const showClientPosts = computed(() => {
  // clients can see contractor posts? you said client only can see contractor posts —
  // but list names: "Client Posts" is list of client-created posts, "Contractor Posts" is contractor-created posts.
  // Keep both visible to everyone by default; if you want stricter rules change logic here.
  // For your requirement: hide client-posts for client? you asked: "if role is client hide client post because client only can see contractor post"
  // so implement exactly that:
  if (role.value === "client") return false;
  // otherwise show client posts to contractors and admins
  return true;
});

const showContractorPosts = computed(() => {
  // clients should be able to view contractor posts (per your requirement),
  // contractors should also view contractor posts.
  if (role.value === "contractor") return false;
  return true;
});

const handleLogout = async () => {
  try {
    // call store logout if available (will clear tokens and redirect)
    if (userStore && typeof userStore.logout === "function") {
      await userStore.logout();
      return;
    }
  } catch (err) {
    console.warn("Logout failed:", err);
  }

  // fallback
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
