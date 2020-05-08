import axios from 'axios';
import tippy from 'tippy.js';

const redditUrlPrefix = 'https://www.reddit.com';

export async function getRedditPosts (redditUrl = `${redditUrlPrefix}/r/popular.json?limit=10`) {
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
      <li class="list-group-item list-group-item-action ${idx % 2 === 0 ? 'odd' : ''} text-white">
        <a href="${redditUrlPrefix}${post.permalink}" title="View Post: ${post.title}" target="_blank" rel="noopener"><strong>${post.title}</strong></a>
        <br>
        <small>
          <a href="${redditUrlPrefix}/r/${post.subreddit}" title="View Subreddit: /r/${post.subreddit}" target="_blank" rel="noopener">/r/${post.subreddit}</a>
          &nbsp;&nbsp;
          <a href="${redditUrlPrefix}/user/${post.author}/" title="View Author Page: ${post.author}" target="_blank" rel="noopener"><i class="fad fa-fw fa-user"></i></a> ${post.author}</a>
        </small>
      </li>
    `;
    idx += 1;
    return listItemMarkup;
  });

  const mainTemplate = `
    <ul class="list-group posts-container">
      <li class="list-group-item list-group-item-heading">
        <h5>
          <i class="fab fa-fw fa-reddit-alien"></i> Reddit Popular Posts
          &nbsp;
          <small><a href="${redditUrlPrefix}/r/popular" title="View on Reddit" target="_blank" rel="noopener"><i class="fad fa-fw fa-external-link"></i> View on Reddit</a></small>
        </h5>
      </li>
      ${postsMarkup.join('\n')}
    </ul>
  `;

  return mainTemplate;
}

export async function initRedditPopup() {
  const redditContent = await getRedditPostsMarkup();
  const elForPopup = document.querySelector('.reddit-popup');
  tippy(elForPopup, {
    allowHTML: true,
    interactive: true,
    maxWidth: 'none',
    trigger: 'click',
    onShow(instance) {
      instance.setContent(redditContent);
    },
  });
}
