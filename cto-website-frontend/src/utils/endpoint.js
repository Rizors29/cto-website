const ENDPOINTS = {
  LOGIN: "/login",
  REGISTER: "/register",

  REQUEST: "/it-service-request",
  REQUEST_DETAIL: (id) => `/it-service-request/${id}`,
  REQUEST_APPROVED: (id) => `/it-service-request/${id}/approve`,
  REQUEST_REJECTED: (id) => `/it-service-request/${id}/reject`,
  REQUEST_DONE: (id) => `/it-service-request/${id}/done`,
  REQUEST_STORAGE: (attachment_path) => `http://localhost:8000/storage/${attachment_path}`,

  INVENTORY: "/inventory",
  INVENTORY_DETAIL: (id) => `/inventory/${id}`,

  SUBMIT_REQUEST: "/submit-request",
  SUBMIT_INVENTORY: "/submit-inventory",
  PUBLISH_NEWS: "/publish-news",

  NEWS: "/news",
  NEWS_DETAIL: (slug) => `/news/${slug}`,
  NEWS_VIEWS: (slug) => `/news/increment-views/${slug}`,
  NEWS_STORAGE: (thumbnail) => `http://localhost:8000/storage/${thumbnail}`,

  GUIDELINE_LIST: "/guideline/list",
  GUIDELINE_UPLOAD: "/guideline/upload",
  GUIDELINE_DELETE: (id) => `/guideline/${id}/delete`,
  GUIDELINE_VIEW: (id) => `http://localhost:8000/api/guideline/${id}/view`,

  REQUEST_SUMMARY_ADMIN: (selectedYear) => `/dashboard/request-summary?year=${selectedYear}`,
  REQUEST_SUMMARY_INTERNAL: (selectedYear) => `/dashboard/request-summary/my?year=${selectedYear}`,
  
  REQUEST_MONTH_ADMIN: (selectedYear) => `/dashboard/request-month?year=${selectedYear}`,
  REQUEST_MONTH_INTERNAL: (selectedYear) => `/dashboard/request-month/my?year=${selectedYear}`,
  
  REQUEST_CATEGORY_ADMIN: (selectedYear) => `/dashboard/request-category?year=${selectedYear}`,
  REQUEST_CATEGORY_INTERNAL: (selectedYear) => `/dashboard/request-category/my?year=${selectedYear}`,

  REQUEST_TABLE_ADMIN: (selectedYear) => `/it-service-request?year=${selectedYear}`,
  REQUEST_TABLE_INTERNAL: (selectedYear) => `/it-service-request/my?year=${selectedYear}`,

  INVENTORY_MONTH: (selectedYear) => `/dashboard/inventory-month?year=${selectedYear}`,
  INVENTORY_CATEGORY: (selectedYear) => `/dashboard/inventory-category?year=${selectedYear}`,

  PROFILE: "/profile",
  PROFILE_UPDATE: "/profile/update",
};

export default ENDPOINTS;
