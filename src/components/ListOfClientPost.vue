<template>
  <SearchBar />
  <div class="client-post-list">
    <div v-for="post in posts" :key="post.id" class="client-post-card">
      <div class="card-header">
        <h3 class="title">{{ post.title }}</h3>
        <div>
          <div class="meta">
            <span class="location">{{ post.city }}</span>
            <span class="pincode">{{ post.pincode }}</span>
          </div>
        </div>
      </div>

      <p class="description">{{ post.description }}</p>
      <p class="address">{{ post.address }}</p>

      <div class="workers">
        <p class="label">Needed workers:</p>
        <ul>
          <li v-for="(worker, index) in post.workers" :key="index">
            {{ worker.type }} - {{ worker.count }}
          </li>
        </ul>
      </div>

      <div class="footer">
        <p class="status">{{ post.status }}</p>
        <el-button
          type="primary"
          size="small"
          class="contact-btn"
          @click="handleViewDetails(post)"
        >
          View Details
        </el-button>
      </div>
    </div>

    <!-- optional load more if you want (keeps UI unchanged unless you add button) -->
    <div v-if="hasMore" style="text-align: center; margin-top: 1rem">
      <el-button type="primary" @click="loadMore" :loading="loading"
        >Load more</el-button
      >
    </div>
  </div>
</template>

<script setup>
/*
  Client posts list logic — mirrored from your contractor-list reference.
  - Uses fetchClientPostsApi(params) from ../api/client (axios-like returning { data: { message, meta, data } })
  - Maps backend shape to the template shape (id, title, description, address, city, pincode, workers[], status)
  - Pagination + load more
  - No template or styling changes
*/

import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import SearchBar from "./SearchBar.vue";
import { fetchClientPostsForContractors } from "../api/client"; // <-- ensure this export exists (or rename to your helper)

const router = useRouter();

const posts = ref([]);
const loading = ref(false);
const error = ref(null);

const page = ref(1);
const limit = ref(10);
const hasMore = ref(true);

/**
 * Map backend client-post item to the card shape used by the template
 * Backend expected fields (example):
 *   { _id, title, description, city, location, pinCode, status, requiredWorkers: [ { type, count, status } ], createdAt, updatedAt, contactDetails }
 */
function mapPostToCard(post) {
  const workersArr = Array.isArray(post.requiredWorkers)
    ? post.requiredWorkers
    : [];
  const workers = workersArr.map((w) => ({
    type: w.type || "worker",
    count: w.count || 0,
    status: w.status || "open",
  }));

  return {
    id: post._id,
    title: post.title || post.name || "Untitled",
    description: post.description || "",
    address: post.location || post.address || "",
    city: post.city || "",
    pincode: post.pinCode || post.pincode || "",
    workers,
    status: post.status || "open",
    raw: post, // keep raw for navigation/details if needed
  };
}

/**
 * Fetch client posts (paged)
 * @param {Object} opts - { q, reset }
 */
async function fetchClientPosts({ q = "", reset = false } = {}) {
  if (loading.value) return;
  loading.value = true;
  error.value = null;

  try {
    if (reset) {
      page.value = 1;
      posts.value = [];
      hasMore.value = true;
    }

    const params = {
      page: page.value,
      limit: limit.value,
    };
    if (q) params.search = q;

    const res = await fetchClientPostsForContractors(params);
    // expected res.data = { message, meta, data }
    const payload = res.data || {};
    const items = payload.data || [];
    const meta = payload.meta || { page: 1, pages: 1 };

    const mapped = items.map(mapPostToCard);

    if (reset) posts.value = mapped;
    else posts.value.push(...mapped);

    // determine if more pages exist
    hasMore.value = (meta.page || page.value) < (meta.pages || 1);

    // increment page for next call
    page.value = (meta.page || page.value) + 1;
  } catch (err) {
    console.error("Error fetching client posts:", err);
    error.value =
      err.response?.data?.message || err.message || "Failed to load";
  } finally {
    loading.value = false;
  }
}

// initial load
onMounted(() => {
  fetchClientPosts({ reset: true });
});

// navigate to details page for client post
function handleViewDetails(post) {
  const postId = post.raw?._id || post.id;
  if (postId) {
    router.push(`/client-posts/details/${postId}`);
  }
}

// load more
function loadMore() {
  if (loading.value || !hasMore.value) return;
  fetchClientPosts();
}
</script>
