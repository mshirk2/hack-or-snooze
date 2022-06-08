"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

// When click nav submit, show story form

function navSubmitClick(evt){
  console.debug("navSubmitClick", evt);
  hidePageComponents();
  $storyForm.show();
}

$navSubmitStory.on("click", navSubmitClick);


// When user clicks on "favorites", show favorites

function navFavorites(evt){
  console.debug("navFavorites", evt);
  hidePageComponents();
  putFavsListOnPage();
  $favStories.show();
}

$body.on("click", "#nav-favorites", navFavorites);

// When user clicks on "my stories", show my stories

function navMyStories(evt){
  console.debug("navMyStories", evt);
  hidePageComponents();
  putUserStoriesOnPage();
  $ownStories.show();
}

$body.on("click", "#nav-my-stories", navMyStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

// When user clicks on profile, show profile

// function navProfileClick(evt) {
//   console.debug("navProfileClick", evt);
//   hidePageComponents();
//   $userProfile.show();
// }

// $navUserProfile.on("click", navProfileClick);

