import { BASE_URL } from "./constants/app-constants";

const makeApiCall = async (methodType, endPoint, body) => {
  const url = `${BASE_URL}${endPoint}`;

  try {
    const loginDetails = JSON.parse(localStorage.getItem("loginDetails"));
    const token = loginDetails?.result?.token || null;

    const headers = {};

    if (token) {
      headers["X-auth-token"] = `bearer ${token}`;
    }

    let requestOptions = {
      method: methodType,
      headers: headers,
    };

    if (body instanceof FormData) {
      requestOptions = {
        ...requestOptions,
        body: body,
      };
    } else {
      headers["Content-Type"] = "application/json";
      requestOptions = {
        ...requestOptions,
        body: JSON.stringify(body),
      };
    }

    const response = await fetch(url, requestOptions);

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData.message || "Failed to login.";
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API Error:", error.message);
    throw new Error(error.message || "An error occurred while logging in.");
  }
};

export default makeApiCall;
