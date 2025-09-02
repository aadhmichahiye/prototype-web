<template>
  <div class="signup-page">
    <div class="signup-card">
      <h2 class="title"><i class="ri-user-add-line"></i> Create an Account</h2>
      <p class="subtitle">Sign up as a Client or Contractor</p>

      <el-form
        ref="signupFormRef"
        :model="signupForm"
        :rules="rules"
        label-position="top"
        class="signup-form"
      >
        <!-- Name -->
        <el-form-item label="Full Name" prop="name">
          <el-input
            v-model="signupForm.name"
            placeholder="Enter your full name"
            clearable
            prefix-icon="ri-user-line"
          />
        </el-form-item>

        <!-- Phone -->
        <el-form-item label="Phone Number" prop="phone">
          <el-input
            v-model="signupForm.phone"
            placeholder="9876543210"
            maxlength="10"
            clearable
            prefix-icon="ri-smartphone-line"
          />
        </el-form-item>

        <!-- Role -->
        <el-form-item label="Role" prop="role">
          <el-select v-model="signupForm.role" placeholder="Select role">
            <el-option label="Client" value="client" />
            <el-option label="Contractor" value="contractor" />
          </el-select>
        </el-form-item>

        <!-- Pin -->
        <el-form-item label="6-Digit Pin" prop="pin">
          <el-input
            v-model="signupForm.pin"
            placeholder="******"
            maxlength="6"
            show-password
            prefix-icon="ri-lock-password-line"
          />
        </el-form-item>

        <!-- Confirm Pin -->
        <el-form-item label="Confirm Pin" prop="confirmPin">
          <el-input
            v-model="signupForm.confirmPin"
            placeholder="******"
            maxlength="6"
            show-password
            prefix-icon="ri-lock-2-line"
          />
        </el-form-item>

        <!-- Submit -->
        <el-form-item>
          <el-button
            type="primary"
            class="signup-btn"
            @click="submitForm"
          >
            <i class="ri-user-follow-line mr-1"></i> Sign Up
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";

const signupFormRef = ref();

const signupForm = reactive({
  name: "",
  phone: "",
  role: "",
  pin: "",
  confirmPin: "",
});

const rules = {
  name: [{ required: true, message: "Name is required", trigger: "blur" }],
  phone: [
    { required: true, message: "Phone number is required", trigger: "blur" },
    { pattern: /^[0-9]{10}$/, message: "Enter valid 10-digit phone number", trigger: "blur" },
  ],
  role: [{ required: true, message: "Role is required", trigger: "change" }],
  pin: [
    { required: true, message: "Pin is required", trigger: "blur" },
    { pattern: /^[0-9]{6}$/, message: "Pin must be 6 digits", trigger: "blur" },
  ],
  confirmPin: [
    { required: true, message: "Please confirm your pin", trigger: "blur" },
    {
      validator: (rule, value, callback) => {
        if (value !== signupForm.pin) {
          callback(new Error("Pins do not match"));
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],
};

const submitForm = () => {
  signupFormRef.value.validate((valid) => {
    if (valid) {
      console.log("Signup form submitted:", signupForm);
      // TODO: API call
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

.signup-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #fff;
  padding: 1rem;
}

.signup-card {
  width: 100%;
  max-width: 420px;
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

  .signup-form {
    .el-form-item__label {
      font-weight: 600;
      color: $text-dark;
    }
  }

  .signup-btn {
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
  .signup-card {
    padding: 1.5rem;
  }
}
</style>
