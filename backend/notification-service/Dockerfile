# Build stage
FROM golang:1.21-alpine AS builder

WORKDIR /app

# Install dependencies
RUN apk add --no-cache git

# Download dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy source code
COPY . .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -o notification-service

# Final stage
FROM alpine:3.18

WORKDIR /app

# Install necessary runtime dependencies
RUN apk add --no-cache ca-certificates tzdata

# Copy the binary from builder
COPY --from=builder /app/notification-service .

# Copy email templates (if any)
COPY --from=builder /app/templates ./templates

# Expose the port the app runs on
EXPOSE 8080

# Command to run the executable
CMD ["./notification-service"]
