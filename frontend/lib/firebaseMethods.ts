import axios from "axios";
import { BACKEND_URL } from "./apiEndPoints";

export async function updateLibraryRating(library:string, rating:number, isLoud:boolean, goodForGroups:boolean, floor:string){
    try {
        const res =  await axios.post(BACKEND_URL+'/api/library/update', {
          library: library,
          rating: rating,
          goodForGroups: goodForGroups,
          isLoud: isLoud,
          floor:floor,
          createdAt: new Date(),
        })
        console.log(res)
      } catch (e) {
        console.error("Error adding document: ", e);
      }
}

export async function getLibraryRating(library:string){
  console.log("\n---"+BACKEND_URL+'/api/library/'+library+"---\n")
  const res =  await axios.get(BACKEND_URL+'/api/library/'+library)
  console.log(res)
  return res
}

export async function getAllLibraryRatings(){
  const res =  await axios.get(BACKEND_URL+'/api/library/')
  console.log("Got ratings data")
  return res
}

// export async function getLibraryRating(library:string){
//       // 1. Calculate "1 hour ago"
//       const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

//       // 2. Create the query
//       // "createdAt" should be the name of your timestamp field in Firestore
//       const q = query(
//         collection(db, "libraryCapacityData"), 
//         where("library", "==", library),
//         where("createdAt", ">", oneHourAgo)
//       );

//       try {
//         const querySnapshot = await getDocs(q);
//         const results = querySnapshot.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data()
//         }));
//         console.log("Found docs:", results);
//         if(results.length == 0)
//           return 50
//         let total = 0
//         results.forEach((res)=>{total += res.rating;})
//         return total/results.length
//       } catch (error) {
//         console.error("Error fetching docs:", error);
//         return 50
//       }

// }