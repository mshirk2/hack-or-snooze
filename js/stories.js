"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories(); //StoryList is referring to the StoryList class, not the variable
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(storyData) {
  // console.debug("generateStoryMarkup", story);

  const hostName = new URL(storyData.url).host;

  const showStar = Boolean(currentUser);
  const showDeleteBtn = Boolean(currentUser);

  return $(`
      <li id="${storyData.storyId}">
        ${showStar ? getStarHTML(storyData, currentUser) : ''}
        ${showDeleteBtn ? getDeleteButtonHTML(storyData, currentUser) : ''}
        <a href="${storyData.url}" target="a_blank" class="story-link">
          ${storyData.title}
        </a>

        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${storyData.author}</small>
        <small class="story-user">posted by ${storyData.username}</small>
      </li>
    `);
}


function getStarHTML(story, user){
  const isFavorite = user.favorites.some(s => s.storyId === story.storyId);
  const starType = isFavorite ? "fas" : "far";
  return `
    <span class="star"><i class="${starType} fa-star"></i></span>`
}

function getDeleteButtonHTML(story, user){
  if (user.ownStories.some((s) => s.storyId === story.storyId)){
  return `<span class="trash"><i class="fas fa-trash"></i></span>`
  } else return ''
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

// When story form is submitted, gets new story data and puts it on the page

async function submitNewStory(evt){
  console.debug("submitNewStory");
  evt.preventDefault();
  
  const title = $("#story-title").val();
  const author = $("#story-author").val();
  const url = $("#story-url").val();
  const username = currentUser.username;
  const storyData = {title, author, url, username};
  const $story = generateStoryMarkup(storyData);
  $allStoriesList.prepend($story);

  await storyList.addStory(currentUser, storyData);

  location.reload();
}

$storyForm.on("submit", submitNewStory);

async function deleteStory(evt){
  console.debug("deleteStory");

  const storyId =  $(evt.target).closest("li").attr("id");
  await storyList.removeStory(currentUser, storyId);
  location.reload();
}

$allStoriesList.on("click", ".trash", deleteStory);

function putUserStoriesOnPage() {
  console.debug("putUserStoriesOnPage");
  $ownStories.empty();

  if (currentUser.ownStories.length === 0) {
    $ownStories.append("You haven't added any stories yet!");
  } else {
    for (let story of currentUser.ownStories){
      let $story = generateStoryMarkup(story);
      $ownStories.append($story);
    }
  }
  $ownStories.show();
}

function putFavsListOnPage() {
  console.debug("putFavsListOnPage");
  $favStories.empty();

  if (currentUser.favorites.length === 0) {
    $favStories.append("You haven't favorited any stories yet!");
  } else {
    for (let story of currentUser.favorites){
      let $story = generateStoryMarkup(story);
      $favStories.append($story);
    }
  }
  $favStories.show();
}

async function toggleFav(evt) {
  console.debug("toggleFav");

  const $clickedStory = $(evt.target)
  const storyId = $clickedStory.closest("li").attr("id");
  const story = storyList.stories.find(s => s.storyId === storyId);

  if ($clickedStory.hasClass("fas")){
    await currentUser.removeFavorite(story);
    $clickedStory.closest("i").toggleClass("fas far");
  } else {
    await currentUser.addFavorite(story);
    $clickedStory.closest("i").toggleClass("fas far");
  }
}

$storiesLists.on("click", ".star", toggleFav);
