<template>
  <div class="settings-page">
    <h2 class="page-title"><i class="ri-settings-3-line"></i> Settings</h2>

    <el-form
      ref="settingsFormRef"
      :model="settingsForm"
      :rules="rules"
      label-position="top"
      class="settings-form"
      v-loading="loading"
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
          <el-form-item label="Old PIN" prop="oldPin">
            <el-input
              v-model="settingsForm.oldPin"
              placeholder="Enter current PIN (if changing)"
              maxlength="6"
              show-password
            />
          </el-form-item>

          <el-form-item label="New PIN" prop="pin">
            <el-input
              v-model="settingsForm.pin"
              placeholder="New 6-digit PIN"
              maxlength="6"
              show-password
            />
          </el-form-item>

          <el-form-item label="Confirm PIN" prop="confirmPin">
            <el-input
              v-model="settingsForm.confirmPin"
              placeholder="Confirm new PIN"
              maxlength="6"
              show-password
            />
          </el-form-item>
        </div>
      </div>

      <!-- Submit -->
      <div class="form-footer">
        <el-button
          :loading="saving"
          type="primary"
          class="save-btn"
          @click="submitForm"
        >
          Save Changes
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script setup>
/*
  Settings.vue — updated behavior:
  - fetch profile on mount
  - role is disabled (display only)
  - on submit:
    - if name/phone changed -> call userProfileUpdate(payload)
    - if pin change requested -> call changeUserPin({ oldPin, pin })
    - no changes => do nothing
  APIs expected (adjust import paths if needed):
    - getUserProfile()
    - userProfileUpdate(payload)  // updates name/phone
    - changeUserPin(payload)      // payload: { oldPin, pin }  (backend validates oldPin)
*/

import { ref, reactive, onMounted } from "vue";
import { ElNotification } from "element-plus";
import { useUserStore } from "../stores/userStore";
import {
  getUserProfile,
  userProfileUpdate,
  userProfileUpdatePin,
} from "../api/user"; // adjust path if your api file differs

const settingsFormRef = ref(null);
const loading = ref(false);
const saving = ref(false);
const userStore = useUserStore();

// internal copy of initially fetched data used for change detection
let originalProfile = { name: "", phone: "", role: "" };

const settingsForm = reactive({
  name: "",
  phone: "", // shown as plain 10-digit (no +91) for input convenience
  role: "",
  pin: "",
  confirmPin: "",
  oldPin: "",
});

// Validation rules
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
    {
      validator: (rule, value, callback) => {
        // oldPin is required only when user wants to change PIN
        const wantsPinChange = Boolean(
          settingsForm.pin || settingsForm.confirmPin
        );
        if (wantsPinChange) {
          if (!/^\d{6}$/.test(value || "")) {
            return callback(new Error("Current PIN must be 6 digits"));
          }
        }
        return callback();
      },
      trigger: "blur",
    },
  ],
  pin: [
    {
      validator: (rule, value, callback) => {
        if (!value && !settingsForm.confirmPin) return callback(); // no change
        if (!/^\d{6}$/.test(value || "")) {
          return callback(new Error("New PIN must be 6 digits"));
        }
        return callback();
      },
      trigger: "blur",
    },
  ],
  confirmPin: [
    {
      validator: (rule, value, callback) => {
        if (!settingsForm.pin && !value) return callback(); // no change
        if (value !== settingsForm.pin) {
          return callback(new Error("Pins do not match"));
        }
        return callback();
      },
      trigger: "blur",
    },
  ],
};

// normalize phone for input (10 digits) and backend (+91...)
function normalizePhoneForInput(phone = "") {
  if (!phone) return "";
  const digits = String(phone).replace(/\D/g, "");
  return digits.length >= 10 ? digits.slice(-10) : digits;
}
function formatPhoneForBackend(phone = "") {
  const digits = String(phone || "").replace(/\D/g, "");
  if (!digits) return "";
  return `+91${digits.slice(-10)}`;
}

// fetch current profile
const fetchProfileDetails = async () => {
  loading.value = true;
  try {
    const res = await getUserProfile();

    // accept res.data or res directly depending on your API wrapper
    const payload = res?.data || res;
    if (!payload) {
      ElNotification({
        title: "Warning",
        message: "Empty profile response",
        type: "warning",
      });
      return null;
    }

    // populate fields
    settingsForm.name = payload.name || "";
    settingsForm.phone = normalizePhoneForInput(
      payload.phone || payload.contactDetails?.phone || ""
    );
    settingsForm.role = payload.role || "";
    // clear PIN fields
    settingsForm.pin = "";
    settingsForm.confirmPin = "";
    settingsForm.oldPin = "";

    // save original copy (for change detection)
    originalProfile = {
      name: settingsForm.name,
      phone: settingsForm.phone,
      role: settingsForm.role,
    };

    // also update pinia store if needed
    userStore.setUserData(payload);

    return payload;
  } catch (err) {
    console.error("fetchProfileDetails error:", err);
    ElNotification({
      title: "Error",
      message:
        err?.response?.data?.message ||
        err?.message ||
        "Unable to fetch profile details",
      type: "error",
    });
    return null;
  } finally {
    loading.value = false;
  }
};

