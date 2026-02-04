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

export const getDynamicStyles = (percentage:number) => {
  let textClass = '';
  let sliderClass = ''; // Keeping this as HSL or Hex if needed for style={{}} prop
  let statusType = '';
  let statusName = ''
  if (percentage <= 25) {
    // Green-600
    statusName='Not Crowded'
    statusType='NotCrowded';
    textClass = 'text-green-600';
    sliderClass = 'hsl(142, 76%, 36%)';
  } else if (percentage <= 50) {
    // Yellow-600
    statusName='Not Too Crowded'
    statusType='NotTooCrowded';
    textClass = 'text-yellow-600';
    sliderClass = 'hsl(42, 93%, 40%)';
  } else if (percentage <= 75) {
    // Orange-600
    statusName='Crowded'
    statusType='Crowded'
    textClass = 'text-orange-600';
    sliderClass = 'hsl(25, 90%, 48%)';
  } else {
    // Red-600
    statusName='At Capacity'
    statusType='AtCapacity'
    textClass = 'text-red-600';
    sliderClass = 'hsl(0, 72%, 51%)';
  }

  return { textClass, sliderClass, statusType, statusName };
};