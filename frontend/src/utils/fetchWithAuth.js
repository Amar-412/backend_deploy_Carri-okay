let tokenGetter = null;
let unauthorizedHandler = null;

export const configureFetchWithAuth = ({ getToken, onUnauthorized } = {}) => {
  tokenGetter = typeof getToken === "function" ? getToken : null;
  unauthorizedHandler =
    typeof onUnauthorized === "function" ? onUnauthorized : null;
};

const hasHeader = (headers, keyToCheck) =>
  Object.keys(headers).some(
    (key) => key.toLowerCase() === keyToCheck.toLowerCase()
  );

const shouldAutoJsonify = (body) => {
  if (body == null || typeof body === "string") return false;
  if (typeof FormData !== "undefined" && body instanceof FormData) return false;
  if (typeof URLSearchParams !== "undefined" && body instanceof URLSearchParams) return false;
  if (typeof Blob !== "undefined" && body instanceof Blob) return false;
  if (typeof ArrayBuffer !== "undefined" && body instanceof ArrayBuffer) return false;
  return typeof body === "object";
};

export const fetchWithAuth = async (url, options = {}, token) => {
  const {
    headers = {},
    onUnauthorized,
    skipAuth = false,
    ...restOptions
  } = options;

  const resolvedToken = skipAuth
    ? null
    : token ?? tokenGetter?.() ?? null;

  let body = restOptions.body;
  const mergedHeaders = { ...headers };

  if (shouldAutoJsonify(body)) {
    body = JSON.stringify(body);
    if (!hasHeader(mergedHeaders, "Content-Type")) {
      mergedHeaders["Content-Type"] = "application/json";
    }
  } else if (body != null && !hasHeader(mergedHeaders, "Content-Type")) {
    mergedHeaders["Content-Type"] = "application/json";
  }

  if (resolvedToken) {
    mergedHeaders.Authorization = `Bearer ${resolvedToken}`;
  }

  const response = await fetch(url, {
    ...restOptions,
    body,
    headers: mergedHeaders
  });

  if (response.status === 401) {
    console.warn("Unauthorized - token expired or invalid");

    if (typeof onUnauthorized === "function") {
      onUnauthorized();
    } else if (typeof unauthorizedHandler === "function") {
      unauthorizedHandler();
    }
  }

  return response;
};
