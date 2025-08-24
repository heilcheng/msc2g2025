# Local Deployment
- Ensure MONGODB is set up as mentioned in the README.md in the main dir.
- Create venv:
```
cd backend
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows
pip install -r requirements.txt
```
- To start the backend server:
```
python src/server.py
```