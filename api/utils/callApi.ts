/**
 * Enumeration of HTTP methods.
 */
export enum API_METHOD {
  POST = 'POST',
  GET = 'GET',
}

/**
 * List of error codes that can be encountered.
 */
export const ERROR_CODES = [500, 502, 400, 404]

/**
 * Makes an API call to the specified endpoint using the given HTTP method and data.
 *
 * @param endpoint - The API endpoint to call.
 * @param method - The HTTP method to use (GET or POST).
 * @param data - The data to send with the request.
 * @returns A promise that resolves to the response data.
 * @throws An error if the API call fails.
 */
export async function callApi(endpoint: string, method: API_METHOD, data: any): Promise<any> {
  const backend = process.env.NEXT_PUBLIC_BACKEND_ENDPOINT
  let url = `${backend}/${endpoint}`
  const headers = {
    'Content-Type': 'application/json',
  }

  try {
    let response: any

    // Handle POST request
    if (method === API_METHOD.POST) {
      response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        const error = new Error(errorData.message || errorData.error || 'Something went wrong')
        ;(error as any).statusCode = response.status // Add the status code to the error object
        throw error
      }
    }
    // Handle GET request
    else if (method === API_METHOD.GET) {
      const params = new URLSearchParams(data).toString()
      url += `?${params}`
      response = await fetch(url, {
        method,
        headers: {}, // Headers for GET request do not need 'Content-Type'
      })

      if (!response.ok) {
        const errorData = await response.json()
        const error = new Error(errorData.message || errorData.error || 'Something went wrong')
        ;(error as any).statusCode = response.status // Add the status code to the error object
        throw error
      }
    }

    // Parse and return the response data
    return await response
  } catch (error) {
    throw error
  }
}
