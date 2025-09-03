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

        <el-form-item label="Pincode" prop="pincode">
          <el-input
            v-model="contractorForm.pincode"
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
          :data="contractorForm.workers"
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

const contractorFormRef = ref();

const contractorForm = reactive({
  name: "",
  city: "Hyderabad", // default
  location: "",
  pincode: "",
  phone: "",
  status: "open",
  workers: [{ type: "", count: 1 }],
});

const rules = {
  name: [
    { required: true, message: "Contractor name is required", trigger: "blur" },
  ],
  city: [{ required: true, message: "City is required", trigger: "change" }],
  location: [
    { required: true, message: "Location is required", trigger: "blur" },
  ],
  pincode: [
    { required: true, message: "Pincode is required", trigger: "blur" },
    {
      pattern: /^[0-9]{6}$/,
      message: "Enter a valid 6-digit pincode",
      trigger: "blur",
    },
  ],
  phone: [
    { required: true, message: "Phone number is required", trigger: "blur" },
    {
      pattern: /^[0-9]{10}$/,
      message: "Enter a valid 10-digit phone number",
      trigger: "blur",
    },
  ],
  status: [
    { required: true, message: "Status is required", trigger: "change" },
  ],
};

const addWorker = () => {
  contractorForm.workers.push({ type: "", count: 1 });
};

const removeWorker = (index) => {
  contractorForm.workers.splice(index, 1);
};

const submitForm = () => {
  contractorFormRef.value.validate((valid) => {
    if (valid) {
      console.log("Form submitted:", contractorForm);
    } else {
      console.log("Validation failed");
      return false;
    }
  });
};
</script>
