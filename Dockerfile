FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B -q
COPY src ./src
RUN mvn package -DskipTests -B -q

FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
RUN groupadd -r uniflow && useradd -r -g uniflow uniflow
COPY --from=build /app/target/*.jar app.jar
USER uniflow
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
