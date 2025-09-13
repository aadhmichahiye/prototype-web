<template>
  <div class="home-page">
    <header class="site-header">
      <div class="brand" @click="goHome">Aadhmichahiye</div>

      <div class="header-cta">
        <el-button plain class="register-btn" @click="goRegister">
          <i class="ri-user-add-line"></i>
          <span>Register</span>
        </el-button>
      </div>
    </header>

    <main class="hero" role="main">
      <div class="hero-inner">
        <div class="hero-left">
          <div class="eyebrow">Aadhmichahiye</div>

          <h1 class="hero-title">
            Find reliable workers fast — post jobs, discover contractors, hire
            quickly.
          </h1>

          <p class="hero-sub">
            Lightweight, secure and built for speed. Post jobs, get matched with
            contractors, and manage hires — all through a simple PIN-based
            workflow.
          </p>

          <div class="hero-ctas">
            <!-- Login is primary (per your choice) -->
            <el-button type="primary" class="cta-login" @click="goLogin">
              <i class="ri-login-circle-line"></i>
              <span>Login</span>
            </el-button>

            <el-button plain class="cta-register" @click="goRegister">
              <i class="ri-user-add-line"></i>
              <span>Register</span>
            </el-button>
          </div>

          <ul class="features">
            <li><i class="ri-check-line"></i> PIN-based secure login</li>
            <li><i class="ri-check-line"></i> Quick job posting & search</li>
            <li><i class="ri-check-line"></i> Contractor & client workflows</li>
          </ul>
        </div>

        <div class="hero-right" aria-hidden="true">
          <!-- keep simple illustration -->
          <svg
            class="hero-illustration"
            viewBox="0 0 600 420"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="g" x1="0" x2="1">
                <stop offset="0" stop-color="#FFF5EE" />
                <stop offset="1" stop-color="#FFF9F6" />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" rx="20" fill="url(#g)" />
            <g transform="translate(60,40)">
              <rect
                x="120"
                y="56"
                width="220"
                height="18"
                rx="6"
                fill="#FF9045"
              />
              <circle cx="230" cy="40" r="30" fill="#FF4500" />
              <rect
                x="180"
                y="96"
                width="18"
                height="110"
                rx="6"
                fill="#FF4500"
              />
              <rect
                x="260"
                y="96"
                width="18"
                height="110"
                rx="6"
                fill="#FF4500"
              />
            </g>
            <text x="28" y="380" font-size="12" fill="#666">
              Aadhmichahiye — connect & hire
            </text>
          </svg>
        </div>
      </div>
    </main>

    <section class="how-it-works">
      <div class="card">
        <h2>How it works</h2>
        <div class="steps">
          <div class="step">
            <div class="num">1</div>
            <div class="desc">
              Create a job post with title, location and needed workers.
            </div>
          </div>
          <div class="step">
            <div class="num">2</div>
            <div class="desc">
              Contractors respond with available workers and contact info.
            </div>
          </div>
          <div class="step">
            <div class="num">3</div>
            <div class="desc">Connect, confirm and manage hires.</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Floating Login button — centered at bottom -->
    <button class="floating-login" @click="goLogin" aria-label="Login">
      <i class="ri-login-circle-line"></i>
      <span class="floating-text">Login</span>
    </button>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../stores/userStore";

const router = useRouter();
const userStore = useUserStore();

onMounted(() => {
  // hydrate store if available
  if (userStore.pageLoadedORRefreshed) {
    try {
      userStore.pageLoadedORRefreshed();
    } catch (e) {}
  }

  // if logged in, redirect (adjust route if your default differs)
  const token = userStore?.token;
  const hasUser =
    userStore?.userData && Object.keys(userStore.userData).length > 0;
  if (token || hasUser) {
    router.push("/contractor-posts/list");
  }
});

function goLogin() {
  router.push("/login");
}
function goRegister() {
  router.push("/register");
}
function goHome() {
  router.push("/");
}
</script>
