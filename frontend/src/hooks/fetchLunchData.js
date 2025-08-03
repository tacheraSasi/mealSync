export const fetchLunchData = async (setLunchData) => {
    try {
      const response = await fetch("http://localhost:3001/lunchChoice");
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