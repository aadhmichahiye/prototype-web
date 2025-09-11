<template>
  <div class="client-visits-posts page-container">
    <div class="layout">
      <!-- Sidebar filters (collapsible on mobile) -->
      <aside :class="['filters', { open: filtersOpen }]">
        <div class="filters-header">
          <h3>Filters</h3>
          <button
            class="toggle"
            @click="filtersOpen = !filtersOpen"
            aria-label="toggle filters"
          >
            <i :class="filtersOpen ? 'ri-close-line' : 'ri-filter-2-line'"></i>
          </button>
        </div>

        <div class="filters-body">
          <el-input
            v-model="filters.q"
            placeholder="Search title / description"
            clearable
            @input="onFilterChanged"
          >
            <template #prefix><i class="ri-search-line"></i></template>
          </el-input>

          <el-select
            v-model="filters.city"
            placeholder="City"
            clearable
            @change="onFilterChanged"
          >
            <el-option label="Hyderabad" value="Hyderabad" />
            <el-option label="Mumbai" value="Mumbai" />
            <el-option label="Delhi" value="Delhi" />
            <!-- extend as you like -->
          </el-select>

          <el-input
            v-model="filters.pinCode"
            placeholder="Pin code"
            maxlength="6"
            @input="onFilterChanged"
          />

          <el-select
            v-model="filters.status"
            placeholder="Status"
            clearable
            @change="onFilterChanged"
          >
            <el-option label="open" value="open" />
            <el-option label="closed" value="closed" />
          </el-select>

          <div class="filter-actions">
            <el-button type="primary" @click="applyFilters">Apply</el-button>
            <el-button @click="resetFilters">Reset</el-button>
          </div>
        </div>
      </aside>

      <!-- Main content -->
      <main class="content">
        <div class="header-row">
          <div class="left">
            <div class="badge">
              <i class="ri-briefcase-4-line"></i>
            </div>
            <div class="heading">
              <h1>My Posts</h1>
              <p class="muted">
                All job posts you created. Edit or delete any post.
              </p>
            </div>
          </div>

          <div class="right">
            <el-input
              v-model="filters.q"
              placeholder="Search by title, city, or pincode"
              clearable
              @input="onFilterChanged"
              class="search-inline"
            >
              <template #prefix><i class="ri-search-line"></i></template>
            </el-input>

            <el-button type="primary" @click="goCreate">Create Post</el-button>
          </div>
        </div>

        <div class="content-card">
          <div v-if="loading && posts.length === 0" class="skeleton">
            <el-skeleton :rows="4" animated />
          </div>

          <div v-if="!loading && posts.length === 0" class="empty">
            <el-empty description="No posts found. Create your first post." />
          </div>

          <div class="posts-grid" v-if="posts.length > 0">
            <article v-for="post in posts" :key="post._id" class="post-card">
              <div class="post-top">
                <div class="left">
                  <h3 class="title">{{ post.title }}</h3>
                  <p class="desc">{{ post.description }}</p>

                  <div class="meta">
                    <span class="meta-item"
                      ><i class="ri-map-pin-line"></i> {{ post.city }} ·
                      {{ post.pinCode }}</span
                    >
                    <span class="meta-item"
                      ><i class="ri-time-line"></i>
                      {{ formatDate(post.createdAt) }}</span
                    >
                    <span
                      class="meta-item"
                      v-if="post.requiredWorkers && post.requiredWorkers.length"
                    >
                      <i class="ri-user-3-line"></i>
                      {{ summarizeWorkers(post.requiredWorkers) }}
                    </span>
                  </div>
                </div>

                <div class="right">
                  <span :class="['status', post.status]">{{
                    post.status
                  }}</span>

                  <div class="actions">
                    <el-tooltip content="Edit" placement="top">
                      <el-button circle @click="handleEdit(post)"
                        ><i class="ri-pencil-line"></i
                      ></el-button>
                    </el-tooltip>

                    <el-tooltip content="Delete" placement="top">
                      <el-button
                        circle
                        type="danger"
                        @click="confirmDelete(post)"
                        ><i class="ri-delete-bin-line"></i
                      ></el-button>
                    </el-tooltip>

                    <el-tooltip content="Contact" placement="top">
                      <el-button
                        circle
                        @click="callPhone(post.contactDetails?.phone)"
                      >
                        <i class="ri-phone-line"></i>
                      </el-button>
                    </el-tooltip>
                  </div>
                </div>
              </div>
            </article>
          </div>

          <!-- loading more indicator -->
          <div class="loader-wrap" v-if="loading && posts.length > 0">
            <el-spinner />
          </div>

          <!-- Intersection observer sentinel -->
          <div ref="sentinel" class="sentinel" />

          <!-- Fallback load more for mobile or if observer not supported -->
          <div
            class="load-more-wrap"
            v-if="
              !infiniteObserverSupported || (page < totalPages && !autoLoading)
            "
          >
            <el-button type="primary" @click="loadMore" :loading="loadingMore"
              >Load more</el-button
            >
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
/* ClientVisitsPosts.vue
  - infinite scroll via IntersectionObserver
  - filter sidebar
  - loads from GET /api/client-job-posts/my-posts
*/

import { ref, reactive, onMounted, onBeforeUnmount, watch } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { fetchMyPosts, deleteClientPost } from "../api/client";
import { useRouter } from "vue-router";
import debounce from "lodash.debounce";

const router = useRouter();

