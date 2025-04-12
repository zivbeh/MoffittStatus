"use client"
import dynamic from "next/dynamic"
const Map = dynamic(()=> import('./MapInterface'),{
    ssr:false
})
export default Map
// export const LazyMarker = dynamic(
//     async () => (await import('react-leaflet')).Marker,
//     {
//       ssr: false,
//     }
//   )
  
//   export const LazyMarkerCluster = dynamic(
//     async () => (await import('./MapComponent')),
//     {
//       ssr: false,
//     }
//   )