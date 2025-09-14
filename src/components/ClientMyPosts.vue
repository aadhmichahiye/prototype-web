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
                All job posts you created. Edit or delete any post.
              </p>
            </div>
          </div>

          <div class="right">
            <el-input
              v-model="filters.search"
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
                    <span class="meta-item">
                      <i class="ri-map-pin-line"></i> {{ post.city }}
                    </span>
                    <span class="meta-item">
                      <i class="ri-map-pin-line"></i>
                      {{ post.pinCode || post.pincode }}
                    </span>
                    <span class="meta-item">
                      <i class="ri-time-line"></i>
                      {{ formatDate(post.createdAt) }}
                    </span>
                  </div>

                  <!-- Workers as chips (wrap) -->
                  <div
                    class="workers-list"
                    v-if="post.requiredWorkers && post.requiredWorkers.length"
                  >
                    <span
                      class="worker-chip"
                      v-for="w in post.requiredWorkers"
                      :key="w._id || w.type"
                    >
                      <strong class="type">{{ w.type }}</strong>
                      <span class="count">{{ w.count }}</span>
                      <!-- <span class="status-dot" :data-status="w.status"></span> -->
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
/* ClientVisitsPosts.vue (updated UI)
   - removed filters sidebar
   - workers rendered as chips
   - removed call phone action
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

const infiniteObserverSupported = typeof IntersectionObserver !== "undefined";
const sentinel = ref(null);
let observer = null;

const filters = reactive({
  search: "",
  city: "",
  pinCode: "",
  status: "",
});

const pageStateKey = "client_my_posts_page_state";

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

    const res = await fetchMyPosts(params);
    const meta = res?.data?.meta || res?.meta || {};
    const data = res?.data?.data || res?.data || [];

    totalItems.value =
      meta?.total || (page.value === 1 ? data.length : totalItems.value);
    totalPages.value =
      meta?.pages ||
      Math.ceil((meta?.total || data.length) / (meta?.limit || limit.value));
    page.value = meta?.page || p;

    if (p === 1) posts.value = data;
    else posts.value = posts.value.concat(data);
  } catch (err) {
    console.error("Failed to load posts", err);
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
  router.push({ name: "ClientPostEdit", params: { id: post._id } });
}

async function confirmDelete(post) {
  try {
    await ElMessageBox.confirm(`Delete post "${post.title}"?`, "Confirm", {
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      type: "warning",
    });
    await deleteClientPost(post._id);
    ElMessage({ message: "Job Post deleted", type: "success" });
    resetAndFetch();
  } catch (err) {
    // cancelled or failed
  }
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