const posts = ref([]);
const loading = ref(false);
const loadingMore = ref(false);
const page = ref(1);
const limit = ref(10);
const totalPages = ref(1);
const totalItems = ref(0);
const autoLoading = ref(true);

const filtersOpen = ref(false);
const infiniteObserverSupported = typeof IntersectionObserver !== "undefined";

const sentinel = ref(null);
let observer = null;
let observerActive = false;

const filters = reactive({
  q: "",
  city: "",
  pinCode: "",
  status: "",
});

const pageStateKey = "client_my_posts_page_state";

// small debounce for search
const doFetchDebounced = debounce(() => {
  resetAndFetch();
}, 450);

function onFilterChanged() {
  // immediate local update but debounce network call
  doFetchDebounced();
}

async function fetchPage(p = 1) {
  if (p === 1) {
    loading.value = true;
  } else {
    loadingMore.value = true;
  }

  try {
    const params = {
      page: p,
      limit: limit.value,
      q: filters.q || undefined,
      city: filters.city || undefined,
      pinCode: filters.pinCode || undefined,
      status: filters.status || undefined,
    };

    const res = await fetchMyPosts(params);
    // expected structure: { message, meta: { total, page, limit, pages }, data: [] }
    const meta = res?.data?.meta || res?.meta;
    const data = res?.data?.data || res?.data || [];

    totalItems.value = meta?.total || data.length;
    totalPages.value =
      meta?.pages ||
      Math.ceil((meta?.total || data.length) / (meta?.limit || limit.value));
    page.value = meta?.page || p;

    if (p === 1) {
      posts.value = data;
    } else {
      posts.value = posts.value.concat(data);
    }
  } catch (err) {
    console.error("Failed to load posts", err);
    ElMessage({
      message: "Failed to load posts",
      type: "error",
    });
  } finally {
    loading.value = false;
    loadingMore.value = false;
  }
}

async function resetAndFetch() {
  page.value = 1;
  totalPages.value = 1;
  posts.value = [];
  await fetchPage(1);
  // re-observe sentinel in case we appended
  activateObserver();
  // persist some page state
  try {
    localStorage.setItem(
      pageStateKey,
      JSON.stringify({ filters: { ...filters }, page: 1 })
    );
  } catch (e) {}
}

function loadMore() {
  if (loadingMore.value || page.value >= totalPages.value) return;
  const next = page.value + 1;
  fetchPage(next);
}

// edit navigation
function handleEdit(post) {
  router.push({ name: "ClientPostEdit", params: { id: post._id } });
}

async function confirmDelete(post) {
  try {
    await ElMessageBox.confirm(`Delete post "${post.title}"?`, "Confirm", {
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      type: "warning",
    });
    // user confirmed
    await deleteClientPost(post._id);
    ElMessage({ message: "Post deleted", type: "success" });
    // refresh current page
    resetAndFetch();
  } catch (err) {
    // cancel or error
  }
}

function callPhone(phone) {
  if (!phone) return;
  // attempt direct tel call
  window.location.href = `tel:${phone}`;
}

function formatDate(d) {
  if (!d) return "";
  return new Date(d).toLocaleString();
}

function summarizeWorkers(list = []) {
  if (!list || list.length === 0) return "No workers listed";
  return list
    .map((w) => `${w.type} - ${String(w.count).padStart(2, "0")}`)
    .join(", ");
}

function goCreate() {
  router.push("/client-posts/create");
}

/* IntersectionObserver handling */
function onIntersection(entries) {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      // load next page if available
      if (page.value < totalPages.value) {
        fetchPage(page.value + 1);
      }
    }
  }
}

function activateObserver() {
  if (!infiniteObserverSupported) return;
  // disconnect existing
  if (observer) {
    observer.disconnect();
    observerActive = false;
  }
  if (!sentinel.value) return;
  observer = new IntersectionObserver(onIntersection, {
    root: null,
    rootMargin: "200px",
    threshold: 0.1,
  });
  observer.observe(sentinel.value);
  observerActive = true;
}

function deactivateObserver() {
  if (observer) {
    observer.disconnect();
    observer = null;
    observerActive = false;
  }
}

onMounted(() => {
  // restore filters/page if present
  try {
    const saved = JSON.parse(localStorage.getItem(pageStateKey) || "{}");
    if (saved.filters) {
      Object.assign(filters, saved.filters);
    }
  } catch (e) {}
  resetAndFetch();

  if (infiniteObserverSupported) {
    activateObserver();
  }
});

onBeforeUnmount(() => {
  deactivateObserver();
});

/* small helper - apply/reset filters */
function applyFilters() {
  resetAndFetch();
  filtersOpen.value = false;
}

function resetFilters() {
  filters.q = "";
  filters.city = "";
  filters.pinCode = "";
  filters.status = "";
  resetAndFetch();
}

/* small UI state: on small screens prefer manual Load More */
const isSmallScreen = ref(window.innerWidth <= 720);
window.addEventListener(
  "resize",
  () => (isSmallScreen.value = window.innerWidth <= 720)
);

const autoObserverToggle = () => {
  // if small screen, don't auto infinite load — prefer manual
  autoLoading.value = !isSmallScreen.value;
};

watch(isSmallScreen, () => {
  autoObserverToggle();
});

/* wire debounce for search */
const onFilterDebounced = debounce(resetAndFetch, 450);

watch(
  () => filters.q,
  () => {
    onFilterDebounced();
  }
);
</script>
