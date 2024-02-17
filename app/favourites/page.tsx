import EmptyState from "@/app/components/EmptyState";
import ClientOnly from "@/app/components/ClientOnly";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import getFavouriteListings from "../actions/getFavouriteListings";
import FavouritesClient from "./FavouritesClient";

const ListingPage = async () => {

    const listings = await getFavouriteListings();
    const currentUser = await getCurrentUser();
    if (listings.length === 0) {
        return (
            <ClientOnly>
                <EmptyState
                title="No favourites found"
                subtitle="No favourites"
                />
            </ClientOnly>
        )
    }
    
    return ( 
        <ClientOnly>
            <FavouritesClient 
                listings={listings}
                currentUser={currentUser}
            />
        </ClientOnly>
    )

};
export default ListingPage;