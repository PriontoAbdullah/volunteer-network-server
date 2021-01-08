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









});

// Root Route
app.get('/', (req, res) => {
	res.send('Welcome to Volunteer Network Server');
});

// PORT
app.listen(process.env.PORT || port, () => {
	console.log('listening on port');
});
