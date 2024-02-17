"use client";

import useSearchModal from "@/app/hooks/useSearchModal";
import Modal from "./Modal";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { Range } from "react-date-range";
import dynamic from "next/dynamic";
import CountrySelect, { CountrySelectValue } from "../inputs/CountrySelect";
import qs from "query-string";
import { formatISO } from "date-fns";
import Heading from "../Heading";
import Calendar from "../inputs/Calendar";
import Counter from "../inputs/Counter";

const SearchModal = () => {
  const router = useRouter();
  const params = useSearchParams();
  const searchModal = useSearchModal();

  enum STEPS {
    LOCATION = 0,
    DATE = 1,
    INFO = 2,
  }
  const [step, setStep] = useState(STEPS.LOCATION);
  const [dateRange, setDateRange] = useState<Range>({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });
  const [guestCount, setGuestCount] = useState(1);
  const [roomCount, setRoomCount] = useState(1);
  const [bathroomCount, setBathroomCount] = useState(1);

  const [location, setLocation] = useState<CountrySelectValue>();

  const Map = useMemo(() =>
    dynamic(() => import("../Map"), {
      ssr: false,
    }), [location]);

  const onBack = useCallback(() => {
    setStep((value) => value - 1);
  }, []);

  const onNext = useCallback(() => {
    setStep((value) => value + 1);
  }, []);

  const onSubmit = useCallback(async () => {
    if (step !== STEPS.INFO) {
      return onNext();
    }

    let currentQuery = {};

    if (params) {
      currentQuery = qs.parse(params.toString());
    }

    const updatedQuery: any = {
      ...currentQuery,
      locationValue: location?.value,
      guestCount,
      roomCount,
      bathroomCount,
    };

    if (dateRange.startDate) {
      updatedQuery.startDate = formatISO(dateRange.startDate);
    }

    if (dateRange.endDate) {
      updatedQuery.endDate = formatISO(dateRange.endDate);
    }

    const url = qs.stringifyUrl({
      url: "/",
      query: updatedQuery,
    }, { skipNull: true });

    setStep(STEPS.LOCATION);
    searchModal.onClose();

    router.push("/");
  }, [
    step,
    searchModal,
    location,
    router,
    guestCount,
    roomCount,
    dateRange,
    onNext,
    bathroomCount,
    params,
  ]);

  const actionLabel = useMemo(() => {
    if (step === STEPS.INFO) {
      return "Search";
    }
    return "Next";
  }, [step]);

  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.LOCATION) {
      return undefined;
    }
    return "Back";
  }, [step]);

  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading
        title="Where do you want to go?"
        subtitle="find the perfect destination:"
      />
      <CountrySelect
        value={location}
        onChange={(value) => {
          setLocation(value as CountrySelectValue);
        }}
      />
      <hr />
      <Map center={location?.latlng} />
    </div>
  );

  if (step === STEPS.DATE) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="When going?"
          subtitle="Clear your calendar!"
        />
        <Calendar
          value={dateRange}
          onChange={(value) => {
            setDateRange(value.selection);
          }}
        />
      </div>
    );
  }

  if (step === STEPS.INFO) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="More info"
          subtitle="Find your perfect place"
        />
        <Counter 
            title="Guests"
            subtitle="How many?"
            value={guestCount}
            onChange={(value) => {setGuestCount}}
        />
        <Counter 
            title="Rooms"
            subtitle="How many?"
            value={roomCount}
            onChange={(value) => {setRoomCount}}
        />
        <Counter 
            title="Bathrooms"
            subtitle="How many?"
            value={bathroomCount}
            onChange={(value) => {setBathroomCount}}
        />
      </div>
    );
  }

  return (
    <div className="">
      <Modal
        isOpen={searchModal.isOpen}
        onClose={searchModal.onClose}
        onSubmit={onSubmit}
        title="Filters"
        actionLabel="Search"
        secondaryAction={step === STEPS.LOCATION ? undefined : onBack}
        secondaryActionLabel={secondaryActionLabel}
        body={bodyContent}
      />
    </div>
  );
};

export default SearchModal;
