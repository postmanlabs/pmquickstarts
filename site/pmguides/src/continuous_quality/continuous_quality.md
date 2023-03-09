author: Joyce
id: continuous_quality
summary: Advanced testing workflows in Postman
categories: Tester, Intermediate
environments: web
status: Published
feedback link: https://github.com/loopDelicious/pmquickstarts
tags: Intermediate, Tester, Automation

# Continuous Quality with Postman

<!-- ------------------------ -->

## Overview

Duration: 1

> aside negative
> This course was originally created by [Neil Studd](https://www.linkedin.com/in/neilstudd) and has been modified to suit the Quickstart format.

### Prerequisites

- A Postman account
- Introductory knowledge of testing in Postman

### What You’ll Learn

- Extend the Postman sandbox with external libraries.
- Run tests locally using the Postman runner.
- Automate testing as part of your continuous integration (CI) pipeline using Newman, Postman’s command-line runner.
- Streamline regression testing cycles using Postman monitors.
- Perform snapshot testing using Postman mock servers.

### What You’ll Build

- A Postman Collection consisting of requests, variables, and tests.

<!-- ------------------------ -->

## Fork the collection

Duration: 1

1. Fork the collection - Click the **Run in Postman** button to fork the collection to your own workspace.

[![Run in Postman](_shared_assets/button.svg)](https://god.gw.postman.com/run-collection/16738531-985b2d7a-3406-490f-ba8a-08d912dbef0e?action=collection%2Ffork&collection-url=entityId%3D16738531-985b2d7a-3406-490f-ba8a-08d912dbef0e%26entityType%3Dcollection%26workspaceId%3D152199ce-48dd-4b46-b201-9e4fcb6f75db)

2. Select the first folder - Begin with the first folder labeled "1. The Power of Libraries", and expand the documentation from the context bar on the right. Instructions for each lesson will be in the documentation for each folder.

### Follow along with the webinar

View the slides [here](https://www.slideshare.net/GetPostman/continuous-quality-with-postman), and watch [the webinar](https://www.youtube.com/watch?v=zrmQAgixMpU) (originally aired September 22, 2021).

### Additional resources

Feeling stuck or want to dig deeper into specific topics? We've got you covered:

- [**Intro to writing tests**](https://www.postman.com/postman/workspace/postman-team-collections/collection/1559645-13bd44c4-94ec-420a-8390-8ff44b60f14d?ctx=documentation) - A collection containing examples of tests that you can use to automate your testing process.
- [**Test examples in Postman**](https://www.postman.com/postman/workspace/test-examples-in-postman/) - A public workspace containing many more examples of crafting tests within Postman.
- [**Continuous testing with Postman**](https://youtu.be/sB2HHrezQOo) - A previously aired webinar covering other advanced testing workflows.

<!-- ------------------------ -->

## The Power of Libraries

Duration: 5

When we talk about 'Tests' in Postman, we are typically referring to scripted checks which are written in the **Tests** tab of a request (or at folder/collection level, if you want the tests to run against every request within).

These are often written as _assertions_, in the style "expect SomeVariable to equal X". The most common library for this is the [Chai Assertion Library](https://www.chaijs.com/api/), which (in conjunction with Postman's own sandbox API) allow you to perform complex checks against both request and response data, including metadata such as headers and response time.

But there are many additional libraries available which can massively simplify your day-to-day operations, and reduce the amount of custom code that you need to write:

- [Moment.js](https://momentjs.com/docs/) allows you to manipulate, format and compare dates/times with ease.
- [Dynamic variables](https://learning.postman.com/docs/writing-scripts/script-references/variables-list/) built upon the Faker library allow for test data randomization, and avoids the so-called "pesticide paradox" where tests which are repeatedly executed with the same inputs are less effective at uncovering problems.
- [Postman's Visualizer](https://learning.postman.com/docs/sending-requests/visualizer/) has many uses, but for exploratory testing it's great for simplifying complex responses to extract the key data that you wish to examine.

To see some examples of what's possible in Postman, visit each of this folder's requests in turn, and look at the **Tests** tab of each request. You can also send each request, and look at the **Test Results** section of the response pane.

### Additional Resources

We've only scratched the surface of the many different libraries that are available through Postman. Here are a few more that you might like to read about:

- **[Postman Sandbox API reference](https://learning.postman.com/docs/writing-scripts/script-references/postman-sandbox-api-reference/)** - A detailed guide to the functionality offered by the `pm` and `postman ` objects.
- **[Lodash](https://lodash.com/docs/3.10.1)** - A library of helpers which make it easier to work with arrays and objects in JavaScript.
- **[Cheerio](https://cheerio.js.org/)** - A quick and easy library for parsing HTML so that it can be traversed in JavaScript.
- **[xml2js](https://www.npmjs.com/package/xml2js)** - Similarly to the above, a library which will convert an XML response into a JavaScript-friendly format.

<!-- ------------------------ -->

## Using the Runner

Duration: 10

Often when testing a scenario, you'll want to run multiple requests consecutively. For example, you might send a `POST` request to submit some data, and then you want to use a `GET` request to check that the data can be retrieved. This is where Postman's Runner comes in handy, allowing you to chain together requests in an automated fashion.

There are many ways to launch the Runner, depending upon how you want to interact with it. One way is to click the 'Runner' button in the bottom-right of the UI, and then drag-and-drop the collection or folder that you wish to execute.

In this folder, we are demonstrating three different methods of running a folder of requests:

- **Simple Linear Sequence** - In this folder, every request in every subfolder will be executed consecutively. This type of structure is very useful for testing an end-to-end scenario or workflow.
- **Non-Linear Execution** - This folder utilizes Postman's `setNextRequest` command to repeatedly run the second request multiple times until all scenarios have been run.
- **Iterating over a data file** - You can perform data-driven testing by passing a JSON or CSV file; each record is treated as a new iteration. The documentation for this folder contains more information about the data which we are using in this example.

### Iterating over a data file

For this example, we will utilize a CSV data file to drive our tests. [Download the file by clicking here.](https://postman-web-property-assets.s3.amazonaws.com/common-share/SpaceCamp_ContinuousQuality_Movies.csv)

If you are unable to access this file, you can recreate it for yourself by copying the below text, and saving it into a file such as `films.csv`:

```csv
id,title,year,imdbUrl
918,Central Intelligence,2016,https://www.imdb.com/title/tt1489889/
600,Doom,2005,https://www.imdb.com/title/tt0419706/
441,Get Smart,2008,https://www.imdb.com/title/tt0425061/
306,Hercules,2014,https://www.imdb.com/title/tt1267297/
1794,Pain & Gain,2013,https://www.imdb.com/title/tt1980209/
286,The Other Guys,2010,https://www.imdb.com/title/tt1386588/
720,The Scorpion King,2002,https://www.imdb.com/title/tt0277296/
814,Walking Tall,2004,https://www.imdb.com/title/tt0351977/
```

Once you have saved or created the file, click the "Run" button in this folder, and in the Runner options, browse to the file via the "Select File" dialog.

Once you have successfully selected the file, you can click "Preview" to confirm how Postman is intending to interpret your data.

### Additional Resources

More detailed documentation about the functionality of the Runner can be found in the following documentation:

- **[Running Collections](https://learning.postman.com/docs/running-collections/intro-to-collection-runs/)**

<!-- ------------------------ -->

## Automating with Monitors

Duration: 5

Having tests which are executed whenever you run requests is great, but these will only alert you to test failures when you choose to run them. One way to get faster notification of changes/failures is to take advantage of Postman's [Monitors](https://learning.postman.com/docs/designing-and-developing-your-api/monitoring-your-api/intro-monitors/). These are run automatically at a scheduled interval, and can notify you via email notifications, or other plugins such as Slack or PagerDuty, if new failures are detected.

Note that while monitors can be run on both free and paid plans, there are monthly usage limits for all tiers; more information can be found in the documentation linked above.

Because a monitor runs against all of the requests within a collection, for this exercise we'll duplicate an existing folder into a new collection:

1. Create a new collection in your workspace, called "Monitoring Demo".
2. Locate the **Simple Linear Sequence** folder in the "Using the Runner" folder, and select "Duplicate" from the context menu.
3. Select the duplicated folder (it will be called "Simple Linear Sequence Copy") and drag it into your "Monitoring Demo" collection.

Now you can go to the Monitors tab in the left sidebar, and set up a monitor for your "Monitoring Demo" collection.

Once you're finished with this exercise, you may wish to pause the monitor so that it is not continuing to use your monthly allowance. You can perform an ad-hoc execution of a monitor at any time.

### Additional Resources

- **[Monitoring FAQs](https://learning.postman.com/docs/designing-and-developing-your-api/monitoring-your-api/faqs-monitors/)**

<!-- ------------------------ -->

## CI integration with Newman

Duration: 5

In this exercise, we'll build upon the work from the "Automating with Monitors" section, so ensure that you've completed that exercise beforehand.

[Newman](https://github.com/postmanlabs/newman) is the highly configurable command-line runner which allows you to extend the power of Postman's testing interface, allowing you to integrate execution into your continuous integration servers and build systems.

> aside negative
> Before completing this exercise, you will need to install Node.js and Newman; see the [Getting Started guide](https://learning.postman.com/docs/running-collections/using-newman-cli/command-line-integration-with-newman/#getting-started) for more information.

Once you've set up these prerequisites, it's incredibly simple to perform your first command-line run:

1. Export the collection that you wish to run. We'll use the "Monitoring Test" collection from the previous exercise. Open the context menu for the collection, and select Export.
2. Save in the recommended format, and give it the filename `mycollection.json`.
3. To run from the command line, browse to the folder where you saved your JSON file, and type the following: `newman run mycollection.json`
4. The results of the tests will be output into the console.

There are many useful advanced features of Newman which you might want to utilize, depending upon your CI setup:

- You can utilize customer reporters to output the results of your Newman tests into a more readable format.
- You can export environment variables from Postman, allowing you to target test runs against multiple environments using a single collection JSON file.
- You can specify an iteration data file (similar to in our Collection Runner example) to manage and maintain your test data without requiring any further Postman modifications.
- You can opt to halt the tests immediately as soon as any failure is encountered, if you want faster feedback on large test suites.

More details on these configuration options can be found within the documentation below.

### Additional Resources

- **[Running collections on the command line with Newman](https://learning.postman.com/docs/running-collections/using-newman-cli/command-line-integration-with-newman/)**

<!-- ------------------------ -->

## Snapshot Testing with Mock Servers

Duration: 3

Sometimes when we're regression testing an endpoint's response, we don't want to write dozens of assertions to validate the values that are returned. Instead, we'd prefer to check that the response is the same as the last time that we asked (or at least that the structure is syntactically identical).

One way to achieve this is to take advantage of the [Mock Servers](https://learning.postman.com/docs/designing-and-developing-your-api/mocking-data/setting-up-mock/) feature in Postman. Typically, the purpose of a mock server during API development is to simulate the request flow before the production API has been constructed, by asking Postman's mock server to return a specific example response in a given scenario. But as testers, we can save real responses as examples, and write tests to compare future responses to these benchmarked examples.

To see this in action, you can fork the [Snapshot testing using Postman](https://www.postman.com/postman/workspace/70c7199b-6aee-49a6-a90f-025ad614f294/collection/1559645-f8f51fd3-13eb-4049-8603-9e8f7b787fbe) collection into your own workspace, using the button below, and follow the documentation within.

[![Run in Postman](_shared_assets/button.svg)](https://god.gw.postman.com/run-collection/1559645-f8f51fd3-13eb-4049-8603-9e8f7b787fbe?action=collection%2Ffork&collection-url=entityId%3D1559645-f8f51fd3-13eb-4049-8603-9e8f7b787fbe%26entityType%3Dcollection%26workspaceId%3D70c7199b-6aee-49a6-a90f-025ad614f294)

<!-- ------------------------ -->

## Next Steps

Duration: 1

### What we've covered

- Extend the Postman sandbox with external libraries.
- Run tests locally using the Postman runner.
- Automate testing as part of your continuous integration (CI) pipeline using Newman, Postman’s command-line runner.
- Streamline regression testing cycles using Postman monitors.
- Perform snapshot testing using Postman mock servers.

If you want to learn more about testing and automation in Postman, check out the following resources. Keep on learning!

### Additional Resources

- Badge: [Postman API Tester](https://badgr.com/public/badges/Q10KBL_YQXSW0lCQgYWx6Q) badge of completion
- Postman Webinar: [Continuous Quality with Postman](https://youtu.be/zrmQAgixMpU) video recording
- [Test examples in Postman](https://www.postman.com/postman/workspace/test-examples-in-postman/overview) workspace
