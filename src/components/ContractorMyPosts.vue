<template>
  <div class="client-visits-posts page-container">
    <div class="layout">
      <!-- Main content only (no sidebar filters) -->
      <main class="content">
        <div class="header-row">
          <div class="left">
            <div class="badge"><i class="ri-briefcase-4-line"></i></div>
            <div class="heading">
              <h1>My Posts</h1>
              <p class="muted">
                All manpower posts you created. Edit or delete any post.
              </p>
            </div>
          </div>

          <div class="right">
            <el-input
              v-model="filters.search"
              placeholder="Search by name, city, or pincode"
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
                  <h3 class="title">{{ post.name }}</h3>
                  <p class="desc" v-if="post.title">{{ post.title }}</p>

                  <div class="meta">
                    <span class="meta-item"
                      ><i class="ri-map-pin-line"></i> {{ post.city }}</span
                    >
                    <span class="meta-item"
                      ><i class="ri-map-pin-line"></i>
                      {{ post.pincode || post.pinCode }}</span
                    >
                    <span class="meta-item"
                      ><i class="ri-time-line"></i>
                      {{ formatDate(post.createdAt) }}</span
                    >
                  </div>

                  <!-- Workers as chips (wrap) -->
                  <div
                    class="workers-list"
                    v-if="post.availableWorkers && post.availableWorkers.length"
                  >
                    <span
                      class="worker-chip"
                      v-for="w in post.availableWorkers"
                      :key="w._id || w.type"
                    >
                      <strong class="type">{{ w.type }}</strong>
                      <span class="count">{{ w.count }}</span>
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
                      >
                        <i class="ri-delete-bin-line"></i>
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

          <div ref="sentinel" class="sentinel" />

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
/*
  ContractorMyPosts.vue
  - Same behaviour / UI as client version, but for contractor's own manpower posts.
  - Expected API response: { message, meta: { total, page, limit, pages }, data: [ { _id, name, city, location, pincode, phone, status, availableWorkers: [...] } ] }
*/

import { ref, reactive, onMounted, onBeforeUnmount, watch } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import debounce from "lodash.debounce";

// --- Replace these imports with your actual API helpers ---
import {
  fetchMyContractorPosts,
  deleteContractorPost,
} from "../api/contractor";
// ----------------------------------------------------------------

const router = useRouter();

const posts = ref([]);
const loading = ref(false);
const loadingMore = ref(false);
const page = ref(1);
const limit = ref(10);
const totalPages = ref(1);
const totalItems = ref(0);
const autoLoading = ref(true);

const infiniteObserverSupported = typeof IntersectionObserver !== "undefined";
const sentinel = ref(null);
let observer = null;

const filters = reactive({
  search: "",
  city: "",
  pinCode: "",
  status: "",
});

const pageStateKey = "contractor_my_posts_page_state";

const doFetchDebounced = debounce(() => {
  resetAndFetch();
}, 450);

function onFilterChanged() {
  doFetchDebounced();
}

async function fetchPage(p = 1) {
  if (p === 1) loading.value = true;
  else loadingMore.value = true;

  try {
    const params = {
      page: p,
      limit: limit.value,
      search: filters.search || undefined,
      city: filters.city || undefined,
      pinCode: filters.pinCode || undefined,
      status: filters.status || undefined,
    };

    const res = await fetchMyContractorPosts(params);
    // expected shape similar to client: res.data.meta & res.data.data
    const meta = res?.data?.meta || res?.meta || {};
    const data = res?.data?.data || res?.data || [];

    totalItems.value =
      meta?.total || (p === 1 ? data.length : totalItems.value);
    totalPages.value =
      meta?.pages ||
      Math.ceil((meta?.total || data.length) / (meta?.limit || limit.value));
    page.value = meta?.page || p;

    if (p === 1) posts.value = data;
    else posts.value = posts.value.concat(data);
  } catch (err) {
    console.error("Failed to load contractor posts", err);
    ElMessage({ message: "Failed to load posts", type: "error" });
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
  activateObserver();
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

function handleEdit(post) {
  // open edit route (create a named route ContractorPostEdit with param id)
  router.push({ name: "ContractorPostEdit", params: { id: post._id } });
}

async function confirmDelete(post) {
  try {
    await ElMessageBox.confirm(
      `Delete post "${post.name || post.title}"?`,
      "Confirm",
      {
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
        type: "warning",
      }
    );
    await deleteContractorPost(post._id);
    ElMessage({ message: "Post deleted", type: "success" });
    resetAndFetch();
  } catch (err) {
    // cancelled or failed
  }
}

function formatDate(d) {
  if (!d) return "";
  return new Date(d).toLocaleString();
}

function goCreate() {
  router.push("/contractor-posts/create");
}

/* IntersectionObserver */
function onIntersection(entries) {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      if (page.value < totalPages.value) {
        fetchPage(page.value + 1);
      }
    }
  }
}

function activateObserver() {
  if (!infiniteObserverSupported) return;
  if (observer) observer.disconnect();
  if (!sentinel.value) return;
  observer = new IntersectionObserver(onIntersection, {
    root: null,
    rootMargin: "200px",
    threshold: 0.1,
  });
  observer.observe(sentinel.value);
}

function deactivateObserver() {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
}

onMounted(() => {
  try {
    const saved = JSON.parse(localStorage.getItem(pageStateKey) || "{}");
    if (saved.filters) Object.assign(filters, saved.filters);
  } catch (e) {}
  resetAndFetch();
  if (infiniteObserverSupported) activateObserver();

  // small responsive toggle for auto-loading
  const isSmallScreen = window.innerWidth <= 720;
  autoLoading.value = !isSmallScreen;
});

onBeforeUnmount(() => {
  deactivateObserver();
});

/* keep search debounce watcher in case other UI updates need it */
const onFilterDebounced = debounce(resetAndFetch, 450);
watch(
  () => filters.search,
  () => {
    onFilterDebounced();
  }
);
</script>

<style scoped>
/* minimal local tweaks — move to your scss files if you want */
.client-visits-posts {
  min-height: 100vh;
  padding: 1.2rem;
}
.layout {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}
.content {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}
.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}
.badge {
  width: 48px;
  height: 48px;
  border-radius: 999px;
  background: var(--primary);
  color: var(--white);
  display: flex;
  align-items: center;
  justify-content: center;
}
.content-card {
  background: var(--white);
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 12px 32px rgba(2, 6, 23, 0.06);
}
.posts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.9rem;
  margin-top: 0.6rem;
}
@media (min-width: 1400px) {
  .posts-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
@media (max-width: 920px) {
  .posts-grid {
    grid-template-columns: 1fr;
  }
}
.post-card {
  padding: 0.9rem;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  background: linear-gradient(180deg, #fff, #fafafa);
  border: 1px solid rgba(0, 0, 0, 0.03);
}
.post-top {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: flex-start;
}
.workers-list {
  margin-top: 0.6rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.worker-chip {
  display: inline-flex;
  gap: 0.5rem;
  align-items: center;
  background: rgba(0, 0, 0, 0.04);
  padding: 6px 8px;
  border-radius: 999px;
  font-size: 0.9rem;
}
.actions .el-button {
  border-radius: 8px;
  width: 40px;
  height: 40px;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
</style>
