'use stritc'
const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID
const path = require('path')

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
        var filter = {};
        if (req.query.status) filter.status = req.query.status;
        if (req.query.owner) filter.owner = req.query.owner;
        if (req.query.effort_lte || req.query.effort_gte) filter.effort = {};
        if (req.query.effort_lte) filter.effort.$lte = parseInt(req.query.effort_lte,10);
        if (req.query.effort_gte) filter.effort.$gte = parseInt(req.query.effort_gte,10);

		db.collection('issues').find(filter).toArray().then(issues => {
			const metadata = { total_count: issues.length };
			res.json({ _metadata: metadata,records: issues });
		}).catch(err => {
			console.log(err);
			res.status(500).json({ message: `Internet Server Error: ${err}` });
		});
	};
});


app.get('/api/issue/:id', (req, res) => {
    let issueId;
    try {
        issueId = new ObjectId(req.params.id);      
    } catch (error) {
        res.status(422).json({ message: `Invalid issue ID format: ${error}`  });
        return;
    }

    db.collection('issues').find({ _id: issueId  }).limit(1).next()
    .then(issue => {
        if (!issue) res.status(404).json({ message: `No such issue: ${issueId}`  });
        else res.json(issue);           
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({ message: `Internal Server Error: ${error}`  });         
    });
});

app.put('/api/issue/:id', (req, res) => {
    let issueId;
    try {
        issueId = new ObjectId(req.params.id);
    } catch (error) {
        res.status(422).json({ message: `Innvalid issue ID formt: ${error}` });
        return;
    }

    var issue = req.body;
    console.log(issue);

    db.collection('issues').updateOne({ _id: issueId },
    {$set: Issue.convertIssue(issue)}).then(() => 
        db.collection('issues').find({ _id: issueId }).limit(1).next()
    ).then(savedIssue => {
        res.json(savedIssue)
    }).catch(err => {
        console.log(err);
        res.status(500).json({ messge: `Internal Server Error: ${err}` });
    });
});

app.get('*', (req, res) => {
    res.sendFile(path.resolve('static/index.html'));
})


MongoClient.connect('mongodb://localhost/', { useNewUrlParser: true }).then(connection => {
	db = connection.db('issuetracker');
	app.listen(3000, () => {
		console.log('App started on http://localhost:3000');
	});
}).catch(error => {
	console.log('Error', error)
});
