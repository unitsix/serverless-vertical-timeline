'use strict';
const path = require('path')
const StaticFileHandler = require('serverless-aws-static-file-handler')
const fs = require('fs');

module.exports.index = (event, context, callback) => {
	console.log( JSON.stringify(event.requestContext.identity) )
	
	const projectLocation = 'src/projects'
	
	//Set brand name from env vars
	var brand = process.env.BRAND;
	
	//Set up the paramObject and eventName
	var paramObject = typeof event.queryStringParameters !== 'undefined' ? event.queryStringParameters : {};
	
	//Get project name if set in url, set the title
	var projectName = paramObject !== null && typeof paramObject.project !== 'undefined' && paramObject.project !== '' ? paramObject.project : '';
	var title = projectName !== '' ? brand + ' - ' + paramObject.project.replaceAll('_', ' ') + ' Project'  : brand + ' Projects';
	
	//start building the html
	var head = '<meta charset="UTF-8">' +
		'<meta name="viewport" content="width=device-width, initial-scale=1">' +
		'<link href="http://fonts.googleapis.com/css?family=Droid+Serif|Open+Sans:400,700" rel="stylesheet" type="text/css">' +
		'<link rel="stylesheet" href="vendor/css/reset.css"> <!-- CSS reset -->' +
		'<link rel="stylesheet" href="css/style.css"> <!-- Resource style -->' +
		'<link rel="stylesheet" href="vendor/css/jquery.modal.min.css"> <!-- Resource style -->' +
		'<script src="vendor/js/modernizr.js"></script> <!-- Modernizr -->' +
		'<title>' + title + '</title>';
	
	//set title
    var header = '<header><h1>' + title + '</h1></header>';
	
	//scripts after body load 
	var scripts = '<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script> <!-- Resource jQuery -->' +
		'<script src="vendor/js/jquery.modal.min.js"></script>' +
		'<script src="js/main.js"></script>';
	
	//creates the timeline depending on project name if set or not
	var timeline = projectName == '' ? getProjects(projectLocation) : getProjectDetails(projectName);
	
	//start compileing html components
	var html = '<!DOCTYPE HTML><html lang="en" class="no-js"><head>' + head + '</head><body>' + header + 
		'<section id="cd-timeline" class="cd-container">' + timeline + '</section>' + scripts + '</body></html>';
	
	//Returns 200 and HTML as responce
	const response = {
		statusCode: 200,
		headers: {
			'Content-Type': 'text/html',
			'Access-Control-Allow-Origin' : '*' 
		},
		body: html,
	};
	
	callback(null, response);
	
	//Gets the json files in the projects folder and lists them as projects and returns html
	function getProjects(srcpath){
		
		var projectsHtml = ''
			
		var files = fs.readdirSync('./' + srcpath + '/')
		files.forEach(file => {
		  if (file.includes('.json')){
			console.log('filename' + file)
			var projectName = file.toString().replace('.json', '')
			projectsHtml = projectsHtml + 
			  	'<div class="cd-timeline-block"><div class="cd-timeline-img cd-picture"><img src="img/cd-icon-flash.svg" alt="Picture"></div>' + 
				'<a href="/?project=' + projectName + '"><div class="cd-timeline-content"><h2>' + projectName.replace(/_/g, ' ') + '</h2></div></a></div> '
		  }
		})
		
		return projectsHtml
	}
	
	//Gets the project timelines from the selected project json file and returns html
	function getProjectDetails(project){
		
		var projectArr = JSON.parse(fs.readFileSync(projectLocation + '/' + project + '.json')), projectHtml = '';
		
		for (var i=projectArr.length-1; i>=0; i--) {
			projectHtml = projectHtml + 
						'<div class="cd-timeline-block" id="project_part_' + i + '"><div class="cd-timeline-img cd-picture"><img src="img/' +
						projectArr[i].icon + '.svg" alt="Picture"></div>' + 
						'<div class="cd-timeline-content"><h2>' + projectArr[i].title + '</h2><p>' +
						projectArr[i].desc + '</p>'
			
			for (var n=projectArr[i]['files'].length-1; n>=0; n--) {
				var thisFileType = 'file'
				if (projectArr[i]['files'][n].file.includes('email')){ 
					thisFileType = 'Email'
				} else if (projectArr[i]['files'][n].file.includes('.jpg') || projectArr[i]['files'][n].file.includes('.png')) {
					thisFileType = 'Screenshot'
				} else if (projectArr[i]['files'][n].file.includes('.pdf')) {
					thisFileType = 'Doc'
				}
				projectHtml = projectHtml + 
						'<a href="' + projectArr[i]['files'][n].file + '" class="cd-read-more view-in-modal">' + thisFileType + '</a>'
			}
			projectHtml = projectHtml + 
						'<span class="cd-date">' + projectArr[i].date + '</span></div></div>'
			
		}
		
		return projectHtml
	}
	
};

//Serves statci non-binary files
module.exports.staticfile = (event, context, callback) => {
  //clientFilesPath is a local directory that serverless will automatically package and deploy to AWS Lambda along with your code
  const clientFilesPath = path.join(__dirname, './src')
  return new StaticFileHandler(clientFilesPath).get(event, context)
    .then(response => callback(null, response))
    .catch(err => callback(err))
}