import getListingById from "@/app/actions/getListingById";
import EmptyState from "@/app/components/EmptyState";
import ClientOnly from "@/app/components/ClientOnly";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import ListingClient from "./ListingClient";
import getReservations from "@/app/actions/getReservations";


interface IParams {
    listingId?: string;
}

// Not a client component, so can't useRouter - but can use params to pass data between
const ListingPage = async ({ params }: { params: IParams }) => { 
    const listing = await getListingById(params);
    const currentUser = await getCurrentUser();
    const reservations = await getReservations(params);


    if (!listing) {
        return (
            <ClientOnly>
                <EmptyState />
            </ClientOnly>
        )
    }

    return ( 
            <ClientOnly>
                <ListingClient listing={listing} currentUser={currentUser} reservations={reservations} />
            </ClientOnly>
    );
}
 
export default ListingPage;