import EmptyState from "../components/EmptyState";
import ClientOnly from "@/app/components/ClientOnly";

import { getCurrentUser } from "@/app/actions/getCurrentUser";

import getReservations from "@/app/actions/getReservations";
import TripsClient from "./TripsClient";


const TripsPage = async() => {
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

    const reservations = await getReservations({ userId: currentUser.id});

    if (reservations.length === 0) {
        return (
            <ClientOnly>
            <EmptyState 
                title="No trips found"
                subtitle="Schedule a trip"
            />
        </ClientOnly>  
        )
    }
    
        return (
            <ClientOnly>
            <TripsClient 
                reservations={reservations}
                currentUser={currentUser}
            />
        </ClientOnly>  
        )
}

export default TripsPage;