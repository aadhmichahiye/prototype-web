<template>
  <div class="client-create-job">
    <div v-if="loading" class="page-skeleton">
      <el-skeleton :rows="6" animated />
    </div>

    <div v-else>
      <h2 class="page-title">
        {{ isEditMode ? "Edit Job Post" : "Create Job Post" }}
      </h2>

      <el-form
        ref="jobFormRef"
        :model="jobForm"
        :rules="rules"
        label-position="top"
        class="job-form"
      >
        <!-- Title -->
        <el-form-item label="Job Title" prop="title">
          <el-input
            v-model="jobForm.title"
            placeholder="e.g., Mason requirement for 2 months project"
            clearable
          />
        </el-form-item>

        <!-- Description -->
        <el-form-item label="Description" prop="description">
          <el-input
            type="textarea"
            v-model="jobForm.description"
            placeholder="e.g., Need 10 masons and 20 helpers for construction site"
            :rows="3"
            clearable
          />
        </el-form-item>

        <!-- City & Pincode -->
        <div class="grid-2">
          <el-form-item label="City" prop="city">
            <el-select
              v-model="jobForm.city"
              placeholder="Select City"
              clearable
            >
              <el-option label="Hyderabad" value="Hyderabad" />
              <el-option label="Mumbai" value="Mumbai" />
              <el-option label="Delhi" value="Delhi" />
            </el-select>
          </el-form-item>

          <el-form-item label="Pincode" prop="pincode">
            <el-input
              v-model="jobForm.pincode"
              placeholder="e.g., 500032"
              maxlength="6"
              clearable
            />
          </el-form-item>
        </div>

        <!-- Address -->
        <el-form-item label="Address" prop="address">
          <el-input
            v-model="jobForm.address"
            placeholder="e.g., Gachibowli, Shivalayam Road"
            clearable
          />
        </el-form-item>

        <!-- phone number -->
        <el-form-item label="Phone Number" prop="phone">
          <el-input
            v-model="jobForm.phone"
            placeholder="e.g., 8547856985"
            clearable
          />
        </el-form-item>

        <!-- Workers Table -->
        <div class="workers-section">
          <h3 class="section-title">Workers</h3>

          <el-table
            :data="jobForm.workers"
            border
            stripe
            style="width: 100%"
            class="workers-table"
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
                  <el-option label="Helper" value="Helper" />
                  <el-option label="Electrician" value="Electrician" />
                  <el-option label="Plumber" value="Plumber" />
                  <el-option label="Carpenter" value="Carpenter" />
                  <el-option label="Painter" value="Painter" />
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
            :loading="saving"
            type="primary"
            class="submit-btn"
            @click="submitForm"
          >
            {{ isEditMode ? "Update Job" : "Submit Job" }}
          </el-button>

          <!-- <el-button @click="cancel" class="cancel-btn">Cancel</el-button> -->
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
/**
 * ClientCreateOrEditJob.vue
 * - single component for create & edit
 * - route '/client-posts/create' => create mode
 * - route '/client-posts/:id' => edit mode (fetch post and populate)
 *
 * Expects these API helpers in ../api/client:
 * - createClientJob(payload)
 * - getClientPost(id)
 * - updateClientPost(id, payload)
 *
 * Adjust import paths if your project uses different paths.
 */

import { ref, reactive, onMounted, watch, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElNotification } from "element-plus";
import {
  createClientJob,
  getClientPost,
  updateClientPost,
} from "../api/client"; // adjust path if needed

const route = useRoute();
const router = useRouter();

const jobFormRef = ref(null);
const loading = ref(false); // initial page fetch loading
const saving = ref(false); // submit loading

const id = route.params?.id || null;
// make reactive so template updates when route changes
const isEditMode = ref(!!id && route.name !== "ClientPostCreate");

// default model
const jobForm = reactive({
  title: "",
  description: "",
  city: "Hyderabad", // default
  pincode: "",
  address: "",
  workers: [{ type: "", count: 1 }],
  phone: "",
});

