import './NavigationHeader.css'
import RouterBreadcrumbs from "../../components/ui/RouterBreadcrumbs";
import UserProfile from './UserProfile'
// import { Breadcrumbs } from '@mui/material'

function NavigationHeader() {
    return (
        <section className="navigationHeader">
            <RouterBreadcrumbs />
            <UserProfile />
        </section>
    )
}

export default NavigationHeader