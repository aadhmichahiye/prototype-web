<template>
  <div class="contractor-create-post">
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
        <el-select v-model="contractorForm.status" placeholder="Select status">
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
                <el-option label="Helpers" value="Helpers" />
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
              <el-input-number v-model="scope.row.count" :min="1" :max="999" />
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
        <el-button type="primary" class="submit-btn" @click="submitForm">
          Submit Contractor Post
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { ElNotification } from "element-plus"; // add this import
import { createManpowerApi } from "../api/contractor"; // your API helper (axios) - adjust path if needed

const contractorFormRef = ref();
const loading = ref(false);

const contractorForm = reactive({
  name: "",
  city: "Hyderabad", // default
  location: "",
  pinCode: "",
  phone: "",
  status: "open",
  availableWorkers: [{ type: "", count: 1 }],
});

const rules = {
  /* ... keep your rules unchanged ... */
};

const addWorker = () => {
  contractorForm.availableWorkers.push({ type: "", count: 1 });
};

const removeWorker = (index) => {
  contractorForm.availableWorkers.splice(index, 1);
};

let submitting = false;

const submitForm = async () => {
  if (submitting) return;
  contractorFormRef.value.validate(async (valid) => {
    if (!valid) {
      ElNotification({
        title: "Validation",
        message: "Please fix the errors in the form.",
        type: "warning",
      });
      loading.value = false;
      return false;
    }

    loading.value = true;
    // Basic client-side safety checks before sending
    if (
      !Array.isArray(contractorForm.availableWorkers) ||
      contractorForm.availableWorkers.length === 0
    ) {
      ElNotification({
        title: "Validation",
        message: "Please add at least one worker.",
        type: "warning",
      });
      loading.value = false;
      return false;
    }

    // normalize workers payload: ensure type is string and count is integer
    const workersPayload = contractorForm.availableWorkers.map((w, idx) => {
      return {
        type: (w.type || "").toString().trim().toLocaleLowerCase(),
        count: Number.isFinite(Number(w.count))
          ? Math.floor(Number(w.count))
          : 0,
      };
    });

    // re-validate worker entries
    for (const [i, w] of workersPayload.entries()) {
      if (!w.type) {
        ElNotification({
          title: "Validation",
          message: `Worker #${i + 1} type is required`,
          type: "warning",
        });
        loading.value = false;
        return false;
      }
      if (!w.count || w.count <= 0) {
        ElNotification({
          title: "Validation",
          message: `Worker #${i + 1} count must be > 0`,
          type: "warning",
        });
        loading.value = false;
        return false;
      }
    }

    // Build payload matching backend expectations:
    // { name, city, location, pincode, phone, status, workers: [...] }
    const payload = {
      name: contractorForm.name?.trim() || undefined,
      city: contractorForm.city?.trim().toLocaleLowerCase(),
      location: contractorForm.location?.trim(),
      pinCode: contractorForm.pinCode?.toString().trim(),
      phone: contractorForm.phone?.toString().trim(),
      status: contractorForm.status || "open",
      availableWorkers: workersPayload,
    };

    try {
      submitting = true;
      // call API helper - adjust function name/path if your project uses a different export
      const res = await createManpowerApi(payload);
      // expecting axios-like response with res.data
      if (res && (res.status === 200 || res.status === 201)) {
        ElNotification({
          title: "Success",
          message: "Manpower post created successfully",
          type: "success",
        });
        // optional: reset form or navigate — keep minimal as requested
        // reset:
        contractorForm.name = "";
        contractorForm.city = "Hyderabad";
        contractorForm.location = "";
        contractorForm.pinCode = "";
        contractorForm.phone = "";
        contractorForm.status = "open";
        contractorForm.availableWorkers = [{ type: "", count: 1 }];
      } else {
        ElNotification({
          title: "Error",
          message: res?.data?.message || "Failed to create manpower post",
          type: "error",
        });
      }
    } catch (err) {
      console.error("Error creating manpower post:", err);
      const msg = err?.response?.data?.message || err.message || "Server error";
      ElNotification({ title: "Error", message: msg, type: "error" });
    } finally {
      submitting = false;
      loading.value = false;
    }
  });
};
</script>
