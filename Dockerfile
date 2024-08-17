FROM maven:3.9.5-openjdk-21 AS MAVEN_BUILD
COPY ./pom.xml ./pom.xml
RUN mvn dependency:go-offline -B
COPY ./src ./src
RUN mvn clean package

FROM openjdk:21-jdk-slim-buster
EXPOSE 8080
COPY --from=MAVEN_BUILD target/Strona2-*.jar /app.jar
ENTRYPOINT ["java","-jar","/app.jar"]