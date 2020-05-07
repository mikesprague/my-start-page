import axios from 'axios';
import tippy from 'tippy.js';
import {
  apiUrl,
} from './helpers';

export async function getTrendingRepos (dataUrl = `${apiUrl()}/github-trending-repos`) {
  const returnData = []
  const pageData = await axios.get(dataUrl)
    .then(response => {
      // limit to 10 items
      for (let i = 0; i < 10; i+=1) {
        returnData.push(response.data[i]);
      }
      return returnData;
    });
  return pageData;
}

export async function getGitHubReposMarkup () {
  const gitHubData = await getTrendingRepos();
  let idx = 0;
  const reposMarkup = gitHubData.map(repo => {
    const listItemMarkup = `
      <li class="list-group-item list-group-item-action ${idx % 2 === 0 ? 'odd' : ''} text-white">
        <a href="${repo.link}" title="View Post: ${repo.title}" target="_blank" rel="noopener">
          ${repo.title}
        </a>
        <br>
        ${repo.description}
        <br>
        <small>
          ${repo.starsToday}
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
          <i class="fab fa-fw fa-github"></i> GitHub Trending Repositories
          <small><a href="https://www.github.com/trending" title="View on GitHub" target="_blank" rel="noopener"><i class="fad fa-fw fa-external-link"></i> View on GitHub</a></small>
        </h5>
      </li>
      ${reposMarkup.join('\n')}
    </ul>
  `;
  return mainTemplate;
}

export async function initGitHubPopup() {
  const gitHubContent = await getGitHubReposMarkup();
  const elForPopup = document.querySelector('.github-popup');
  tippy(elForPopup, {
    allowHTML: true,
    interactive: true,
    maxWidth: 'none',
    trigger: 'click',
    onShow(instance) {
      instance.setContent(gitHubContent);
    },
  });
}
