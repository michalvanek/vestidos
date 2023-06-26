import axios from "axios"; //Axios slouzi pro komunikaci s backendem

export class DressService {
  static serverURL = "http://localhost:5001"; //tady bezi api server

  //   //fce na vytazeni vsech kategorii
  //   static getCategories() {
  //     let dataURL = `${this.serverURL}/categories`;
  //     return axios.get(dataURL);
  //   }

  //   //fce na vytazeni konkretni kategorie podle ID
  //   static getCategory(video) {
  //     let categoryId = video.categoryId;
  //     if (categoryId === -1)
  //       return { data: { id: -1, name: "No category", topics: [] } }; //video can have no category assigned, so there is no need in axios request (will result in 404 error)
  //     let dataURL = `${this.serverURL}/categories/${categoryId}`;
  //     return axios.get(dataURL);
  //   }

  //fce na vytazeni vsech satu z databaze
  static getAllDresses() {
    let dataURL = `${this.serverURL}/api/dress`;
    return axios.get(dataURL);
  }
}

//   //fce na ziskani konkretniho videa podle ID z databaze
//   static getVideo(videoId) {
//     let dataURL = `${this.serverURL}/videos/${videoId}`;
//     return axios.get(dataURL);
//   }

//   //fce vytvoreni noveho videa
//   static createVideo(video) {
//     let dataURL = `${this.serverURL}/videos`;
//     const validationResult = addAbl(video);
//     if (!validationResult?.errors?.length) {
//       //Check if validation errors array is empty
//       return axios.post(dataURL, video);
//     } else {
//       throw TypeError(
//         JSON.stringify(validationResult?.errors, undefined, 2) ||
//           "Error has been occured"
//       );
//     }
//   }

//   //fce na ulozeni zmen
//   static updateVideo(video, videoId) {
//     let dataURL = `${this.serverURL}/videos/${videoId}`;
//     const validationResult = addAbl(video);
//     if (!validationResult?.errors?.length) {
//       //Check if validation errors array is empty
//       return axios.put(dataURL, video);
//     } else {
//       throw TypeError(
//         JSON.stringify(validationResult?.errors, undefined, 2) ||
//           "Error has been occured"
//       );
//     }
//   }

//   //fce na smazani videa
//   static deleteVideo(videoId) {
//     let dataURL = `${this.serverURL}/videos/${videoId}`;
//     return axios.delete(dataURL);
//   }
// }
