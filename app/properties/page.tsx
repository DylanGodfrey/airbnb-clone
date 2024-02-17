import EmptyState from "../components/EmptyState";
import ClientOnly from "@/app/components/ClientOnly";

import { getCurrentUser } from "@/app/actions/getCurrentUser";

import getListings from "../actions/getListings";
import PropertiesClient from "./PropertiesClient";


const PropertiesPage = async() => {
    const currentUser = await getCurrentUser();

    if(!currentUser) {
        return (
            <ClientOnly>
                <EmptyState 
                    title="Unauthorized access"
                    subtitle="Please login"
                />
            </ClientOnly>
        )
    }

    const listings = await getListings({ userId: currentUser.id});

    if (listings.length === 0) {
        return (
            <ClientOnly>
            <EmptyState 
                title="No Properties found"
                subtitle="No properties saved"
            />
        </ClientOnly>  
        )
    }
    
        return (
            <ClientOnly>
            <PropertiesClient
                listings={listings}
                currentUser={currentUser}
            />
        </ClientOnly>  
        )
}

export default PropertiesPage;