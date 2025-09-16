import request from "../utils/request";

/**
 * Fetch current user's posts (paginated)
 * params: { page, limit, q, city, pinCode, status }
 */

export function fetchContractorsApi(params) {
  return request({
    url: "contractor-manpower-posts/all",
    method: "get",
    params,
  });
}


export function getContractorPostDetails(id) {
  return request({
    url: `contractor-manpower-posts/${id}`,
    method: "get",
  });
}