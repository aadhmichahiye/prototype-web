<template>
  <div class="login-page">
    <div class="login-card">
      <h2 class="title"><i class="ri-user-line"></i> Welcome Back</h2>
      <p class="subtitle">Login with your ID and 6-digit pin</p>

      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="rules"
        label-position="top"
        class="login-form"
      >
        <!-- User ID -->
        <el-form-item label="User ID" prop="id">
          <el-input
            v-model="loginForm.id"
            placeholder="Enter your ID"
            clearable
            prefix-icon="ri-id-card-line"
          />
        </el-form-item>

        <!-- PIN -->
        <el-form-item label="6-Digit Pin" prop="pin">
          <el-input
            v-model="loginForm.pin"
            placeholder="******"
            maxlength="6"
            show-password
            prefix-icon="ri-lock-password-line"
          />
        </el-form-item>

        <!-- Submit -->
        <el-form-item>
          <el-button
            type="primary"
            class="login-btn"
            @click="submitForm"
          >
            <i class="ri-login-circle-line mr-1"></i> Login
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";

const loginFormRef = ref();

const loginForm = reactive({
  id: "",
  pin: "",
});

const rules = {
  id: [{ required: true, message: "User ID is required", trigger: "blur" }],
  pin: [
    { required: true, message: "Pin is required", trigger: "blur" },
    { pattern: /^[0-9]{6}$/, message: "Pin must be 6 digits", trigger: "blur" },
  ],
};

const submitForm = () => {
  loginFormRef.value.validate((valid) => {
    if (valid) {
      console.log("Login attempt:", loginForm);
      // TODO: call API for login
    } else {
      console.log("Validation failed");
      return false;
    }
  });
};
</script>

<style lang="scss" scoped>
$primary-color: #ff7a00; // Dark Orange
$text-dark: #111;
$text-light: #555;

.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #fff; // keep background white
  padding: 1rem;
}

.login-card {
  width: 100%;
  max-width: 400px;
  background: #fff;
  border: 2px solid $primary-color;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

  .title {
    font-size: 1.5rem;
    font-weight: 700;
    color: $primary-color;
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .subtitle {
    font-size: 0.9rem;
    color: $text-light;
    margin-bottom: 2rem;
  }

  .login-form {
    .el-form-item__label {
      font-weight: 600;
      color: $text-dark;
    }
  }

  .login-btn {
    width: 100%;
    background: $primary-color;
    border: none;
    color: #fff;
    font-weight: 600;
    padding: 0.8rem;
    font-size: 1rem;
    border-radius: 0.5rem;
    transition: all 0.2s ease;

    &:hover {
      background: darken($primary-color, 10%);
    }
  }
}

/* Responsive */
@media (max-width: 768px) {
  .login-card {
    padding: 1.5rem;
  }
}
</style>
