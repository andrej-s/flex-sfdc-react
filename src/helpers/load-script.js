export const loadScript = async url =>
  new Promise((resolve, reject) => {
    const scriptRef = document.createElement('script');
    const tag = document.getElementsByTagName('script')[0];

    scriptRef.src = url;
    scriptRef.type = 'text/javascript';
    scriptRef.async = true;
    scriptRef.onerror = reject;
    scriptRef.onload = scriptRef.onreadystatechange = res =>
      (!res.readyState || res.readyState === 'complete') && resolve(res);

    tag.parentNode.insertBefore(scriptRef, tag);
  });
