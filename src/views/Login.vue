<template>
  <div class="login-page">
    <!-- Left SVG Illustration (desktop only) -->
    <div class="illustration">
      <svg viewBox="0 0 500 500" class="hero-svg">
        <circle cx="250" cy="250" r="200" fill="#FFE5D0" />
        <rect x="120" y="260" width="260" height="40" rx="8" fill="#FF4500" />
        <circle cx="200" cy="200" r="30" fill="#FF4500" />
        <circle cx="300" cy="200" r="30" fill="#FF4500" />
        <text x="250" y="380" text-anchor="middle" font-size="20" fill="#333">
          Welcome Back
        </text>
      </svg>
    </div>

    <!-- Right Form -->
    <div class="form-section">
      <h2 class="title"><i class="ri-login-circle-line"></i> Login</h2>
      <p class="subtitle">Login with your phone and 6-digit PIN</p>

      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="rules"
        label-position="top"
        class="login-form"
        v-loading="loading"
      >
        <!-- Phone -->
        <el-form-item label="Phone Number" prop="phone">
          <el-input
            v-model="loginForm.phone"
            placeholder="9876543210"
            maxlength="10"
            clearable
          />
        </el-form-item>

        <!-- PIN -->
        <el-form-item label="6-Digit PIN" prop="pin">
          <el-input
            v-model="loginForm.pin"
            placeholder="******"
            maxlength="6"
            show-password
          />
        </el-form-item>

        <!-- Submit -->
        <el-form-item>
          <el-button type="primary" class="login-btn" @click="handleLogin">
            <i class="ri-login-circle-line"></i> Login
          </el-button>
        </el-form-item>
      </el-form>

      <!-- Register redirect -->
      <div class="register-redirect">
        Not a user?
        <router-link to="/register" class="register-link">Register</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { ElNotification } from "element-plus";
import { userLogin } from "../api/user";
import { useUserStore } from "../stores/userStore";

const router = useRouter();
const loginFormRef = ref();
const loading = ref(false);
const UserStore = useUserStore();

const loginForm = reactive({
  phone: "",
  pin: "",
});

const rules = {
  phone: [
    { required: true, message: "Phone number is required", trigger: "blur" },
    {
      pattern: /^[0-9]{10}$/,
      message: "Enter valid 10-digit phone",
      trigger: "blur",
    },
  ],
  pin: [
    { required: true, message: "PIN is required", trigger: "blur" },
    { pattern: /^[0-9]{6}$/, message: "PIN must be 6 digits", trigger: "blur" },
  ],
};

async function handleLogin() {
  loginFormRef.value.validate(async (valid) => {
    if (!valid) return;

    loading.value = true;
    try {
      const payload = { phone: `+91${loginForm.phone}`, pin: loginForm.pin };

      const res = await userLogin(payload);

      if (res?.status === 200 && res?.data?.user) {
        // Save user info
        localStorage.setItem("users", JSON.stringify(res.data.user));
        // Save token to store

        const accessToken = res.data.tokens?.accessToken;

        UserStore.loginToken(accessToken);
        UserStore.setUserData(res.data.user);
        // Redirect based on role
        if (res.data.user.role === "client") {
          router.push("/contractor-posts/list");
        } else if (res.data.user.role === "contractor") {
          router.push("/client-posts/list");
        } else {
          router.push("/"); // fallback route
        }
      } else {
        ElNotification({
          title: "Login Failed",
          message: res?.data?.message || "Invalid credentials",
          type: "warning",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      ElNotification({
        title: "Error",
        message: error?.response?.data?.message || "Something went wrong",
        type: "error",
      });
    } finally {
      loading.value = false;
    }
  });
}
</script>
