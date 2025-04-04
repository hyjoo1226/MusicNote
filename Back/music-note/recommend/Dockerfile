FROM openjdk:17-jdk-slim

RUN ln -snf /usr/share/zoneinfo/Asia/Seoul /etc/localtime && echo Asia/Seoul > /etc/timezone
# 로케일 및 폰트 설치
RUN apt-get update && apt-get install -y locales fonts-nanum && \
    locale-gen ko_KR.UTF-8 && \
    update-locale LANG=ko_KR.UTF-8

ENV LANG ko_KR.UTF-8
ENV LANGUAGE ko_KR.UTF-8
ENV LC_ALL ko_KR.UTF-8

ENV JAVA_OPTS="-Dfile.encoding=UTF-8"
ARG JAR_FILE=build/libs/recommend-0.0.1-SNAPSHOT.jar

COPY ${JAR_FILE} recommend.jar

ENTRYPOINT ["java", "-jar", "-Duser.timezone=Asia/Seoul", "/recommend.jar"]

