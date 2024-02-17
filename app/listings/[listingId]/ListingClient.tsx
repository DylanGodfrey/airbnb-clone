"use client";

import Container from "@/app/components/Container";
import { categories } from "@/app/components/navbar/Categories";
import { SafeListing, SafeReservation, SafeUser } from "@/app/types";
import { useCallback, useEffect, useMemo, useState } from "react";
import ListingHead from "./ListingHead";
import ListingInfo from "./ListingInfo";
import useLoginModal from "@/app/hooks/useLoginModal";
import { useRouter } from "next/navigation";
import { differenceInCalendarDays, eachDayOfInterval } from "date-fns";
import axios from "axios";
import toast from "react-hot-toast";
import ListingReservation from "./ListingReservation";
import { Range } from "react-date-range";

const initialDateRange = {
  startDate: new Date(),
  endDate: new Date(),
  key: "selection",
};

interface ListingClientProps {
  listing: SafeListing & { user: SafeUser; };
  currentUser?: SafeUser | null;
  reservations?: SafeReservation[];
}

const ListingClient: React.FC<ListingClientProps> = (
  { listing, currentUser, reservations = [] },
) => {
  const loginModal = useLoginModal();
  const router = useRouter();

  const disabledDates = useMemo(() => {
    let dates: Date[] = [];
    reservations.forEach((reservation) => {
      const range = eachDayOfInterval({
        start: new Date(reservation.startDate),
        end: new Date(reservation.endDate),
      });
      dates = [...dates, ...range];
    });

    return dates;
  }, [reservations]);

  const [isLoading, setisLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(listing.price);
  const [dateRange, setDateRange] = useState<Range>(initialDateRange);

  const onCreateReservation = useCallback(() => {
    if (!currentUser) {
      return loginModal.onOpen();
    }

    setisLoading(true);

    axios.post("/api/reservations", {
      totalPrice,
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      listingId: listing?.id,
    })
      .then(() => {
        toast.success("Lisiting reserved");
        setDateRange(initialDateRange);
        router.push('/trips');
      })
      .catch(() => {
        toast.error("Something went wrong");
      })
      .finally(() => {
        setisLoading(false);
      });
  }, [
    currentUser,
    router,
    totalPrice,
    dateRange,
    listing?.id,
    loginModal,
  ]);

  useEffect(() => {
    if (dateRange.startDate && dateRange.endDate) {
        const dayCount = differenceInCalendarDays (
            dateRange.endDate, dateRange.startDate
        )
        
        if (dayCount && listing.price) {
            setTotalPrice(dayCount * listing.price);
        }
        else {
            setTotalPrice(listing.price);
        }
    }
  }, [dateRange, listing.price])

  const category = useMemo(() => {
    categories.find((item) => item.label === listing.category);
  }, [listing.category]);

  return (
    <Container>
      <div className="max-w-screen-lg mx-auto">
        <div className="flex flex-col gap-6">
          <ListingHead
            id={listing.id}
            title={listing.title}
            imageSrc={listing.imageSrc}
            locationValue={listing.locationValue}
            currentUser={currentUser}
          />

          <div className="grid grid-cols-1 md:grid-cols-7 md:gap-10 mt-6">
            <ListingInfo
              user={listing.user}
              category={category}
              description={listing.description}
              roomCount={listing.roomCount}
              guestCount={listing.guestCount}
              bathroomCount={listing.bathroomCount}
              locationValue={listing.locationValue}
            />
            <div className="order-first mb-10 md:order-last md:col-span-3">
                <ListingReservation 
                price={listing.price}
                totalPrice={totalPrice}
                onChangeDate={(value) => setDateRange(value)}
                dateRange={dateRange}
                onSubmit={onCreateReservation}
                disabled={isLoading}                
                disabledDates={disabledDates}
                />
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ListingClient;
