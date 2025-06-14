# Use an official Python runtime as a base image
FROM python:3.9-slim

# Set working directory inside container
WORKDIR /app

# Copy requirements first (for caching layer)
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Expose the Flask port
EXPOSE 5000

# Run the Flask app
CMD ["python", "prediction_api.py"]
