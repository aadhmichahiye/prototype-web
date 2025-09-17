import request from "../utils/request";

/**
 * Fetch current user's posts (paginated)
 * params: { page, limit, q, city, pinCode, status }
 */

export function createManpowerApi(data) {
  return request({
    url: `contractor-manpower-posts/create`,
    method: "post",
    data,
  });
}
export function fetchContractorsApi(params) {
  return request({
    url: "contractor-manpower-posts/all",
    method: "get",
    params,
  });
}

export function deleteContractorPost(id) {
  return request({
    url: `contractor-manpower-posts/delete/${id}`,
    method: "delete",
  });
}

export function fetchMyContractorPosts(params) {
  return request({
    url: `contractor-manpower-posts/my-posts`,
    method: "get",
    params,
  });
}

export function getContractorPostDetails(id) {
  return request({
    url: `contractor-manpower-posts/details/${id}`,
    method: "get",
  });
}
