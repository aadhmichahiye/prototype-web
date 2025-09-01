<template>
  <div class="job-listing-container">
    <!-- Empty state -->
    <div v-if="!jobs.length" class="empty-state">
      <div class="empty-card">
        <h3>No Jobs Posted</h3>
        <p>You need to post a job to see contractor details.</p>
      </div>
    </div>

    <!-- Data state -->
    <div v-else class="job-list">
      <div v-for="(job, index) in jobs" :key="index" class="job-card">
        <h3 class="job-title">{{ job.title }}</h3>
        <p class="job-desc">{{ job.description }}</p>
        <div class="job-meta">
          <span class="job-location">📍 {{ job.location }}</span>
          <span class="job-workers">👷 {{ job.workers }} workers</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

// Fake jobs data → later replace with API
const jobs = ref([
  {
    title: "Construction Labor Needed",
    description: "Looking for 20 laborers for a 2-month project.",
    location: "Hyderabad",
    workers: 20,
  },
  {
    title: "Electrical Work",
    description: "Need 5 electricians for wiring in an apartment project.",
    location: "Hyderabad",
    workers: 5,
  },
]);
</script>

<style scoped>
.job-listing-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
}

/* Empty state */
.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 40vh;
}
.empty-card {
  border: 1px dashed #aaa;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  max-width: 500px;
  width: 100%;
  background: #fafafa;
}
.empty-card h3 {
  margin-bottom: 8px;
  font-size: 20px;
  color: #222;
}
.empty-card p {
  font-size: 14px;
  color: #555;
}

/* Job cards */
.job-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.job-card {
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 20px;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}
.job-title {
  font-size: 18px;
  margin-bottom: 8px;
  font-weight: 600;
  color: #111;
}
.job-desc {
  font-size: 14px;
  color: #444;
  margin-bottom: 12px;
}
.job-meta {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #666;
}

/* Responsive tweaks */
@media (min-width: 768px) {
  .job-listing-container {
    padding: 32px;
  }
  .job-card {
    padding: 28px;
  }
}
</style>
