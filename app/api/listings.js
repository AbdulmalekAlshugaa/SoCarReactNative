import client from "./client";

const endpoint = "/cars";

const getListings = () => client.get(endpoint);
//

const makeBooking = (carId, onUploadProgress) =>
  client.put("/cars/bookCar", carId, {
    onUploadProgress: (progress) =>
      onUploadProgress(progress.loaded / progress.total),
  });
//
const myBooking = () => client.get("/cars/myBooking");
const myBookedCar = () => client.get("/cars/myCarsBooking");

export const addListing = (listing, onUploadProgress) => {
  const data = new FormData();
  data.append("title", listing.title);
  data.append("price", listing.price);
  data.append("categoryId", listing.category);
  data.append("description", listing.description);

  listing.images.forEach((image, index) =>
    data.append("images", {
      images,
    })
  );

  if (listing.location)
    data.append("location", JSON.stringify(listing.location));

  return client.post(endpoint, data, {
    onUploadProgress: (progress) =>
      onUploadProgress(progress.loaded / progress.total),
  });
};

export default {
  addListing,
  getListings,
  makeBooking,
  myBooking,
  myBookedCar,
};
