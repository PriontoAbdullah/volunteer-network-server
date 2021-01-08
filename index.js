const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const port = 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.v9ypd.mongodb.net/${process.env
	.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect((err) => {
	const servicesCollection = client.db('volunteerNetwork').collection('services');
	const eventsCollection = client.db('volunteerNetwork').collection('events');

	console.log('Volunteer Network DataBase Connected');

	// Added all services Information
	app.post('/addAllServices', (req, res) => {
		const mainData = req.body;
		servicesCollection.insertMany(mainData).then((result) => {
			console.log(result);
			console.log(result.insertedCount, 'All Data Inserted');
			res.send(result.insertedCount);
		});
	});


	// Get all services Information
	app.get('/volunteerTasks', (req, res) => {
		servicesCollection.find({}).toArray((err, documents) => {
			res.send(documents);
		});
	});


// Added Volunteer Event Information
  app.post("/registerVolunteer", (req, res) => {
		const newVolunteer = req.body;
		eventsCollection.insertOne(newVolunteer).then((result) => {
			console.log(result, "Task Inserted");
			res.send(result.insertedCount > 0);
		});
  });


// GetVolunteer Event Information for user specific email
  app.get("/events", (req, res) => {
	console.log(req.query.email);
	eventsCollection.find({ email: req.query.email }).toArray((error, documents) => {
		res.send(documents);
		console.log(error);
	});
});


// Delete Event Information for user 
app.delete("/deleteTask/:id", (req, res) => {
	console.log(req.params.id);
	eventsCollection.deleteOne({ _id: ObjectId(req.params.id) }).then((result) => {
		console.log(result, "Deleted");
		res.send(result.deletedCount > 0);
	});
});





});

// Root Route
app.get('/', (req, res) => {
	res.send('Welcome to Volunteer Network Server');
});

// PORT
app.listen(process.env.PORT || port, () => {
	console.log('listening on port');
});
