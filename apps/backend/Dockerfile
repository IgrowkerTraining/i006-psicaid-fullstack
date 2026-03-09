# Development stage
FROM eclipse-temurin:17-jdk-alpine AS development

WORKDIR /app

# Install Maven and curl
RUN apk add --no-cache maven curl

# Copy pom.xml and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Expose port
EXPOSE 3000

# Run the application
CMD ["mvn", "spring-boot:run"]

# Build stage
FROM eclipse-temurin:17-jdk-alpine AS build

WORKDIR /app

# Install Maven
RUN apk add --no-cache maven

# Copy pom.xml and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# Production stage
FROM eclipse-temurin:17-jre-alpine AS production

WORKDIR /app

# Add a non-root user for security
RUN addgroup -S spring && adduser -S spring -G spring

# Copy the built jar from build stage and give ownership
COPY --from=build --chown=spring:spring /app/target/*.jar app.jar

# Run as non-root user
USER spring

# Set default profile (can be overridden)
ENV SPRING_PROFILES_ACTIVE=production

# Expose port
EXPOSE 3000

# Run the application
CMD ["java", "-jar", "app.jar"]
