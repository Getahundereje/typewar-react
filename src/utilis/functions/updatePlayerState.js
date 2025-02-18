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
    const { data } = response;
    return data.data;
  } catch (error) {
    console.log(error);
    return {};
  }
}

export default updatePlayerSetting;
