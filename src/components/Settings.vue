<template>
  <div class="settings-page">
    <h2 class="page-title"><i class="ri-settings-3-line"></i> Settings</h2>

    <el-form
      ref="settingsFormRef"
      :model="settingsForm"
      :rules="rules"
      label-position="top"
      class="settings-form"
    >
      <!-- User Details -->
      <div class="form-section">
        <h3 class="section-title">User Details</h3>

        <div class="grid-2">
          <el-form-item label="Full Name" prop="name">
            <el-input
              v-model="settingsForm.name"
              placeholder="Enter your name"
              clearable
            />
          </el-form-item>

          <el-form-item label="Phone" prop="phone">
            <el-input
              v-model="settingsForm.phone"
              placeholder="9876543210"
              maxlength="10"
              clearable
            />
          </el-form-item>
        </div>

        <el-form-item label="Role">
          <el-input v-model="settingsForm.role" disabled />
        </el-form-item>
      </div>

      <!-- Security -->
      <div class="form-section">
        <h3 class="section-title">Security</h3>

        <div class="grid-2">
          <el-form-item label="New PIN" prop="pin">
            <el-input
              v-model="settingsForm.pin"
              placeholder="******"
              maxlength="6"
              show-password
            />
          </el-form-item>

          <el-form-item label="Confirm PIN" prop="confirmPin">
            <el-input
              v-model="settingsForm.confirmPin"
              placeholder="******"
              maxlength="6"
              show-password
            />
          </el-form-item>
          <el-form-item label="Old PIN" prop="oldPin">
            <el-input
              v-model="settingsForm.pin"
              placeholder="******"
              maxlength="6"
              show-password
            />
          </el-form-item>
        </div>
      </div>

      <!-- Submit -->
      <div class="form-footer">
        <el-button type="primary" class="save-btn" @click="submitForm">
          Save Changes
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";

const settingsFormRef = ref();

const settingsForm = reactive({
  name: "John Doe", // default (to be replaced with real user data)
  phone: "9876543210",
  role: "Contractor",
  pin: "",
  confirmPin: "",
  oldPin: "",
});

const rules = {
  name: [{ required: true, message: "Name is required", trigger: "blur" }],
  phone: [
    { required: true, message: "Phone is required", trigger: "blur" },
    {
      pattern: /^[0-9]{10}$/,
      message: "Enter valid 10-digit phone",
      trigger: "blur",
    },
  ],
  oldPin: [
    { pattern: /^[0-9]{6}$/, message: "PIN must be 6 digits", trigger: "blur" },
  ],
  pin: [
    { pattern: /^[0-9]{6}$/, message: "PIN must be 6 digits", trigger: "blur" },
  ],
  confirmPin: [
    {
      validator: (rule, value, callback) => {
        if (value !== settingsForm.pin) {
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
  settingsFormRef.value.validate((valid) => {
    if (valid) {
      console.log("Settings saved:", settingsForm);
      // TODO: API call for saving
    } else {
      console.log("Validation failed");
      return false;
    }
  });
};
</script>
