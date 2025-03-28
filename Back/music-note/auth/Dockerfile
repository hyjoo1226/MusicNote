FROM openjdk:17

RUN ln -snf /usr/share/zoneinfo/Asia/Seoul /etc/localtime && echo Asia/Seoul > /etc/timezone

ARG JAR_FILE=build/libs/auth-0.0.1-SNAPSHOT.jar

COPY ${JAR_FILE} auth.jar

ENV JAVA_OPTS="-Dfile.encoding=UTF-8"

ENTRYPOINT ["java", "-jar", "-Duser.timezone=Asia/Seoul", "/auth.jar"]

