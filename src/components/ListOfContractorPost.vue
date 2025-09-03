<template>
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
        <el-button type="primary" size="small" class="contact-btn">
          Contact Client
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
const contractorPosts = [
  {
    id: 1,
    name: "Tony",
    city: "Hyderabad",
    location: "Gachibowli",
    pincode: "500032",
    status: "open",
    workers: [{ type: "Mason", count: 25 }],
  },
  {
    id: 2,
    name: "Ramesh",
    city: "Hyderabad",
    location: "Kukatpally",
    pincode: "500072",
    status: "open",
    workers: [
      { type: "Helpers", count: 40 },
      { type: "Electrician", count: 5 },
    ],
  },
  {
    id: 3,
    name: "Suresh",
    city: "Hyderabad",
    location: "Miyapur",
    pincode: "500049",
    status: "closed",
    workers: [{ type: "Rod Benders", count: 12 }],
  },
  {
    id: 4,
    name: "Vikram",
    city: "Hyderabad",
    location: "Secunderabad",
    pincode: "500003",
    status: "open",
    workers: [{ type: "Electrician", count: 8 }],
  },
  {
    id: 5,
    name: "Ravi",
    city: "Hyderabad",
    location: "Patancheru",
    pincode: "502319",
    status: "open",
    workers: [{ type: "Helpers", count: 60 }],
  },
  {
    id: 6,
    name: "Arun",
    city: "Hyderabad",
    location: "Kompally",
    pincode: "500014",
    status: "closed",
    workers: [
      { type: "Mason", count: 20 },
      { type: "Plumber", count: 6 },
    ],
  },
  {
    id: 7,
    name: "Vijay",
    city: "Hyderabad",
    location: "LB Nagar",
    pincode: "500074",
    status: "open",
    workers: [
      { type: "Carpenter", count: 5 },
      { type: "Painter", count: 8 },
    ],
  },
  {
    id: 8,
    name: "Krishna",
    city: "Hyderabad",
    location: "Hitech City",
    pincode: "500081",
    status: "open",
    workers: [
      { type: "Helpers", count: 70 },
      { type: "Electrician", count: 15 },
    ],
  },
  {
    id: 9,
    name: "Mohan",
    city: "Hyderabad",
    location: "Locharam",
    pincode: "500034",
    status: "closed",
    workers: [{ type: "Helpers", count: 30 }],
  },
  {
    id: 10,
    name: "Anil",
    city: "Hyderabad",
    location: "Banjara Hills",
    pincode: "500045",
    status: "open",
    workers: [{ type: "Plumber", count: 10 }],
  },
];
</script>
