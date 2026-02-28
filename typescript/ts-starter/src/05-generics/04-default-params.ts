// Write type ApiResponse<T = unknown> = { status: number; data: T }.
// Use ApiResponse<string> vs ApiResponse.
// Observe defaulting to unknown.

type ApiResponse<T = unknown> = { status: number; data: T };

const response: ApiResponse = { status: 200, data: {Status: "Connected"} };

const response2: ApiResponse<string> = { status: 200, data: "Successfull Transferred" };

console.log(response);
console.log(response2);
