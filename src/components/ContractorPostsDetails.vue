<template>
  <div class="contractor-post-detail" v-if="contractor">
    <div class="contractor-card">
      <!-- Header -->
      <div class="card-header">
        <h2 class="contractor-name">{{ contractor.name }}</h2>
        <span class="status" :class="contractor.status">{{
          contractor.status
        }}</span>
      </div>

      <!-- Contact Info -->
      <div class="contact-info">
        <p class="label">Phone</p>
        <a :href="`tel:${contractor.phone}`" class="phone">{{
          contractor.phone
        }}</a>
      </div>

      <!-- Location Info -->
      <div class="location-info">
        <div class="info-row">
          <p class="label">City</p>
          <h4 class="value">{{ contractor.city }}</h4>
        </div>
        <div class="info-row">
          <p class="label">Location</p>
          <p class="value">{{ contractor.location }}</p>
        </div>
        <div class="info-row">
          <p class="label">Pincode</p>
          <h4 class="value">{{ contractor.pincode }}</h4>
        </div>
      </div>

      <!-- Workers -->
      <div class="worker-section">
        <p class="label">Available Workers</p>
        <el-table
          :data="contractor.workers"
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
import { useRoute } from "vue-router";
import { ref } from "vue";

// Mock contractor posts data (replace with API later)
const contractorPosts = [
  {
    id: 1,
    name: "Tony",
    phone: "+917396547852",
    city: "Hyderabad",
    location: "Gachibowli, SBI Bank Road",
    pincode: "500032",
    status: "open",
    workers: [
      { type: "Mason", count: 26, status: "open" },
      { type: "Helpers", count: 55, status: "open" },
      { type: "Rod Benders", count: 8, status: "closed" },
    ],
  },
  {
    id: 2,
    name: "Ramesh",
    phone: "+919876543210",
    city: "Hyderabad",
    location: "Miyapur",
    pincode: "500049",
    status: "closed",
    workers: [
      { type: "Plumber", count: 10, status: "open" },
      { type: "Electrician", count: 5, status: "closed" },
    ],
  },
];

// const route = useRoute();
// const contractorId = Number(route.params.id);
const contractor = ref(contractorPosts.find((c, i) => c.id));
</script>
