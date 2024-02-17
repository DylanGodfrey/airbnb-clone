"use client";

import { SafeReservation, SafeUser } from "../types";
import Container from "../components/Container";
import Heading from "../components/Heading";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import ListingCard from "../components/listings/ListingCard";

interface ReservationClientProps {
  currentUser?: SafeUser | null;
  reservations: SafeReservation[];
}

const ReservationClient: React.FC<ReservationClientProps> = (
  { currentUser, reservations },
) => {
  const router = useRouter();

  const [deletingId, setDeletingId] = useState("");
  const onCancel = useCallback((id: string) => {
    setDeletingId(id);

    axios.delete(`/api/reservations/${id}`)
      .then(() => {
        toast.success("Successfully removed reservation");
      })
      .catch((error) => {
        toast.error("Something went wrong");
      })
      .finally(() => {
        setDeletingId("");
      });
  }, [router]);

  return (
    <Container>
      <Heading
        title="Reservations"
        subtitle="Bookings on your properties"
      />
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
        {reservations.map((reservation) => (
          <ListingCard
            key={reservation.id}
            data={reservation.listing}
            actionId={reservation.id}
            actionLabel="Cancel guest reservation"
            onAction={onCancel}
            disabled={deletingId === reservation.id}
            currentUser={currentUser}
          />
        ))}
      </div>
    </Container>
  );
};

export default ReservationClient;
