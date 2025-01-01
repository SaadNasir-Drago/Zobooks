"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import CreateListing from "../../create-listing/page";
const Updatelisting = ({ params }: { params: { id: string } }) => {
  const [property, setProperty] = useState(null);
  const { id } = params; // This gets the dynamic `id` from the URL

  useEffect(() => {
    if (id) {
      axios
        .get(`https://zolo-production.up.railway.app/api/getProperty/${id}`)
        .then((response) => {
          setProperty(response.data);
        })
        .catch((error) => {
          console.error("Error fetching property data:", error);
        });
    }
  }, []);

  return (
    <div>
      <CreateListing {...(property ? { updateData: property } : {})} />
    </div>
  );
};

export default Updatelisting;
