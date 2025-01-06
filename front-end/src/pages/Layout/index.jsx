import { Outlet } from "react-router-dom";
import PageHeader from "../../components/ui/RITBanner";
import './styles.css'

function Layout() {
  return (
    <>
      <div className="pageLayout">
        <PageHeader />
        <Outlet />
      </div>
    </>
  );
};

export default Layout;