// validation rules (kept same as before)
const rules = {
  title: [{ required: true, message: "Title is required", trigger: "blur" }],
  description: [
    { required: true, message: "Description is required", trigger: "blur" },
  ],
  city: [{ required: true, message: "City is required", trigger: "change" }],
  pincode: [
    { required: true, message: "Pincode is required", trigger: "blur" },
    {
      pattern: /^[0-9]{6}$/,
      message: "Enter a valid 6-digit pincode",
      trigger: "blur",
    },
  ],
  address: [
    { required: true, message: "Address is required", trigger: "blur" },
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

// helper functions
const addWorker = () => jobForm.workers.push({ type: "", count: 1 });
const removeWorker = (index) => {
  // ensure at least one row remains
  if (jobForm.workers.length <= 1) {
    jobForm.workers.splice(index, 1);
    if (jobForm.workers.length === 0)
      jobForm.workers.push({ type: "", count: 1 });
  } else {
    jobForm.workers.splice(index, 1);
  }
};

function buildPayload() {
  return {
    title: jobForm.title,
    description: jobForm.description,
    city: jobForm.city || "Hyderabad",
    location: jobForm.address || "",
    pinCode: jobForm.pincode || "",
    requiredWorkers: (jobForm.workers || [])
      .filter((w) => w && w.type && Number(w.count) > 0)
      .map((w) => ({
        type: (w.type || "").toString().toLowerCase(),
        count: Number(w.count),
      })),
    contactDetails: {
      phone: jobForm.phone
        ? `+91${jobForm.phone.replace(/\D/g, "").slice(-10)}`
        : "",
    },
  };
}

watch(
  () => route.fullPath,
  (newPath, oldPath) => {
    // Case: navigated to create page
    if (newPath.endsWith("/create")) {
      console.log("Switched to create mode");
      jobForm.title = "";
      jobForm.description = "";
      jobForm.city = "Hyderabad";
      jobForm.pincode = "";
      jobForm.address = "";
      jobForm.phone = "";
      jobForm.workers = [{ type: "", count: 1 }];
      // resetForm(); // <-- your existing resetForm function
      isEditMode.value = false;
    }

    // Case: navigated to edit page with id
    else if (route.params.id) {
      console.log("Switched to edit mode, id:", route.params.id);
      // loadExistingPost(route.params.id); // <-- your existing loader
      isEditMode.value = true;
    }
  },
  { immediate: true } // run once on mount as well
);

// on component mount: if edit mode fetch existing post
onMounted(async () => {
  // If there is no id but route param present is empty string, redirect
  if (id === "" || id === undefined) {
    router.replace("/client-posts/my-posts");
    return;
  }

  if (id) {
    console.log("fetching post for edit:", id);
    loading.value = true;
    try {
      const resp = await getClientPost(id);
      // expect resp.data or resp?.data?.data depending on your API helper
      const data = resp?.data?.data || resp?.data || resp;
      if (!data || !data._id) {
        // invalid response -> redirect
        ElNotification({
          title: "Not found",
          message: "Post not found",
          type: "warning",
        });
        router.replace("/client-posts/my-posts");
        return;
      }

      // populate form: map backend fields into jobForm
      jobForm.title = data.title || "";
      jobForm.description = data.description || "";
      jobForm.city = data.city || "Hyderabad";
      jobForm.pincode = data.pinCode || data.pincode || "";
      jobForm.address = data.location || data.address || "";
      jobForm.phone =
        data.contactDetails && data.contactDetails.phone
          ? String(data.contactDetails.phone).replace(/^\+91/, "").slice(-10)
          : "";
      // workers: ensure shape matches our form (type, count)
      if (Array.isArray(data.requiredWorkers) && data.requiredWorkers.length) {
        jobForm.workers = data.requiredWorkers.map((w) => ({
          type: w.type
            ? String(w.type).charAt(0).toUpperCase() + String(w.type).slice(1)
            : "",
          count: w.count || 1,
        }));
      } else {
        jobForm.workers = [{ type: "", count: 1 }];
      }
    } catch (err) {
      console.error("Failed to fetch post for edit:", err);
      // If API returns 404 or other error, redirect back to my-posts
      ElNotification({
        title: "Error",
        message: "Unable to load post for editing. Redirecting.",
        type: "error",
      });
      router.replace("/client-posts/my-posts");
    } finally {
      loading.value = false;
    }
  } // end if id
});

// submit handler — create or update depending on mode
const submitForm = async () => {
  if (!jobFormRef.value) return;

  jobFormRef.value.validate(async (valid) => {
    if (!valid) {
      ElNotification({
        title: "Validation",
        message: "Please fix the highlighted fields before submitting.",
        type: "warning",
      });
      return false;
    }

    const payload = buildPayload();

    // ensure at least one worker
    if (!payload.requiredWorkers || payload.requiredWorkers.length === 0) {
      ElNotification({
        title: "Validation",
        message: "Please add at least one worker with type and count.",
        type: "warning",
      });
      return false;
    }

    saving.value = true;
    try {
      if (id && isEditMode.value) {
        // update
        const res = await updateClientPost(id, payload);
        if (res?.status === 200 || res?.status === 204 || res?.status === 201) {
          ElNotification({
            title: "Success",
            message: "Post updated successfully.",
            type: "success",
          });
          router.push("/client-posts/my-posts");
        } else {
          ElNotification({
            title: "Error",
            message: res?.data?.message || "Failed to update post.",
            type: "error",
          });
        }
      } else {
        // create
        const res = await createClientJob(payload);
        if (res?.status === 200 || res?.status === 201) {
          ElNotification({
            title: "Success",
            message: "Job posted successfully.",
            type: "success",
          });
          // reset form
          jobForm.title = "";
          jobForm.description = "";
          jobForm.city = "Hyderabad";
          jobForm.pincode = "";
          jobForm.address = "";
          jobForm.phone = "";
          jobForm.workers = [{ type: "", count: 1 }];
          router.push("/client-posts/my-posts");
        } else {
          ElNotification({
            title: "Error",
            message: res?.data?.message || "Failed to create job.",
            type: "error",
          });
        }
      }
    } catch (err) {
      console.error("Submit error:", err);
      ElNotification({
        title: "Error",
        message:
          err?.response?.data?.message ||
          err?.message ||
          "Network/Server error while saving.",
        type: "error",
      });
    } finally {
      saving.value = false;
    }
  });
};

// cancel handler
function cancel() {
  router.back();
}
</script>
