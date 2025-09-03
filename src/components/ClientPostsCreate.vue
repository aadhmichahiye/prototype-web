<template>
  <div class="client-create-job">
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
          rows="3"
          clearable
        />
      </el-form-item>

      <!-- City & Pincode -->
      <div class="grid-2">
        <el-form-item label="City" prop="city">
          <el-select v-model="jobForm.city" placeholder="Select City" clearable>
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

      <!-- phone nuber -->
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
        <el-table :data="jobForm.workers" border stripe style="width: 100%">
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
          Submit Job
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";

const jobFormRef = ref();

const jobForm = reactive({
  title: "",
  description: "",
  city: "Hyderabad", // default
  pincode: "",
  address: "",
  workers: [{ type: "", count: 1 }],
  phone: "",
});

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

const addWorker = () => {
  jobForm.workers.push({ type: "", count: 1 });
};

const removeWorker = (index) => {
  jobForm.workers.splice(index, 1);
};

const submitForm = () => {
  jobFormRef.value.validate((valid) => {
    if (valid) {
      console.log("Form submitted:", jobForm);
    } else {
      console.log("Validation failed");
      return false;
    }
  });
};
</script>
