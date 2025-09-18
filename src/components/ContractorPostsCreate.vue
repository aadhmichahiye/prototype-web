<template>
  <div class="contractor-create-post">
    <div v-if="loading" class="page-skeleton">
      <el-skeleton :rows="6" animated />
    </div>
    <div v-else>
      <h2 class="page-title" style="margin-bottom: 20px">
        {{ isEditMode ? "Edit Job Post" : "Create Job Post" }}
      </h2>
      <el-form
        ref="contractorFormRef"
        :model="contractorForm"
        :rules="rules"
        label-position="top"
        class="contractor-form"
      >
        <!-- Contractor Name -->
        <el-form-item label="Contractor Name" prop="name">
          <el-input
            v-model="contractorForm.name"
            placeholder="e.g., Tony Builders"
            clearable
          />
        </el-form-item>

        <!-- City & Pincode -->
        <div class="grid-2">
          <el-form-item label="City" prop="city">
            <el-select
              v-model="contractorForm.city"
              placeholder="Select City"
              clearable
            >
              <el-option label="Hyderabad" value="Hyderabad" />
              <el-option label="Mumbai" value="Mumbai" />
              <el-option label="Delhi" value="Delhi" />
            </el-select>
          </el-form-item>

          <el-form-item label="Pincode" prop="pinCode">
            <el-input
              v-model="contractorForm.pinCode"
              placeholder="e.g., 500032"
              maxlength="6"
              clearable
            />
          </el-form-item>
        </div>

        <!-- Location -->
        <el-form-item label="Location" prop="location">
          <el-input
            v-model="contractorForm.location"
            placeholder="e.g., Gachibowli, Near SBI Bank Road"
            clearable
          />
        </el-form-item>

        <!-- Phone -->
        <el-form-item label="Phone Number" prop="phone">
          <el-input
            v-model="contractorForm.phone"
            placeholder="e.g., 9876543210"
            maxlength="10"
            clearable
          />
        </el-form-item>

        <!-- Status -->
        <el-form-item label="Status" prop="status">
          <el-select
            v-model="contractorForm.status"
            placeholder="Select status"
          >
            <el-option label="Open" value="open" />
            <el-option label="Closed" value="closed" />
          </el-select>
        </el-form-item>

        <!-- Workers Table -->
        <div class="workers-section">
          <h3 class="section-title">Available Workers</h3>
          <el-table
            :data="contractorForm.availableWorkers"
            border
            stripe
            style="width: 100%"
          >
            <el-table-column label="S.No" type="index" width="60" />

            <el-table-column label="Worker Type">
              <template #default="scope">
                <el-select
                  v-model="scope.row.type"
                  placeholder="Select type"
                  style="width: 100%"
                >
                  <el-option label="Mason" value="Mason" />
                  <el-option label="Helpers" value="Helper" />
                  <el-option label="Electrician" value="Electrician" />
                  <el-option label="Plumber" value="Plumber" />
                  <el-option label="Carpenter" value="Carpenter" />
                  <el-option label="Painter" value="Painter" />
                  <el-option label="Rod Benders" value="Rod Benders" />
                </el-select>
              </template>
            </el-table-column>

            <el-table-column label="Count" width="180">
              <template #default="scope">
                <el-input-number
                  v-model="scope.row.count"
                  :min="1"
                  :max="999"
                />
              </template>
            </el-table-column>

            <el-table-column label="Action" width="80">
              <template #default="scope">
                <el-button
                  type="danger"
                  circle
                  @click="removeWorker(scope.$index)"
                >
                  <i class="ri-delete-bin-line"></i>
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-button
            type="default"
            class="add-worker-btn"
            @click="addWorker"
            icon="ri-add-line"
          >
            Add Worker
          </el-button>
        </div>

        <!-- Submit -->
        <div class="form-footer">
          <el-button
            type="primary"
            class="submit-btn"
            :loading="submitting"
            @click="submitForm"
          >
            {{
              isEditMode ? "Update Contractor Post" : "Submit Contractor Post"
            }}
          </el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
/*
  ContractorCreatePost.vue
  - Supports Create (no route id) and Edit (route param id present).
  - Do not change UI.
  - Requires API helpers (adjust import paths/names if different in your project):
      createManpowerApi(payload)      => POST /api/contractor-manpower-post (create)
      getManpowerApi(id)              => GET  /api/contractor-manpower-post/:id
      updateManpowerApi(id, payload)  => PUT  /api/contractor-manpower-post/:id
*/

import { reactive, ref, onMounted, watch, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElNotification } from "element-plus";

import {
  createManpowerApi,
  getManpowerApi,
  updateManpowerApi,
} from "../api/contractor"; // adjust path if needed

