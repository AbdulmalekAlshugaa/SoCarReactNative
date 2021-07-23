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
  data.append("categoryId", listing.category.value);
  data.append("description", listing.description);
  data.append("location[latitude]", listing.location.latitude);
  data.append("location[longitude]", listing.location.longitude);

  // if (listing.location)
  //   data.append("location", JSON.stringify(listing.location));

  listing.images.forEach((image, index) =>
    data.append("images", {
      name: "images" + index,
      type: "image/jpeg",
      uri: image,
    })
  );

  return client.post(
    endpoint,
    data,

    {
      onUploadProgress: (progress) =>
        onUploadProgress(progress.loaded / progress.total),
    }
  );
};

export default {
  addListing,
  getListings,
  makeBooking,
  myBooking,
  myBookedCar,
};
