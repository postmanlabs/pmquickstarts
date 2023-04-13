const { getTutorialsMetadata } = require('./helpers');

describe("Check if the docs are not properly formatted", () => {

    test('Every tutorial must have an author', async () => {
        const tutorialMetadata = await getTutorialsMetadata();
        const allAuthorsBool = tutorialMetadata.every(tutorial => !!tutorial.author);

        expect(allAuthorsBool).toBeTruthy();
	});

    test('Every tutorial must have an id', async () => {
        const tutorialMetadata = await getTutorialsMetadata();
        const allAuthorsBool = tutorialMetadata.every(tutorial => !!tutorial.id);

        expect(allAuthorsBool).toBeTruthy();
	});

    test('Every tutorial must have a summary', async () => {
        const tutorialMetadata = await getTutorialsMetadata();
        const allAuthorsBool = tutorialMetadata.every(tutorial => !!tutorial.summary);

        expect(allAuthorsBool).toBeTruthy();
	});

    test('Every tutorial must have a category', async () => {
        const tutorialMetadata = await getTutorialsMetadata();
        const allAuthorsBool = tutorialMetadata.every(tutorial => !!tutorial.category);

        expect(allAuthorsBool).toBeTruthy();
	});


})