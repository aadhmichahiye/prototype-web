<template>
  <div class="job-form-page">
    <el-form
      ref="jobFormRef"
      :model="jobForm"
      :rules="rules"
      label-position="top"
      class="job-form"
    >
      <h2 class="form-heading">
        Turn your plans into action – <span>post a job</span> and empower
        workers
      </h2>

      <!-- Job Title -->
      <el-form-item label="Job Title" prop="title">
        <el-input
          v-model="jobForm.title"
          placeholder="example: Mason requirement for 2 months project"
          clearable
        />
      </el-form-item>

      <!-- Description -->
      <el-form-item label="Description" prop="description">
        <el-input
          type="textarea"
          v-model="jobForm.description"
          placeholder="example: Need 10 masons and 20 helpers for construction site"
          rows="4"
          clearable
        />
      </el-form-item>

      <!-- Grid for city & pin -->
      <div class="grid-2">
        <el-form-item label="City" prop="city">
          <el-select v-model="jobForm.city" placeholder="Select City" clearable>
            <el-option label="Hyderabad" value="Hyderabad" />
            <el-option label="Mumbai" value="Mumbai" />
            <el-option label="Delhi" value="Delhi" />
          </el-select>
        </el-form-item>

        <el-form-item label="Pin Code" prop="pincode">
          <el-input
            v-model="jobForm.pincode"
            placeholder="example: 500032"
            maxlength="6"
            clearable
          />
        </el-form-item>
      </div>

      <!-- Address -->
      <el-form-item label="Address" prop="address">
        <el-input
          v-model="jobForm.address"
          placeholder="example: Gachibowli, Shivalayam Road"
          clearable
        />
      </el-form-item>

      <!-- Phone -->
      <el-form-item label="Phone Number" prop="phone">
        <el-input
          v-model="jobForm.phone"
          placeholder="example: 9876543210"
          maxlength="10"
          clearable
        />
        <el-checkbox v-model="jobForm.usePersonal"
          >use personal number</el-checkbox
        >
      </el-form-item>

      <!-- Workers -->
      <el-form-item label="Workers">
        <div
          v-for="(worker, index) in jobForm.workers"
          :key="index"
          class="worker-row"
        >
          <el-select v-model="worker.type" placeholder="Select type">
            <el-option label="Mason" value="mason" />
            <el-option label="Helpers" value="helpers" />
            <el-option label="Electrician" value="electrician" />
            <el-option label="Plumber" value="plumber" />
          </el-select>
          <el-input-number v-model="worker.count" :min="1" :max="999" />
          <el-button type="danger" circle @click="removeWorker(index)">
            <i class="ri-delete-bin-line"></i>
          </el-button>
        </div>
        <el-button type="default" @click="addWorker" class="add-worker-btn">
          <i class="ri-add-line mr-1"></i> Add another worker
        </el-button>
      </el-form-item>

      <!-- Submit -->
      <div class="form-footer">
        <el-button type="primary" class="submit-btn" @click="submitForm">
          <i class="ri-send-plane-fill mr-1"></i> Post Job
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
  city: "",
  address: "",
  pincode: "",
  phone: "",
  usePersonal: false,
  workers: [{ type: "", count: 1 }],
});

// Validation rules
const rules = {
  title: [{ required: true, message: "Title is required", trigger: "blur" }],
  city: [{ required: true, message: "City is required", trigger: "change" }],
  address: [
    { required: true, message: "Address is required", trigger: "blur" },
  ],
  pincode: [
    { required: true, message: "Pin code is required", trigger: "blur" },
    {
      pattern: /^[0-9]{6}$/,
      message: "Enter valid 6-digit pin code",
      trigger: "blur",
    },
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

const addWorker = () => jobForm.workers.push({ type: "", count: 1 });
const removeWorker = (index) => jobForm.workers.splice(index, 1);

const submitForm = () => {
  jobFormRef.value.validate((valid) => {
    if (valid) {
      console.log("Form submitted", jobForm);
    } else {
      console.log("Validation failed");
      return false;
    }
  });
};
</script>

<style lang="scss" scoped>
.job-form-page {
  padding: 5rem 1rem;
}

.job-form {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;

  .form-heading {
    color: #111;
    margin-bottom: 2rem;
    font-size: 1.4rem;
    font-weight: 600;

    span {
      font-weight: 700;
    }
  }

  .grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }

  .worker-row {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .form-footer {
    margin-top: 2rem;

    .submit-btn {
      width: 100%;
      font-size: 1rem;
      padding: 0.75rem;
      border-radius: 0.5rem;
    }
  }
}
</style>
