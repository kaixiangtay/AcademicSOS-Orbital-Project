import * as firebase from "firebase";
import { database, role } from "./FireBaseConfig.js";

const BookConsultFB = {
  addBooking: function (creator, modCode, ta, date, startTime, endTime, location, participants, remarks, status, bookDate, bookTime) {
    database.ref(`modules/${modCode}/bookings`).push({
      creator: creator,
      ta: ta,
      date: date,
      startTime: startTime,
      endTime: endTime,
      location: location,
      participants: participants,
      remarks: remarks,
      status: status,
      //Date and time of booking made
      bookDate: bookDate,
      bookTime: bookTime,
    });
  },
  getTutorialClass: function (id, modCode) {
    //Returns a promise of tutorial class
    return database
      .ref(`users/${role(id)}/${id}/modules/${modCode}`)
      .once("value")
      .then((snapshot) => snapshot.val())
      .then((obj) => {
        return obj["tutorialClass"];
      });
  },
  getTutorialClassTA: function (tutorialClass, modCode) {
    //Returns an array of TAs belonging to the tutorialClass
    return database
      .ref(`users`)
      .once("value")
      .then((snapshot) => snapshot.val())
      .then((obj) => {
        var TA = [];
        for (var role in obj) {
          //Loop through Students & Professor branch
          for (var id in obj[role]) {
            //Loop through each user
            var mod = obj[role][id]["modules"]
            if (modCode in mod) {
              //If user is taking the module
              var tc = mod[modCode]["tutorialClass"];
              var modRole = mod[modCode]["role"];
              if (tc === tutorialClass && modRole != "Student") {
                //And user is in the tutorial class and is TA/Prof
                var name = obj[role][id]["name"];
                TA.push({ id: id, name: name });
              }
            }
          }
        }
        return TA;
      });
  },
};

export default BookConsultFB;
