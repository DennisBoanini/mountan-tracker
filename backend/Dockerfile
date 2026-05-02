# Build stage
FROM maven:3.9-eclipse-temurin-24 AS builder
WORKDIR /app
COPY pom.xml .
# Scarica dipendenze in layer separato (cache Docker)
RUN mvn dependency:go-offline -q
COPY src/ ./src/
RUN mvn package -DskipTests -q

# Run stage
FROM eclipse-temurin:24-jre-alpine
WORKDIR /app
COPY --from=builder /app/target/mountain-tracker-*.jar app.jar
EXPOSE 3000
ENTRYPOINT ["java", "-jar", "app.jar"]
