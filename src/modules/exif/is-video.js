module.exports = ({ config }) => ({ exif = {} }) => {

    const hasDuration = 'Duration' in exif;
    const hasVideoFrameRate = 'VideoFrameRate' in exif;

    const hasVideoMime =
        'MIMEType' in exif && exif.MIMEType.startsWith('video/');

    const hasVideoFileType =
        'FileType' in exif &&
        config.videoFileTypes.includes(exif.FileType.toLowerCase());

    const hasVideoMajorBrand =
        'MajorBrand' in exif &&
        config.videoMajorBrands.includes(exif.MajorBrand.toLowerCase());

    const isVideo =
        hasDuration ||
        hasVideoFrameRate ||
        hasVideoMime ||
        hasVideoFileType ||
        hasVideoMajorBrand;

    return isVideo;
};
