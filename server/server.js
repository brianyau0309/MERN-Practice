'use stritc'
const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const Issue = require('./issue.js')

const app = express();
app.use(express.static('static'));
app.use(bodyParser.json());

app.all('/api/issues', (req,res) => {
	if (req.method == "POST") {
		const newIssue = req.body;
		newIssue.created = new Date();
		if (!newIssue.status) { 
			newIssue.status = "New";
		}	
		const err = Issue.validateIssue(newIssue);
		if (err) {
			res.status(422).json({ message: `Invalid request: ${err}` });
			return;
		}
		
		db.collection('issues').insertOne(newIssue).then(result => 
			db.collection('issues').find({ _id: result.insertedId }).limit(1).next()
		).then(newIssue => {
			res.json(newIssue);
		}).catch(err => {
			console.log(err);
			res.status(500).json({ message: `Internet Server Error: ${err}` });
		});
	}
	if (req.method == "GET") {
		db.collection('issues').find().toArray().then(issues => {
			const metadata = { total_count: issues.length };
			res.json({ _metadata: metadata,records: issues });
		}).catch(err => {
			console.log(err);
			res.status(500).json({ message: `Internet Server Error: ${err}` });
		});
	};
});

MongoClient.connect('mongodb://localhost/', { useNewUrlParser: true }).then(connection => {
	db = connection.db('issuetracker');
	app.listen(3000, () => {
		console.log('App started on http://localhost:3000');
	});
}).catch(error => {
	console.log('Error', error)
});
