import { Suspense } from "react";
import { fetchCarList, fetchVehicleType } from "../../../services/api";

export async function generateStaticParams() {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = 2015; i <= currentYear; i++) years.push(String(i));

  const posts = await fetchCarList().then((res) => res.data.Results);

  return posts.flatMap((record) =>
    years.map((year) => {
      return {
        makeId: String(record.MakeId),
        carYear: year,
      };
    }),
  );
}

export default async function Page({ params }) {
  const { makeId, carYear } = params;
  console.log(makeId, carYear);
  const carTypes = await fetchVehicleType(makeId, carYear)
    .then((res) => res.data.Results)
    .catch(function (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error", error.message);
      }
      console.log(error.config);
    });

  return (
    <>
      {carTypes.map((car) => {
        return (
          <>
            <Suspense fallback={<Loading />}>
              <div className="relative flex flex-col text-gray-700 bg-white shadow-md w-96 rounded-xl bg-clip-border">
                <nav className="flex min-w-[240px] flex-col gap-1 p-2 font-sans text-base font-normal text-blue-gray-700">
                  <div
                    role="button"
                    className={
                      "flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none bg-blue-gray-50/50 text-start text-blue-gray-700 hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900"
                    }
                  >
                    {car.Model_Name}
                  </div>
                </nav>
              </div>
            </Suspense>
          </>
        );
      })}
    </>
  );

  function Loading() {
    return <h2>🌀 Loading...</h2>;
  }
}
