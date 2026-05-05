FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci --silent
COPY frontend/ ./
RUN npm run build

FROM maven:3.9-eclipse-temurin-17 AS backend-build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B -q
COPY src ./src
COPY --from=frontend-build /app/frontend/dist ./src/main/resources/static/
RUN mvn package -DskipTests -B -q

FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
RUN groupadd -r uniflow && useradd -r -g uniflow uniflow
COPY --from=backend-build /app/target/*.jar app.jar
USER uniflow
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
