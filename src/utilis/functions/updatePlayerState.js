import axios from "axios";

async function updatePlayerSetting(newState) {
  try {
    const response = await axios.post(
      "http://localhost:8000/states",
      newState,
      {
        withCredentials: true,
      }
    );

    return response.status;
  } catch (error) {
    return error.status;
  }
}

export default updatePlayerSetting;
