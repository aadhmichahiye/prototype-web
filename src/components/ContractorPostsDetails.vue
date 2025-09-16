<template>
  <div class="contractor-post-detail" v-if="contractor">
    <div class="contractor-card">
      <!-- Header -->
      <div class="card-header">
        <h2 class="contractor-name">{{ contractor.name || "-" }}</h2>
        <span class="status" :class="contractor.status">{{
          contractor.status
        }}</span>
      </div>

      <!-- Contact Info -->
      <div class="contact-info">
        <p class="label">Phone</p>
        <a :href="`tel:${contractor?.contactDetails?.phone}`" class="phone">{{
          contractor?.contactDetails?.phone
        }}</a>
      </div>

      <!-- Location Info -->
      <div class="location-info">
        <div class="info-row">
          <p class="label">City</p>
          <h4 class="value">{{ contractor.city || "-" }}</h4>
        </div>
        <div class="info-row">
          <p class="label">Location</p>
          <p class="value">{{ contractor.location || "-" }}</p>
        </div>
        <div class="info-row">
          <p class="label">Pincode</p>
          <h4 class="value">{{ contractor.pinCode || "-" }}</h4>
        </div>
      </div>

      <!-- Workers -->
      <div class="worker-section">
        <p class="label">Available Workers</p>
        <el-table
          :data="contractor.availableWorkers"
          border
          style="width: 100%"
          class="workers-table"
        >
          <el-table-column prop="type" label="Worker Type" />
          <el-table-column prop="count" label="Count" />
          <el-table-column prop="status" label="Status">
            <template #default="scope">
              <span class="worker-status" :class="scope.row.status">
                {{ scope.row.status }}
              </span>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- Footer -->
      <div class="footer">
        <a :href="`tel:${contractor.phone}`">
          <el-button type="primary" class="call-btn">
            <i class="ri-phone-line"></i> Call Contractor
          </el-button>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { ref, onMounted, reactive } from "vue";
import { ElNotification } from "element-plus";
import { getContractorPostDetails } from "../api/contractor";

const route = useRoute();
const router = useRouter();
const loading = ref(false);

// const route = useRoute();
// const contractorId = Number(route.params.id);
const contractor = ref({});

const id = route.params.id;

async function fetchContractorPost(postId) {
  loading.value = true;
  try {
    const resp = await getContractorPostDetails(postId);
    if (resp.status === 200) {
      let apiData = resp?.data ?? null;
      contractor.value = apiData.data;
    }
  } catch (err) {
    console.error("Failed to fetch contractor post, using fallback:", err);
    ElNotification("warning", "Failed to fetch contractor post");
    router.back();
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  // if no id, still render fallback
  if (!id) {
    ElNotification("warning", "Failed to fetch contractor post");
    router.back();
    return;
  }
  fetchContractorPost(id);
});
</script>
