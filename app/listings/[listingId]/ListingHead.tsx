"use client";

import Heading from "@/app/components/Heading";
import HeartButton from "@/app/components/HeartButton";
import useCountries from "@/app/hooks/useCountries";
import { SafeUser } from "@/app/types";
import Image from "next/image";

interface ListingHeadProps {
  id: string;
  title: string;
  imageSrc: string;
  locationValue: string;
  currentUser?: SafeUser | null;
}

const ListingHead:React.FC<ListingHeadProps> = ({
  id,
  title,
  imageSrc,
  locationValue,
  currentUser,
}) => {
    const { getByValue } = useCountries();

    const location = getByValue(locationValue);
  return <>
  <Heading 
  title={title}
  subtitle={`${location?.region},${location?.label}`}
  />
  <div className="w-full h-[60vh] overflow-hidden rounded-xl relative">
    <Image  
    alt="Image"
    fill
    className="object-cover w-full"
    src={imageSrc}
    />
    <HeartButton
    listingId={id}
    currentUser={currentUser}
    />
  </div>
  </>;
};

export default ListingHead;
