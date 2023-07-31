# Postman Quickstarts

[![deployment](https://github.com/postmanlabs/pmquickstarts/actions/workflows/pages/pages-build-deployment/badge.svg)](https://github.com/postmanlabs/pmquickstarts/actions/workflows/pages/pages-build-deployment)

Watch the [How to Contribute to Postman Quickstarts](https://youtu.be/aLehVZegyXk) video demo:

[![Contribute to Postman Quickstarts thumbnail](http://i3.ytimg.com/vi/aLehVZegyXk/hqdefault.jpg)](https://youtu.be/aLehVZegyXk)

## What are Postman Quickstarts?

Postman Quickstarts are interactive tutorials and self-serve demos written in markdown syntax. Quickstarts provide a step-by-step reading experience and automatically saves tutorial progress for readers. These tutorials are published at [quickstarts.postman.com](https://quickstarts.postman.com/)

You can submit your own Quickstarts to be published on Postman's website by submitting a pull request to this repo. This repository contains all the tools and documentation you’ll need for building, writing, and submitting your own Quickstart.

## What's special about the Quickstart format?

- Powerful and flexible authoring flow in Markdown text
- Ability to produce interactive web or markdown tutorials without writing any code
- Easy interactive previewing
- Usage monitoring via Google Analytics
- Support for multiple target environments or events (conferences, kiosk, web, offline, etc.)
- Support for anonymous use - ideal for public computers at developer events
- Looks great, with a responsive web implementation
- Remembers where the student left off when returning to a quickstart
- Mobile friendly user experience

## Getting Started

### Prerequisites

1. [Install Node 14](https://nodejs.org/en/download/); Homebrew installed? `brew install node@14`
   - Install gulp-cli `npm i -g gulp-cli`
2. [Install Go](https://golang.org/doc/install); Homebrew installed? `brew install golang`
   - Install claat `go install github.com/googlecodelabs/tools/claat@latest`
   - Ensure go and claat is in your `PATH` [claat path setup](#user-content-1-claat-related-errors)
3. **Optional**: install the live-reload plugin for Chrome: [LiveReload](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei)

### Run locally

1. Fork this repository to your personal github account (top right of webpage, `fork` button)
2. Clone your new fork `git clone git@github.com:<YOUR-USERNAME>/pmquickstarts.git pmquickstarts`
3. Navigate to the site directory `cd pmquickstarts/site`
4. Install node dependencies `npm install`
5. Run the site `npm run serve`

Congratulations! You now have the Postman Quickstarts landing page running which can be reached at `http://localhost:8000/`.

### Common Errors

#### 1. Claat related errors

- Make sure Go is properly in your `PATH`. Add the following lines to your profile (`~/.profile`, or `~/.zshrc`):

```bash
#adding Golang to path
export PATH=$PATH:/usr/local/go/bin
export PATH=$PATH:$HOME/go/bin
```

**\*Note:** After adding Go to your `PATH`, be sure to apply your new profile: `source ~/.profile` or `source ~/.zshrc`\*

#### 2. You get a `EACCES` error when installing `gulp-cli`

- This means that your npm location needs to be updated. Follow the steps here: [Resolve EACCESS permissions](https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally#manually-change-npms-default-directory)

#### 3. You get `Error: Cannot find module 'postcss'` when running `npm run serve`

- The module may not have been installed for some reason so run `npm install --save-dev postcss gulp-postcss` and then rerun `npm run serve`

## Write Your First Quickstart

1. Terminate the running server with `ctrl C` and and navigate to the `pmguides` source directory `cd pmguides/src`
   - In this directory, you will see all existing guides and their markdown files.
2. Generate a new guide from the guide template `npm run template <GUIDE-NAME>`
   - Don't use spaces in the name of your guide, instead use **hyphens** to separate words.
   ![image](https://github.com/postmanlabs/pmquickstarts/assets/29985200/e0b37274-f9e7-4020-9294-4adddff3febb)
3. Navigate to the newly generated guide (`cd pmguides/src/<GUIDE-NAME>`) and edit your guide in a tool like vscode.
4. Run the website again `npm run serve`
5. As you edit and save changes, your changes will automatically load in the browser.

### Tips

- Review the [sample.md](site/pmguides/src/sample/sample.md) file to learn more about how to structure and format your Quickstart for the claat tool.
- You can see the supported Quickstart categories [here](site/app/styles/_overrides.scss). If you want to suggest a new category please create a github issue.
- Check out [how to use VS Code to write markdown files](https://code.visualstudio.com/docs/languages/markdown)

## How do I get my Postman Quickstart on [quickstarts.postman.com](https://quickstarts.postman.com)?

1. Fork this repository
1. Clone it to your local system
1. Make a new branch
1. Make your changes
1. Push it back to your repo
1. Open this repository on GitHub.com
1. Click the Pull Request button to open a new pull request
1. Postman will review and approve the submission

To learn more about how to submit a pull request on GitHub in general, check out GitHub's [official documentation](https://docs.github.com/en/free-pro-team@latest/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request-from-a-fork).

## Create tutorial in a non-English language

If you are interested in submitting a tutorial in a non-English language, we require at least two learning modules along with a separate reviewer for the new language before adding it to the site. Currently, the site supports the following non-English languages.

- `fr` - French

Change into the `/site` directory. Create the name of the tutorial and include the language tag at the end of the name, such as `fr` for French language.

    $ cd site
    $ npm run template lost-in-space-fr

In the page metadata at the top, update `status` to "Hidden". Add language tag to `tags` in the metadata.

```markdown
author: Joyce
id: lost-in-space-fr
summary: This is an API game
categories: Game
environments: web
status: Hidden
feedback link: https://github.com/postmanlabs/pmquickstarts
tags: Game, fr
```

## How to deploy (for project maintainers)

Change into the `site/` directory, and run the deploy script, which builds and publishes site at `https://quickstarts.postman.com/`.

    $ cd site
    $ npm run deploy

Note: To update custom domain, update the CNAME file in app/CNAME and `BASE_URL` in gulpfile.js
