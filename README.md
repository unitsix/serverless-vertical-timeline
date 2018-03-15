# Serverless Vertical Timeline 

An easy to customize, responsive timeline in AWS Lambda. 

Use JSON files for multiple timelines.

[Original article on CodyHouse](http://codyhouse.co/gem/vertical-timeline/)

## Prerequisites ##

- Docker
- Docker Compose
- Make
- AWS Admin Access

## Environment variables

Make sure you have set your environment variables properly or create a file `.env`. The file `.env.template` contains the environment variables that are used by the application. Keys found in LastPass.

## Make Usage ##

```bash
# using . env.template for .env as an example
$ make dotenv DOTENV=.env.template
# OR 
$ make .env
# Deploy the lambda stack, make sure to comment out serverless offline in the serverless.yml file
$ make deploy
# Remove the lambda stack
$ make remove
```

## Develop ##

All docs moved to FreshDesk and direct linked. Images hosted in the LiveConnected My Account.

Uncomment the Offline plugin in serverless.yml 

```bash
# using offline mode
$ make offline
```

## Multiple timelines

Add JSON files in the src/projects/ directory. 

### Structure

```
[
	{
		"title" : "Initial Spike with Deloitte Digital", 
		"icon" : "flash-21", 
		"desc" : "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iusto, optio, dolorum provident rerum aut hic quasi placeat iure tempora laudantium ipsa ad debitis unde? Iste voluptatibus minus veritatis qui ut.", 
		"files" : [{
			"file": "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
		}],
		"date" : "Aug 18"
	},
	{
		"title" : "Proof of concept", 
		"icon" : "settings-gear-63", 
		"desc" : "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iusto, optio, dolorum provident rerum aut hic quasi placeat iure tempora laudantium ipsa ad debitis unde? Iste voluptatibus minus veritatis qui ut.", 
		"files" : [{
			"file": "https://www.w3schools.com/w3css/img_lights.jpg"
		}],
		"date" : "Sept 05"
	}
]
```



## Credits

Virtical Timeline https://github.com/CodyHouse/vertical-timeline

Static File Handler https://www.npmjs.com/package/serverless-aws-static-file-handler

Icons https://nucleoapp.com/