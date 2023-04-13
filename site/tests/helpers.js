const fs = require('fs');
const md = require('markdown-it')();


// Recursively traverse through all the docs and convert all the markdowns to JSON
const getTutorialsMetadata = async () => {
    const tutorials = [];
    
    let tutorialsMarkdownFolderNames = fs.readdirSync('./pmguides/src');

    // filter out folders to ignore
    tutorialsMarkdownFolderNames = tutorialsMarkdownFolderNames.filter(folderName => {
        const ignoredFolders = ['_imports', '_shared_assets', '_template', '.DS_Store'];
        return !ignoredFolders.includes(folderName);
    });
    
    for(let i = 1; i < tutorialsMarkdownFolderNames.length; i++){
        const metadataObject = await tutorialMetadata(tutorialsMarkdownFolderNames[i]);
        tutorials.push(metadataObject);
    }

    return tutorials;
}

const tutorialMetadata = (folderName) => new Promise(async (resolve) => {
    let filesArray = await fs.promises.readdir(`./pmguides/src/${folderName}`)

    // filter out non markdown files
    let file = filesArray.filter(dirFile => dirFile.split('.').pop() === 'md');

    if(file.length > 0){
        const path = `./pmguides/src/${folderName}/${file[0]}`;
        const mdJson = markDownToJson(path);
        const metadataArray = mdJson[1].children;

        const author = metadataArray[0].content.split('author: ')[1]
        const id = metadataArray[2].content.split('id: ')[1]
        const summary = metadataArray[4].content.split('summary: ')[1];
        const category = metadataArray[6].content.split('categories: ')[1]

        let metadataObj = {
            author,
            id,
            summary,
            category
        }

        resolve(metadataObj)
    }
})

const markDownToJson = (path) => {
    const markdown = fs.readFileSync(path, 'utf-8');
    const json = md.parse(markdown, { references: {} });

    return json;
}

module.exports = { getTutorialsMetadata };

