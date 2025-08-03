import { API_URL } from "@/lib/constants";

export const fetchMenuData = async (setMenuData) => {
    try {
      const response = await fetch(API_URL+"/menu");
      const data = await response.json();
      if (data.status === "success") {
        setMenuData(data.result);
      } else {
        console.log(data.error);
      }
    } catch (error) {
      console.error("Error fetching menu data:", error);
    }
  };
