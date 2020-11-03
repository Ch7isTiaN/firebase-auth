const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks = document.querySelectorAll('.logged-in');

const loginCheck = user => {
  if(user){
    loggedInLinks.forEach(link => link.style.display = 'block');
    loggedOutLinks.forEach((link) => (link.style.display = "none"));
  } else{
    loggedInLinks.forEach((link) => (link.style.display = "none"));
    loggedOutLinks.forEach((link) => (link.style.display = "block"));
  }
}

//SignUp
const signupForm = document.querySelector("#signup-form");

signupForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const email = document.querySelector("#signup-email").value;
  const password = document.querySelector("#signup-password").value;

  auth
      .createUserWithEmailAndPassword(email,password)
      .then(userCredential => {
        //Clear the form
        signupForm.reset();
        //CLose the modal
        $("#sigupModal").modal("hide");
      });
});

//SignIn
const signinForm = document.querySelector("#login-form");

signinForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.querySelector("#login-email").value;
  const password = document.querySelector("#login-password").value;

  auth
    .signInWithEmailAndPassword(email,password)
    .then(userCredential => {
      //Clear the form
      signinForm.reset();
      
      //Close the modal
      $("#siginModal").modal("hide");
      
      console.log('sign in');
    });
});

//Logout
const logout = document.querySelector('#logout');

logout.addEventListener('click', e => {
  e.preventDefault();
  auth.signOut().then(() => {
    console.log('Log out')
  })
})

//Login with Google
const googleButton = document.querySelector('#googleLogin');
googleButton.addEventListener('click', e => {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider)
      .then(result => {
        console.log("Google Sing in");
        //Clear the form
        signinForm.reset();

        //Close the modal
        $("#siginModal").modal("hide");
      })
      .catch(err =>{
        console.log(err);
      })
})

//Login with Facebook
const facebookButton = document.querySelector("#facebookLogin");
facebookButton.addEventListener("click", (e) => {
  const provider = new firebase.auth.FacebookAuthProvider();
  auth
    .signInWithPopup(provider)
    .then((result) => {
      console.log("Facebook Sing in");
      //Clear the form
      signinForm.reset();

      //Close the modal
      $("#siginModal").modal("hide");
    })
    .catch((err) => {
      console.log(err);
    });
});

//Post
const postList = document.querySelector('.posts');
const setupPosts = data => {
  if(data.length){
    let html = '';
    data.forEach(doc => {
      const post = doc.data()
      const li = `
        <li class="list-group-item">
            <h5>${post.title}</h5>
            <p>${post.description}</p>
        </li>
      `;
      html += li;
    });
    postList.innerHTML = html;
  } else {
    postList.innerHTML = '<p class="text-center">Login to see the posts</p>';
  }
}

//Events
//Listar estado del auth de los usuario

auth.onAuthStateChanged(user => {
  if(user){
    fs.collection('posts')
    .get()
    .then(snapshot => {
      setupPosts(snapshot.docs);
      loginCheck(user)
    })
  } else {
    setupPosts([]); //le enviamos un arreglo vacio para que no haga consulta a Firestore
    loginCheck(user);
  }
})

