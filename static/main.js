// ベースの位置
BASE = [35.0090728300962, 135.7459909276804]
// マップ
let map
// wkt形式のポリゴン
let wkt;
// ポリゴンのレイヤー
let polygonLayer;

$(function() {
    makeMap();
    init();
})

function makeMap() {
    
    const os_map = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
    });
    const std_map = new L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png', {
        attribution: "<a href='https://maps.gsi.go.jp/development/ichiran.html' target='_blank'>地理院タイル</a>"
    });
    const seamlessphoto_map = new L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/{z}/{x}/{y}.jpg', {
        attribution: "<a href='https://maps.gsi.go.jp/development/ichiran.html' target='_blank'>地理院タイル</a>"
    });
    
    const myMaps = {
        "OpenStreetMap": os_map,
        "地理院地図 標準": std_map,
        "地理院地図 写真": seamlessphoto_map,
    };

    map = L.map('leaflet-map', {
        center: BASE,
        zoom: 14,
        layers: [os_map]
    });

    L.control.layers(myMaps).addTo(map);

    // スケールコントロールを最大幅200px、右下、m単位で地図に追加
    L.control.scale({ maxWidth: 200, position: 'bottomright', imperial: false }).addTo(map);

}

function init() {
    $.ajaxSetup({async: false});
    $.getJSON("/init", function(obj) {
        // ポリゴンをリストに詰める
        wkt = obj.data.map(function(arr) {
            return L.geoJson(wellknown.parse(arr[5]),{
                id: arr[0],
                prefectures: arr[1],
                city: arr[2],
                ward: arr[3],
                town: arr[4],
                polygon: arr[5],
                fillColor: "aliceblue",
                // polygonのスタイル
                color: "black",
                fill: true,
                opacity: 0.4,
                weight: 1,
                fillOpacity: 0.8,
                onEachFeature: onEachFeature
            });
        });
    });
    $.ajaxSetup({async: true});
    // ポリゴンリストをレイヤーグループとして保持
    polygonLayer = L.layerGroup(wkt);
    // レイヤーグループを地図に設定
    map.addLayer(polygonLayer);
}

// ポリゴン内イベント定義
function onEachFeature(feature, layer) {
    layer.on({
        click: whenClick,
        mouseover: whenMouseover,
        mouseout: whenMouseout
    });
}
// クリックイベント
function whenClick(e) {
    // ポリゴン色変更
    this.setStyle({
        'fillColor': document.getElementById('color-select').value
    });

    let id = e.target.defaultOptions.id;
    let town = e.target.defaultOptions.town;
    let ward = e.target.defaultOptions.ward;
    let latlng = [e.latlng.lat, e.latlng.lng];

    L.popup().setLatLng(latlng)
    .setContent(`
    <p>
    ID: ${id}<br>
    区: ${ward}<br>
    町名: ${town}<br>
    緯度経度: (${latlng})<br>
    </p>

    `)
    .openOn(map);
}

// マウスオーバーイベント
function whenMouseover(e) {
    // 濃淡変更
    this.setStyle({
        'fillOpacity': 1
    });
}

// マウスアウトイベント
function whenMouseout(e) {
    // 濃淡変更
    this.setStyle({
        'fillOpacity': 0.8
    });
}

var vm = new Vue ({
    el: "#initialize-btn",
    methods: {
        initialize: function(e) {
            map.removeLayer(polygonLayer);
            init();
        }
    }
});
