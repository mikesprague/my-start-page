import axios from 'axios';
import dayjs from 'dayjs';
import {
  clearData,
  getData,
  setData,
} from './data';
import {
  apiUrl,
} from './helpers';

export async function getUnsplashImagesData() {
  const bgImagesApiUrl = `${apiUrl()}/background-image/`;
  const bgImagesData =  await axios.get(bgImagesApiUrl)
  .then((response) => {
    // console.log(response.data);
    return response.data;
  });
  return bgImagesData;
}

export async function getUnsplashImage() {
  const lastUpdated = getData('bgLastUpdated');
  let apiData = null;
  if (lastUpdated) {
    const nextUpdateTime = dayjs(lastUpdated).add(60, 'minute');
    if (dayjs().isAfter(nextUpdateTime) || lastUpdated === null) {
      apiData = await getUnsplashImagesData();
      clearData('bgData');
      clearData('bgLastUpdated');
      setData('bgData', apiData);
      setData('bgLastUpdated', dayjs());
    } else {
      apiData = getData('bgData');
    }
  } else {
    apiData = await getUnsplashImagesData();
    clearData('bgData');
    clearData('bgLastUpdated');
    setData('bgData', apiData);
    setData('bgLastUpdated', dayjs());
  }

  return apiData;
}

export async function preloadBgImages () {
  const bgImagesData = getData('bgData');
  const bgPromises = bgImagesData.map(bgImageData => {
    const bgImage = axios.get(bgImageData.imageUrl);
    return bgImage;
  });
  return bgPromises;
}

export async function setImageAndMetaData () {
  const getAllBgImages = await getUnsplashImage();
  const bgNum = getData('bgCurrent') || 0;
  const imageData = getAllBgImages[bgNum];
  setData('bgCurrent', bgNum);
  const {
    title,
    name,
    imageLink,
    imageUrl,
    imageThumbUrl,
    userLink,
    userName,
  } = imageData || null;
  const getImageTitle = () => {
    if (title) {
      return title;
    }
    if (name) {
      return name;
    }
    return 'No description available';
  };
  document.body.style.background = `url('${imageUrl}') no-repeat fixed center center, url('${imageThumbUrl}') no-repeat fixed center center`;
  document.body.style.backgroundSize = 'cover, cover';
  const linkSuffix = '?utm_source=My%20Start%20Page&utm_medium=referral';
  const bgMetadataEl = document.querySelector('.bg-metadata');
  bgMetadataEl.innerHTML = `
    <span class="text-muted">
      <a class="" href="${imageLink}${linkSuffix}" target="_blank" rel="noopener">
        <i class="fad fa-fw fa-image"></i> ${getImageTitle()}
      </a>
      <br>
      <a href="${userLink}${linkSuffix}" target="_blank" rel="noopener"><i class="fad fa-fw fa-user"></i> ${userName}</a>
      via
      <a href="https://unsplash.com/${linkSuffix}" target="_blank" rel="noopener">Unsplash</a>
    </span>
  `;
};

export async function rotateBgImage () {
  const currentBgNum = getData('bgCurrent') || 0;
  const nextBgNum = currentBgNum + 1 >= 5 ? 0 : currentBgNum + 1;
  setData('bgCurrent', nextBgNum);
  await setImageAndMetaData();
}

export function initRotateBgImage () {
  const rotateLink = document.querySelector('.rotate-bg');
  const rotateIcon = document.querySelector('i.fa-sync-alt');
  rotateLink.addEventListener('click', async (event) => {
    event.preventDefault();
    rotateIcon.classList.add('fa-spin');
    await rotateBgImage();
    rotateIcon.classList.remove('fa-spin');
  });
}

export async function initBgImages() {
  await setImageAndMetaData();
  initRotateBgImage();
}
