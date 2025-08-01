export const fetchMenuData = async (setMenuData) => {
    try {
      const response = await fetch("http://localhost:5000/menu");
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
