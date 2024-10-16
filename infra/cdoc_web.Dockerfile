# Base image
FROM maven:3.8.6-openjdk-11 AS compiler
# Copy encryption source
WORKDIR /app/cdoc_jar
COPY cdoc/cdoc_jar/pom.xml pom.xml
COPY cdoc/cdoc_jar/src src
COPY .git .git

# Package project to jar
RUN mvn package

# Copy webapp source
WORKDIR /app/cdoc_web
COPY cdoc/cdoc_web/pom.xml pom.xml
COPY cdoc/cdoc_web/src src

# Package project to jar
RUN mvn package



FROM openjdk:11.0.11-jre-slim

EXPOSE 4444

WORKDIR /app

COPY --from=compiler /app .

CMD ["java", "-jar", "/app/cdoc_web/target/cdoc-web-1.0.jar"]