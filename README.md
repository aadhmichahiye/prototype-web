# 📌 Application Routes

This project uses **Vue Router** with `createWebHistory` mode.  
Routes are organized into **standalone routes** (auth / public pages) and **MainLayout routes** (authenticated area with sidebar & layout).

---

## 🔑 Standalone Routes

These routes do **not** use the `MainLayout`.

| Path        | Name     | Component                      | Notes                   |
| ----------- | -------- | ------------------------------ | ----------------------- |
| `/login`    | Login    | `views/Login.vue`              | User login page         |
| `/register` | Register | `views/Register.vue`           | New user signup         |
| `/terms`    | terms    | `views/TermsAndConditions.vue` | Terms & Conditions page |

---

## 🖥️ MainLayout Routes

These routes are wrapped inside `layouts/MainLayout.vue` (includes sidebar & top layout).

| Path                            | Name (if any)          | Component                               | Notes                                       |
| ------------------------------- | ---------------------- | --------------------------------------- | ------------------------------------------- |
| `/`                             | —                      | Redirect → `/contractor-posts/list`     | Default route                               |
| `/settings`                     | —                      | `components/Settings.vue`               | User settings                               |
| `/client-posts/create`          | —                      | `components/ClientPostsCreate.vue`      | Create a new Client job post                |
| `/contractor-posts/create`      | —                      | `components/ContractorPostsCreate.vue`  | Create a new Contractor availability post   |
| `/client-posts/list`            | —                      | `components/ListOfClientPost.vue`       | List of all client job posts                |
| `/contractor-posts/list`        | —                      | `components/ListOfContractorPost.vue`   | List of all contractor posts                |
| `/client-posts/details/:id`     | ClientPostDetails      | `components/ClientPostDetails.vue`      | Client post detail page (dynamic by ID)     |
| `/contractor-posts/details/:id` | ContractorPostsDetails | `components/ContractorPostsDetails.vue` | Contractor post detail page (dynamic by ID) |

---

## ⚙️ Notes

- **Dynamic Params**:
  - `:id` is used in `/client-posts/details/:id` and `/contractor-posts/details/:id` to show individual post details.
- **Redirect**:
  - Visiting `/` will automatically redirect to `/contractor-posts/list`.
- **Auth Pages** (Login & Register) bypass the `MainLayout` for a clean UX.

---

## 🚀 Example Navigation

```vue
<!-- Navigate to a client post detail -->
<router-link
  :to="{ name: 'ClientPostDetails', params: { id: 1 } }"
>View Client Post</router-link>

<!-- Navigate to contractor list -->
<router-link to="/contractor-posts/list">Contractors</router-link>
```
