import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface GeoLocation {
  lat: number,
  lng: number
}

export const getCurrentLocation = (): Promise<{ lat: number; lng: number }> => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      console.warn("Geolocation not supported");
      resolve({ lat: -1, lng: -1 });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      // Error (User denied, timeout, or technical error)
      (error) => {
        console.warn("Geolocation error or timeout:", error.message);
        resolve({ lat: -1, lng: -1 });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000*15
      }
    );
  });
};

export const getDynamicStyles = (percentage: number) => {
  let textClass = '';
  let sliderClass = '';

  if (percentage <= 25) {
    textClass = 'text-green-600';
    sliderClass = '[&_.bg-primary]:bg-green-600'; 
  } else if (percentage <= 50) {
    textClass = 'text-yellow-600';
    sliderClass = '[&_.bg-primary]:bg-yellow-600';
  } else if (percentage <= 75) {
    textClass = 'text-orange-600';
    sliderClass = '[&_.bg-primary]:bg-orange-600';
  } else {
    textClass = 'text-red-600';
    sliderClass = '[&_.bg-primary]:bg-red-600';
  }
  return { textClass, sliderClass };
};