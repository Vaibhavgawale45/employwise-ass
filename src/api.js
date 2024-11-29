import { message } from "antd";
import { LOCAL_API_BASE_URL, METHOD_TYPES } from "./constants/app-constants";

const makeApiCall = async (methodType, endPoint, body) => {
  const url = `${LOCAL_API_BASE_URL}${endPoint}`;

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
      const errorMessage = errorData.message || response.statusText;
      message.error(errorMessage);
      throw new Error(`Error: ${response.status} - ${errorMessage}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API Error:", error.message);
    throw error;
  }
};

export default makeApiCall;
