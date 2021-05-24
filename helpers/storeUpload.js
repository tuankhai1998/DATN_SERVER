const path = require('path');
const fs = require('fs');
const storeUpload = async ({ stream, filename, mimetype, encoding }) => {
    let pathName = path.join(__dirname, '../public/images', filename);
    return new Promise((resolve, reject) =>
        stream
            .pipe(fs.createWriteStream(pathName))
            .on("finish", () => resolve({
                category: "profilePic",
                url: `http://localhost:8000/images/${filename}`,
                path: pathName,
                filename: filename,
                mimetype,
                encoding,
                createdAt: new Date().toISOString(),
                commentsCount: 0,
                likesCount: 0,
                sharesCount: 0
            }))
            .on("error", reject)
    );
};


module.exports = storeUpload