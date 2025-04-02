FROM openjdk:17

RUN ln -snf /usr/share/zoneinfo/Asia/Seoul /etc/localtime && echo Asia/Seoul > /etc/timezone

RUN apt-get update && apt-get install -y locales
RUN locale-gen ko_KR.UTF-8
ENV LANG ko_KR.UTF-8
ENV LANGUAGE ko_KR.UTF-8
ENV LC_ALL ko_KR.UTF-8

ENV JAVA_OPTS="-Dfile.encoding=UTF-8"
ARG JAR_FILE=build/libs/auth-0.0.1-SNAPSHOT.jar

COPY ${JAR_FILE} auth.jar

ENTRYPOINT ["java", "-jar", "-Duser.timezone=Asia/Seoul", "/auth.jar"]

