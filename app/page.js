'use client'
import Image from "next/image";
import { useEffect, useState, useMemo, useRef } from "react";
import { fetchCarList } from './services/api';
import { Suspense } from 'react';
import { lazy } from 'react';

const Select = lazy(() => import('./components/Select'));

export default function Home() {

  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(new Promise((resolve, reject) => {}));
  let [disabled, setDisabled] = useState(true);
  const [selectedCar, setselectedCar] = useState(null);
  const [selectedYear, setselectedYear] = useState(null);

  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = 2015; i <= currentYear; i++) years.push(String(i));

  const effectRun = useRef(false);

  const getCars = useMemo(() => (signal) => {
    try {
      fetchCarList(signal).then((res) => {
        const cars = (res);
        console.log(cars)
        setCars(cars.data.Results);
        setLoading(Promise.resolve());
      })
    } catch (e) {
      if (e.name === "AbortError") {
        console.log("Aborted");
        return;
      }
      setError(e);
    } finally {
   
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController();
    if (effectRun.current) {
      getCars(controller.signal);
    }
    return () => { controller.abort(); effectRun.current = true; };
  }, [getCars]);

  useEffect(() => {
   makeButtonActive();
  }, [selectedCar, selectedYear])

  const handleCarSelection = (e) => {
    setselectedCar(e.target.value)
  }

  const handleYearSelection = (e) => {
    setselectedYear(e.target.value)
  }

  const makeButtonActive = () => {
    selectedCar != null && selectedYear != null ? setDisabled(false) : setDisabled(true)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Suspense fallback={<Loading />}>
        <section className="py-24 relative">
                  {loading}
                  <Select handleCarSelection={handleCarSelection} sortBy={'car'}>
                  {cars.map(car => <option key={car.MakeId} value={car.MakeId}>{car.MakeName}</option>)}
                  </Select>
                    <Select handleCarSelection={handleYearSelection} sortBy={'year'}>
                  {years.map(year => <option key={year} value={year}>{year}</option>)}
                  </Select>         
        </section>
      </Suspense>
      <a href={`results/${selectedCar}/${selectedYear}`} className={'text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800' + ' ' + (disabled ? 'disabled' : '')}>Next</a>
    </main>
  );
}

function Loading() {
  return <h2>🌀 Loading...</h2>;
}
