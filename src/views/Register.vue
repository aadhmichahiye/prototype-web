<template>
  <div class="register-page">
    <!-- Left SVG Illustration (desktop only) -->
    <div class="illustration">
      <svg viewBox="0 0 500 500" class="hero-svg">
        <!-- Simple Construction/Workforce Concept -->
        <circle cx="250" cy="250" r="200" fill="#FFE5D0" />
        <rect x="100" y="280" width="300" height="40" rx="8" fill="#FF4500" />
        <rect x="160" y="220" width="60" height="100" fill="#333" />
        <rect x="280" y="180" width="80" height="140" fill="#555" />
        <path d="M200 280 L220 200 L240 280 Z" fill="#999" />
        <circle cx="250" cy="150" r="30" fill="#FF4500" />
        <text x="250" y="400" text-anchor="middle" font-size="20" fill="#333">
          Connecting Clients & Workers
        </text>
      </svg>
    </div>

    <!-- Right Form -->
    <div class="form-section">
      <h2 class="title"><i class="ri-user-add-line"></i> Create an Account</h2>
      <p class="subtitle">Sign up as a Client or Contractor</p>

      <el-form
        ref="registerFormRef"
        :model="registerForm"
        :rules="rules"
        label-position="top"
        class="register-form"
      >
        <!-- Full Name -->
        <el-form-item label="Full Name" prop="name">
          <el-input
            v-model="registerForm.name"
            placeholder="Enter your full name"
            clearable
          />
        </el-form-item>

        <!-- Phone -->
        <el-form-item label="Phone Number" prop="phone">
          <el-input
            v-model="registerForm.phone"
            placeholder="9876543210"
            maxlength="10"
            clearable
          />
        </el-form-item>

        <!-- Role -->
        <el-form-item label="Role" prop="role">
          <el-select v-model="registerForm.role" placeholder="Select role">
            <el-option label="Client" value="client" />
            <el-option label="Contractor" value="contractor" />
          </el-select>
        </el-form-item>

        <!-- Pin -->
        <el-form-item label="6-Digit Pin" prop="pin">
          <el-input
            v-model="registerForm.pin"
            placeholder="******"
            maxlength="6"
            show-password
          />
        </el-form-item>

        <!-- Confirm Pin -->
        <el-form-item label="Confirm Pin" prop="confirmPin">
          <el-input
            v-model="registerForm.confirmPin"
            placeholder="******"
            maxlength="6"
            show-password
          />
        </el-form-item>

        <!-- Terms -->
        <el-form-item prop="terms">
          <el-checkbox v-model="registerForm.terms">
            I agree to the
            <router-link to="/terms" class="terms-link"
              >Terms & Conditions</router-link
            >
          </el-checkbox>
        </el-form-item>

        <!-- Submit -->
        <el-form-item>
          <el-button type="primary" class="register-btn" @click="submitForm">
            <i class="ri-user-follow-line"></i> Register
          </el-button>
        </el-form-item>
        <!-- Already a user? -->
        <div class="login-redirect">
          Already have an account?
          <router-link to="/login" class="login-link">Login</router-link>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const registerFormRef = ref();

const registerForm = reactive({
  name: "",
  phone: "",
  role: "",
  pin: "",
  confirmPin: "",
  terms: false,
});

const rules = {
  name: [{ required: true, message: "Name is required", trigger: "blur" }],
  phone: [
    { required: true, message: "Phone number is required", trigger: "blur" },
    {
      pattern: /^[0-9]{10}$/,
      message: "Enter valid 10-digit phone",
      trigger: "blur",
    },
  ],
  role: [{ required: true, message: "Role is required", trigger: "change" }],
  pin: [
    { required: true, message: "Pin is required", trigger: "blur" },
    { pattern: /^[0-9]{6}$/, message: "Pin must be 6 digits", trigger: "blur" },
  ],
  confirmPin: [
    { required: true, message: "Please confirm pin", trigger: "blur" },
    {
      validator: (rule, value, callback) => {
        if (value !== registerForm.pin)
          callback(new Error("Pins do not match"));
        else callback();
      },
      trigger: "blur",
    },
  ],
  terms: [
    {
      type: "enum",
      enum: [true],
      message: "You must accept terms",
      trigger: "change",
    },
  ],
};

const submitForm = () => {
  registerFormRef.value.validate((valid) => {
    if (valid) {
      console.log("Registered:", registerForm);
      router.push("/login"); // redirect after success
    } else {
      console.log("Validation failed");
    }
  });
};
</script>
