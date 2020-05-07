import axios from 'axios';

export async function getRedditPosts (redditUrl = 'https://www.reddit.com/r/popular.json?limit=10') {
  const redditData = await axios.get(redditUrl)
    .then(response => {
      const { children } = response.data.data;
      const returnData = children.map(child => {
        return child.data;
      });
      return returnData;
    });
    return redditData;
}

export async function getRedditPostsMarkup () {
  const redditData = await getRedditPosts();
  let idx = 0;
  const postsMarkup = redditData.map(post => {
    const listItemMarkup = `
      <li class="list-group-item list-group-item-action ${idx % 2 === 0 ? 'odd' : ''}">
        <small>
          <a href="https://www.reddit.com/r/${post.subreddit}" target="_blank" rel="noopener">${post.subreddit}</a>
          Posted by <a href="https://www.reddit.com/user/${post.author}/" target="_blank" rel="noopener">${post.author}</a>
        </small>
        <br>
        <a href="https://www.reddit.com${post.permalink}" target="_blank" rel="noopener">${post.title}</a>
      </li>
    `;
    idx += 1;
    return listItemMarkup;
  });

  const mainTemplate = `
    <ul class="list-group posts-container">
      <li class="list-group-item list-group-item-heading"><h4><i class="fab fa-fw fa-reddit-alien"></i> Reddit Popular Posts</h4></li>
      ${postsMarkup.join('\n')}
    </ul>
  `;

  return mainTemplate;
}

export async function initRedditPosts () {
  const redditHtml = await getRedditPostsMarkup();
  const postsEl = document.querySelector('.posts');
  postsEl.innerHTML = redditHtml;
}
