import React, {  useState } from "react";
import LunchChoiceTable from "./LunchChoiceTable";
import MenuTable from "./MenuTable";
import NavBar from "./NavBar";
import UserTable from "./UserTable";

const HomePage = () => {
  
  const [active, setActive] = useState({
    menu: true,
    user: false,
    choice: false,
  });
  return (
    <div>
      <NavBar setActive={setActive} />
      {active.menu && <MenuTable />}
      {active.user && <UserTable />}
      {active.choice && <LunchChoiceTable />}
    </div>
  );
};

export default HomePage;