const route = useRoute();
const router = useRouter();
const id = route.params.id || null;
const isEditMode = ref(!!id && route.name !== "ContractorPostCreate");

const contractorFormRef = ref();
const loading = ref(false);
const submitting = ref(false);

const contractorForm = reactive({
  // fields mapping to UI
  name: "",
  city: "Hyderabad", // default
  location: "",
  pinCode: "",
  phone: "",
  status: "open",
  availableWorkers: [{ type: "", count: 1 }],
});

// validation rules (kept minimal; keep as you had)
const rules = {
  name: [{ required: true, message: "Name is required", trigger: "blur" }],
  city: [{ required: true, message: "City is required", trigger: "change" }],
  pinCode: [
    { required: true, message: "Pincode is required", trigger: "blur" },
    {
      pattern: /^[0-9]{6}$/,
      message: "Enter a valid 6-digit pincode",
      trigger: "blur",
    },
  ],
  location: [
    { required: true, message: "Location is required", trigger: "blur" },
  ],
  phone: [
    { required: true, message: "Phone number is required", trigger: "blur" },
    {
      pattern: /^[0-9]{10}$/,
      message: "Enter valid 10-digit phone number",
      trigger: "blur",
    },
  ],
};

function resetForm() {
  // reset reactive fields
  contractorForm.name = "";
  contractorForm.city = "Hyderabad";
  contractorForm.location = "";
  contractorForm.pinCode = "";
  contractorForm.phone = "";
  contractorForm.status = "open";
  contractorForm.availableWorkers = [{ type: "", count: 1 }];

  // reset Element Plus validations and touched state (if using el-form)
  if (contractorFormRef?.value?.resetFields) {
    // nextTick to ensure DOM bindings are stable
    nextTick(() => contractorFormRef.value.resetFields());
  }
}

/* Worker helpers */
const addWorker = () => {
  contractorForm.availableWorkers.push({ type: "", count: 1 });
};

const removeWorker = (index) => {
  contractorForm.availableWorkers.splice(index, 1);
};

/* Map API payload -> form */
function populateFormFromApi(data) {
  if (!data) return;
  contractorForm.name = data.name || data.title || "";
  contractorForm.city = data.city
    ? // normalize capitalization
      data.city.charAt(0).toUpperCase() + data.city.slice(1)
    : "Hyderabad";
  contractorForm.location = data.location || "";
  contractorForm.pinCode = data.pinCode || data.pincode || "";
  // contactDetails.phone may be +91 prefixed; map to last 10 digits for input
  const phoneRaw = data.contactDetails?.phone || data.phone || "";
  contractorForm.phone = ("" + phoneRaw).replace(/\D/g, "").slice(-10);

  contractorForm.status = data.status || "open";

  // map availableWorkers -> keep type and count; preserve _id if present
  contractorForm.availableWorkers =
    Array.isArray(data.availableWorkers) && data.availableWorkers.length
      ? data.availableWorkers.map((w) => ({
          _id: w._id || undefined,
          type: typeof w.type === "string" ? w.type : "",
          count: w.count ?? 1,
        }))
      : [{ type: "", count: 1 }];
}

/* Build payload to send to backend */
function buildPayloadFromForm() {
  const payload = {
    name: contractorForm.name?.trim() || undefined,
    city: contractorForm.city?.trim().toLowerCase(),
    location: contractorForm.location?.trim(),
    pinCode: contractorForm.pinCode?.toString().trim(),
    // backend expects nested contactDetails perhaps — many of your backend examples used contactDetails.phone
    contactDetails: {
      phone: contractorForm.phone ? `+91${contractorForm.phone}` : "",
    },
    status: contractorForm.status || "open",
    // availableWorkers: array of { type, count }
    availableWorkers: (contractorForm.availableWorkers || [])
      .filter((w) => w && w.type)
      .map((w) => ({
        type: (w.type || "").toString().trim().toLowerCase(),
        count: Number(w.count) || 0,
      })),
  };

  // remove undefined keys
  Object.keys(payload).forEach((k) => {
    if (payload[k] === undefined || payload[k] === "") delete payload[k];
  });

  return payload;
}

/* Load existing data when editing */
async function loadExistingPost(postId) {
  loading.value = true;
  try {
    const res = await getManpowerApi(postId);
    // expected shape: { message, data }
    const apiData = res?.data?.data ? res.data.data : res?.data || null;
    if (!apiData) {
      throw new Error("No data returned from server");
    }
    populateFormFromApi(apiData);
  } catch (err) {
    ElNotification({
      title: "Error",
      message:
        err?.response?.data?.message ||
        err?.message ||
        "Unable to load post for editing.",
      type: "error",
    });
    // if edit id invalid, redirect back to list to avoid stale page
    router.push("/contractor-posts/my-posts");
  } finally {
    loading.value = false;
  }
}

