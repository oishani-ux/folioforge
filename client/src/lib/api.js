// One helper for every call to our backend.
// Always uses relative URLs (/api/...) so the login cookie is sent automatically.
export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

export async function api(path, { method = 'GET', body } = {}) {
  let res
  try {
    res = await fetch(`/api${path}`, {
      method,
      credentials: 'same-origin',
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError("Can't reach the server. Check your internet connection.", 0)
  }
  // The backend always answers JSON; if it doesn't, the server is probably not running.
  const json = await res.json().catch(() => null)
  if (!res.ok) {
    const fallback = res.status >= 500 ? "Can't reach the server. Is it running?" : `Request failed (${res.status})`
    throw new ApiError(json?.error || fallback, res.status)
  }
  return json ?? {}
}
