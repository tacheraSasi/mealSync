import { useState } from "react";
import LunchChoiceTable from "./LunchChoiceTable";
import MenuTable from "./MenuTable";
import NavBar from "./NavBar";
import UserTable from "./UserTable";
import AdminWeeklyPlanView from "./AdminWeeklyPlanView";
import DepartmentTable from "./DepartmentTable";
import DietaryPreferencesTable from "./DietaryPreferencesTable";

const HomePage = () => {
  const [active, setActive] = useState({
    menu: true,
    user: false,
    choice: false,
    weeklyPlans: false,
    departments: false,
    dietaryPreferences: false,
  });
  return (
    <div>
      <NavBar setActive={setActive} />
      {active.menu && <MenuTable />}
      {active.user && <UserTable />}
      {active.choice && <LunchChoiceTable />}
      {active.weeklyPlans && <AdminWeeklyPlanView />}
      {active.departments && <DepartmentTable />}
      {active.dietaryPreferences && <DietaryPreferencesTable />}
    </div>
  );
};

export default HomePage;
