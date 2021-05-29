Flask and Leaflet and Vue
=================

Clone:
```
git clone https://github.com/remia007/flask-leaflet-vue.git
```


Python Version:

```
3.9.1
```

Polygon data:
```
https://uedayou.net/loa/京都府京都市
```

Install dependencies:

```
pip install flask
pip install flask_sqlalchemy
pip install pandas

// 以下はデータ作成用のため、アプリ起動には必要ない
pip install requests
pip install bs4
```

Create DB:
```
python data_creation.py
```

Start server:

```
python app.py
```

View the demo by navigating to `http://localhost:5000`
