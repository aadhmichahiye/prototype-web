<template>
  <SearchBar @search="updateSearch" />
  <div class="contractor-post-list">
    <div
      v-for="post in contractorPosts"
      :key="post.id"
      class="contractor-post-card"
    >
      <!-- Header -->
      <div class="card-header">
        <div>
          <h3 class="contractor-name">{{ post.name }}</h3>
          <p class="city">{{ post.city }}</p>
          <p class="location">{{ post.location }}</p>
          <p class="pincode">Pin: {{ post.pincode }}</p>
        </div>
        <div class="meta">
          <span class="status" :class="post.status">{{ post.status }}</span>
        </div>
      </div>

      <!-- Workers -->
      <div class="workers">
        <p class="label">Available workers:</p>
        <ul>
          <li v-for="(worker, index) in post.workers" :key="index">
            {{ worker.type }} - {{ worker.count }}
          </li>
        </ul>
      </div>

      <!-- Footer -->
      <div class="footer">
        <el-button
          type="primary"
          size="small"
          class="contact-btn"
          @click="handleViewDetails(post)"
        >
          Contact Contractor
        </el-button>
      </div>
    </div>

    <!-- optional load more area if needed by UI -->
    <div v-if="hasMore" style="text-align: center; margin-top: 1rem">
      <el-button type="primary" @click="loadMore" :loading="loading">
        Load more
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import SearchBar from "./SearchBar.vue";
import { fetchContractorsApi } from "../api/contractor"; // must return axios-like response { data: { message, meta, data } }

const router = useRouter();

const contractorPosts = ref([]); // data used by template (card list)
const loading = ref(false);
const error = ref(null);

const page = ref(1);
const limit = ref(10); // change if you want different page size
const hasMore = ref(true);

const searchQuery = ref(""); // current search text

// --- map one manpower-post item from backend into your card shape ---
// backend item shape expected:
// {
//   _id, details (contractor id), title, name, city, location, pinCode,
//   status, contactDetails: { phone }, availableWorkers: [ { _id, type, count, status } ], createdAt, updatedAt
// }
function mapPostToCard(post) {
  // pick primary workers array (availableWorkers)
  const workersArr = Array.isArray(post.availableWorkers)
    ? post.availableWorkers
    : [];

  // transform workers into simple { type, count } items used by your template
  const workers = workersArr.map((w) => ({
    type: w.type || "worker",
    count: w.count || 0,
    _id: w._id,
    status: w.status || "available",
  }));

  return {
    id: post._id,
    // display name: prefer post.name, fallback to title or contractor id
    name: post.name || post.title || `Contractor ${post.details || ""}`,
    city: post.city || "",
    location: post.location || "",
    pincode: post.pinCode || post.pin || "",
    status: post.status || "open",
    workers,
    raw: post, // keep raw for navigation/details
  };
}

/**
 * Fetch manpower-posts (paged)
 * - opts.q overrides searchQuery for this call
 * - opts.reset = true will reset posts + page counter
 *
 * Important: only increment page for subsequent pagination, not for search/reset.
 */
async function fetchContractors({ q = "", reset = false } = {}) {
  if (loading.value) return;
  loading.value = true;
  error.value = null;

  try {
    if (reset) {
      page.value = 1;
      contractorPosts.value = [];
      hasMore.value = true;
    }

    // choose effective query: explicit q wins; otherwise use searchQuery if present
    const effectiveQ =
      typeof q === "string" && q.length > 0
        ? q
        : searchQuery.value || undefined;

    const params = {
      page: page.value,
      limit: limit.value,
    };
    if (effectiveQ) params.search = effectiveQ;

    const res = await fetchContractorsApi(params);
    // expected res.data = { message, meta, data }
    const payload = res.data || {};
    const posts = payload?.data || [];
    const meta = payload?.meta || { page: page.value, pages: 1 };

    // map and append
    const mapped = posts.map(mapPostToCard);

    if (reset) {
      contractorPosts.value = mapped;
    } else {
      contractorPosts.value.push(...mapped);
    }

    // determine if more pages exist
    const currentPage = meta.page || page.value;
    const pages = meta.pages || 1;
    hasMore.value = currentPage < pages;

    // increment page for next call (only for pagination)
    page.value = currentPage + 1;
  } catch (err) {
    console.error("Error fetching manpower posts:", err);
    error.value =
      err.response?.data?.message || err.message || "Failed to load";
  } finally {
    loading.value = false;
  }
}

/* ---------- SEARCH HANDLER ---------- */
/**
 * Called by SearchBar @search
 * Always reset page & items to avoid treating search change as "load more".
 */
function updateSearch(value) {
  searchQuery.value = value || "";
  fetchContractors({ q: searchQuery.value, reset: true });
}

// call on mount - initial load (reset true)
onMounted(() => {
  fetchContractors({ reset: true });
});

// click handler: navigate to details page for manpower post
function handleViewDetails(post) {
  // post.raw is the backend item; use manpower post id for details route
  const manpowerId = post.raw?._id || post.id;
  if (manpowerId) {
    router.push(`/contractor-posts/details/${manpowerId}`);
  } else {
    // fallback to contractor details by contractor id
    const contractorId = post.raw?.details;
    if (contractorId) router.push(`/contractor-posts/${contractorId}`);
  }
}

// optional: expose loadMore for "Load more" button or infinite scroll
function loadMore() {
  if (loading.value || !hasMore.value) return;
  fetchContractors();
}
</script>
