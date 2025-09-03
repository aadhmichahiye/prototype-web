<template>
  <div class="client-post-detail">
    <!-- Job Card -->
    <div class="client-card">
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
        <el-button type="primary" class="contact-btn">
          Contact Client
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
const route = useRoute();
const postId = route.params.id;
const post = {
  id: 1,
  title: "Mason Requirement",
  description: "Need 10 masons and 20 helpers for construction site.",
  city: "Hyderabad",
  address: "Gachibowli, Near SBI Bank Road",
  pincode: "500032",
  status: "open",
  workers: [
    { type: "Mason", count: 10 },
    { type: "Helpers", count: 20 },
  ],
};
</script>
