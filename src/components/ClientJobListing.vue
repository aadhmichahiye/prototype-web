<template>
  <div class="contractor-list">
    <div
      v-for="contractor in contractors"
      :key="contractor.id"
      class="contractor-card"
    >
      <div class="contractor-info">
        <h2 class="contractor-name">{{ contractor.name }}</h2>
        <p class="contractor-type">
          {{ contractor.workerType }} - {{ contractor.count }}
        </p>
        <div class="contractor-location">
          <i class="ri-map-pin-line"></i>
          <span>{{ contractor.location }}</span>
        </div>
      </div>

      <div class="contractor-status">
        <span :class="contractor.status">{{ contractor.status }}</span>
        <button class="contact-btn">contact details</button>
      </div>
    </div>
  </div>
</template>

<script setup>
const contractors = [
  {
    id: 1,
    name: "tony",
    workerType: "mason",
    count: 26,
    location: "Hyderabad, locharam",
    status: "open",
  },
  {
    id: 2,
    name: "tony",
    workerType: "helpers",
    count: 55,
    location: "Hyderabad, locharam",
    status: "open",
  },
];
</script>

<style lang="scss" scoped>
.contractor-list {
  display: flex;
  flex-direction: column;
  padding: 100px 16px;
  gap: 1rem;
}

.contractor-card {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border: 1px solid #ddd;
  border-radius: 1rem;
  padding: 1rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  background: #fff;

  .contractor-info {
    .contractor-name {
      font-weight: 600;
      margin-bottom: 0.25rem;
    }

    .contractor-type {
      color: #2563eb; // blue
      font-weight: 500;
    }

    .contractor-location {
      display: flex;
      align-items: center;
      color: #2563eb;
      margin-top: 0.5rem;

      i {
        margin-right: 0.25rem;
      }
    }
  }

  .contractor-status {
    display: flex;
    flex-direction: column;
    align-items: flex-end;

    span.open {
      color: #16a34a; // green
      font-weight: 600;
    }

    span.closed {
      color: #dc2626; // red
      font-weight: 600;
    }

    .contact-btn {
      border: 1px solid #333;
      border-radius: 0.5rem;
      padding: 0.25rem 0.75rem;
      margin-top: 0.5rem;
      background: transparent;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: #f5f5f5;
      }
    }
  }
}
</style>
