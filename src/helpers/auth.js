import { auth } from "../services/firebase";

export async function signInWithEmailPassword(email, password) {
  // [START auth_signin_password]
  try {
    const userCredential = await auth().signInWithEmailAndPassword(
      email,
      password
    );

    if (userCredential) return userCredential.user;
  } catch (error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    return { errorCode, errorMessage };
  }
  // [END auth_signin_password]
}

export async function signUpWithEmailPassword(email, password, name) {
  // [START auth_signup_password]
  const userRegister = auth()
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      var user = userCredential.user;
      user.updateProfile({
        displayName: name,
        photoURL:
          "https://lh4.googleusercontent.com/-v0soe-ievYE/AAAAAAAAAAI/AAAAAAACyas/yR1_yhwBcBA/photo.jpg?sz=50",
      });
      // Signed in
      return user;
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      return { errorCode, errorMessage };
    });
  return userRegister;
  // [END auth_signup_password]
}

export async function sendEmailVerification() {
  // [START auth_send_email_verification]
  auth()
    .currentUser.sendEmailVerification()
    .then(() => {
      // Email verification sent!
      // ...
    });
  // [END auth_send_email_verification]
}

export async function sendPasswordReset(email) {
  // [START auth_send_password_reset]
  auth()
    .sendPasswordResetEmail(email)
    .then(() => {
      // Password reset email sent!
      // ..
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      return { errorCode, errorMessage };
      // ..
    });
  // [END auth_send_password_reset]
}

export async function googleSignInPopup() {
  // [START auth_google_provider_create]
  var provider = new auth.GoogleAuthProvider();
  // [END auth_google_provider_create]

  // [START auth_google_signin_popup]
  try {
    const loginGoogle = await auth().signInWithPopup(provider);

    if (loginGoogle) return loginGoogle.user;
  } catch (error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    return { errorCode, errorMessage };
  }
  // [END auth_google_signin_popup]
}

/**
 * Sign out
 */
export async function signOut() {
  auth().signOut();
}

/**
 * Get user info
 * @returns
 */
// export async function getUserInfo() {
//   var config = {
//     displayName: null,
//     email: null,
//     photoURL: null,
//     uid: null,
//   };

//   console.log(auth().currentUser, "currenauth");
//   await auth().onAuthStateChanged(function (user) {
//     if (user) {
//       console.log(user, "auth");
//       config.displayName = user.displayName;
//       config.email = user.email;
//       config.photoURL = user.photoURL;
//       config.uid = user.uid;

//       return config;
//     } else {
//       // No user is signed in.
//     }
//   });

//   return config;
// }