/* Submit handler: create or update based on mode */
const submitForm = async () => {
  if (submitting.value) return;
  if (!contractorFormRef.value) return;

  contractorFormRef.value.validate(async (valid) => {
    if (!valid) {
      ElNotification({
        title: "Validation",
        message: "Please fix the errors in the form.",
        type: "warning",
      });
      return false;
    }

    // Basic client-side workers validation
    if (
      !Array.isArray(contractorForm.availableWorkers) ||
      contractorForm.availableWorkers.length === 0
    ) {
      ElNotification({
        title: "Validation",
        message: "Please add at least one worker.",
        type: "warning",
      });
      return false;
    }

    const workersPayload = contractorForm.availableWorkers.map((w, idx) => {
      return {
        type: (w.type || "").toString().trim().toLowerCase(),
        count: Number.isFinite(Number(w.count))
          ? Math.floor(Number(w.count))
          : 0,
      };
    });

    for (const [i, w] of workersPayload.entries()) {
      if (!w.type) {
        ElNotification({
          title: "Validation",
          message: `Worker #${i + 1} type is required`,
          type: "warning",
        });
        return false;
      }
      if (!w.count || w.count <= 0) {
        ElNotification({
          title: "Validation",
          message: `Worker #${i + 1} count must be > 0`,
          type: "warning",
        });
        return false;
      }
    }

    const payload = buildPayloadFromForm();

    submitting.value = true;
    try {
      if (isEditMode.value && id) {
        // Update existing post
        const res = await updateManpowerApi(id, payload);
        if (res && (res.status === 200 || res.status === 201)) {
          ElNotification({
            title: "Success",
            message: "Manpower post updated successfully",
            type: "success",
          });
          // redirect to list or details page
          router.push("/contractor-posts/my-posts");
        } else {
          ElNotification({
            title: "Error",
            message: res?.data?.message || "Failed to update manpower post",
            type: "error",
          });
        }
      } else {
        // Create new post
        const res = await createManpowerApi(payload);
        if (res && (res.status === 200 || res.status === 201)) {
          ElNotification({
            title: "Success",
            message: "Manpower post created successfully",
            type: "success",
          });
          // reset form
          contractorForm.name = "";
          contractorForm.city = "Hyderabad";
          contractorForm.location = "";
          contractorForm.pinCode = "";
          contractorForm.phone = "";
          contractorForm.status = "open";
          contractorForm.availableWorkers = [{ type: "", count: 1 }];
          // optionally redirect to list
          router.push("/contractor-posts/my-posts");
        } else {
          ElNotification({
            title: "Error",
            message: res?.data?.message || "Failed to create manpower post",
            type: "error",
          });
        }
      }
    } catch (err) {
      console.error("Submit error:", err);
      const msg =
        err?.response?.data?.message || err?.message || "Server error";
      ElNotification({ title: "Error", message: msg, type: "error" });
    } finally {
      submitting.value = false;
    }
  });
};
watch(
  () => route.fullPath,
  async (newFull) => {
    const newId = route.params?.id;
    const hasId = !!newId;
    const isCreatePath = newFull.endsWith("/create");

    // If navigated to create path, reset form and set create mode
    if (isCreatePath && !hasId) {
      // set flag first so heading updates immediately
      isEditMode.value = false;
      console.log("Switched to create mode, resetting form.");
      contractorForm.name = "";
      contractorForm.city = "Hyderabad";
      contractorForm.location = "";
      contractorForm.pinCode = "";
      contractorForm.phone = "";
      contractorForm.status = "open";
      contractorForm.availableWorkers = [{ type: "", count: 1 }];

      // reset reactive fields + el-form validation
      // resetForm(); // uses nextTick internally
      return;
    }

    // If navigated to an edit route with an id
    if (hasId) {
      // set edit flag
      isEditMode.value = true;

      // load API data for this id
      // note: don't await blocking UI navigation; we show skeleton with `loading`
      // await loadExistingPost(newId);
      return;
    }

    // Generic fallback: if route changed but not create or edit (e.g. query change),
    // keep current mode but if it now ends with /create reset
    if (!hasId && isCreatePath) {
      isEditMode.value = false;
      console.log("Route changed to create mode, resetting form.");
      // resetForm();
    }
  },
  { immediate: true } // run on mount too
);

/* On mount: if edit mode, fetch data and populate */
onMounted(() => {
  if (id === "" || id === undefined) {
    router.replace("/contractor-posts/my-posts");
    return;
  }

  if (id) {
    loadExistingPost(id);
  }
});
</script>

<!-- no style block here — keep styling in your SCSS files as requested -->
