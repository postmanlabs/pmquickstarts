author: Greg Bulmash
id: php_laravel_API
summary: Create A REST API with PHP And Laravel 
categories: Getting-Started
environments: web
status: Published 
feedback link: https://github.com/loopDelicious/pmquickstarts
tags: Getting Started, Developer, Tester, Automation, PHP 

# Create A REST API with PHP And Laravel
<!-- ------------------------ -->
## Overview 
Duration: 1

PHP is the programming language behind major web applications like WordPress (blog), Drupal ([CMS](https://en.wikipedia.org/wiki/Content_management_system)), and Magento (e-commerce). It first appeared in 1995, less than 3 weeks after the Java programming language.

It remains one of the top 10 programming languages in the world according to many lists and is the "P" in the famous LAMP stack (Linux, Apache, MySQL, and PHP).

In this tutorial, let's create a simple REST API, supporting a POST and a GET HTTP request. We'll set a value with the POST and retrieve it with the GET. 

### Prerequisites
- PHP
- Composer for PHP

### What You’ll Learn 
- How to create a PHP-based API server with the Laravel framework.
- How to create POST and GET API endpoints for it. 
- How to send requests to those endpoints with Postman. 

### What You’ll Need 
- [PHP](https://www.php.net/manual/en/install.php) Installed (Required)
- [Composer](https://getcomposer.org/download/) Installed (Required)
- [VSCode](https://code.visualstudio.com/download) Installed (Optional)
  - Or a code editor of your choice

**You will not need Apache or Nginx for this guide as we'll use PHP's built in serving function to serve the API locally.**

### What You’ll Build 
- A simple API with PHP and Laravel

<!-- ------------------------ -->
## Installing The Prerequisites
Duration: 5

### Installing PHP

Installing PHP can seem complicated. The first step is to check if you have it installed. Open a terminal and type the following.

```bash
$ php -v
```

If you already have it, you'll get a message like:
```bash
PHP 8.2.3 (cli) (built: Feb 15 2023 00:18:01) (NTS)
Copyright (c) The PHP Group
Zend Engine v4.2.3, Copyright (c) Zend Technologies
    with Zend OPcache v8.2.3, Copyright (c), by Zend Technologies
```

If you know you have it installed, and this doesn't work, make sure its installation directory is in your path.

If you don't have it, try one of these options.

#### MacOS

1. PHP is most easily installed with [Homebrew](https://brew.sh): 
```bash
brew install php
```

When Homebrew finishes the installation, it will put PHP in your path. 

Confirm PHP is installed with `php -v` in the command prompt.

#### Windows 

1. Download and install [the Microsoft Visual C++ redistributable (2015-2022)](https://learn.microsoft.com/en-us/cpp/windows/latest-supported-vc-redist?view=msvc-170) for your architecture. Almost all recent Intel and AMD CPUs will need the x64 version while Windows on ARM runs on ARM devices (some Windows laptops or running virtualized on Apple Silicon).

2. Download PHP. The [PHP Windows downloads](https://windows.php.net/download) page has a lot of options. On most Windows 10 or 11 machines, downloading the **VS16 x64 Non Thread Safe** version will work well. Select the **Zip** download. 

3. Unzip the downloaded file to the folder of your choice. 

4. Copy the path to the folder (like `C:users\youraccount\downloads\php`).

5. In a command prompt type `setx PATH "%PATH%;[yourpath]"`, replacing **[yourpath]** with the path to the folder.

6. Close the command prompt and open a new one which will now have the new directory in your path.

Confirm PHP is installed with `php -v` in the command prompt.

#### Linux

1. Let's use Ubuntu as an example. If you're running another Linux distribution (Fedora, Arch, etc.), please look up instructions for installing PHP with your distribution's package manager.

```bash
sudo apt install -y php
```

At the time of this writing, that will install PHP 8.1. Anything over 7.4 will work for this tutorial.

Confirm PHP is installed with `php -v` in the terminal.

### Installing Composer

The [Composer download and installation instructions](https://getcomposer.org/doc/00-intro.md#system-requirements) are a little dense. Let's simplify them.

#### MacOS

[Homebrew](https://brew.sh) makes it simple. 
```bash
brew install composer
```

If you don't have Homebrew, use the Linux instructions below.

#### Windows

Use the installer, per the [Composer installation instructions for Windows](https://getcomposer.org/doc/00-intro.md#installation-windows).

#### Linux

Use the [Composer installation instructions for Linux/Unix](https://getcomposer.org/download/).

Additionally follow the step to move the installed copy into a directory that's already in your path so it's easy to call from the terminal.

### Verifying Composer

Open a new terminal or command prompt and type `composer -h`.

![Composer help](./assets/composer_output.png)

If you get an error or nothing, check your installation.

<!-- ------------------------ -->
## Starting A Laravel Project
Duration: 5




<!-- ------------------------ -->
## Metadata Configuration
Duration: 2

It is important to set the correct metadata for your Postman Guide. The metadata contains all the information required for listing and publishing your guide and includes the following:


- **summary**: This is a sample Postman Guide 
  - This should be a short, 1 sentence description of your guide. This will be visible on the main landing page. 
- **id**: sample 
  - make sure to match the id here with the name of the file, all one word.
- **categories**: getting-started
  - You can have multiple categories, but the first one listed is used for the icon.
- **environments**: web 
  - `web` is default. If this will be published for a specific event or  conference, include it here.
- **status**: Published
  - (`Draft`, `Published`, `Deprecated`, `Hidden`) to indicate the progress and whether the pmguide is ready to be published. `Hidden` implies the pmguide is for restricted use, should be available only by direct URL, and should not appear on the main landing page.
- **feedback link**: https://github.com/loopDelicious/pmquickstarts
- **tags**: Getting Started, Data Science, Twitter 
  - Add relevant  tags to make your pmguide easily found and SEO friendly.
- **authors**: Joyce Lin
  - Indicate the author(s) of this specific pmguide.

---

You can see the source metadata for this guide you are reading now, on [the github repo](https://raw.githubusercontent.com/loopDelicious/pmquickstarts/master/site/pmguides/src/sample/sample.md).


<!-- ------------------------ -->
## Creating a Step
Duration: 2

A single Postman Quickstart consists of multiple steps. These steps are defined in Markdown using Header 2 tag `##`. 

```markdown
## Step 1 Title
Duration: 3

All the content for the step goes here.

## Step 2 Title
Duration: 1

All the content for the step goes here.
```

To indicate how long each step will take, set the `Duration` under the step title (i.e. `##`) to an integer. The integers refer to minutes. If you set `Duration: 4` then a particular step will take 4 minutes to complete. 

The total Postman Quickstarts completion time is calculated automatically for you and will be displayed on the landing page. 

<!-- ------------------------ -->
## Code Snippets, Info Boxes, and Tables
Duration: 2

Look at the [markdown source for this pmguide](https://raw.githubusercontent.com/loopDelicious/pmquickstarts/master/site/pmguides/src/sample/sample.md) to see how to use markdown to generate code snippets, info boxes, and download buttons. 

### JavaScript
```javascript
{ 
  key1: "string", 
  key2: integer,
  key3: "string"
}
```

### Java
```java
for (statement 1; statement 2; statement 3) {
  // code block to be executed
}
```

### Info Boxes
Positive
: This will appear in a positive info box.


Negative
: This will appear in a negative info box.

### Buttons
<button>
  [This is a button](https://link.com)
</button>

[![Run in Postman](_shared_assets/button.svg)](https://god.gw.postman.com/run-collection/1559645-032fb22a-9afb-4c56-b8f0-4042db96a4f3?action=collection%2Ffork&collection-url=entityId%3D1559645-032fb22a-9afb-4c56-b8f0-4042db96a4f3%26entityType%3Dcollection%26workspaceId%3D7a8604d2-6966-4313-8b07-282d2ba5501c)

### Tables
<table>
    <thead>
        <tr>
            <th colspan="2"> **The table header** </th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>The table body</td>
            <td>with two columns</td>
        </tr>
    </tbody>
</table>

### Hyperlinking
[Youtube - Halsey Playlists](https://www.youtube.com/user/iamhalsey/playlists)

<!-- ------------------------ -->
## Images, Videos, and Surveys, and iFrames
Duration: 2

Look at the [markdown source for this guide](https://raw.githubusercontent.com/loopDelicious/pmquickstarts/master/site/pmguides/src/sample/sample.md) to see how to use markdown to generate these elements. 

### Images
![Postman illustration](assets/SAMPLE.jpg)

### Videos
Videos from youtube can be directly embedded:
<video id="tw7x3yBpU1Y"></video>

### Inline Surveys
<form>
  <name>How do you rate yourself as a user of Postman?</name>
  <input type="radio" value="Beginner">
  <input type="radio" value="Intermediate">
  <input type="radio" value="Advanced">
</form>

### Embed an iframe
![https://codepen.io/MarioD/embed/Prgeja](https://en.wikipedia.org/wiki/File:Example.jpg "Try Me Publisher")

<!-- ------------------------ -->
## Conclusion
Duration: 1

At the end of your Postman Guide, always have a clear call to action (CTA). This CTA could be a link to the docs pages, links to videos on youtube, a GitHub repo link, etc. 

If you want to learn more about Postman Guide formatting, checkout the official documentation here: [Formatting Guide](https://github.com/googlecodelabs/tools/blob/master/FORMAT-GUIDE.md)

### What we've covered
- creating steps and setting duration
- adding code snippets
- embedding images, videos, and surveys
- importing other markdown files