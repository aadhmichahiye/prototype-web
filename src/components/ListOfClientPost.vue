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
        <p>open</p>
        <el-button
          type="primary"
          size="small"
          class="contact-btn"
          @click="handleViewDetails"
        >
          Contact Client
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import SearchBar from "./SearchBar.vue";
const router = useRouter();
const posts = [
  {
    id: 1,
    title: "Mason Requirement",
    description: "Need masons for a 2-month residential project.",
    address: "Gachibowli, Hyderabad",
    city: "Hyderabad",
    pincode: "500032",
    workers: [{ type: "Mason", count: 25 }],
  },
  {
    id: 2,
    title: "Large Construction Project",
    description: "Looking for helpers and electricians for a new site.",
    address: "Locharam, Hyderabad",
    city: "Hyderabad",
    pincode: "500034",
    workers: [
      { type: "Helpers", count: 50 },
      { type: "Electrician", count: 5 },
    ],
  },
  {
    id: 3,
    title: "Plumbing Work",
    description: "Need experienced plumbers for 1-week repair work.",
    address: "Banjara Hills, Hyderabad",
    city: "Hyderabad",
    pincode: "500045",
    workers: [{ type: "Plumber", count: 10 }],
  },
  {
    id: 4,
    title: "Warehouse Setup",
    description: "Looking for 40 helpers for warehouse arrangement.",
    address: "Kukatpally, Hyderabad",
    city: "Hyderabad",
    pincode: "500072",
    workers: [{ type: "Helpers", count: 40 }],
  },
  {
    id: 5,
    title: "Road Construction",
    description: "Need masons and rod benders for road project.",
    address: "Miyapur, Hyderabad",
    city: "Hyderabad",
    pincode: "500049",
    workers: [
      { type: "Mason", count: 15 },
      { type: "Rod Benders", count: 12 },
    ],
  },
  {
    id: 6,
    title: "House Wiring",
    description: "Looking for electricians for a housing complex.",
    address: "Secunderabad",
    city: "Hyderabad",
    pincode: "500003",
    workers: [{ type: "Electrician", count: 8 }],
  },
  {
    id: 7,
    title: "Factory Setup",
    description: "Helpers required for machinery installation.",
    address: "Patancheru Industrial Area",
    city: "Hyderabad",
    pincode: "502319",
    workers: [{ type: "Helpers", count: 60 }],
  },
  {
    id: 8,
    title: "New Apartment Construction",
    description: "Masons and plumbers required for multi-floor work.",
    address: "Kompally, Hyderabad",
    city: "Hyderabad",
    pincode: "500014",
    workers: [
      { type: "Mason", count: 20 },
      { type: "Plumber", count: 6 },
    ],
  },
  {
    id: 9,
    title: "School Renovation",
    description: "Looking for carpenters and painters.",
    address: "LB Nagar, Hyderabad",
    city: "Hyderabad",
    pincode: "500074",
    workers: [
      { type: "Carpenter", count: 5 },
      { type: "Painter", count: 8 },
    ],
  },
  {
    id: 10,
    title: "Mall Construction",
    description: "Helpers and electricians needed urgently.",
    address: "Hitech City, Hyderabad",
    city: "Hyderabad",
    pincode: "500081",
    workers: [
      { type: "Helpers", count: 70 },
      { type: "Electrician", count: 15 },
    ],
  },
];

const handleViewDetails = () => {
  router.push("/client-posts/details/id");
};
</script>