// submit handler: only call APIs for changed fields
const submitForm = async () => {
  if (!settingsFormRef.value) return;

  await settingsFormRef.value.validate(async (valid) => {
    if (!valid) {
      ElNotification({
        title: "Validation",
        message: "Please fix highlighted fields",
        type: "warning",
      });
      return false;
    }
    loading.value = true;
    // detect changes
    const nameChanged =
      String((settingsForm.name || "").trim()) !==
      String((originalProfile.name || "").trim());
    const phoneChanged =
      String((settingsForm.phone || "").trim()) !==
      String((originalProfile.phone || "").trim());
    const wantsPinChange = Boolean(
      settingsForm.pin || settingsForm.confirmPin || settingsForm.oldPin
    );

    // If no changes at all
    if (!nameChanged && !phoneChanged && !wantsPinChange) {
      loading.value = false;
      ElNotification({
        title: "No changes",
        message: "Nothing to update",
        type: "info",
      });
      return false;
    }

    // Prepare promises for API calls (only those that are necessary)
    const calls = [];
    const results = {};

    // Profile update payload (only name/phone if changed)
    if (nameChanged || phoneChanged) {
      const profilePayload = {};
      if (nameChanged) profilePayload.name = String(settingsForm.name).trim();
      if (phoneChanged)
        profilePayload.phone = formatPhoneForBackend(settingsForm.phone);
      // push call
      calls.push(
        (async () => {
          const res = await userProfileUpdate(profilePayload);
          results.profile = res;
          return res;
        })()
      );
    }

    // PIN change: require oldPin and new pin; validation already done
    if (wantsPinChange) {
      if (!/^\d{6}$/.test(settingsForm.oldPin || "")) {
        ElNotification({
          title: "Validation",
          message: "Current PIN is required to change PIN",
          type: "warning",
        });
        return false;
      }
      if (!/^\d{6}$/.test(settingsForm.pin || "")) {
        ElNotification({
          title: "Validation",
          message: "New PIN must be 6 digits",
          type: "warning",
        });
        return false;
      }
      // push call
      calls.push(
        (async () => {
          const res = await userProfileUpdatePin({
            oldPin: settingsForm.oldPin,
            pin: settingsForm.pin,
          });
          results.pin = res;
          return res;
        })()
      );
    }

    // Run calls (if any) and handle responses
    saving.value = true;
    try {
      if (calls.length === 0) {
        ElNotification({
          title: "No changes",
          message: "Nothing to update",
          type: "info",
        });
        return false;
      }

      // Run in parallel
      const settled = await Promise.allSettled(calls);

      // Process profile update result (if any)
      if (
        results.profile ||
        settled.some(
          (s) =>
            s.status === "fulfilled" &&
            s.value &&
            (s.value.config?.url?.includes("profile") || s.value?.data?.user)
        )
      ) {
        // pick response (results.profile may be undefined depending on the helper)
        const profileRes =
          results.profile ||
          settled.find(
            (s) =>
              s.status === "fulfilled" &&
              s.value &&
              (s.value.data?.user || s.value.data)
          )?.value;
        const updatedUser =
          profileRes?.data?.user || profileRes?.data || profileRes || null;

        // Update pinia store if backend returned user
        if (updatedUser) {
          userStore.setUserData(updatedUser);
        } else {
          // fallback: update local originalProfile so future checks reflect new values
          if (nameChanged) originalProfile.name = settingsForm.name;
          if (phoneChanged) originalProfile.phone = settingsForm.phone;
        }
      }

      // Process pin change result (if any)
      if (
        results.pin ||
        settled.some(
          (s) =>
            s.status === "fulfilled" &&
            s.value &&
            s.value.config?.url &&
            s.value.config.url.includes("pin")
        )
      ) {
        // assume success if fulfilled
        // clear PIN fields
        settingsForm.oldPin = "";
        settingsForm.pin = "";
        settingsForm.confirmPin = "";
      }

      // Check for any rejected promises and show meaningful messages
      const rejected = settled.filter((s) => s.status === "rejected");
      if (rejected.length) {
        // prefer the first rejection message
        const err = rejected[0].reason;
        const msg =
          err?.response?.data?.message || err?.message || "Failed to update";
        ElNotification({ title: "Error", message: msg, type: "error" });
        return false;
      }

      // All good
      ElNotification({
        title: "Success",
        message: "Settings updated",
        type: "success",
      });
      // refresh originalProfile to latest values
      originalProfile.name = settingsForm.name;
      originalProfile.phone = settingsForm.phone;
      return true;
    } catch (err) {
      console.error("Settings save error:", err);
      ElNotification({
        title: "Error",
        message:
          err?.response?.data?.message ||
          err?.message ||
          "Unable to save settings",
        type: "error",
      });
      return false;
    } finally {
      saving.value = false;
      loading.value = false;
      userStore.logout();
    }
  });
};

// load profile on mount
onMounted(() => {
  fetchProfileDetails();
});
</script>
