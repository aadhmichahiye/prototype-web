<template>
  <div class="contractor-post-detail">
    <!-- Filters Info -->
    <p class="filters-text">No filters applied</p>

    <!-- Contractor Card -->
    <div class="contractor-card">
      <div class="card-header">
        <div>
          <p class="label">contractor name</p>
          <h3 class="value">{{ contractor.name }}</h3>
        </div>
        <div class="text-right">
          <p class="label">contractor number</p>
          <a :href="`tel:${contractor.phone}`" class="phone">
            {{ contractor.phone }}
          </a>
        </div>
      </div>

      <div class="card-body">
        <div class="info-row">
          <p class="label">city</p>
          <h4 class="value">{{ contractor.city }}</h4>
        </div>

        <div class="info-row">
          <p class="label">location</p>
          <div class="location">
            <i class="ri-map-pin-line"></i>
            <span>{{ contractor.address }}</span>
          </div>
        </div>
      </div>

      <!-- Worker List -->
      <div class="worker-section">
        <p class="label">available workers for this contractor</p>

        <el-table
          :data="contractor.workers"
          border
          style="width: 100%"
          class="workers-table"
        >
          <el-table-column prop="type" label="Type" />
          <el-table-column prop="count" label="Count" />
          <el-table-column label="Status">
            <template #default="scope">
              <span class="status" :class="scope.row.status">
                {{ scope.row.status }}
              </span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script setup>
import MainLayout from "../layouts/MainLayout.vue";

const contractor = {
  name: "Tony",
  phone: "+917396547852",
  city: "Hyderabad",
  address: "Gachibowli, SBI bank road, 584562",
  workers: [
    { type: "mason", count: 26, status: "open" },
    { type: "helpers", count: 55, status: "open" },
    { type: "rod benders", count: 8, status: "open" },
  ],
};
</script>

<style lang="scss" scoped>
.contractor-post-detail {
  padding: 5rem 1rem;

  .filters-text {
    font-size: 0.9rem;
    color: #555;
    margin-bottom: 1rem;
  }

  .contractor-card {
    border: 1px solid #ddd;
    border-radius: 1rem;
    padding: 1.5rem;
    background: #fff;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;

    .label {
      font-size: 0.8rem;
      color: #888;
      margin-bottom: 0.25rem;
    }

    .value {
      font-size: 1rem;
      font-weight: 600;
      color: #111;
    }

    .phone {
      color: #2563eb;
      font-weight: 600;
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .info-row {
      margin-bottom: 1rem;

      .location {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        font-size: 0.95rem;
        color: #333;
      }
    }

    .worker-section {
      .workers-table {
        border-radius: 0.5rem;
        overflow: hidden;
      }

      .status {
        font-weight: 600;

        &.open {
          color: #16a34a; // green
        }
        &.closed {
          color: #dc2626; // red
        }
      }
    }
  }
}

/* Responsive */
@media (max-width: 768px) {
  .contractor-card {
    padding: 1rem;
  }

  .card-header {
    flex-direction: column;
    align-items: flex-start !important;
  }

  .phone {
    font-size: 0.95rem;
  }
}
</style>
