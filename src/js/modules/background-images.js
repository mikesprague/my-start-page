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

const normalizeImageData = (apiData) => {
  const returnData = apiData.map((imageData) => {
    const {
      alt_description: altDescription,
      description,
      links,
      location,
      urls,
      user,
    } = imageData || null;
    const {
      html: imageLink,
    } = links || null;
    const {
      title,
      name,
    } = location || null;
    const {
      regular: imageUrl,
      small: imageSmallUrl,
      thumb: imageThumbUrl,
    } = urls || null;
    const {
      name: userName,
      links: userLinks,
    } = user || null;
    const {
      html: userLink,
    } = userLinks || null;
    return {
      altDescription,
      description,
      title,
      name,
      imageLink,
      imageUrl,
      imageSmallUrl,
      imageThumbUrl,
      userLink,
      userName,
    };
  });
  return returnData;
};

export async function getUnsplashImage() {
  const lastUpdated = getData('bgLastUpdated');
  let apiData = null;
  if (lastUpdated) {
    const nextUpdateTime = dayjs(lastUpdated).add(60, 'minute');
    if (dayjs().isAfter(nextUpdateTime) || lastUpdated === null) {
      apiData = await getUnsplashImagesData();
      apiData = normalizeImageData(apiData);
      clearData('bgData');
      clearData('bgLastUpdated');
      setData('bgData', apiData);
      setData('bgLastUpdated', dayjs());
    } else {
      apiData = getData('bgData');
    }
  } else {
    apiData = await getUnsplashImagesData();
    apiData = normalizeImageData(apiData);
    clearData('bgData');
    clearData('bgLastUpdated');
    setData('bgData', apiData);
    setData('bgLastUpdated', dayjs());
  }

  return apiData;
}

export const setImageAndMetaData = async () => {
  const getAllBgImages = await getUnsplashImage();
  const randomImageNumber = Math.floor(Math.random() * 4);
  const imageData = getAllBgImages[randomImageNumber];
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
