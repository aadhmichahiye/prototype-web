<template>
  <div class="settings-page">
    <h2 class="page-heading">
      <i class="ri-settings-3-line"></i> Account Settings
    </h2>

    <el-form
      ref="settingsFormRef"
      :model="settingsForm"
      :rules="rules"
      label-position="top"
      class="settings-form"
    >
      <!-- User Info -->
      <div class="form-section">
        <h3 class="section-heading">Basic Details</h3>

        <el-form-item label="Full Name" prop="name">
          <el-input v-model="settingsForm.name" placeholder="Enter your name" clearable />
        </el-form-item>

        <el-form-item label="Phone Number" prop="phone">
          <el-input v-model="settingsForm.phone" placeholder="9876543210" maxlength="10" clearable />
        </el-form-item>

        <el-form-item label="Role" prop="role">
          <el-select v-model="settingsForm.role" placeholder="Select role">
            <el-option label="Client" value="client" />
            <el-option label="Contractor" value="contractor" />
          </el-select>
        </el-form-item>
      </div>

      <!-- Security Pin -->
      <div class="form-section">
        <h3 class="section-heading">Security Pin</h3>

        <el-form-item label="6-Digit Pin" prop="pin">
          <el-input
            v-model="settingsForm.pin"
            placeholder="******"
            maxlength="6"
            show-password
          />
        </el-form-item>
      </div>

      <!-- Submit -->
      <div class="form-footer">
        <el-button type="primary" class="save-btn" @click="submitForm">
          <i class="ri-save-3-line mr-1"></i> Save Changes
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";

const settingsFormRef = ref();

const settingsForm = reactive({
  name: "",
  phone: "",
  role: "",
  pin: "",
});

// Validation rules
const rules = {
  name: [{ required: true, message: "Name is required", trigger: "blur" }],
  phone: [
    { required: true, message: "Phone number is required", trigger: "blur" },
    { pattern: /^[0-9]{10}$/, message: "Enter valid 10-digit phone", trigger: "blur" },
  ],
  role: [{ required: true, message: "Role is required", trigger: "change" }],
  pin: [
    { required: true, message: "Pin is required", trigger: "blur" },
    { pattern: /^[0-9]{6}$/, message: "Pin must be 6 digits", trigger: "blur" },
  ],
};

const submitForm = () => {
  settingsFormRef.value.validate((valid) => {
    if (valid) {
      console.log("Settings updated", settingsForm);
      // TODO: Send API request here
    } else {
      console.log("Validation failed");
      return false;
    }
  });
};
</script>

<style lang="scss" scoped>
.settings-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem 1rem;

  .page-heading {
    font-size: 1.4rem;
    font-weight: 600;
    margin-bottom: 2rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #111;
  }

  .settings-form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .form-section {
    .section-heading {
      font-size: 1rem;
      font-weight: 600;
      margin-bottom: 1rem;
      color: #333;
    }
  }

  .form-footer {
    margin-top: 2rem;
    text-align: center;

    .save-btn {
      width: 100%;
      background: #000;
      border: none;
      color: #fff;
      padding: 0.75rem;
      font-size: 1rem;
      border-radius: 0.5rem;

      &:hover {
        background: #222;
      }
    }
  }
}

/* Responsive */
@media (max-width: 768px) {
  .settings-page {
    padding: 1rem;
  }
}
</style>
