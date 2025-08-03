import { API_URL } from "@/lib/constants";

export const fetchLunchData = async (setLunchData) => {
    try {
      const response = await fetch(API_URL+"/lunchChoice");
      const data = await response.json();
      if (data.status === "success") {
        setLunchData(data.result);
      } else {
        console.log(data.error);
      }
    } catch (error) {
      console.error("Error fetching lunch data:", error);
    }
  };