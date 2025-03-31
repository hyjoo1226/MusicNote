print("MongoDB 초기 사용자 및 데이터 설정 시작...");

db = db.getSiblingDB("admin");

if (db.system.users.find({user: "music"}).count() === 0) {
    db.createUser({
        user: "music",
        pwd: "note",
        roles: [
            {role: "readWrite", db: "musicdb"},
            {role: "readWrite", db: "typedb"}
        ]
    });
    print("사용자 생성 완료");
} else {
    print("music 사용자 이미 존재함");
}

const musicDB = db.getSiblingDB("musicdb");

musicDB.tracks.insertMany([
    {
        spotifyId: "a123456789",
        title: "music1",
        artist: "Luna Waves",
        audioFeatures: {
            valence: 0.75,
            acousticness: 0.15,
            instrumentalness: 0.60,
            speechiness: 0.05,
            liveness: 0.12,
            tempo: 120.0,
            energy: 0.80,
            loudness: -5.2,
            danceability: 0.78
        }
    },
    {
        spotifyId: "b123456789",
        title: "music2",
        artist: "Luna Waves",
        audioFeatures: {
            valence: 0.75,
            acousticness: 0.15,
            instrumentalness: 0.60,
            speechiness: 0.05,
            liveness: 0.12,
            tempo: 120.0,
            energy: 0.80,
            loudness: -5.2,
            danceability: 0.78
        }
    },
    {
        spotifyId: "c123456789",
        title: "music3",
        artist: "Luna Waves",
        audioFeatures: {
            valence: 0.75,
            acousticness: 0.15,
            instrumentalness: 0.60,
            speechiness: 0.05,
            liveness: 0.12,
            tempo: 120.0,
            energy: 0.80,
            loudness: -5.2,
            danceability: 0.78
        }
    }
]);