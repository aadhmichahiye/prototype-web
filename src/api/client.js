// src/api/clientPosts.js
import request from "../utils/request";

/**
 * Fetch current user's posts (paginated)
 * params: { page, limit, q, city, pinCode, status }
 */

export function getClientPost(id) {
  return request({
    url: `client-job-posts/my-posts/${id}`,
    method: "get",
  });
}

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
    url: `client-job-posts/my-posts/delete/${id}`,
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

export function updateClientPost(id, data) {
  return request({
    url: `client-job-posts/my-posts/update/${id}`,
    method: "post",
    data,
  });
}

export function fetchClientPostsForContractors(params) {
  return request({
    url: "client-job-posts/all",
    method: "get",
    params,
  });
}

export function getClientPostDetails(id) {
  return request({
    url: `client-job-posts/details/${id}`,
    method: "get",
  });
}
