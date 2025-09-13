// src/api/clientPosts.js
import request from "../utils/request";

/**
 * Fetch current user's posts (paginated)
 * params: { page, limit, q, city, pinCode, status }
 */
export function fetchMyPosts(params = {}) {
  return request({
    url: "client-job-posts/my-posts",
    method: "get",
    params,
  });
}

/**
 * Delete a client post
 */
export function deleteClientPost(id) {
  return request({
    url: `client-job-posts/${id}`,
    method: "delete",
  });
}

export function createClientJob(data) {
  return request({
    url: "client-job-posts/create",
    method: "post",
    data,
  });
}
