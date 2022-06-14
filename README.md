# aws-deepracer-leaderboard
AWS Deepracer Leaderboard

## Back End
The back end was built using the CDK, install the CDK as outlined in the documentation [here](https://docs.aws.amazon.com/cdk/v2/guide/getting_started.html).

It is easier to use [AWS Cloud9](https://aws.amazon.com/cloud9/), however if you are not using Cloud9, you need to configure the [aws cli](https://aws.amazon.com/cli/) on your machine.

Once configured with the CDK installed from the `back-end` folder run the commands:
```
npm install
cdk bootstrap
```

`cdk bootstrap` should only be run once, the first time you setup the project, it is explained [here](https://docs.aws.amazon.com/cdk/v2/guide/bootstrapping.html)

After your code has been bootstrapped you can run:

```
cdk deploy
```

To deploy the code to your account. I used the Ireland region (eu-west-1), but it should work in most commercial regions.

Once deployed the code will setup a DynamoDB bucket, which you need to edit.

In the console, go to DynamoDB, and add your racers, go to [DynamoDB](https://eu-west-1.console.aws.amazon.com/dynamodbv2/home) make sure you are in the correct region.

Go to the `deepracerdrivers` table, then click `Explore table items`, add your drivers, each driver needs 3 fields:

| Column | Type   | Comment               |
| ------ | ------ | --------------        |
| name   | string | index                 |
| team   | string | free text             |
| time   | number | set this to 999999999 |

If the time is set to 999999999 it will not show up in the leader board.

Now that the data has been added, go to [API Gateway](https://eu-west-1.console.aws.amazon.com/apigateway/home) to get the end point URL.

Go to the API Gateway page, select the Deep Racer Service. Make sure CORS is enabled, I think I missed it in the CDK, on the screen that loaded select from the actions drop down, and press ENABLE CORS. Then follow the prompts. Then go to Dashboard on the left, and copy the entire Invoke API URL from the top. It is that URL you need for the front end.

## Front End
The front end was developed using Angular. Follow the angular setup guide [here](https://angular.io/guide/setup-local).
Once Angular is setup, you can build the front end as follows.
From the front-end folder run:

```bash
npm install
ng build
```

Before you build and deploy the front-end you need to configure the backend above, and copy the endpoint to your project, sorry this was a hack don't judge, it is not as clean as I would like. Search for [ENDPOINT-HERE] in the code and replace it with your API i.e https://path/prod. The files to edit are (3 entries in total):

```
aws-deepracer-leaderboard/front-end/src/app/leaderboard/leaderboard.component.ts
aws-deepracer-leaderboard/front-end/src/app/racetimer/racetimer.component.ts
```

**Note:** Add a custom logo, add the png to the `front-end/src/assets/img/` and then edit the file `front-end/src/app/leaderboard/leaderboard.component.html` update the code to point to your image:
```html
<img  src="assets/img/[Your logo].png" height="120"> 
```

The customer in my case wanted to link people to teams if you don't want that, edit the leader board and remove the teams html

The front end will be built and added to the dist folder. Create an S3 folder and configure it as a website, it is not best practice to make the S3 file public, so front it with CloudFront.
Follow the aws instructions:
[Custom Domain Walk Through](https://docs.aws.amazon.com/AmazonS3/latest/userguide/website-hosting-custom-domain-walkthrough.html)
[CloudFront Serve Static Pages](https://aws.amazon.com/premiumsupport/knowledge-center/cloudfront-serve-static-website/)
[Hosting a static website](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html)
[Hands on hosting a static website](https://aws.amazon.com/getting-started/hands-on/host-static-website/)

This site was a hack, and I built it for a DeepRacer day really quickly, like 4hrs, so I am sorry that it is nothing special, there is no Cognito Security etc. I will do that in due course, I plan to neaten up my code, and build everything with the CDK. (Don't judge ;) )

Then copy the contents of the dist folder to your S3 bucket, and go to the CloudFront URL. You should have a working website.
If you want to run it locally run:

```
ng serve
```
Open `http://localhost:4200/` in your browser:

Website:
![Website](imgs/website.png?raw=true "Website")

Timer Screen
![Timer](imgs/timing.png?raw=true "Timer Screen")

Leaderboard
![Leaderboard](imgs/leaderboard.png?raw=true "Leaderboard Screen")


Because there is no security, it is recommended that you run the leaderboard in full screen. On windows it is easy just hit F11 in the browser on a Mac a little different. Open chrome press fn F, and then to switch between address bar and no address bar use command, shift, f.

