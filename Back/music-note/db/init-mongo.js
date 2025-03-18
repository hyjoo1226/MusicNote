// init-mongo.js
print("MongoDB 초기 사용자 설정 시작...");

// test 데이터베이스 USER 생성
db = db.getSiblingDB("test");
db.createUser({
    user: "test",
    pwd: "1234",
    roles: [{ role: "readWrite", db: "test" }]
});

print("✅ test 계정 생성 완료!");