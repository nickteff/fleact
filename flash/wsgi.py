from backend import server
from frontend import app1
from frontend import app2

app1.app.enable_dev_tools(debug=True)
app2.app.enable_dev_tools(debug=True)
