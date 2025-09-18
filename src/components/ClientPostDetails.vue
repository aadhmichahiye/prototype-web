<template>
  <div class="client-post-detail">
    <!-- Job Card -->
    <div class="client-card" v-if="!loading">
      <!-- Header -->
      <div class="card-header">
        <div>
          <p class="label">Job Title</p>
          <h3 class="value">{{ post.title }}</h3>
        </div>
        <div class="text-right">
          <p class="label">Status</p>
          <span class="status" :class="post.status">{{ post.status }}</span>
        </div>
      </div>

      <!-- Description -->
      <div class="card-section">
        <p class="label">Description</p>
        <p class="description">{{ post.description }}</p>
      </div>

      <!-- Location Info -->
      <div class="card-section location-info">
        <div class="info-row">
          <p class="label">City</p>
          <h4 class="value">{{ post.city }}</h4>
        </div>
        <div class="info-row">
          <p class="label">Address</p>
          <div class="location">
            <i class="ri-map-pin-line"></i>
            <span>{{ post.address }}</span>
          </div>
        </div>
        <div class="info-row">
          <p class="label">Pincode</p>
          <h4 class="value">{{ post.pincode }}</h4>
        </div>
      </div>

      <!-- Workers -->
      <div class="worker-section">
        <p class="label">Required Workers</p>
        <el-table
          :data="post.workers"
          border
          style="width: 100%"
          class="workers-table"
        >
          <el-table-column prop="type" label="Worker Type" />
          <el-table-column prop="count" label="Count" />
        </el-table>
      </div>

      <!-- Footer -->
      <div class="footer">
        <el-button
          v-if="post.contactPhone"
          type="primary"
          class="contact-btn"
          @click="callClient"
        >
          Contact Client
        </el-button>
      </div>
    </div>

    <div
      v-if="loading"
      class="loading-state"
      style="padding: 2rem; text-align: center"
    >
      <el-skeleton :rows="6" animated />
    </div>

    <div
      v-if="!loading && error"
      class="error-state"
      style="padding: 2rem; text-align: center"
    >
      <p style="color: #b91c1c">{{ error }}</p>
      <el-button type="primary" @click="goBack">Back to My Posts</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElNotification } from "element-plus";
import { getClientPostDetails } from "../api/client"; // ensure this exists and returns axios-like response

const route = useRoute();
const router = useRouter();

const postId = route.params.id;
const loading = ref(false);
const error = ref(null);

const post = ref({
  title: "",
  description: "",
  city: "",
  address: "",
  pincode: "",
  status: "",
  workers: [],
  contactPhone: "",
});

// helper to map backend response -> post structure
function mapApiToPost(apiData) {
  if (!apiData) return;

  const workers = Array.isArray(apiData.requiredWorkers)
    ? apiData.requiredWorkers.map((w) => ({
        type: w.type || "",
        count: w.count || 0,
      }))
    : [];

  return {
    title: apiData.title || "",
    description: apiData.description || "",
    city: apiData.city || "",
    address: apiData.location || apiData.address || "",
    pincode: apiData.pinCode || apiData.pincode || "",
    status: apiData.status || "",
    workers,
    contactPhone: apiData.contactDetails?.phone || "",
    raw: apiData,
  };
}

async function loadPost(id) {
  if (!id) {
    error.value = "Invalid post id";
    ElNotification({
      title: "Error",
      message: "Invalid post id",
      type: "error",
    });
    // redirect after short delay to give user feedback
    setTimeout(() => router.push("/client-posts/my-posts"), 700);
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    // expected axios-like: res.data = { message, data }
    const res = await getClientPostDetails(id);
    const payload = res?.data || {};
    const apiData = payload.data || payload; // support helpers that return raw data

    if (!apiData) {
      error.value = "Post not found";
      ElNotification({
        title: "Error",
        message: "Post not found",
        type: "error",
      });
      setTimeout(() => router.push("/client-posts/my-posts"), 700);
      return;
    }

    const mapped = mapApiToPost(apiData);
    post.value = mapped;
  } catch (err) {
    console.error("Failed to fetch client post details:", err);
    const msg =
      err?.response?.data?.message ||
      err?.message ||
      "Failed to load post details";
    error.value = msg;
    ElNotification({ title: "Error", message: msg, type: "error" });
    // optionally redirect user back to my-posts after showing error
    router.push("/client-posts/list");
  } finally {
    loading.value = false;
  }
}

function callClient() {
  if (!post.value.contactPhone) return;
  window.location.href = `tel:${post.value.contactPhone}`;
}

function goBack() {
  router.back();
}

onMounted(() => {
  loadPost(postId);
});
</script>
