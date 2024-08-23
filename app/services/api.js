import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL,
});

const fetchCarList = (signal) => {
  return api.get("/vehicles/GetMakesForVehicleType/car?format=json", {
    signal: signal,
  });
};

const fetchVehicleType = (makeId, year) => {
  return api.get(
    `/vehicles//GetModelsForMakeIdYear/makeId/${makeId}/modelyear/${year}?format=json`,
  );
};

export { fetchCarList, fetchVehicleType };
