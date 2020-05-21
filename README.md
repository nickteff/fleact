# fleact

Simple Flask and React SPA.  

To install


1. Install the Python virtualenv

```bash
cd backend;
python -m venv env;
source env/bin/activate
```

2. Load the Python libraries

```bash
pip install -r requirements.txt
```

2.1 Explore the Flask API endpoints by running `flask run` and navigating to

`localhost:5000\api\chart` or `localhost:5000\api\states`

3. Install the npm project

```bash
cd ../frontend;
npm install
```

3.1 Explore the frontend development environment by running

`npm start` and navigating to `localhost:3000.`  

*Note: The Flask server needs to be running for the frontend to proxy over to the API.*

4. Compile and run from the static Flask server
```bash
npm run-script build;
cd ..;
python fleact.py
```

Go to `localhost:5000` and all should be good!
